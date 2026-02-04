package org.squadron.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.squadron.model.HardwareAsset;
import org.squadron.model.HardwareAsset.AssetStatus;
import org.squadron.model.HardwareAsset.VerificationStatus;
import org.squadron.model.HardwareAsset.AssetType;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class HardwareAssetRepository implements PanacheRepository<HardwareAsset> {
    
    public List<HardwareAsset> findByStatus(AssetStatus status) {
        return find("status", status).list();
    }
    
    public List<HardwareAsset> findByVerificationStatus(VerificationStatus status) {
        return find("verificationStatus", status).list();
    }
    
    public List<HardwareAsset> findByAssignedTo(String employeeId) {
        return find("assignedTo", employeeId).list();
    }
    
    public List<HardwareAsset> findByAssetType(AssetType assetType) {
        return find("assetType", assetType).list();
    }
    
    public HardwareAsset findByServiceTag(String serviceTag) {
        return find("serviceTag", serviceTag).firstResult();
    }
    
    public List<HardwareAsset> findInstock() {
        return find("status", AssetStatus.Instock).list();
    }
    
    public List<HardwareAsset> findAssigned() {
        return find("status", AssetStatus.Assigned).list();
    }
    
    public List<HardwareAsset> findExceptions() {
        return find("verificationStatus in (?1, ?2)", 
            VerificationStatus.Exception, VerificationStatus.Overdue).list();
    }
    
    public List<HardwareAsset> findHighValue() {
        return find("isHighValue", true).list();
    }
    
    public long countByStatus(AssetStatus status) {
        return count("status", status);
    }
    
    public long countByVerificationStatus(VerificationStatus status) {
        return count("verificationStatus", status);
    }
}
