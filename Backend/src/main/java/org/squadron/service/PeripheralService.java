package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.squadron.model.Peripheral;
import org.squadron.model.Peripheral.PeripheralType;
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
    
    @Transactional
    public Peripheral create(Peripheral peripheral) {
        repository.persist(peripheral);
        return peripheral;
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
        return existing;
    }
    
    @Transactional
    public Peripheral assignToEmployee(PeripheralType type, String serialNumber, 
                                        String employeeId, String employeeName) {
        Peripheral p = new Peripheral();
        p.type = type;
        p.serialNumber = serialNumber;
        p.assignedTo = employeeId;
        p.assignedToName = employeeName;
        p.assignedDate = LocalDate.now();
        p.verified = false;
        repository.persist(p);
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
        return stats;
    }
}
