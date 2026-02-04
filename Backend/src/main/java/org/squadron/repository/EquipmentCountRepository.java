package org.squadron.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.squadron.model.EquipmentCount;
import org.squadron.model.EquipmentCount.EquipmentCategory;
import org.squadron.model.EquipmentCount.EquipmentStatus;
import org.squadron.model.EquipmentCount.VerificationStatus;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class EquipmentCountRepository implements PanacheRepository<EquipmentCount> {
    
    public List<EquipmentCount> findByCategory(EquipmentCategory category) {
        return find("category", category).list();
    }
    
    public List<EquipmentCount> findByStatus(EquipmentStatus status) {
        return find("status", status).list();
    }
    
    public List<EquipmentCount> findByVerificationStatus(VerificationStatus status) {
        return find("verificationStatus", status).list();
    }
    
    public List<EquipmentCount> findByUploadedBy(String employeeId) {
        return find("uploadedBy", employeeId).list();
    }
    
    public List<EquipmentCount> findByLocation(String location) {
        return find("location", location).list();
    }
    
    public List<EquipmentCount> findNetworkEquipment() {
        return find("category", EquipmentCategory.network).list();
    }
    
    public List<EquipmentCount> findServers() {
        return find("category", EquipmentCategory.servers).list();
    }
    
    public List<EquipmentCount> findAudioVideo() {
        return find("category", EquipmentCategory.audioVideo).list();
    }
    
    public List<EquipmentCount> findFurniture() {
        return find("category", EquipmentCategory.furniture).list();
    }
    
    public List<EquipmentCount> findOther() {
        return find("category", EquipmentCategory.other).list();
    }
    
    public long countByCategory(EquipmentCategory category) {
        return count("category", category);
    }
}
