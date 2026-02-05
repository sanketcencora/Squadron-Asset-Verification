package org.squadron.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_records")
public class VerificationRecord extends PanacheEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    @JsonBackReference
    public Campaign campaign;
    
    @Column(nullable = false)
    public String employeeId;
    
    @Column(nullable = false)
    public String employeeName;
    
    public Long assetId;
    
    public String serviceTag;
    
    @Enumerated(EnumType.STRING)
    public HardwareAsset.AssetType assetType;
    
    @Enumerated(EnumType.STRING)
    public VerificationStatus status = VerificationStatus.Pending;
    
    @Column(columnDefinition = "LONGTEXT")
    public String uploadedImage;
    
    public String recordedServiceTag;
    
    // JSON stored peripherals confirmed and not with me
    @Column(columnDefinition = "TEXT")
    public String peripheralsConfirmedJson;
    
    @Column(columnDefinition = "TEXT")
    public String peripheralsNotWithMeJson;
    
    @Column(columnDefinition = "TEXT")
    public String comment;
    
    public LocalDateTime submittedDate;
    
    public String reviewedBy;
    
    @Enumerated(EnumType.STRING)
    public ExceptionType exceptionType;
    
    // Enum definitions
    public enum VerificationStatus {
        Verified, Pending, Overdue, Exception
    }
    
    public enum ExceptionType {
        NoResponse, Mismatch, NotWithEmployee, MissingDevice
    }
}
