package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * OCR Service for extracting text (especially asset tags) from images
 */
@ApplicationScoped
public class OcrService {

    // Common service tag patterns (Dell, HP, Lenovo, etc.)
    // Dell: 7 alphanumeric characters
    // HP: 10 alphanumeric 
    // Lenovo: Various formats
    private static final Pattern SERVICE_TAG_PATTERN = Pattern.compile(
        "(?i)(?:service\\s*tag|serial|s/n|asset\\s*tag)[:\\s]*([A-Z0-9]{5,15})|" +
        "\\b([A-Z0-9]{7})\\b|" +  // Dell style (7 chars)
        "\\b([A-Z0-9]{10})\\b"    // HP style (10 chars)
    );

    private Tesseract tesseract;
    private boolean tesseractAvailable = false;

    public OcrService() {
        try {
            tesseract = new Tesseract();
            // Try to find tessdata - check common locations
            String[] possiblePaths = {
                "C:/Program Files/Tesseract-OCR/tessdata",
                "C:/Tesseract-OCR/tessdata",
                "/usr/share/tesseract-ocr/4.00/tessdata",
                "/usr/share/tessdata",
                System.getenv("TESSDATA_PREFIX")
            };
            
            for (String path : possiblePaths) {
                if (path != null) {
                    File tessdata = new File(path);
                    if (tessdata.exists() && tessdata.isDirectory()) {
                        tesseract.setDatapath(tessdata.getParent().contains("tessdata") ? 
                            tessdata.getParent() : path);
                        tesseractAvailable = true;
                        System.out.println("[OcrService] Tesseract initialized with path: " + path);
                        break;
                    }
                }
            }
            
            if (!tesseractAvailable) {
                System.out.println("[OcrService] Tesseract not found - OCR will be disabled. Install Tesseract-OCR to enable.");
            } else {
                tesseract.setLanguage("eng");
            }
        } catch (Exception e) {
            System.err.println("[OcrService] Failed to initialize Tesseract: " + e.getMessage());
            tesseractAvailable = false;
        }
    }

    /**
     * Extract text from a base64-encoded image
     */
    public String extractText(String base64Image) {
        if (!tesseractAvailable) {
            System.out.println("[OcrService] Tesseract not available, skipping OCR");
            return null;
        }

        try {
            // Remove data URL prefix if present
            String imageData = base64Image;
            if (base64Image.contains(",")) {
                imageData = base64Image.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(imageData);
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
            
            if (image == null) {
                System.err.println("[OcrService] Failed to decode image");
                return null;
            }

            String text = tesseract.doOCR(image);
            System.out.println("[OcrService] Extracted text: " + text.substring(0, Math.min(200, text.length())));
            return text;
        } catch (TesseractException e) {
            System.err.println("[OcrService] OCR failed: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.err.println("[OcrService] Error processing image: " + e.getMessage());
            return null;
        }
    }

    /**
     * Extract service tag from image
     * Returns the extracted tag or null if not found
     */
    public String extractServiceTag(String base64Image) {
        String text = extractText(base64Image);
        if (text == null || text.isEmpty()) {
            return null;
        }

        // Clean up OCR text
        text = text.replaceAll("[\\r\\n]+", " ").trim();

        Matcher matcher = SERVICE_TAG_PATTERN.matcher(text);
        if (matcher.find()) {
            // Return the first non-null group
            for (int i = 1; i <= matcher.groupCount(); i++) {
                if (matcher.group(i) != null) {
                    String tag = matcher.group(i).toUpperCase();
                    System.out.println("[OcrService] Found service tag: " + tag);
                    return tag;
                }
            }
        }

        // Fallback: Look for any alphanumeric sequence that looks like a service tag
        Pattern fallbackPattern = Pattern.compile("\\b([A-Z0-9]{6,12})\\b");
        Matcher fallbackMatcher = fallbackPattern.matcher(text.toUpperCase());
        while (fallbackMatcher.find()) {
            String candidate = fallbackMatcher.group(1);
            // Skip common words that might match
            if (!isCommonWord(candidate)) {
                System.out.println("[OcrService] Found potential service tag (fallback): " + candidate);
                return candidate;
            }
        }

        System.out.println("[OcrService] No service tag found in image");
        return null;
    }

    private boolean isCommonWord(String word) {
        String[] common = {"MODEL", "SERIAL", "SERVICE", "PRODUCT", "WINDOWS", "INTEL", "CORE", "VERSION"};
        for (String c : common) {
            if (word.equals(c)) return true;
        }
        return false;
    }

    /**
     * Verify if extracted tag matches expected tag
     */
    public VerificationResult verifyServiceTag(String base64Image, String expectedTag) {
        if (expectedTag == null || expectedTag.isEmpty()) {
            return new VerificationResult(false, null, "No expected tag provided");
        }

        String extractedTag = extractServiceTag(base64Image);
        
        if (extractedTag == null) {
            return new VerificationResult(false, null, 
                tesseractAvailable ? "Could not extract service tag from image" : "OCR not available");
        }

        // Normalize tags for comparison
        String normalizedExpected = expectedTag.toUpperCase().replaceAll("[^A-Z0-9]", "");
        String normalizedExtracted = extractedTag.toUpperCase().replaceAll("[^A-Z0-9]", "");

        boolean matches = normalizedExpected.equals(normalizedExtracted);
        
        return new VerificationResult(
            matches,
            extractedTag,
            matches ? "Service tag verified successfully" : 
                      "Service tag mismatch: expected " + expectedTag + ", found " + extractedTag
        );
    }

    public boolean isTesseractAvailable() {
        return tesseractAvailable;
    }

    /**
     * Result class for verification
     */
    public static class VerificationResult {
        public final boolean matches;
        public final String extractedTag;
        public final String message;

        public VerificationResult(boolean matches, String extractedTag, String message) {
            this.matches = matches;
            this.extractedTag = extractedTag;
            this.message = message;
        }
    }
}
