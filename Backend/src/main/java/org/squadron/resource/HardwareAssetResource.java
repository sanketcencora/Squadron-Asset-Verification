package org.squadron.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.squadron.model.HardwareAsset;
import org.squadron.model.HardwareAsset.AssetType;
import org.squadron.model.HardwareAsset.VerificationStatus;
import org.squadron.service.HardwareAssetService;

import java.util.List;
import java.util.Map;

@Path("/api/assets")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HardwareAssetResource {
    
    @Inject
    HardwareAssetService service;
    
    @GET
    public List<HardwareAsset> getAll() {
        return service.findAll();
    }
    
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        HardwareAsset asset = service.findById(id);
        if (asset == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Asset not found"))
                .build();
        }
        return Response.ok(asset).build();
    }
    
    @GET
    @Path("/service-tag/{serviceTag}")
    public Response getByServiceTag(@PathParam("serviceTag") String serviceTag) {
        HardwareAsset asset = service.findByServiceTag(serviceTag);
        if (asset == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Asset not found"))
                .build();
        }
        return Response.ok(asset).build();
    }
    
    @GET
    @Path("/instock")
    public List<HardwareAsset> getInstock() {
        return service.findInstock();
    }
    
    @GET
    @Path("/assigned")
    public List<HardwareAsset> getAssigned() {
        return service.findAssigned();
    }
    
    @GET
    @Path("/exceptions")
    public List<HardwareAsset> getExceptions() {
        return service.findExceptions();
    }
    
    @GET
    @Path("/employee/{employeeId}")
    public List<HardwareAsset> getByEmployee(@PathParam("employeeId") String employeeId) {
        return service.findByAssignedTo(employeeId);
    }
    
    @GET
    @Path("/type/{assetType}")
    public List<HardwareAsset> getByType(@PathParam("assetType") AssetType assetType) {
        return service.findByAssetType(assetType);
    }
    
    @GET
    @Path("/high-value")
    public List<HardwareAsset> getHighValue() {
        return service.findHighValue();
    }
    
    @GET
    @Path("/stats")
    public Map<String, Object> getStats() {
        return service.getStats();
    }
    
    @POST
    public Response create(HardwareAsset asset) {
        HardwareAsset created = service.create(asset);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
    
    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, HardwareAsset asset) {
        HardwareAsset updated = service.update(id, asset);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Asset not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    public static class AssignRequest {
        public String employeeId;
        public String employeeName;
    }
    
    @POST
    @Path("/{id}/assign")
    public Response assignToEmployee(@PathParam("id") Long id, AssignRequest req) {
        HardwareAsset updated = service.assignToEmployee(id, req.employeeId, req.employeeName);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Asset not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    public static class VerifyRequest {
        public VerificationStatus status;
        public String imageUrl;
    }
    
    @POST
    @Path("/{id}/verify")
    public Response verify(@PathParam("id") Long id, VerifyRequest req) {
        HardwareAsset updated = service.updateVerificationStatus(id, req.status, req.imageUrl);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Asset not found"))
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
                .entity(Map.of("message", "Asset not found"))
                .build();
        }
        return Response.noContent().build();
    }
    
    // Bulk import from CSV (ServiceNow format)
    @POST
    @Path("/bulk-import")
    public Response bulkImport(List<HardwareAsset> assets) {
        if (assets == null || assets.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("message", "No assets provided"))
                .build();
        }
        
        int created = 0;
        int updated = 0;
        int errors = 0;
        
        for (HardwareAsset asset : assets) {
            try {
                // Check if asset already exists by service tag
                HardwareAsset existing = service.findByServiceTag(asset.serviceTag);
                if (existing != null) {
                    // Update existing asset
                    service.update(existing.id, asset);
                    updated++;
                } else {
                    // Create new asset
                    service.create(asset);
                    created++;
                }
            } catch (Exception e) {
                errors++;
                System.err.println("Error importing asset: " + asset.serviceTag + " - " + e.getMessage());
            }
        }
        
        return Response.ok(Map.of(
            "message", "Import completed",
            "created", created,
            "updated", updated,
            "errors", errors,
            "total", assets.size()
        )).build();
    }
}
