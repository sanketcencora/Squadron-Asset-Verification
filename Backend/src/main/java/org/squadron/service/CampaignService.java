package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.squadron.model.Campaign;
import org.squadron.model.Campaign.CampaignStatus;
import org.squadron.model.VerificationRecord;
import org.squadron.repository.CampaignRepository;
import org.squadron.repository.VerificationRecordRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@ApplicationScoped
public class CampaignService {
    
    @Inject
    CampaignRepository repository;
    
    @Inject
    VerificationRecordRepository verificationRecordRepository;
    
    public List<Campaign> findAll() {
        return repository.listAll();
    }
    
    public Campaign findById(Long id) {
        return repository.findById(id);
    }
    
    public List<Campaign> findActive() {
        return repository.findActive();
    }
    
    public List<Campaign> findByStatus(CampaignStatus status) {
        return repository.findByStatus(status);
    }
    
    public List<Campaign> findByCreatedBy(String userId) {
        return repository.findByCreatedBy(userId);
    }
    
    @Transactional
    public Campaign create(Campaign campaign) {
        campaign.createdDate = LocalDate.now();
        if (campaign.status == null) {
            campaign.status = CampaignStatus.Draft;
        }
        repository.persist(campaign);
        return campaign;
    }
    
    @Transactional
    public Campaign update(Long id, Campaign campaign) {
        Campaign existing = repository.findById(id);
        if (existing == null) {
            return null;
        }
        existing.name = campaign.name;
        existing.description = campaign.description;
        existing.deadline = campaign.deadline;
        existing.status = campaign.status;
        existing.totalEmployees = campaign.totalEmployees;
        existing.totalAssets = campaign.totalAssets;
        existing.totalPeripherals = campaign.totalPeripherals;
        existing.filtersJson = campaign.filtersJson;
        return existing;
    }
    
    @Transactional
    public Campaign launch(Long id) {
        Campaign campaign = repository.findById(id);
        if (campaign == null) {
            return null;
        }
        campaign.status = CampaignStatus.Active;
        return campaign;
    }
    
    @Transactional
    public Campaign complete(Long id) {
        Campaign campaign = repository.findById(id);
        if (campaign == null) {
            return null;
        }
        campaign.status = CampaignStatus.Completed;
        return campaign;
    }
    
    @Transactional
    public Campaign updateCounts(Long id) {
        Campaign campaign = repository.findById(id);
        if (campaign == null) {
            return null;
        }
        
        List<VerificationRecord> records = verificationRecordRepository.findByCampaignId(id);
        
        int verified = 0, pending = 0, overdue = 0, exception = 0;
        for (VerificationRecord record : records) {
            switch (record.status) {
                case Verified -> verified++;
                case Pending -> pending++;
                case Overdue -> overdue++;
                case Exception -> exception++;
            }
        }
        
        campaign.verifiedCount = verified;
        campaign.pendingCount = pending;
        campaign.overdueCount = overdue;
        campaign.exceptionCount = exception;
        
        return campaign;
    }
    
    @Transactional
    public boolean delete(Long id) {
        return repository.deleteById(id);
    }
    
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", repository.count());
        stats.put("active", repository.countByStatus(CampaignStatus.Active));
        stats.put("draft", repository.countByStatus(CampaignStatus.Draft));
        stats.put("completed", repository.countByStatus(CampaignStatus.Completed));
        return stats;
    }
}
