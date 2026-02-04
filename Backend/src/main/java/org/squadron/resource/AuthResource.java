package org.squadron.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.squadron.model.User;
import org.squadron.service.UserService;
import org.squadron.service.SessionService;

import java.util.Map;
import java.util.Optional;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    UserService userService;

    @Inject
    SessionService sessionService;

    public static class LoginRequest {
        public String username;
        public String password;
    }

    public static class RegisterRequest {
        public String username;
        public String password;
        public String role;
        public String name;
        public String email;
        public String phone;
        public String department;
        public String employeeId;
    }

    @POST
    @Path("/login")
    public Response login(LoginRequest req, @Context UriInfo uriInfo) {
        if (req.username == null || req.password == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity(Map.of("message", "username and password required")).build();
        }

        Optional<User> opt = userService.authenticate(req.username, req.password);
        if (opt.isEmpty()) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(Map.of("message", "Invalid credentials")).build();
        }

        User user = opt.get();
        String sid = sessionService.createSession(user.id);

        NewCookie cookie = NewCookie.valueOf("sid=" + sid + "; Path=/; HttpOnly; SameSite=Lax");

        return Response.ok(user).cookie(cookie).build();
    }

    @POST
    @Path("/register")
    public Response register(RegisterRequest req) {
        System.out.println("[AuthResource] /api/auth/register attempt: username=" + req.username + ", role=" + req.role + ", email=" + req.email);
        if (req.username == null || req.password == null || req.role == null || req.name == null || req.email == null || req.phone == null || req.department == null || req.employeeId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity(Map.of("message", "Missing fields" )).build();
        }
        // ensure username not taken
        if (userService.findByUsername(req.username).isPresent()) {
            return Response.status(Response.Status.CONFLICT).entity(Map.of("message", "Username already exists")).build();
        }
        try {
            User created = userService.registerFull(req.username, req.password, req.role, req.name, req.email, req.phone, req.department, req.employeeId);
            return Response.status(Response.Status.CREATED).entity(created).build();
        } catch (Exception ex) {
            // Log server-side for diagnostics
            ex.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("message", "Registration failed on server: " + ex.getMessage()))
                    .build();
        }
    }

    @GET
    @Path("/health")
    public Response health() {
        return Response.ok(Map.of("ok", true, "service", "backend")).build();
    }

    @GET
    @Path("/me")
    public Response me(@Context HttpHeaders headers) {
        // Read sid cookie
        Cookie sidCookie = headers.getCookies().get("sid");
        if (sidCookie == null) return Response.status(Response.Status.UNAUTHORIZED).entity(Map.of("message","Not logged in")).build();
        String sid = sidCookie.getValue();
        Optional<Long> userIdOpt = sessionService.getUserId(sid);
        if (userIdOpt.isEmpty()) return Response.status(Response.Status.UNAUTHORIZED).entity(Map.of("message","Not logged in")).build();
        Optional<User> u = userService.findById(userIdOpt.get());
        if (u.isEmpty()) return Response.status(Response.Status.UNAUTHORIZED).entity(Map.of("message","Not logged in")).build();
        return Response.ok(u.get()).build();
    }

    @POST
    @Path("/logout")
    public Response logout(@Context HttpHeaders headers) {
        Cookie sidCookie = headers.getCookies().get("sid");
        if (sidCookie != null) {
            String sid = sidCookie.getValue();
            sessionService.destroySession(sid);
        }
        NewCookie clear = NewCookie.valueOf("sid=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax");
        return Response.ok(Map.of("message","Logged out")).cookie(clear).build();
    }

    @GET
    @Path("/debug/users")
    public Response debugUsers() {
        // For debugging only - list all users
        var users = userService.findAll();
        return Response.ok(users).build();
    }

    @GET
    @Path("/debug/check-user/{username}")
    public Response debugCheckUser(@PathParam("username") String username) {
        var user = userService.findByUsername(username);
        if (user.isPresent()) {
            return Response.ok(Map.of(
                "found", true,
                "username", user.get().username,
                "email", user.get().email,
                "role", user.get().role,
                "hasPassword", user.get().password != null && !user.get().password.isEmpty()
            )).build();
        }
        return Response.ok(Map.of("found", false)).build();
    }
}