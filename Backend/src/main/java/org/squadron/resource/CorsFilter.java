package org.squadron.resource;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

@Provider
public class CorsFilter implements ContainerResponseFilter {
    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        String origin = requestContext.getHeaderString("Origin");
        if (origin == null || origin.isEmpty()) {
            origin = "*";
        }
        // For credentialed requests, origin cannot be '*'. We'll echo the request origin to allow dev usage.
        if (!"*".equals(origin)) {
            responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", origin);
        } else {
            responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", "*");
        }
        responseContext.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    }
}
