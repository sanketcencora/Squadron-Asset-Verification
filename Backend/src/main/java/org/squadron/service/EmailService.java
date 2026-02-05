package org.squadron.service;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.squadron.model.*;
import org.squadron.repository.VerificationTokenRepository;
import org.squadron.repository.HardwareAssetRepository;
import org.squadron.repository.PeripheralRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@ApplicationScoped
public class EmailService {
    
    @Inject
    Mailer mailer;
    
    @Inject
    VerificationTokenRepository tokenRepository;
    
    @Inject
    HardwareAssetRepository assetRepository;
    
    @Inject
    PeripheralRepository peripheralRepository;
    
    @Inject
    ObjectMapper objectMapper;
    
    @ConfigProperty(name = "app.frontend.url", defaultValue = "http://localhost:5173")
    String frontendUrl;
    
    @ConfigProperty(name = "app.email.from", defaultValue = "asset-verification@cencora.com")
    String emailFrom;
    
    /**
     * Send verification email to an employee with their assigned assets
     */
    @Transactional
    public VerificationToken sendVerificationEmail(String employeeId, String employeeName, 
                                                    String employeeEmail, Campaign campaign) {
        // Get employee's assigned assets
        List<HardwareAsset> assets = assetRepository.findByAssignedTo(employeeId);
        
        if (assets.isEmpty()) {
            System.out.println("[EmailService] No assets found for employee: " + employeeId);
            return null;
        }
        
        // Get asset IDs as JSON
        List<Long> assetIds = assets.stream().map(a -> a.id).collect(Collectors.toList());
        String assetIdsJson;
        try {
            assetIdsJson = objectMapper.writeValueAsString(assetIds);
        } catch (Exception e) {
            assetIdsJson = "[]";
        }
        
        // Calculate expiration based on campaign deadline (or 30 days default)
        int expirationDays = 30;
        if (campaign.deadline != null) {
            long daysUntilDeadline = java.time.temporal.ChronoUnit.DAYS.between(
                java.time.LocalDate.now(), campaign.deadline);
            if (daysUntilDeadline > 0) {
                expirationDays = (int) daysUntilDeadline + 7; // Add 7 days buffer
            }
        }
        
        // Create verification token
        VerificationToken token = VerificationToken.create(
            employeeId, employeeName, employeeEmail,
            campaign.id, campaign.name, assetIdsJson, expirationDays
        );
        tokenRepository.persist(token);
        tokenRepository.flush(); // Ensure token is immediately persisted
        System.out.println("[EmailService] Persisted token ID: " + token.id + " for campaign ID: " + token.campaignId);
        
        // Build verification URL
        String verificationUrl = frontendUrl + "/verify?token=" + token.token;
        
        // Build email content
        String subject = "Action Required: Asset Verification for " + campaign.name;
        String htmlContent = buildVerificationEmailHtml(employeeName, campaign, assets, verificationUrl);
        String textContent = buildVerificationEmailText(employeeName, campaign, assets, verificationUrl);
        
        try {
            mailer.send(
                Mail.withHtml(employeeEmail, subject, htmlContent)
                    .setText(textContent)
            );
            System.out.println("[EmailService] Verification email sent to: " + employeeEmail);
        } catch (Exception e) {
            System.err.println("[EmailService] Failed to send email to " + employeeEmail + ": " + e.getMessage());
            // Still return the token so verification can proceed via direct link
        }
        
        return token;
    }
    
    /**
     * Send bulk verification emails for a campaign
     */
    @Transactional
    public List<VerificationToken> sendCampaignEmails(Campaign campaign, List<User> employees) {
        List<VerificationToken> tokens = new ArrayList<>();
        
        System.out.println("[EmailService] sendCampaignEmails called for campaign: " + campaign.name + " (ID: " + campaign.id + ")");
        System.out.println("[EmailService] Processing " + employees.size() + " employees");
        
        for (User employee : employees) {
            System.out.println("[EmailService] Processing employee: " + employee.name + " (" + employee.employeeId + ")");
            VerificationToken token = sendVerificationEmail(
                employee.employeeId, 
                employee.name, 
                employee.email, 
                campaign
            );
            if (token != null) {
                System.out.println("[EmailService] Created token for " + employee.name + " with campaignId: " + token.campaignId);
                tokens.add(token);
            } else {
                System.out.println("[EmailService] No token created for " + employee.name + " (no assets?)");
            }
        }
        
        System.out.println("[EmailService] Total tokens created: " + tokens.size());
        return tokens;
    }
    
    private String buildVerificationEmailHtml(String employeeName, Campaign campaign, 
                                              List<HardwareAsset> assets, String verificationUrl) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html><head><style>");
        html.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
        html.append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
        html.append(".header { background: #461e96; color: white; padding: 20px; text-align: center; }");
        html.append(".content { padding: 20px; background: #f9f9f9; }");
        html.append(".asset-card { background: white; border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }");
        html.append(".btn { display: inline-block; background: #461e96; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }");
        html.append(".footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }");
        html.append("</style></head><body>");
        
        html.append("<div class='container'>");
        html.append("<div class='header'>");
        html.append("<h1>Asset Verification Required</h1>");
        html.append("</div>");
        
        html.append("<div class='content'>");
        html.append("<p>Dear ").append(employeeName).append(",</p>");
        html.append("<p>As part of the <strong>").append(campaign.name).append("</strong>, ");
        html.append("you are required to verify the following assets assigned to you:</p>");
        
        html.append("<h3>Your Assigned Assets:</h3>");
        for (HardwareAsset asset : assets) {
            html.append("<div class='asset-card'>");
            html.append("<strong>").append(asset.model).append("</strong><br>");
            html.append("Type: ").append(asset.assetType).append("<br>");
            html.append("Service Tag: <code>").append(asset.serviceTag).append("</code>");
            html.append("</div>");
        }
        
        // Get peripherals for these assets
        for (HardwareAsset asset : assets) {
            List<Peripheral> peripherals = peripheralRepository.findByAssetId(asset.id);
            if (!peripherals.isEmpty()) {
                html.append("<h4>Peripherals for ").append(asset.model).append(":</h4>");
                html.append("<ul>");
                for (Peripheral p : peripherals) {
                    html.append("<li>").append(p.type).append("</li>");
                }
                html.append("</ul>");
            }
        }
        
        html.append("<p style='text-align: center;'>");
        html.append("<a href='").append(verificationUrl).append("' class='btn'>Verify My Assets</a>");
        html.append("</p>");
        
        html.append("<p><strong>What you need to do:</strong></p>");
        html.append("<ol>");
        html.append("<li>Click the button above to open the verification form</li>");
        html.append("<li>Take photos of each device showing the service tag</li>");
        html.append("<li>Confirm which peripherals are in your possession</li>");
        html.append("<li>Submit your verification</li>");
        html.append("</ol>");
        
        if (campaign.deadline != null) {
            html.append("<p style='color: #c00;'><strong>Deadline: ")
                .append(campaign.deadline).append("</strong></p>");
        }
        
        html.append("</div>");
        
        html.append("<div class='footer'>");
        html.append("<p>This is an automated message from the Asset Verification System.</p>");
        html.append("<p>If you have questions, please contact your Asset Manager.</p>");
        html.append("</div>");
        
        html.append("</div></body></html>");
        
        return html.toString();
    }
    
    private String buildVerificationEmailText(String employeeName, Campaign campaign,
                                              List<HardwareAsset> assets, String verificationUrl) {
        StringBuilder text = new StringBuilder();
        text.append("Asset Verification Required\n\n");
        text.append("Dear ").append(employeeName).append(",\n\n");
        text.append("As part of the ").append(campaign.name).append(", ");
        text.append("you are required to verify the following assets assigned to you:\n\n");
        
        text.append("YOUR ASSIGNED ASSETS:\n");
        for (HardwareAsset asset : assets) {
            text.append("- ").append(asset.model).append("\n");
            text.append("  Type: ").append(asset.assetType).append("\n");
            text.append("  Service Tag: ").append(asset.serviceTag).append("\n\n");
        }
        
        text.append("VERIFY YOUR ASSETS:\n");
        text.append(verificationUrl).append("\n\n");
        
        text.append("WHAT YOU NEED TO DO:\n");
        text.append("1. Click the link above to open the verification form\n");
        text.append("2. Take photos of each device showing the service tag\n");
        text.append("3. Confirm which peripherals are in your possession\n");
        text.append("4. Submit your verification\n\n");
        
        if (campaign.deadline != null) {
            text.append("DEADLINE: ").append(campaign.deadline).append("\n\n");
        }
        
        text.append("This is an automated message from the Asset Verification System.\n");
        text.append("If you have questions, please contact your Asset Manager.\n");
        
        return text.toString();
    }
    
    /**
     * Send reminder email for pending verifications (without campaign object)
     */
    public void sendReminderEmail(VerificationToken token) {
        sendReminderEmail(token, null);
    }
    
    /**
     * Send reminder email for pending verifications
     */
    public void sendReminderEmail(VerificationToken token, Campaign campaign) {
        String subject = "Reminder: Asset Verification Still Pending";
        String verificationUrl = frontendUrl + "/verify?token=" + token.token;
        
        String deadlineInfo = "";
        if (campaign != null && campaign.deadline != null) {
            deadlineInfo = "<p style='color:#e74c3c;'><strong>Deadline: " + campaign.deadline + "</strong></p>";
        }
        
        String htmlContent = "<!DOCTYPE html><html><body style='font-family: Arial, sans-serif;'>" +
            "<div style='background:#461e96;color:white;padding:20px;text-align:center;'>" +
            "<h2>Verification Reminder</h2></div>" +
            "<div style='padding:20px;'>" +
            "<p>Dear " + token.employeeName + ",</p>" +
            "<p>This is a reminder that your asset verification for <strong>" + 
            token.campaignName + "</strong> is still pending.</p>" +
            deadlineInfo +
            "<p style='text-align:center;margin:20px 0;'>" +
            "<a href='" + verificationUrl + "' style='background:#461e96;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;display:inline-block;'>Complete Verification Now</a></p>" +
            "<p>Please complete this at your earliest convenience to avoid any delays in asset tracking.</p>" +
            "</div></body></html>";
        
        try {
            mailer.send(Mail.withHtml(token.employeeEmail, subject, htmlContent));
            System.out.println("[EmailService] Reminder sent to: " + token.employeeEmail);
        } catch (Exception e) {
            System.err.println("[EmailService] Failed to send reminder: " + e.getMessage());
        }
    }
}
