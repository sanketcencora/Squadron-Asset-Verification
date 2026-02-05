package org.squadron.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.squadron.model.Campaign;
import org.squadron.model.Campaign.CampaignStatus;
import org.squadron.model.User;
import org.squadron.model.VerificationToken;
import org.squadron.service.CampaignService;
import org.squadron.service.EmailService;
import org.squadron.service.UserService;
import org.squadron.repository.VerificationTokenRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.squadron.service.EquipmentService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Path("/api/campaigns")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CampaignResource {
    
    @Inject
    CampaignService service;
    
    @Inject
    EmailService emailService;
    
    @Inject
    UserService userService;
    
    @Inject
    ObjectMapper objectMapper;
    
    @Inject
    VerificationTokenRepository tokenRepository;
    
    // Added: equipment service to map pending employees when tokens are missing
    @Inject
    EquipmentService equipmentService;

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
    
    /**
     * Launch campaign and send verification emails to all employees
     */
    @POST
    @Path("/{id}/launch-with-emails")
    @jakarta.transaction.Transactional
    public Response launchWithEmails(@PathParam("id") Long id) {
        Campaign campaign = service.findById(id);
        if (campaign == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Campaign not found"))
                .build();
        }
        
        System.out.println("[CampaignResource] Launching campaign: " + campaign.name + " (ID: " + id + ")");
        System.out.println("[CampaignResource] filtersJson: " + campaign.filtersJson);
        
        // Get employees from campaign filters
        List<User> employees = new ArrayList<>();
        try {
            if (campaign.filtersJson != null) {
                JsonNode filters = objectMapper.readTree(campaign.filtersJson);
                JsonNode teamsNode = filters.get("teams");
                if (teamsNode != null && teamsNode.isArray()) {
                    List<String> teams = new ArrayList<>();
                    teamsNode.forEach(node -> teams.add(node.asText()));
                    System.out.println("[CampaignResource] Teams from filter: " + teams);
                    employees = userService.findByDepartments(teams);
                    System.out.println("[CampaignResource] Found " + employees.size() + " employees for teams");
                    for (User emp : employees) {
                        System.out.println("[CampaignResource]   - " + emp.name + " (" + emp.employeeId + ") - " + emp.email);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[CampaignResource] Failed to parse filters: " + e.getMessage());
            e.printStackTrace();
        }
        
        if (employees.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("message", "No employees found for this campaign. Check that selected teams have employees with assigned assets."))
                .build();
        }
        
        // Launch the campaign
        Campaign updated = service.launch(id);
        
        // Send emails to all employees
        List<VerificationToken> tokens = emailService.sendCampaignEmails(campaign, employees);
        System.out.println("[CampaignResource] Created " + tokens.size() + " verification tokens");
        
        // Build verification links for UI display (useful when emails are mocked)
        List<Map<String, String>> verificationLinks = new ArrayList<>();
        for (VerificationToken token : tokens) {
            verificationLinks.add(Map.of(
                "employeeName", token.employeeName,
                "employeeEmail", token.employeeEmail,
                "verificationUrl", "http://localhost:5173/verify?token=" + token.token
            ));
        }
        
        return Response.ok(Map.of(
            "campaign", updated,
            "emailsSent", tokens.size(),
            "totalEmployees", employees.size(),
            "verificationLinks", verificationLinks
        )).build();
    }
    
    /**
     * Send reminder emails for pending verifications
     */
    @POST
    @Path("/{id}/send-reminders")
    @jakarta.transaction.Transactional
    public Response sendReminders(@PathParam("id") Long id) {
        Campaign campaign = service.findById(id);
        if (campaign == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Campaign not found"))
                .build();
        }
        
        System.out.println("[CampaignResource] sendReminders called for campaign ID: " + id);
        
        // Get pending verification tokens for this campaign
        List<VerificationToken> pendingTokens = tokenRepository.findPendingByCampaignId(id);
        System.out.println("[CampaignResource] Found " + pendingTokens.size() + " pending tokens");
        
        int remindersSent = 0;

        if (!pendingTokens.isEmpty()) {
            // Normal path: send reminder emails using existing tokens
            for (VerificationToken token : pendingTokens) {
                try {
                    emailService.sendReminderEmail(token, campaign);
                    remindersSent++;
                    System.out.println("[CampaignResource] Reminder sent to: " + token.employeeEmail);
                } catch (Exception e) {
                    System.err.println("[CampaignResource] Failed to send reminder to " + token.employeeEmail + ": " + e.getMessage());
                }
            }
        } else {
            // Fallback: no tokens found but records may be pending. Find employees with pending verification records for this campaign.
            List<User> pendingEmployees = equipmentService.findPendingEmployeesByCampaign(id);
            System.out.println("[CampaignResource] Fallback pending employees: " + pendingEmployees.size());

            // Send fresh verification emails (creating tokens) to these pending employees
            List<VerificationToken> newTokens = emailService.sendCampaignEmails(campaign, pendingEmployees);
            remindersSent += newTokens.size();
            System.out.println("[CampaignResource] Fallback created and sent " + newTokens.size() + " verification emails");
        }
        
        return Response.ok(Map.of(
            "message", "Reminders sent",
            "remindersSent", remindersSent,
            "totalPending", pendingTokens.size()
        )).build();
    }
    
    /**
     * Debug endpoint to check tokens for a campaign
     */
    @GET
    @Path("/{id}/tokens")
    @jakarta.transaction.Transactional
    public Response getTokens(@PathParam("id") Long id) {
        Campaign campaign = service.findById(id);
        if (campaign == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Campaign not found"))
                .build();
        }
        
        List<VerificationToken> allTokens = tokenRepository.findAllByCampaignId(id);
        List<VerificationToken> pendingTokens = tokenRepository.findPendingByCampaignId(id);
        
        List<Map<String, Object>> tokenInfos = allTokens.stream()
            .map(t -> {
                java.util.HashMap<String, Object> tokenMap = new java.util.HashMap<>();
                tokenMap.put("id", t.id);
                tokenMap.put("employeeName", t.employeeName);
                tokenMap.put("employeeEmail", t.employeeEmail != null ? t.employeeEmail : "");
                tokenMap.put("used", t.used);
                tokenMap.put("createdAt", t.createdAt.toString());
                tokenMap.put("expiresAt", t.expiresAt.toString());
                return (Map<String, Object>) tokenMap;
            })
            .collect(Collectors.toList());
        
        return Response.ok(Map.of(
            "campaignId", id,
            "totalTokens", allTokens.size(),
            "pendingTokens", pendingTokens.size(),
            "tokens", tokenInfos
        )).build();
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
