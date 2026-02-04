package org.squadron.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "campaigns")
public class Campaign extends PanacheEntity {
    
    @Column(nullable = false)
    public String name;
    
    public String description;
    
    public String createdBy; // user ID
    
    public LocalDate createdDate;
    
    public LocalDate startDate;
    
    public LocalDate deadline; // End date
    
    @Enumerated(EnumType.STRING)
    public CampaignStatus status = CampaignStatus.Draft;
    
    public int totalEmployees;
    
    public int totalAssets;
    
    public int totalPeripherals;
    
    public int verifiedCount;
    
    public int pendingCount;
    
    public int overdueCount;
    
    public int exceptionCount;
    
    // JSON stored filters
    @Column(columnDefinition = "TEXT")
    public String filtersJson;
    
    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<VerificationRecord> verificationRecords;
    
    // Enum definition
    public enum CampaignStatus {
        Draft, Active, Completed
    }
}
