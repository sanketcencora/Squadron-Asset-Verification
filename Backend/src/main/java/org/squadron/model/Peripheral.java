package org.squadron.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "peripherals")
public class Peripheral extends PanacheEntity {
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public PeripheralType type;
    
    public String serialNumber;
    
    @Column(nullable = false)
    public String assignedTo; // employee ID
    
    @Column(nullable = false)
    public String assignedToName;
    
    public boolean verified;
    
    public LocalDate assignedDate;
    
    public LocalDate verifiedDate;
    
    // Enum definition
    public enum PeripheralType {
        Charger, Headphones, Dock, Mouse, Keyboard, USBCCable
    }
}
