package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.squadron.model.HardwareAsset;
import org.squadron.model.HardwareAsset.AssetStatus;
import org.squadron.model.HardwareAsset.AssetType;
import org.squadron.model.HardwareAsset.VerificationStatus;
import org.squadron.repository.HardwareAssetRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@ApplicationScoped
public class HardwareAssetService {
    
    @Inject
    HardwareAssetRepository repository;
    
    public List<HardwareAsset> findAll() {
        return repository.listAll();
    }
    
    public HardwareAsset findById(Long id) {
        return repository.findById(id);
    }
    
    public HardwareAsset findByServiceTag(String serviceTag) {
        return repository.findByServiceTag(serviceTag);
    }
    
    public List<HardwareAsset> findInstock() {
        return repository.findInstock();
    }
    
    public List<HardwareAsset> findAssigned() {
        return repository.findAssigned();
    }
    
    public List<HardwareAsset> findExceptions() {
        return repository.findExceptions();
    }
    
    public List<HardwareAsset> findByAssignedTo(String employeeId) {
        return repository.findByAssignedTo(employeeId);
    }
    
    public List<HardwareAsset> findByAssetType(AssetType assetType) {
        return repository.findByAssetType(assetType);
    }
    
    public List<HardwareAsset> findHighValue() {
        return repository.findHighValue();
    }
    
    @Transactional
    public HardwareAsset create(HardwareAsset asset) {
        repository.persist(asset);
        return asset;
    }
    
    @Transactional
    public HardwareAsset update(Long id, HardwareAsset asset) {
        HardwareAsset existing = repository.findById(id);
        if (existing == null) {
            return null;
        }
        existing.serviceTag = asset.serviceTag;
        existing.assetType = asset.assetType;
        existing.model = asset.model;
        existing.invoiceNumber = asset.invoiceNumber;
        existing.poNumber = asset.poNumber;
        existing.cost = asset.cost;
        existing.purchaseDate = asset.purchaseDate;
        existing.assignedTo = asset.assignedTo;
        existing.assignedToName = asset.assignedToName;
        existing.assignedDate = asset.assignedDate;
        existing.status = asset.status;
        existing.verificationStatus = asset.verificationStatus;
        existing.lastVerifiedDate = asset.lastVerifiedDate;
        existing.verificationImage = asset.verificationImage;
        existing.isHighValue = asset.isHighValue;
        existing.location = asset.location;
        existing.team = asset.team;
        return existing;
    }
    
    @Transactional
    public HardwareAsset assignToEmployee(Long id, String employeeId, String employeeName) {
        HardwareAsset asset = repository.findById(id);
        if (asset == null) {
            return null;
        }
        asset.assignedTo = employeeId;
        asset.assignedToName = employeeName;
        asset.assignedDate = LocalDate.now();
        asset.status = AssetStatus.Assigned;
        asset.verificationStatus = VerificationStatus.Pending;
        return asset;
    }
    
    @Transactional
    public HardwareAsset updateVerificationStatus(Long id, VerificationStatus status, String imageUrl) {
        HardwareAsset asset = repository.findById(id);
        if (asset == null) {
            return null;
        }
        asset.verificationStatus = status;
        asset.lastVerifiedDate = LocalDate.now();
        if (imageUrl != null) {
            asset.verificationImage = imageUrl;
        }
        return asset;
    }
    
    @Transactional
    public boolean delete(Long id) {
        return repository.deleteById(id);
    }
    
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", repository.count());
        stats.put("instock", repository.countByStatus(AssetStatus.Instock));
        stats.put("assigned", repository.countByStatus(AssetStatus.Assigned));
        stats.put("verified", repository.countByVerificationStatus(VerificationStatus.Verified));
        stats.put("pending", repository.countByVerificationStatus(VerificationStatus.Pending));
        stats.put("overdue", repository.countByVerificationStatus(VerificationStatus.Overdue));
        stats.put("exception", repository.countByVerificationStatus(VerificationStatus.Exception));
        
        // Calculate total value
        List<HardwareAsset> all = repository.listAll();
        BigDecimal totalValue = all.stream()
            .filter(a -> a.cost != null)
            .map(a -> a.cost)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalValue", totalValue);
        
        return stats;
    }
}
