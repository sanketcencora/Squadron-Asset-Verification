package org.squadron.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.squadron.model.User;
import org.squadron.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {
    
    @Inject
    UserService userService;
    
    @GET
    public List<User> getAll() {
        return User.listAll();
    }
    
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Optional<User> user = userService.findById(id);
        if (user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "User not found"))
                .build();
        }
        return Response.ok(user.get()).build();
    }
    
    @GET
    @Path("/username/{username}")
    public Response getByUsername(@PathParam("username") String username) {
        Optional<User> user = userService.findByUsername(username);
        if (user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "User not found"))
                .build();
        }
        return Response.ok(user.get()).build();
    }
    
    @GET
    @Path("/role/{role}")
    public Response getByRole(@PathParam("role") String role) {
        Optional<User> user = userService.findByRole(role);
        if (user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "User not found"))
                .build();
        }
        return Response.ok(user.get()).build();
    }
    
    @GET
    @Path("/employee/{employeeId}")
    public Response getByEmployeeId(@PathParam("employeeId") String employeeId) {
        User user = User.find("employeeId", employeeId).firstResult();
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "User not found"))
                .build();
        }
        return Response.ok(user).build();
    }
    
    @GET
    @Path("/department/{department}")
    public List<User> getByDepartment(@PathParam("department") String department) {
        return User.find("department", department).list();
    }
    
    @POST
    @Path("/by-departments")
    public List<User> getByDepartments(List<String> departments) {
        if (departments == null || departments.isEmpty()) {
            return List.of();
        }
        return User.find("department in ?1", departments).list();
    }
    
    @GET
    @Path("/departments")
    public List<String> getAllDepartments() {
        List<User> users = User.listAll();
        return users.stream()
            .map(u -> u.department)
            .distinct()
            .toList();
    }
}
