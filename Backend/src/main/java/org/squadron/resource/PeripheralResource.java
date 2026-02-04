package org.squadron.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.squadron.model.Peripheral;
import org.squadron.model.Peripheral.PeripheralType;
import org.squadron.service.PeripheralService;

import java.util.List;
import java.util.Map;

@Path("/api/peripherals")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PeripheralResource {
    
    @Inject
    PeripheralService service;
    
    @GET
    public List<Peripheral> getAll() {
        return service.findAll();
    }
    
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Peripheral peripheral = service.findById(id);
        if (peripheral == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Peripheral not found"))
                .build();
        }
        return Response.ok(peripheral).build();
    }
    
    @GET
    @Path("/employee/{employeeId}")
    public List<Peripheral> getByEmployee(@PathParam("employeeId") String employeeId) {
        return service.findByAssignedTo(employeeId);
    }
    
    @GET
    @Path("/type/{type}")
    public List<Peripheral> getByType(@PathParam("type") PeripheralType type) {
        return service.findByType(type);
    }
    
    @GET
    @Path("/verified")
    public List<Peripheral> getVerified() {
        return service.findVerified();
    }
    
    @GET
    @Path("/unverified")
    public List<Peripheral> getUnverified() {
        return service.findUnverified();
    }
    
    @GET
    @Path("/stats")
    public Map<String, Object> getStats() {
        return service.getStats();
    }
    
    @POST
    public Response create(Peripheral peripheral) {
        Peripheral created = service.create(peripheral);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
    
    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, Peripheral peripheral) {
        Peripheral updated = service.update(id, peripheral);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Peripheral not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    public static class AssignPeripheralRequest {
        public PeripheralType type;
        public String serialNumber;
        public String employeeId;
        public String employeeName;
    }
    
    @POST
    @Path("/assign")
    public Response assign(AssignPeripheralRequest req) {
        Peripheral created = service.assignToEmployee(req.type, req.serialNumber, 
            req.employeeId, req.employeeName);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
    
    @POST
    @Path("/{id}/verify")
    public Response verify(@PathParam("id") Long id) {
        Peripheral updated = service.verify(id);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Peripheral not found"))
                .build();
        }
        return Response.ok(updated).build();
    }
    
    public static class VerifyMultipleRequest {
        public List<Long> ids;
    }
    
    @POST
    @Path("/verify-multiple")
    public Response verifyMultiple(VerifyMultipleRequest req) {
        List<Peripheral> updated = service.verifyMultiple(req.ids);
        return Response.ok(updated).build();
    }
    
    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = service.delete(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Peripheral not found"))
                .build();
        }
        return Response.noContent().build();
    }
}
