package org.squadron.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.squadron.model.Campaign;
import org.squadron.model.Campaign.CampaignStatus;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class CampaignRepository implements PanacheRepository<Campaign> {
    
    public List<Campaign> findByStatus(CampaignStatus status) {
        return find("status", status).list();
    }
    
    public List<Campaign> findActive() {
        return find("status", CampaignStatus.Active).list();
    }
    
    public List<Campaign> findByCreatedBy(String userId) {
        return find("createdBy", userId).list();
    }
    
    public long countByStatus(CampaignStatus status) {
        return count("status", status);
    }
}
