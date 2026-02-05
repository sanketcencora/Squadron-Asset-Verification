package org.squadron.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.squadron.model.VerificationRecord;
import org.squadron.model.VerificationRecord.VerificationStatus;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class VerificationRecordRepository implements PanacheRepository<VerificationRecord> {
    
    public List<VerificationRecord> findByCampaignId(Long campaignId) {
        return find("campaign.id", campaignId).list();
    }
    
    public List<VerificationRecord> findByEmployeeId(String employeeId) {
        return find("employeeId", employeeId).list();
    }
    
    public List<VerificationRecord> findByStatus(VerificationStatus status) {
        return find("status", status).list();
    }
    
    public List<VerificationRecord> findPending() {
        return find("status", VerificationStatus.Pending).list();
    }
    
    public List<VerificationRecord> findExceptions() {
        return find("status", VerificationStatus.Exception).list();
    }
    
    public List<VerificationRecord> findByEmployeeIdAndCampaignId(String employeeId, Long campaignId) {
        return find("employeeId = ?1 and campaign.id = ?2", employeeId, campaignId).list();
    }
    
    public long countByStatus(VerificationStatus status) {
        return count("status", status);
    }
    
    public long countByCampaignId(Long campaignId) {
        return count("campaign.id", campaignId);
    }

    // Added: pending records for specific campaign
    public List<VerificationRecord> findPendingByCampaignId(Long campaignId) {
        return find("campaign.id = ?1 and status = ?2", campaignId, VerificationStatus.Pending).list();
    }

    // Added: distinct pending employee IDs for campaign
    public List<String> findDistinctPendingEmployeeIdsByCampaignId(Long campaignId) {
        return getEntityManager()
            .createQuery("select distinct vr.employeeId from VerificationRecord vr where vr.campaign.id = :cid and vr.status = :status", String.class)
            .setParameter("cid", campaignId)
            .setParameter("status", VerificationStatus.Pending)
            .getResultList();
    }
}
