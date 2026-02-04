package org.squadron.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.squadron.model.EquipmentCount;
import org.squadron.model.EquipmentCount.EquipmentCategory;
import org.squadron.model.EquipmentCount.VerificationStatus;
import org.squadron.service.EquipmentService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Path("/api/equipment")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EquipmentResource {
    
    @Inject
    EquipmentService service;
    
    @GET
    public List<EquipmentCount> getAll() {
        return service.findAll();
    }
    
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        EquipmentCount equipment = service.findById(id);
        if (equipment == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Equipment not found"))
                .build();
        }
        return Response.ok(equipment).build();
    }
    
    @GET
    @Path("/category/{category}")
    public List<EquipmentCount> getByCategory(@PathParam("category") EquipmentCategory category) {
        return service.findByCategory(category);
    }
    
    @GET
    @Path("/network")
    public List<EquipmentCount> getNetworkEquipment() {
        return service.findNetworkEquipment();
    }
    
    @GET
    @Path("/servers")
    public List<EquipmentCount> getServers() {
        return service.findServers();
    }
    
    @GET
    @Path("/audio-video")
    public List<EquipmentCount> getAudioVideo() {
        return service.findAudioVideo();
    }
    
    @GET
    @Path("/furniture")
    public List<EquipmentCount> getFurniture() {
        return service.findFurniture();
    }
    
    @GET
    @Path("/other")
    public List<EquipmentCount> getOther() {
        return service.findOther();
    }
    
    @GET
    @Path("/uploaded-by/{employeeId}")
    public List<EquipmentCount> getByUploadedBy(@PathParam("employeeId") String employeeId) {
        return service.findByUploadedBy(employeeId);
    }
    
    @GET
    @Path("/location/{location}")
    public List<EquipmentCount> getByLocation(@PathParam("location") String location) {
        return service.findByLocation(location);
    }
    
    @GET
    @Path("/stats")
    public Map<String, Object> getStats() {
        return service.getStats();
    }
    
    public static class CreateEquipmentRequest {
        public EquipmentCategory category;
        public String itemName;
        public int quantity;
        public BigDecimal itemValue;
        public String location;
        public String uploadedBy;
    }
    
    @POST
    public Response create(CreateEquipmentRequest req) {
        EquipmentCount equipment = new EquipmentCount();
        equipment.category = req.category;
        equipment.itemName = req.itemName;
        equipment.quantity = req.quantity;
        equipment.itemValue = req.itemValue;
        equipment.location = req.location;
        equipment.uploadedBy = req.uploadedBy;
        
        EquipmentCount created = service.create(equipment);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
    
    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, EquipmentCount equipment) {
        EquipmentCount updated = service.update(id, equipment);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Equipment not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    public static class VerifyRequest {
        public VerificationStatus status;
    }
    
    @POST
    @Path("/{id}/verify")
    public Response verify(@PathParam("id") Long id, VerifyRequest req) {
        EquipmentCount updated = service.updateVerificationStatus(id, req.status);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Equipment not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    @POST
    @Path("/{id}/archive")
    public Response archive(@PathParam("id") Long id) {
        EquipmentCount updated = service.archive(id);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Equipment not found"))
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
                .entity(Map.of("message", "Equipment not found"))
                .build();
        }
        return Response.noContent().build();
    }
}
