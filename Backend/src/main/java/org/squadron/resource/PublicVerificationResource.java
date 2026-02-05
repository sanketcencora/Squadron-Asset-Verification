package org.squadron.resource;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.squadron.model.*;
import org.squadron.repository.VerificationTokenRepository;
import org.squadron.repository.HardwareAssetRepository;
import org.squadron.repository.PeripheralRepository;
import org.squadron.service.VerificationService;
import org.squadron.service.CampaignService;
import org.squadron.service.OcrService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Public API for employee verification (no authentication required)
 * Employees access this via unique token link from email
 */
@Path("/api/public/verify")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PublicVerificationResource {
    
    @Inject
    VerificationTokenRepository tokenRepository;
    
    @Inject
    HardwareAssetRepository assetRepository;
    
    @Inject
    PeripheralRepository peripheralRepository;
    
    @Inject
    VerificationService verificationService;
    
    @Inject
    CampaignService campaignService;
    
    @Inject
    OcrService ocrService;
    
    @Inject
    ObjectMapper objectMapper;
    
    /**
     * Get verification data by token
     * Returns employee info, their assets, and peripherals
     */
    @GET
    @Path("/{token}")
    public Response getVerificationData(@PathParam("token") String token) {
        Optional<VerificationToken> optToken = tokenRepository.findByToken(token);
        
        if (optToken.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Invalid or expired verification link"))
                .build();
        }
        
        VerificationToken verificationToken = optToken.get();
        
        if (!verificationToken.isValid()) {
            return Response.status(Response.Status.GONE)
                .entity(Map.of("message", "This verification link has expired or already been used"))
                .build();
        }
        
        // Get assigned assets
        List<HardwareAsset> assets = assetRepository.findByAssignedTo(verificationToken.employeeId);
        
        // Get peripherals for each asset
        List<Map<String, Object>> assetsWithPeripherals = new ArrayList<>();
        List<String> allPeripherals = new ArrayList<>();
        
        for (HardwareAsset asset : assets) {
            Map<String, Object> assetData = new HashMap<>();
            assetData.put("id", asset.id);
            assetData.put("serviceTag", asset.serviceTag);
            assetData.put("assetType", asset.assetType);
            assetData.put("model", asset.model);
            assetData.put("verificationStatus", asset.verificationStatus);
            
            List<Peripheral> peripherals = peripheralRepository.findByAssetId(asset.id);
            List<String> peripheralTypes = peripherals.stream()
                .map(p -> p.type.name())
                .collect(Collectors.toList());
            assetData.put("peripherals", peripheralTypes);
            allPeripherals.addAll(peripheralTypes);
            
            assetsWithPeripherals.add(assetData);
        }
        
        // Get campaign info
        Campaign campaign = campaignService.findById(verificationToken.campaignId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("employeeId", verificationToken.employeeId);
        response.put("employeeName", verificationToken.employeeName);
        response.put("employeeEmail", verificationToken.employeeEmail);
        response.put("campaignId", verificationToken.campaignId);
        response.put("campaignName", verificationToken.campaignName);
        response.put("deadline", campaign != null ? campaign.deadline : null);
        response.put("assets", assetsWithPeripherals);
        response.put("allPeripherals", allPeripherals.stream().distinct().collect(Collectors.toList()));
        response.put("expiresAt", verificationToken.expiresAt);
        response.put("ocrEnabled", ocrService.isTesseractAvailable());
        
        return Response.ok(response).build();
    }
    
    /**
     * Extract service tag from image using OCR
     */
    public static class OcrRequest {
        public String imageData; // Base64 encoded image
        public String expectedTag; // Optional: expected service tag for verification
    }
    
    @POST
    @Path("/ocr/extract")
    public Response extractServiceTag(OcrRequest req) {
        if (req.imageData == null || req.imageData.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("message", "No image data provided"))
                .build();
        }
        
        if (!ocrService.isTesseractAvailable()) {
            return Response.ok(Map.of(
                "ocrEnabled", false,
                "message", "OCR is not available. Install Tesseract-OCR to enable this feature."
            )).build();
        }
        
        try {
            if (req.expectedTag != null && !req.expectedTag.isEmpty()) {
                // Verify against expected tag
                OcrService.VerificationResult result = ocrService.verifyServiceTag(req.imageData, req.expectedTag);
                return Response.ok(Map.of(
                    "ocrEnabled", true,
                    "extractedTag", result.extractedTag != null ? result.extractedTag : "",
                    "expectedTag", req.expectedTag,
                    "matches", result.matches,
                    "message", result.message
                )).build();
            } else {
                // Just extract the tag
                String extractedTag = ocrService.extractServiceTag(req.imageData);
                return Response.ok(Map.of(
                    "ocrEnabled", true,
                    "extractedTag", extractedTag != null ? extractedTag : "",
                    "found", extractedTag != null,
                    "message", extractedTag != null ? "Service tag found" : "No service tag detected in image"
                )).build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("message", "OCR processing failed: " + e.getMessage()))
                .build();
        }
    }
    
    /**
     * Submit verification for an asset
     */
    public static class VerificationSubmitRequest {
        public Long assetId;
        public String recordedServiceTag;
        public String uploadedImage; // Base64 or URL
        public List<String> peripheralsConfirmed;
        public List<String> peripheralsNotWithMe;
        public String comment;
    }
    
    @POST
    @Path("/{token}/submit")
    @Transactional
    public Response submitVerification(@PathParam("token") String tokenStr, 
                                       VerificationSubmitRequest req) {
        Optional<VerificationToken> optToken = tokenRepository.findByToken(tokenStr);
        
        if (optToken.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Invalid verification link"))
                .build();
        }
        
        VerificationToken token = optToken.get();
        
        if (!token.isValid()) {
            return Response.status(Response.Status.GONE)
                .entity(Map.of("message", "This verification link has expired or already been used"))
                .build();
        }
        
        // Find or create verification record for this asset in the campaign
        VerificationRecord record = findOrCreateVerificationRecord(token, req.assetId);
        if (record == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("message", "Asset not found or not assigned to you"))
                .build();
        }
        
        // OCR: Extract and verify service tag from uploaded image
        String extractedServiceTag = null;
        boolean ocrMatch = false;
        String ocrMessage = null;
        
        if (req.uploadedImage != null && !req.uploadedImage.isEmpty() && record.serviceTag != null) {
            try {
                OcrService.VerificationResult ocrResult = ocrService.verifyServiceTag(req.uploadedImage, record.serviceTag);
                extractedServiceTag = ocrResult.extractedTag;
                ocrMatch = ocrResult.matches;
                ocrMessage = ocrResult.message;
                System.out.println("[PublicVerificationResource] OCR result - Expected: " + record.serviceTag + 
                    ", Extracted: " + extractedServiceTag + ", Match: " + ocrMatch);
            } catch (Exception e) {
                System.err.println("[PublicVerificationResource] OCR failed: " + e.getMessage());
                ocrMessage = "OCR processing failed";
            }
        }
        
        // Convert lists to JSON
        String peripheralsConfirmedJson = "[]";
        String peripheralsNotWithMeJson = "[]";
        try {
            if (req.peripheralsConfirmed != null) {
                peripheralsConfirmedJson = objectMapper.writeValueAsString(req.peripheralsConfirmed);
            }
            if (req.peripheralsNotWithMe != null) {
                peripheralsNotWithMeJson = objectMapper.writeValueAsString(req.peripheralsNotWithMe);
            }
        } catch (Exception e) {
            // Use empty arrays on error
        }
        
        // Use extracted service tag if available, otherwise use provided
        String serviceTagToRecord = extractedServiceTag != null ? extractedServiceTag : req.recordedServiceTag;
        
        // Submit the verification
        VerificationRecord updated = verificationService.submit(
            record.id,
            serviceTagToRecord,
            req.uploadedImage,
            peripheralsConfirmedJson,
            peripheralsNotWithMeJson,
            req.comment
        );
        
        // Update campaign counts
        campaignService.updateCounts(token.campaignId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Verification submitted successfully");
        response.put("status", updated.status);
        response.put("recordId", updated.id);
        response.put("ocrEnabled", ocrService.isTesseractAvailable());
        if (extractedServiceTag != null) {
            response.put("extractedServiceTag", extractedServiceTag);
            response.put("ocrMatch", ocrMatch);
            response.put("ocrMessage", ocrMessage);
        }
        
        return Response.ok(response).build();
    }
    
    /**
     * Submit all verifications and mark token as used
     */
    @POST
    @Path("/{token}/complete")
    @Transactional
    public Response completeVerification(@PathParam("token") String tokenStr) {
        Optional<VerificationToken> optToken = tokenRepository.findByToken(tokenStr);
        
        if (optToken.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Invalid verification link"))
                .build();
        }
        
        VerificationToken token = optToken.get();
        
        if (!token.isValid()) {
            return Response.status(Response.Status.GONE)
                .entity(Map.of("message", "This verification link has expired"))
                .build();
        }
        
        // Mark token as used
        token.used = true;
        token.usedAt = LocalDateTime.now();
        
        // Update campaign counts
        campaignService.updateCounts(token.campaignId);
        
        return Response.ok(Map.of(
            "message", "Verification completed successfully",
            "submittedAt", token.usedAt
        )).build();
    }
    
    private VerificationRecord findOrCreateVerificationRecord(VerificationToken token, Long assetId) {
        // Check if asset belongs to this employee
        HardwareAsset asset = assetRepository.findById(assetId);
        if (asset == null || !token.employeeId.equals(asset.assignedTo)) {
            return null;
        }
        
        // Find existing verification record for this campaign and asset
        List<VerificationRecord> records = verificationService.findByCampaignId(token.campaignId);
        for (VerificationRecord record : records) {
            if (record.assetId != null && record.assetId.equals(assetId)) {
                return record;
            }
        }
        
        // Create new verification record
        return verificationService.createForCampaign(
            token.campaignId,
            token.employeeId,
            token.employeeName,
            assetId,
            asset.serviceTag,
            asset.assetType
        );
    }
}
