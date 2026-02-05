package org.squadron.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verification_tokens")
public class VerificationToken extends PanacheEntity {
    
    @Column(nullable = false, unique = true)
    public String token;
    
    @Column(nullable = false)
    public String employeeId;
    
    @Column(nullable = false)
    public String employeeName;
    
    public String employeeEmail;
    
    @Column(nullable = false)
    public Long campaignId;
    
    public String campaignName;
    
    @Column(nullable = false)
    public LocalDateTime createdAt;
    
    @Column(nullable = false)
    public LocalDateTime expiresAt;
    
    public boolean used = false;
    
    public LocalDateTime usedAt;
    
    // JSON stored asset IDs for this employee
    @Column(columnDefinition = "TEXT")
    public String assetIdsJson;
    
    public static VerificationToken create(String employeeId, String employeeName, 
                                           String employeeEmail, Long campaignId, 
                                           String campaignName, String assetIdsJson,
                                           int expirationDays) {
        VerificationToken token = new VerificationToken();
        token.token = UUID.randomUUID().toString();
        token.employeeId = employeeId;
        token.employeeName = employeeName;
        token.employeeEmail = employeeEmail;
        token.campaignId = campaignId;
        token.campaignName = campaignName;
        token.assetIdsJson = assetIdsJson;
        token.createdAt = LocalDateTime.now();
        token.expiresAt = LocalDateTime.now().plusDays(expirationDays);
        return token;
    }
    
    public boolean isValid() {
        return !used && LocalDateTime.now().isBefore(expiresAt);
    }
}
