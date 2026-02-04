package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.squadron.model.VerificationRecord;
import org.squadron.model.VerificationRecord.VerificationStatus;
import org.squadron.model.VerificationRecord.ExceptionType;
import org.squadron.model.Campaign;
import org.squadron.repository.VerificationRecordRepository;
import org.squadron.repository.CampaignRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@ApplicationScoped
public class VerificationService {
    
    @Inject
    VerificationRecordRepository repository;
    
    @Inject
    CampaignRepository campaignRepository;
    
    public List<VerificationRecord> findAll() {
        return repository.listAll();
    }
    
    public VerificationRecord findById(Long id) {
        return repository.findById(id);
    }
    
    public List<VerificationRecord> findByCampaignId(Long campaignId) {
        return repository.findByCampaignId(campaignId);
    }
    
    public List<VerificationRecord> findByEmployeeId(String employeeId) {
        return repository.findByEmployeeId(employeeId);
    }
    
    public List<VerificationRecord> findPending() {
        return repository.findPending();
    }
    
    public List<VerificationRecord> findExceptions() {
        return repository.findExceptions();
    }
    
    public List<VerificationRecord> findByStatus(VerificationStatus status) {
        return repository.findByStatus(status);
    }
    
    @Transactional
    public VerificationRecord create(VerificationRecord record) {
        repository.persist(record);
        return record;
    }
    
    @Transactional
    public VerificationRecord createForCampaign(Long campaignId, String employeeId, String employeeName,
                                                 Long assetId, String serviceTag, 
                                                 org.squadron.model.HardwareAsset.AssetType assetType) {
        Campaign campaign = campaignRepository.findById(campaignId);
        if (campaign == null) {
            return null;
        }
        
        VerificationRecord record = new VerificationRecord();
        record.campaign = campaign;
        record.employeeId = employeeId;
        record.employeeName = employeeName;
        record.assetId = assetId;
        record.serviceTag = serviceTag;
        record.assetType = assetType;
        record.status = VerificationStatus.Pending;
        
        repository.persist(record);
        return record;
    }
    
    @Transactional
    public VerificationRecord submit(Long id, String recordedServiceTag, String imageUrl,
                                     String peripheralsConfirmedJson, String peripheralsNotWithMeJson,
                                     String comment) {
        VerificationRecord record = repository.findById(id);
        if (record == null) {
            return null;
        }
        
        record.recordedServiceTag = recordedServiceTag;
        record.uploadedImage = imageUrl;
        record.peripheralsConfirmedJson = peripheralsConfirmedJson;
        record.peripheralsNotWithMeJson = peripheralsNotWithMeJson;
        record.comment = comment;
        record.submittedDate = LocalDateTime.now();
        
        // Check if service tag matches
        if (recordedServiceTag != null && record.serviceTag != null && 
            !recordedServiceTag.equals(record.serviceTag)) {
            record.status = VerificationStatus.Exception;
            record.exceptionType = ExceptionType.Mismatch;
        } else {
            record.status = VerificationStatus.Verified;
        }
        
        return record;
    }
    
    @Transactional
    public VerificationRecord review(Long id, String reviewedBy, VerificationStatus newStatus,
                                     ExceptionType exceptionType) {
        VerificationRecord record = repository.findById(id);
        if (record == null) {
            return null;
        }
        
        record.reviewedBy = reviewedBy;
        record.status = newStatus;
        if (exceptionType != null) {
            record.exceptionType = exceptionType;
        }
        
        return record;
    }
    
    @Transactional
    public VerificationRecord markException(Long id, ExceptionType exceptionType, String comment) {
        VerificationRecord record = repository.findById(id);
        if (record == null) {
            return null;
        }
        
        record.status = VerificationStatus.Exception;
        record.exceptionType = exceptionType;
        if (comment != null) {
            record.comment = comment;
        }
        
        return record;
    }
    
    @Transactional
    public boolean delete(Long id) {
        return repository.deleteById(id);
    }
    
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", repository.count());
        stats.put("verified", repository.countByStatus(VerificationStatus.Verified));
        stats.put("pending", repository.countByStatus(VerificationStatus.Pending));
        stats.put("overdue", repository.countByStatus(VerificationStatus.Overdue));
        stats.put("exception", repository.countByStatus(VerificationStatus.Exception));
        return stats;
    }
}
