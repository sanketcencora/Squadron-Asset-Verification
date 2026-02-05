package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.squadron.model.EquipmentCount;
import org.squadron.model.EquipmentCount.EquipmentCategory;
import org.squadron.model.EquipmentCount.EquipmentStatus;
import org.squadron.model.EquipmentCount.VerificationStatus;
import org.squadron.repository.EquipmentCountRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.squadron.repository.VerificationRecordRepository;
import org.squadron.model.VerificationRecord;
import org.squadron.repository.UserRepository;
import org.squadron.model.User;
import java.util.stream.Collectors;

@ApplicationScoped
public class EquipmentService {
    
    @Inject
    EquipmentCountRepository repository;
    
    // Added: repositories to map pending employees by campaign
    @Inject
    VerificationRecordRepository verificationRecordRepository;

    @Inject
    UserRepository userRepository;

    public List<EquipmentCount> findAll() {
        return repository.listAll();
    }
    
    public EquipmentCount findById(Long id) {
        return repository.findById(id);
    }
    
    public List<EquipmentCount> findByCategory(EquipmentCategory category) {
        return repository.findByCategory(category);
    }
    
    public List<EquipmentCount> findNetworkEquipment() {
        return repository.findNetworkEquipment();
    }
    
    public List<EquipmentCount> findServers() {
        return repository.findServers();
    }
    
    public List<EquipmentCount> findAudioVideo() {
        return repository.findAudioVideo();
    }
    
    public List<EquipmentCount> findFurniture() {
        return repository.findFurniture();
    }
    
    public List<EquipmentCount> findOther() {
        return repository.findOther();
    }
    
    public List<EquipmentCount> findByUploadedBy(String employeeId) {
        return repository.findByUploadedBy(employeeId);
    }
    
    public List<EquipmentCount> findByLocation(String location) {
        return repository.findByLocation(location);
    }
    
    @Transactional
    public EquipmentCount create(EquipmentCount equipment) {
        equipment.uploadedDate = LocalDate.now();
        if (equipment.status == null) {
            equipment.status = EquipmentStatus.Active;
        }
        if (equipment.verificationStatus == null) {
            equipment.verificationStatus = VerificationStatus.Pending;
        }
        repository.persist(equipment);
        return equipment;
    }
    
    @Transactional
    public EquipmentCount update(Long id, EquipmentCount equipment) {
        EquipmentCount existing = repository.findById(id);
        if (existing == null) {
            return null;
        }
        existing.category = equipment.category;
        existing.itemName = equipment.itemName;
        existing.quantity = equipment.quantity;
        existing.itemValue = equipment.itemValue;
        existing.location = equipment.location;
        existing.status = equipment.status;
        existing.verificationStatus = equipment.verificationStatus;
        return existing;
    }
    
    @Transactional
    public EquipmentCount updateVerificationStatus(Long id, VerificationStatus status) {
        EquipmentCount equipment = repository.findById(id);
        if (equipment == null) {
            return null;
        }
        equipment.verificationStatus = status;
        return equipment;
    }
    
    @Transactional
    public EquipmentCount archive(Long id) {
        EquipmentCount equipment = repository.findById(id);
        if (equipment == null) {
            return null;
        }
        equipment.status = EquipmentStatus.Archived;
        return equipment;
    }
    
    @Transactional
    public boolean delete(Long id) {
        return repository.deleteById(id);
    }
    
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Count by category
        stats.put("networkCount", sumQuantityByCategory(EquipmentCategory.network));
        stats.put("serverCount", sumQuantityByCategory(EquipmentCategory.servers));
        stats.put("audioVideoCount", sumQuantityByCategory(EquipmentCategory.audioVideo));
        stats.put("furnitureCount", sumQuantityByCategory(EquipmentCategory.furniture));
        stats.put("otherCount", sumQuantityByCategory(EquipmentCategory.other));
        
        // Value by category
        stats.put("networkValue", sumValueByCategory(EquipmentCategory.network));
        stats.put("serverValue", sumValueByCategory(EquipmentCategory.servers));
        stats.put("audioVideoValue", sumValueByCategory(EquipmentCategory.audioVideo));
        stats.put("furnitureValue", sumValueByCategory(EquipmentCategory.furniture));
        stats.put("otherValue", sumValueByCategory(EquipmentCategory.other));
        
        // Totals
        List<EquipmentCount> all = repository.listAll();
        int totalQuantity = all.stream().mapToInt(e -> e.quantity).sum();
        BigDecimal totalValue = all.stream()
            .filter(e -> e.itemValue != null)
            .map(e -> e.itemValue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalQuantity", totalQuantity);
        stats.put("totalValue", totalValue);
        
        return stats;
    }
    
    private int sumQuantityByCategory(EquipmentCategory category) {
        return repository.findByCategory(category).stream()
            .mapToInt(e -> e.quantity)
            .sum();
    }
    
    private BigDecimal sumValueByCategory(EquipmentCategory category) {
        return repository.findByCategory(category).stream()
            .filter(e -> e.itemValue != null)
            .map(e -> e.itemValue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Added: functions to support mapping of pending employees for current campaign
    public List<VerificationRecord> findPendingVerificationRecordsByCampaign(Long campaignId) {
        return verificationRecordRepository.findPendingByCampaignId(campaignId);
    }

    public List<String> findPendingEmployeeIdsByCampaign(Long campaignId) {
        return verificationRecordRepository.findDistinctPendingEmployeeIdsByCampaignId(campaignId);
    }

    public List<User> findPendingEmployeesByCampaign(Long campaignId) {
        List<String> employeeIds = findPendingEmployeeIdsByCampaign(campaignId);
        return employeeIds.stream()
            .map(userRepository::findByEmployeeId)
            .filter(u -> u != null)
            .collect(Collectors.toList());
    }

    public Map<String, Long> getPendingCountByEmployeeForCampaign(Long campaignId) {
        List<VerificationRecord> pending = findPendingVerificationRecordsByCampaign(campaignId);
        return pending.stream()
            .collect(Collectors.groupingBy(vr -> vr.employeeId, Collectors.counting()));
    }
}
