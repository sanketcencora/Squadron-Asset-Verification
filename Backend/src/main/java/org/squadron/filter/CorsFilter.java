package org.squadron.filter;

import jakarta.annotation.Priority;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

/**
 * Custom CORS filter that handles preflight OPTIONS requests and adds CORS headers to all responses.
 * This filter runs at the highest priority (PreMatching) to ensure CORS headers are added even for error responses.
 */
@Provider
@PreMatching
@Priority(1)
public class CorsFilter implements ContainerRequestFilter, ContainerResponseFilter {

    private static final String ALLOWED_ORIGIN = "http://localhost:5173";
    private static final String ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD";
    private static final String ALLOWED_HEADERS = "Content-Type, Accept, Authorization, Origin, X-Requested-With";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Handle preflight OPTIONS requests immediately
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            requestContext.abortWith(Response.ok()
                .header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
                .header("Access-Control-Allow-Methods", ALLOWED_METHODS)
                .header("Access-Control-Allow-Headers", ALLOWED_HEADERS)
                .header("Access-Control-Allow-Credentials", "true")
                .header("Access-Control-Max-Age", "86400")
                .build());
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        // Add CORS headers to all responses
        responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
        responseContext.getHeaders().putSingle("Access-Control-Allow-Methods", ALLOWED_METHODS);
        responseContext.getHeaders().putSingle("Access-Control-Allow-Headers", ALLOWED_HEADERS);
        responseContext.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
        responseContext.getHeaders().putSingle("Access-Control-Expose-Headers", "Content-Type, Authorization");
    }
}
