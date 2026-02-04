package org.squadron.filter;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
@Priority(1)
public class CorsFilter implements ContainerRequestFilter, ContainerResponseFilter {

    private static final String ALLOWED_ORIGIN = "http://localhost:5173";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Handle preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            requestContext.abortWith(Response.ok()
                .header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, Origin, X-Requested-With")
                .header("Access-Control-Allow-Credentials", "true")
                .header("Access-Control-Max-Age", "86400")
                .build());
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        // Use putSingle to replace any existing CORS headers (avoid duplicates)
        responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
        responseContext.getHeaders().putSingle("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, Origin, X-Requested-With");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
        responseContext.getHeaders().putSingle("Access-Control-Expose-Headers", "Content-Type, Authorization");
    }
}
