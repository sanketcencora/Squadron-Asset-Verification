package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.squadron.model.Campaign;
import org.squadron.model.Campaign.CampaignStatus;
import org.squadron.model.VerificationRecord;
import org.squadron.model.HardwareAsset;
import org.squadron.model.User;
import org.squadron.repository.CampaignRepository;
import org.squadron.repository.VerificationRecordRepository;
import org.squadron.repository.HardwareAssetRepository;
import org.squadron.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@ApplicationScoped
public class CampaignService {
    
    @Inject
    CampaignRepository repository;
    
    @Inject
    VerificationRecordRepository verificationRecordRepository;
    
    @Inject
    HardwareAssetRepository hardwareAssetRepository;
    
    @Inject
    UserRepository userRepository;
    
    @Inject
    ObjectMapper objectMapper;
    
    public List<Campaign> findAll() {
        return repository.listAll();
    }
    
    public Campaign findById(Long id) {
        return repository.findById(id);
    }
    
    public List<Campaign> findActive() {
        return repository.findActive();
    }
    
    public List<Campaign> findByStatus(CampaignStatus status) {
        return repository.findByStatus(status);
    }
    
    public List<Campaign> findByCreatedBy(String userId) {
        return repository.findByCreatedBy(userId);
    }
    
    @Transactional
    public Campaign create(Campaign campaign) {
        campaign.createdDate = LocalDate.now();
        if (campaign.status == null) {
            campaign.status = CampaignStatus.Draft;
        }
        repository.persist(campaign);
        
        // Generate verification records for this campaign
        generateVerificationRecords(campaign);
        
        // Update counts after generating records
        updateCounts(campaign.id);
        
        return campaign;
    }
    
    @Transactional
    public Campaign update(Long id, Campaign campaign) {
        Campaign existing = repository.findById(id);
        if (existing == null) {
            return null;
        }
        existing.name = campaign.name;
        existing.description = campaign.description;
        existing.deadline = campaign.deadline;
        existing.status = campaign.status;
        existing.totalEmployees = campaign.totalEmployees;
        existing.totalAssets = campaign.totalAssets;
        existing.totalPeripherals = campaign.totalPeripherals;
        existing.filtersJson = campaign.filtersJson;
        return existing;
    }
    
    @Transactional
    public Campaign launch(Long id) {
        Campaign campaign = repository.findById(id);
        if (campaign == null) {
            return null;
        }
        campaign.status = CampaignStatus.Active;
        return campaign;
    }
    
    @Transactional
    public Campaign complete(Long id) {
        Campaign campaign = repository.findById(id);
        if (campaign == null) {
            return null;
        }
        campaign.status = CampaignStatus.Completed;
        return campaign;
    }
    
    @Transactional
    public Campaign updateCounts(Long id) {
        Campaign campaign = repository.findById(id);
        if (campaign == null) {
            return null;
        }
        
        List<VerificationRecord> records = verificationRecordRepository.findByCampaignId(id);
        
        int verified = 0, pending = 0, overdue = 0, exception = 0;
        for (VerificationRecord record : records) {
            switch (record.status) {
                case Verified -> verified++;
                case Pending -> pending++;
                case Overdue -> overdue++;
                case Exception -> exception++;
            }
        }
        
        campaign.verifiedCount = verified;
        campaign.pendingCount = pending;
        campaign.overdueCount = overdue;
        campaign.exceptionCount = exception;
        
        return campaign;
    }
    
    @Transactional
    public boolean delete(Long id) {
        return repository.deleteById(id);
    }
    
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", repository.count());
        stats.put("active", repository.countByStatus(CampaignStatus.Active));
        stats.put("draft", repository.countByStatus(CampaignStatus.Draft));
        stats.put("completed", repository.countByStatus(CampaignStatus.Completed));
        return stats;
    }
    
    /**
     * Generate verification records for a campaign based on filters
     */
    private void generateVerificationRecords(Campaign campaign) {
        if (campaign.filtersJson == null || campaign.filtersJson.isEmpty()) {
            return;
        }
        
        try {
            // Parse filters JSON
            JsonNode filters = objectMapper.readTree(campaign.filtersJson);
            
            // Get employee IDs from filters
            List<String> employeeIds = new ArrayList<>();
            if (filters.has("employeeIds") && filters.get("employeeIds").isArray()) {
                filters.get("employeeIds").forEach(node -> employeeIds.add(node.asText()));
            }
            
            // Get asset types from filters
            List<String> assetTypeStrings = new ArrayList<>();
            if (filters.has("assetTypes") && filters.get("assetTypes").isArray()) {
                filters.get("assetTypes").forEach(node -> assetTypeStrings.add(node.asText()));
            }
            
            // Convert to AssetType enum
            List<HardwareAsset.AssetType> assetTypes = new ArrayList<>();
            for (String typeStr : assetTypeStrings) {
                try {
                    assetTypes.add(HardwareAsset.AssetType.valueOf(typeStr));
                } catch (IllegalArgumentException e) {
                    System.err.println("Invalid asset type: " + typeStr);
                }
            }
            
            // If no specific employee IDs, get all users (or by department if specified)
            List<User> targetUsers = new ArrayList<>();
            if (!employeeIds.isEmpty()) {
                for (String empId : employeeIds) {
                    User user = userRepository.findByEmployeeId(empId);
                    if (user != null) {
                        targetUsers.add(user);
                    }
                }
            } else {
                // If no specific employees, could filter by teams/departments
                // For now, skip creating records if no employees specified
                return;
            }
            
            // For each employee, find their assigned assets matching the asset types
            for (User user : targetUsers) {
                List<HardwareAsset> userAssets = hardwareAssetRepository.findByAssignedTo(user.employeeId);
                
                for (HardwareAsset asset : userAssets) {
                    // Filter by asset type if specified
                    if (!assetTypes.isEmpty() && !assetTypes.contains(asset.assetType)) {
                        continue;
                    }
                    
                    // Create verification record
                    VerificationRecord record = new VerificationRecord();
                    record.campaign = campaign;
                    record.employeeId = user.employeeId;
                    record.employeeName = user.name;
                    record.assetId = asset.id;
                    record.serviceTag = asset.serviceTag;
                    record.assetType = asset.assetType;
                    record.status = VerificationRecord.VerificationStatus.Pending;
                    
                    verificationRecordRepository.persist(record);
                }
            }
            
            System.out.println("[CampaignService] Generated verification records for campaign: " + campaign.name);
            
        } catch (Exception e) {
            System.err.println("[CampaignService] Error generating verification records: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
