package org.squadron.resource;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import org.jboss.resteasy.reactive.RestForm;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

/**
 * Handle image uploads for asset verification
 */
@jakarta.ws.rs.Path("/api/public/upload")
@Produces(MediaType.APPLICATION_JSON)
public class ImageUploadResource {
    
    @ConfigProperty(name = "app.upload.dir", defaultValue = "uploads")
    String uploadDir;
    
    @ConfigProperty(name = "app.backend.url", defaultValue = "http://localhost:8080")
    String backendUrl;
    
    @POST
    @jakarta.ws.rs.Path("/image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadImage(@RestForm("file") FileUpload file,
                                @RestForm("assetId") String assetId) {
        if (file == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("message", "No file provided"))
                .build();
        }
        
        try {
            // Create upload directory if it doesn't exist
            java.nio.file.Path uploadPath = java.nio.file.Path.of(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Get original filename and extension
            String originalName = file.fileName();
            String extension = "";
            int lastDot = originalName.lastIndexOf('.');
            if (lastDot > 0) {
                extension = originalName.substring(lastDot);
            }
            
            // Validate file type
            String contentType = file.contentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Only image files are allowed"))
                    .build();
            }
            
            // Generate unique filename
            String filename = "asset_" + (assetId != null ? assetId + "_" : "") + 
                             UUID.randomUUID().toString() + extension;
            
            // Save file
            java.nio.file.Path filePath = uploadPath.resolve(filename);
            Files.copy(file.uploadedFile(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Generate URL for the uploaded file
            String fileUrl = backendUrl + "/api/public/images/" + filename;
            
            return Response.ok(Map.of(
                "message", "File uploaded successfully",
                "filename", filename,
                "url", fileUrl
            )).build();
            
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("message", "Failed to upload file: " + e.getMessage()))
                .build();
        }
    }
    
    /**
     * Serve uploaded images
     */
    @GET
    @jakarta.ws.rs.Path("/images/{filename}")
    @Produces({"image/jpeg", "image/png", "image/gif", "image/webp"})
    public Response getImage(@PathParam("filename") String filename) {
        try {
            java.nio.file.Path filePath = java.nio.file.Path.of(uploadDir, filename);
            if (!Files.exists(filePath)) {
                return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Image not found"))
                    .build();
            }
            
            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            byte[] imageData = Files.readAllBytes(filePath);
            return Response.ok(imageData)
                .type(contentType)
                .header("Cache-Control", "max-age=86400") // Cache for 1 day
                .build();
                
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("message", "Failed to read image"))
                .build();
        }
    }
    
    /**
     * Alternative: Accept base64 encoded image
     */
    public static class Base64ImageRequest {
        public String imageData; // base64 encoded
        public String assetId;
        public String filename;
    }
    
    @POST
    @jakarta.ws.rs.Path("/image-base64")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response uploadBase64Image(Base64ImageRequest req) {
        if (req.imageData == null || req.imageData.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("message", "No image data provided"))
                .build();
        }
        
        try {
            // Create upload directory
            java.nio.file.Path uploadPath = java.nio.file.Path.of(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Parse base64 data (may include data URL prefix)
            String base64Data = req.imageData;
            String extension = ".jpg";
            
            if (base64Data.startsWith("data:image/")) {
                // Extract mime type and actual base64 data
                int commaIndex = base64Data.indexOf(',');
                if (commaIndex > 0) {
                    String header = base64Data.substring(0, commaIndex);
                    base64Data = base64Data.substring(commaIndex + 1);
                    
                    // Determine extension from mime type
                    if (header.contains("png")) extension = ".png";
                    else if (header.contains("gif")) extension = ".gif";
                    else if (header.contains("webp")) extension = ".webp";
                }
            }
            
            // Decode base64
            byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Data);
            
            // Generate filename
            String filename = "asset_" + (req.assetId != null ? req.assetId + "_" : "") +
                             UUID.randomUUID().toString() + extension;
            
            // Save file
            java.nio.file.Path filePath = uploadPath.resolve(filename);
            Files.write(filePath, imageBytes);
            
            // Generate URL
            String fileUrl = backendUrl + "/api/public/images/" + filename;
            
            return Response.ok(Map.of(
                "message", "Image uploaded successfully",
                "filename", filename,
                "url", fileUrl
            )).build();
            
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("message", "Failed to process image: " + e.getMessage()))
                .build();
        }
    }
}
