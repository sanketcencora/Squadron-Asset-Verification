package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.squadron.model.Peripheral;
import org.squadron.model.Peripheral.PeripheralType;
import org.squadron.model.Peripheral.PeripheralStatus;
import org.squadron.repository.PeripheralRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@ApplicationScoped
public class PeripheralService {
    
    @Inject
    PeripheralRepository repository;
    
    public List<Peripheral> findAll() {
        return repository.listAll();
    }
    
    public Peripheral findById(Long id) {
        return repository.findById(id);
    }
    
    public List<Peripheral> findByAssignedTo(String employeeId) {
        return repository.findByAssignedTo(employeeId);
    }
    
    public List<Peripheral> findByType(PeripheralType type) {
        return repository.findByType(type);
    }
    
    public List<Peripheral> findVerified() {
        return repository.findVerified();
    }
    
    public List<Peripheral> findUnverified() {
        return repository.findUnverified();
    }
    
    // Stock management methods
    public List<Peripheral> findInstock() {
        return repository.list("status", PeripheralStatus.Instock);
    }
    
    public List<Peripheral> findInstockByType(PeripheralType type) {
        return repository.list("status = ?1 and type = ?2", PeripheralStatus.Instock, type);
    }
    
    public long countInstockByType(PeripheralType type) {
        return repository.count("status = ?1 and type = ?2", PeripheralStatus.Instock, type);
    }
    
    public Map<String, Long> getStockByType() {
        Map<String, Long> stock = new HashMap<>();
        for (PeripheralType type : PeripheralType.values()) {
            stock.put(type.name(), countInstockByType(type));
        }
        return stock;
    }
    
    @Transactional
    public Peripheral create(Peripheral peripheral) {
        if (peripheral.status == null) {
            peripheral.status = PeripheralStatus.Instock;
        }
        repository.persist(peripheral);
        return peripheral;
    }
    
    @Transactional 
    public Peripheral addToStock(PeripheralType type, String serialNumber, String location) {
        Peripheral p = new Peripheral();
        p.type = type;
        p.serialNumber = serialNumber;
        p.status = PeripheralStatus.Instock;
        p.location = location;
        p.purchaseDate = LocalDate.now();
        p.verified = false;
        repository.persist(p);
        return p;
    }
    
    @Transactional
    public Peripheral update(Long id, Peripheral peripheral) {
        Peripheral existing = repository.findById(id);
        if (existing == null) {
            return null;
        }
        existing.type = peripheral.type;
        existing.serialNumber = peripheral.serialNumber;
        existing.assignedTo = peripheral.assignedTo;
        existing.assignedToName = peripheral.assignedToName;
        existing.verified = peripheral.verified;
        existing.assignedDate = peripheral.assignedDate;
        existing.verifiedDate = peripheral.verifiedDate;
        existing.status = peripheral.status;
        existing.location = peripheral.location;
        return existing;
    }
    
    @Transactional
    public Peripheral assignFromStock(PeripheralType type, String employeeId, String employeeName) {
        // Find an available peripheral of this type in stock
        List<Peripheral> available = findInstockByType(type);
        if (available.isEmpty()) {
            return null; // No stock available
        }
        
        // Take the first available one
        Peripheral p = available.get(0);
        p.assignedTo = employeeId;
        p.assignedToName = employeeName;
        p.assignedDate = LocalDate.now();
        p.status = PeripheralStatus.Assigned;
        p.verified = false;
        return p;
    }
    
    @Transactional
    public Peripheral assignToEmployee(PeripheralType type, String serialNumber, 
                                        String employeeId, String employeeName) {
        // Try to assign from stock first
        Peripheral p = assignFromStock(type, employeeId, employeeName);
        if (p != null) {
            return p;
        }
        
        // If no stock, return null (don't create new peripheral)
        return null;
    }
    
    @Transactional
    public Peripheral returnToStock(Long id) {
        Peripheral p = repository.findById(id);
        if (p == null) {
            return null;
        }
        p.assignedTo = null;
        p.assignedToName = null;
        p.assignedDate = null;
        p.status = PeripheralStatus.Instock;
        p.verified = false;
        p.verifiedDate = null;
        return p;
    }
    
    @Transactional
    public Peripheral verify(Long id) {
        Peripheral p = repository.findById(id);
        if (p == null) {
            return null;
        }
        p.verified = true;
        p.verifiedDate = LocalDate.now();
        return p;
    }
    
    @Transactional
    public List<Peripheral> verifyMultiple(List<Long> ids) {
        List<Peripheral> peripherals = repository.list("id in ?1", ids);
        for (Peripheral p : peripherals) {
            p.verified = true;
            p.verifiedDate = LocalDate.now();
        }
        return peripherals;
    }
    
    @Transactional
    public boolean delete(Long id) {
        return repository.deleteById(id);
    }
    
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", repository.count());
        stats.put("verified", repository.countVerified());
        stats.put("unverified", repository.countUnverified());
        stats.put("instock", repository.count("status", PeripheralStatus.Instock));
        stats.put("assigned", repository.count("status", PeripheralStatus.Assigned));
        stats.put("stockByType", getStockByType());
        return stats;
    }
}
