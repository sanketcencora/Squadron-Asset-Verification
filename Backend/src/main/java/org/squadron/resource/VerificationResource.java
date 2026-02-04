package org.squadron.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.squadron.model.VerificationRecord;
import org.squadron.model.VerificationRecord.VerificationStatus;
import org.squadron.model.VerificationRecord.ExceptionType;
import org.squadron.model.HardwareAsset.AssetType;
import org.squadron.service.VerificationService;

import java.util.List;
import java.util.Map;

@Path("/api/verifications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class VerificationResource {
    
    @Inject
    VerificationService service;
    
    @GET
    public List<VerificationRecord> getAll() {
        return service.findAll();
    }
    
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        VerificationRecord record = service.findById(id);
        if (record == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Verification record not found"))
                .build();
        }
        return Response.ok(record).build();
    }
    
    @GET
    @Path("/campaign/{campaignId}")
    public List<VerificationRecord> getByCampaign(@PathParam("campaignId") Long campaignId) {
        return service.findByCampaignId(campaignId);
    }
    
    @GET
    @Path("/employee/{employeeId}")
    public List<VerificationRecord> getByEmployee(@PathParam("employeeId") String employeeId) {
        return service.findByEmployeeId(employeeId);
    }
    
    @GET
    @Path("/pending")
    public List<VerificationRecord> getPending() {
        return service.findPending();
    }
    
    @GET
    @Path("/exceptions")
    public List<VerificationRecord> getExceptions() {
        return service.findExceptions();
    }
    
    @GET
    @Path("/status/{status}")
    public List<VerificationRecord> getByStatus(@PathParam("status") VerificationStatus status) {
        return service.findByStatus(status);
    }
    
    @GET
    @Path("/stats")
    public Map<String, Object> getStats() {
        return service.getStats();
    }
    
    @POST
    public Response create(VerificationRecord record) {
        VerificationRecord created = service.create(record);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
    
    public static class CreateForCampaignRequest {
        public Long campaignId;
        public String employeeId;
        public String employeeName;
        public Long assetId;
        public String serviceTag;
        public AssetType assetType;
    }
    
    @POST
    @Path("/campaign")
    public Response createForCampaign(CreateForCampaignRequest req) {
        VerificationRecord created = service.createForCampaign(
            req.campaignId, req.employeeId, req.employeeName,
            req.assetId, req.serviceTag, req.assetType
        );
        if (created == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("message", "Campaign not found"))
                .build();
        }
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
    
    public static class SubmitRequest {
        public String recordedServiceTag;
        public String imageUrl;
        public String peripheralsConfirmedJson;
        public String peripheralsNotWithMeJson;
        public String comment;
    }
    
    @POST
    @Path("/{id}/submit")
    public Response submit(@PathParam("id") Long id, SubmitRequest req) {
        VerificationRecord updated = service.submit(id, 
            req.recordedServiceTag, req.imageUrl,
            req.peripheralsConfirmedJson, req.peripheralsNotWithMeJson,
            req.comment
        );
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Verification record not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    public static class ReviewRequest {
        public String reviewedBy;
        public VerificationStatus status;
        public ExceptionType exceptionType;
    }
    
    @POST
    @Path("/{id}/review")
    public Response review(@PathParam("id") Long id, ReviewRequest req) {
        VerificationRecord updated = service.review(id, 
            req.reviewedBy, req.status, req.exceptionType
        );
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Verification record not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    public static class ExceptionRequest {
        public ExceptionType exceptionType;
        public String comment;
    }
    
    @POST
    @Path("/{id}/exception")
    public Response markException(@PathParam("id") Long id, ExceptionRequest req) {
        VerificationRecord updated = service.markException(id, req.exceptionType, req.comment);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Verification record not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = service.delete(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Verification record not found"))
                .build();
        }
        return Response.noContent().build();
    }
}
