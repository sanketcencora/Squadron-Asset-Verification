package org.squadron.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.squadron.model.VerificationToken;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class VerificationTokenRepository implements PanacheRepository<VerificationToken> {
    
    public Optional<VerificationToken> findByToken(String token) {
        return find("token", token).firstResultOptional();
    }
    
    public List<VerificationToken> findByCampaignId(Long campaignId) {
        return list("campaignId", campaignId);
    }
    
    public List<VerificationToken> findByEmployeeId(String employeeId) {
        return list("employeeId", employeeId);
    }
    
    public Optional<VerificationToken> findValidToken(String employeeId, Long campaignId) {
        return find("employeeId = ?1 and campaignId = ?2 and used = false", employeeId, campaignId)
                .firstResultOptional();
    }
    
    /**
     * Find all pending (unused) verification tokens for a campaign.
     * A token is pending if it's not used (regardless of expiration - let the user know about expired ones too).
     */
    public List<VerificationToken> findPendingByCampaignId(Long campaignId) {
        // Debug: List all tokens in the database first
        List<VerificationToken> allDbTokens = listAll();
        System.out.println("[VerificationTokenRepository] Total tokens in database: " + allDbTokens.size());
        for (VerificationToken t : allDbTokens) {
            System.out.println("[VerificationTokenRepository]   DB Token: id=" + t.id + ", campaignId=" + t.campaignId + 
                ", employee=" + t.employeeName + ", used=" + t.used + ", expires=" + t.expiresAt);
        }
        
        // First, get ALL tokens for this campaign that haven't been used
        List<VerificationToken> allTokens = list("campaignId = ?1 and used = false", campaignId);
        System.out.println("[VerificationTokenRepository] findPendingByCampaignId(" + campaignId + ") found " + allTokens.size() + " unused tokens");
        
        // Filter by current time in Java (more reliable than SQL CURRENT_TIMESTAMP)
        LocalDateTime now = LocalDateTime.now();
        List<VerificationToken> validTokens = allTokens.stream()
            .filter(t -> t.expiresAt.isAfter(now))
            .toList();
        
        System.out.println("[VerificationTokenRepository] After filtering expired, " + validTokens.size() + " valid tokens remain");
        for (VerificationToken t : validTokens) {
            System.out.println("[VerificationTokenRepository]   - Token for " + t.employeeName + " (" + t.employeeEmail + "), expires: " + t.expiresAt);
        }
        
        return validTokens;
    }
    
    /**
     * Find all tokens for a campaign (regardless of status)
     */
    public List<VerificationToken> findAllByCampaignId(Long campaignId) {
        return list("campaignId", campaignId);
    }
    
    public long deleteExpired() {
        LocalDateTime now = LocalDateTime.now();
        return delete("expiresAt < ?1 and used = false", now);
    }
}
