package org.squadron.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.squadron.model.Peripheral;
import org.squadron.model.Peripheral.PeripheralType;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class PeripheralRepository implements PanacheRepository<Peripheral> {
    
    /**
     * Find peripherals by asset ID - Currently Peripheral doesn't have a direct relationship to HardwareAsset.
     * This method returns an empty list since peripherals are assigned to employees, not hardware assets.
     * Use findByAssignedTo(employeeId) instead to get peripherals for an employee.
     */
    public List<Peripheral> findByAssetId(Long assetId) {
        // Peripheral model doesn't have hardwareAsset relationship - return empty list
        // Peripherals are tracked by employee assignment (assignedTo field)
        return List.of();
    }
    
    public List<Peripheral> findByAssignedTo(String employeeId) {
        return find("assignedTo", employeeId).list();
    }
    
    public List<Peripheral> findByType(PeripheralType type) {
        return find("type", type).list();
    }
    
    public List<Peripheral> findVerified() {
        return find("verified", true).list();
    }
    
    public List<Peripheral> findUnverified() {
        return find("verified", false).list();
    }
    
    public long countByAssignedTo(String employeeId) {
        return count("assignedTo", employeeId);
    }
    
    public long countVerified() {
        return count("verified", true);
    }
    
    public long countUnverified() {
        return count("verified", false);
    }
}
