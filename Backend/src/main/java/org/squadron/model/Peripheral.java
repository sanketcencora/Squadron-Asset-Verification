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
    @Enumerated(EnumType.STRING)
    public PeripheralStatus status = PeripheralStatus.Instock;
    
    public String assignedTo; // employee ID (nullable - null means instock)
    
    public String assignedToName;
    
    public boolean verified;
    
    public LocalDate assignedDate;
    
    public LocalDate verifiedDate;
    
    public LocalDate purchaseDate;
    
    public String location;
    
    // Enum definitions
    public enum PeripheralType {
        Charger, Headphones, Dock, Mouse, Keyboard, USBCCable
    }
    
    public enum PeripheralStatus {
        Instock, Assigned
    }
}
