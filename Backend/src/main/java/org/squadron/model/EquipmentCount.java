package org.squadron.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "equipment_counts")
public class EquipmentCount extends PanacheEntity {
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public EquipmentCategory category;
    
    @Column(nullable = false)
    public String itemName;
    
    public int quantity;
    
    @Column(name = "item_value", precision = 14, scale = 2)
    @JsonProperty("value")
    public BigDecimal itemValue;
    
    public String location;
    
    public String uploadedBy; // employee ID
    
    public LocalDate uploadedDate;
    
    @Enumerated(EnumType.STRING)
    public EquipmentStatus status = EquipmentStatus.Active;
    
    @Enumerated(EnumType.STRING)
    public VerificationStatus verificationStatus = VerificationStatus.Pending;
    
    // Enum definitions
    public enum EquipmentCategory {
        network, servers, audioVideo, furniture, other
    }
    
    public enum EquipmentStatus {
        Active, Archived
    }
    
    public enum VerificationStatus {
        Verified, Pending, Overdue, Exception
    }
}
