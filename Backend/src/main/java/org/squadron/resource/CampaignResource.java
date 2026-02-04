package org.squadron.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.squadron.model.Campaign;
import org.squadron.model.Campaign.CampaignStatus;
import org.squadron.service.CampaignService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Path("/api/campaigns")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CampaignResource {
    
    @Inject
    CampaignService service;
    
    @GET
    public List<Campaign> getAll() {
        return service.findAll();
    }
    
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Campaign campaign = service.findById(id);
        if (campaign == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Campaign not found"))
                .build();
        }
        return Response.ok(campaign).build();
    }
    
    @GET
    @Path("/active")
    public List<Campaign> getActive() {
        return service.findActive();
    }
    
    @GET
    @Path("/status/{status}")
    public List<Campaign> getByStatus(@PathParam("status") CampaignStatus status) {
        return service.findByStatus(status);
    }
    
    @GET
    @Path("/created-by/{userId}")
    public List<Campaign> getByCreatedBy(@PathParam("userId") String userId) {
        return service.findByCreatedBy(userId);
    }
    
    @GET
    @Path("/stats")
    public Map<String, Object> getStats() {
        return service.getStats();
    }
    
    public static class CreateCampaignRequest {
        public String name;
        public String description;
        public String createdBy;
        public LocalDate startDate;
        public LocalDate deadline;
        public int totalEmployees;
        public int totalAssets;
        public int totalPeripherals;
        public String filtersJson;
    }
    
    @POST
    public Response create(CreateCampaignRequest req) {
        Campaign campaign = new Campaign();
        campaign.name = req.name;
        campaign.description = req.description;
        campaign.createdBy = req.createdBy;
        campaign.startDate = req.startDate;
        campaign.deadline = req.deadline;
        campaign.totalEmployees = req.totalEmployees;
        campaign.totalAssets = req.totalAssets;
        campaign.totalPeripherals = req.totalPeripherals;
        campaign.filtersJson = req.filtersJson;
        
        // Automatically set status based on current date
        LocalDate today = LocalDate.now();
        if (req.deadline != null && today.isAfter(req.deadline)) {
            // Deadline has passed - mark as completed
            campaign.status = CampaignStatus.Completed;
        } else if (req.startDate != null && !today.isBefore(req.startDate)) {
            // Current date is on or after start date (and before deadline) - mark as active
            campaign.status = CampaignStatus.Active;
        } else {
            // Start date is in the future - mark as draft
            campaign.status = CampaignStatus.Draft;
        }
        
        Campaign created = service.create(campaign);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
    
    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, Campaign campaign) {
        Campaign updated = service.update(id, campaign);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Campaign not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    @POST
    @Path("/{id}/launch")
    public Response launch(@PathParam("id") Long id) {
        Campaign updated = service.launch(id);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Campaign not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    @POST
    @Path("/{id}/complete")
    public Response complete(@PathParam("id") Long id) {
        Campaign updated = service.complete(id);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Campaign not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    @POST
    @Path("/{id}/update-counts")
    public Response updateCounts(@PathParam("id") Long id) {
        Campaign updated = service.updateCounts(id);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Campaign not found"))
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
                .entity(Map.of("message", "Campaign not found"))
                .build();
        }
        return Response.noContent().build();
    }
}
