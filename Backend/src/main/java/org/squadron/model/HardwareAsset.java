package org.squadron.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "hardware_assets")
public class HardwareAsset extends PanacheEntity {
    
    @Column(unique = true, nullable = false)
    public String serviceTag;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public AssetType assetType;
    
    @Column(nullable = false)
    public String model;
    
    public String invoiceNumber;
    
    public String poNumber;
    
    @Column(precision = 12, scale = 2)
    public BigDecimal cost;
    
    public LocalDate purchaseDate;
    
    public String assignedTo; // employee ID
    
    public String assignedToName;
    
    public LocalDate assignedDate;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public AssetStatus status = AssetStatus.Instock;
    
    @Enumerated(EnumType.STRING)
    public VerificationStatus verificationStatus = VerificationStatus.NotStarted;
    
    public LocalDate lastVerifiedDate;
    
    public String verificationImage;
    
    public boolean isHighValue;
    
    public String location;
    
    public String team;
    
    // Enum definitions
    public enum AssetType {
        Laptop, Monitor, Mobile
    }
    
    public enum AssetStatus {
        Instock, Assigned
    }
    
    public enum VerificationStatus {
        Verified, Pending, Overdue, Exception, NotStarted
    }
}
