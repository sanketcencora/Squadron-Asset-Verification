package org.squadron.filter;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.Map;

/**
 * Global exception handler that ensures CORS headers are present on error responses.
 * This fixes the issue where CORS headers are missing on 500 errors.
 */
@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Throwable> {

    private static final String DEFAULT_ALLOWED_ORIGIN = "http://localhost:5173";

    @Override
    public Response toResponse(Throwable exception) {
        // Log the exception for debugging
        System.err.println("[GlobalExceptionHandler] Caught exception: " + exception.getClass().getName());
        System.err.println("[GlobalExceptionHandler] Message: " + exception.getMessage());
        exception.printStackTrace();

        // Determine appropriate status code
        int statusCode = 500;
        String errorMessage = "Internal server error";
        
        if (exception instanceof jakarta.ws.rs.WebApplicationException webEx) {
            statusCode = webEx.getResponse().getStatus();
            errorMessage = exception.getMessage();
        } else if (exception instanceof IllegalArgumentException) {
            statusCode = 400;
            errorMessage = exception.getMessage();
        } else if (exception instanceof jakarta.persistence.EntityNotFoundException) {
            statusCode = 404;
            errorMessage = "Resource not found";
        }

        // Build response with CORS headers
        return Response.status(statusCode)
            .entity(Map.of(
                "error", errorMessage,
                "status", statusCode,
                "message", exception.getMessage() != null ? exception.getMessage() : "Unknown error"
            ))
            .header("Access-Control-Allow-Origin", DEFAULT_ALLOWED_ORIGIN)
            .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD")
            .header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, Origin, X-Requested-With")
            .header("Access-Control-Allow-Credentials", "true")
            .header("Vary", "Origin")
            .build();
    }
}
