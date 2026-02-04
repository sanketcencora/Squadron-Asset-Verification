package org.squadron;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.squadron.service.UserService;
import org.squadron.service.HardwareAssetService;
import org.squadron.service.PeripheralService;
import org.squadron.service.CampaignService;
import org.squadron.service.EquipmentService;
import org.squadron.model.*;
import org.squadron.model.HardwareAsset.AssetType;
import org.squadron.model.HardwareAsset.AssetStatus;
import org.squadron.model.Peripheral.PeripheralType;
import org.squadron.model.Campaign.CampaignStatus;
import org.squadron.model.EquipmentCount.EquipmentCategory;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.event.Observes;

import java.math.BigDecimal;
import java.time.LocalDate;

@ApplicationScoped
public class Bootstrap {

    @Inject
    UserService userService;
    
    @Inject
    HardwareAssetService assetService;
    
    @Inject
    PeripheralService peripheralService;
    
    @Inject
    CampaignService campaignService;
    
    @Inject
    EquipmentService equipmentService;

    @Transactional
    void onStart(@Observes StartupEvent ev) {
        seedUsers();
        seedHardwareAssets();
        seedPeripherals();
        // seedCampaigns(); // Disabled - only show user-created campaigns
        seedEquipment();
        System.out.println("[Bootstrap] Database seeded successfully!");
    }
    
    private void seedUsers() {
        // Finance user
        if (userService.findByUsername("sarah.chen").isEmpty()) {
            userService.registerFull("sarah.chen", "password", "finance", "Sarah Chen", 
                "sarah.chen@company.com", "555-0101", "CBS PMO", "FIN001");
        }
        // Asset Manager
        if (userService.findByUsername("michael.torres").isEmpty()) {
            userService.registerFull("michael.torres", "password", "assetManager", "Michael Torres",
                "michael.torres@company.com", "555-0102", "Cloud Provisioning", "IT002");
        }
        // Employees
        if (userService.findByUsername("emily.johnson").isEmpty()) {
            userService.registerFull("emily.johnson", "password", "employee", "Emily Johnson",
                "emily.johnson@company.com", "555-0103", "Alliance IT BusApps", "ENG003");
        }
        if (userService.findByUsername("james.wilson").isEmpty()) {
            userService.registerFull("james.wilson", "password", "employee", "James Wilson",
                "james.wilson@company.com", "555-0104", "BG Data Analytics IT", "ENG004");
        }
        if (userService.findByUsername("lisa.anderson").isEmpty()) {
            userService.registerFull("lisa.anderson", "password", "employee", "Lisa Anderson",
                "lisa.anderson@company.com", "555-0105", "eCommerce & Portal", "MKT005");
        }
        // Network Equipment Manager
        if (userService.findByUsername("debasish").isEmpty()) {
            userService.registerFull("debasish", "password", "networkEquipment", "Debasish",
                "debasish@company.com", "555-0106", "Dist Svcs", "NET001");
        }
        // Audio Video Manager
        if (userService.findByUsername("pradeep").isEmpty()) {
            userService.registerFull("pradeep", "password", "audioVideo", "Pradeep",
                "pradeep@company.com", "555-0107", "Quality Assurance", "AV001");
        }
        // Furniture Manager
        if (userService.findByUsername("revant").isEmpty()) {
            userService.registerFull("revant", "password", "furniture", "Revant",
                "revant@company.com", "555-0108", "Replenish IT", "FUR001");
        }
    }
    
    private void seedHardwareAssets() {
        if (assetService.findAll().isEmpty()) {
            // Asset 1 - Assigned, Verified
            HardwareAsset hw1 = new HardwareAsset();
            hw1.serviceTag = "ST-LT-2024-001";
            hw1.assetType = AssetType.Laptop;
            hw1.model = "Dell Latitude 5540";
            hw1.invoiceNumber = "INV-2024-001";
            hw1.poNumber = "PO-98765";
            hw1.cost = new BigDecimal("1200");
            hw1.purchaseDate = LocalDate.of(2024, 1, 15);
            hw1.assignedTo = "ENG003";
            hw1.assignedToName = "Emily Johnson";
            hw1.status = AssetStatus.Assigned;
            hw1.verificationStatus = HardwareAsset.VerificationStatus.Verified;
            hw1.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw1.isHighValue = true;
            hw1.location = "Austin";
            hw1.team = "Engineering";
            assetService.create(hw1);
            
            // Asset 2 - Assigned, Pending
            HardwareAsset hw2 = new HardwareAsset();
            hw2.serviceTag = "ST-LT-2024-002";
            hw2.assetType = AssetType.Laptop;
            hw2.model = "MacBook Pro 16\"";
            hw2.invoiceNumber = "INV-2024-002";
            hw2.poNumber = "PO-98766";
            hw2.cost = new BigDecimal("2800");
            hw2.purchaseDate = LocalDate.of(2024, 2, 20);
            hw2.assignedTo = "ENG004";
            hw2.assignedToName = "James Wilson";
            hw2.status = AssetStatus.Assigned;
            hw2.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw2.isHighValue = true;
            hw2.location = "Austin";
            hw2.team = "Engineering";
            assetService.create(hw2);
            
            // Asset 3 - Monitor, Overdue
            HardwareAsset hw3 = new HardwareAsset();
            hw3.serviceTag = "ST-MN-2024-003";
            hw3.assetType = AssetType.Monitor;
            hw3.model = "Dell UltraSharp 27\"";
            hw3.invoiceNumber = "INV-2024-003";
            hw3.poNumber = "PO-98767";
            hw3.cost = new BigDecimal("450");
            hw3.purchaseDate = LocalDate.of(2024, 3, 10);
            hw3.assignedTo = "MKT005";
            hw3.assignedToName = "Lisa Anderson";
            hw3.status = AssetStatus.Assigned;
            hw3.verificationStatus = HardwareAsset.VerificationStatus.Overdue;
            hw3.lastVerifiedDate = LocalDate.of(2024, 6, 15);
            hw3.isHighValue = false;
            hw3.location = "New York";
            hw3.team = "Marketing";
            assetService.create(hw3);
            
            // Asset 4 - Mobile, Exception
            HardwareAsset hw4 = new HardwareAsset();
            hw4.serviceTag = "ST-MB-2024-004";
            hw4.assetType = AssetType.Mobile;
            hw4.model = "iPhone 15 Pro";
            hw4.invoiceNumber = "INV-2024-004";
            hw4.poNumber = "PO-98768";
            hw4.cost = new BigDecimal("1200");
            hw4.purchaseDate = LocalDate.of(2024, 4, 5);
            hw4.assignedTo = "ENG003";
            hw4.assignedToName = "Emily Johnson";
            hw4.status = AssetStatus.Assigned;
            hw4.verificationStatus = HardwareAsset.VerificationStatus.Exception;
            hw4.isHighValue = true;
            hw4.location = "Austin";
            hw4.team = "Engineering";
            assetService.create(hw4);
            
            // Asset 5-7 - Instock
            HardwareAsset hw5 = new HardwareAsset();
            hw5.serviceTag = "ST-LT-2024-005";
            hw5.assetType = AssetType.Laptop;
            hw5.model = "HP EliteBook 840";
            hw5.invoiceNumber = "INV-2024-005";
            hw5.poNumber = "PO-98769";
            hw5.cost = new BigDecimal("1400");
            hw5.purchaseDate = LocalDate.of(2024, 5, 12);
            hw5.status = AssetStatus.Instock;
            hw5.verificationStatus = HardwareAsset.VerificationStatus.NotStarted;
            hw5.isHighValue = true;
            assetService.create(hw5);
            
            HardwareAsset hw6 = new HardwareAsset();
            hw6.serviceTag = "ST-LT-2024-006";
            hw6.assetType = AssetType.Laptop;
            hw6.model = "Lenovo ThinkPad X1";
            hw6.invoiceNumber = "INV-2024-006";
            hw6.poNumber = "PO-98770";
            hw6.cost = new BigDecimal("1600");
            hw6.purchaseDate = LocalDate.of(2024, 6, 18);
            hw6.status = AssetStatus.Instock;
            hw6.verificationStatus = HardwareAsset.VerificationStatus.NotStarted;
            hw6.isHighValue = true;
            assetService.create(hw6);
            
            HardwareAsset hw7 = new HardwareAsset();
            hw7.serviceTag = "ST-MN-2024-007";
            hw7.assetType = AssetType.Monitor;
            hw7.model = "LG UltraWide 34\"";
            hw7.invoiceNumber = "INV-2024-007";
            hw7.poNumber = "PO-98771";
            hw7.cost = new BigDecimal("650");
            hw7.purchaseDate = LocalDate.of(2024, 7, 22);
            hw7.status = AssetStatus.Instock;
            hw7.verificationStatus = HardwareAsset.VerificationStatus.NotStarted;
            hw7.isHighValue = false;
            assetService.create(hw7);
        }
    }
    
    private void seedPeripherals() {
        if (peripheralService.findAll().isEmpty()) {
            // Emily Johnson peripherals
            Peripheral p1 = new Peripheral();
            p1.type = PeripheralType.Charger;
            p1.assignedTo = "ENG003";
            p1.assignedToName = "Emily Johnson";
            p1.verified = true;
            p1.assignedDate = LocalDate.of(2024, 1, 15);
            peripheralService.create(p1);
            
            Peripheral p2 = new Peripheral();
            p2.type = PeripheralType.Headphones;
            p2.assignedTo = "ENG003";
            p2.assignedToName = "Emily Johnson";
            p2.verified = true;
            p2.assignedDate = LocalDate.of(2024, 1, 15);
            peripheralService.create(p2);
            
            Peripheral p3 = new Peripheral();
            p3.type = PeripheralType.Mouse;
            p3.assignedTo = "ENG003";
            p3.assignedToName = "Emily Johnson";
            p3.verified = true;
            p3.assignedDate = LocalDate.of(2024, 1, 15);
            peripheralService.create(p3);
            
            // James Wilson peripherals
            Peripheral p4 = new Peripheral();
            p4.type = PeripheralType.Charger;
            p4.assignedTo = "ENG004";
            p4.assignedToName = "James Wilson";
            p4.verified = false;
            p4.assignedDate = LocalDate.of(2024, 2, 20);
            peripheralService.create(p4);
            
            Peripheral p5 = new Peripheral();
            p5.type = PeripheralType.Dock;
            p5.assignedTo = "ENG004";
            p5.assignedToName = "James Wilson";
            p5.verified = false;
            p5.assignedDate = LocalDate.of(2024, 2, 20);
            peripheralService.create(p5);
            
            // Lisa Anderson peripherals
            Peripheral p6 = new Peripheral();
            p6.type = PeripheralType.Charger;
            p6.assignedTo = "MKT005";
            p6.assignedToName = "Lisa Anderson";
            p6.verified = false;
            p6.assignedDate = LocalDate.of(2024, 3, 10);
            peripheralService.create(p6);
            
            Peripheral p7 = new Peripheral();
            p7.type = PeripheralType.Keyboard;
            p7.assignedTo = "MKT005";
            p7.assignedToName = "Lisa Anderson";
            p7.verified = false;
            p7.assignedDate = LocalDate.of(2024, 3, 10);
            peripheralService.create(p7);
        }
    }
    
    private void seedCampaigns() {
        // Seed each campaign individually by checking if it exists by name
        
        // Campaign 1 - Completed
        if (Campaign.find("name", "Q4 2024 Annual Audit").firstResult() == null) {
            Campaign camp1 = new Campaign();
            camp1.name = "Q4 2024 Annual Audit";
            camp1.description = "Annual hardware and peripheral verification for audit compliance";
            camp1.createdBy = "FIN001";
            camp1.createdDate = LocalDate.of(2024, 12, 1);
            camp1.startDate = LocalDate.of(2024, 12, 15);
            camp1.deadline = LocalDate.of(2025, 1, 31);
            camp1.status = CampaignStatus.Completed;
            camp1.totalEmployees = 245;
            camp1.totalAssets = 680;
            camp1.totalPeripherals = 1240;
            camp1.verifiedCount = 680;
            camp1.pendingCount = 0;
            camp1.overdueCount = 0;
            camp1.exceptionCount = 0;
            camp1.filtersJson = "{\"teams\":[\"Alliance IT BusApps\",\"BG Data Analytics IT\",\"CBS PMO\"],\"assetTypes\":[\"Laptop\",\"Monitor\",\"Mobile\"]}";
            campaignService.create(camp1);
        }
        
        // Campaign 2 - Completed
        if (Campaign.find("name", "High-Value Assets Q1 2025").firstResult() == null) {
            Campaign camp2 = new Campaign();
            camp2.name = "High-Value Assets Q1 2025";
            camp2.description = "Verification of assets valued over $1000";
            camp2.createdBy = "FIN001";
            camp2.createdDate = LocalDate.of(2025, 1, 5);
            camp2.startDate = LocalDate.of(2025, 1, 10);
            camp2.deadline = LocalDate.of(2025, 2, 15);
            camp2.status = CampaignStatus.Completed;
            camp2.totalEmployees = 89;
            camp2.totalAssets = 234;
            camp2.totalPeripherals = 456;
            camp2.verifiedCount = 234;
            camp2.pendingCount = 0;
            camp2.overdueCount = 0;
            camp2.exceptionCount = 0;
            camp2.filtersJson = "{\"teams\":[\"Cloud Provisioning\",\"eCommerce & Portal\"],\"assetTypes\":[\"Laptop\",\"Mobile\"]}";
            campaignService.create(camp2);
        }
        
        // Campaign 3 - Active campaign
        if (Campaign.find("name", "Q1 2026 IT Equipment Audit").firstResult() == null) {
            Campaign camp3 = new Campaign();
            camp3.name = "Q1 2026 IT Equipment Audit";
            camp3.description = "Quarterly verification of all IT equipment across departments";
            camp3.createdBy = "FIN001";
            camp3.createdDate = LocalDate.of(2026, 1, 15);
            camp3.startDate = LocalDate.of(2026, 1, 20);
            camp3.deadline = LocalDate.of(2026, 2, 28);
            camp3.status = CampaignStatus.Active;
            camp3.totalEmployees = 8;
            camp3.totalAssets = 12;
            camp3.totalPeripherals = 24;
            camp3.verifiedCount = 3;
            camp3.pendingCount = 7;
            camp3.overdueCount = 1;
            camp3.exceptionCount = 1;
            camp3.filtersJson = "{\"teams\":[\"Alliance IT BusApps\",\"BG Data Analytics IT\",\"CBS PMO\",\"Cloud Provisioning\",\"Dist Svcs\",\"eCommerce & Portal\",\"Quality Assurance\",\"Replenish IT\"],\"assetTypes\":[\"Laptop\",\"Monitor\",\"Mobile\"]}";
            campaignService.create(camp3);
        }
        
        // Campaign 4 - Draft campaign
        if (Campaign.find("name", "New Employee Equipment Verification").firstResult() == null) {
            Campaign camp4 = new Campaign();
            camp4.name = "New Employee Equipment Verification";
            camp4.description = "Verification campaign for new hires in 2026";
            camp4.createdBy = "FIN001";
            camp4.createdDate = LocalDate.of(2026, 2, 1);
            camp4.startDate = LocalDate.of(2026, 2, 15);
            camp4.deadline = LocalDate.of(2026, 3, 15);
            camp4.status = CampaignStatus.Draft;
            camp4.totalEmployees = 0;
            camp4.totalAssets = 0;
            camp4.totalPeripherals = 0;
            camp4.verifiedCount = 0;
            camp4.pendingCount = 0;
            camp4.overdueCount = 0;
            camp4.exceptionCount = 0;
            camp4.filtersJson = "{\"teams\":[],\"assetTypes\":[\"Laptop\"]}";
            campaignService.create(camp4);
        }
        
        // Campaign 5 - Active campaign for specific teams
        if (Campaign.find("name", "Network & Server Equipment Audit").firstResult() == null) {
            Campaign camp5 = new Campaign();
            camp5.name = "Network & Server Equipment Audit";
            camp5.description = "Verification of network infrastructure and server equipment";
            camp5.createdBy = "NET001";
            camp5.createdDate = LocalDate.of(2026, 1, 20);
            camp5.startDate = LocalDate.of(2026, 1, 25);
            camp5.deadline = LocalDate.of(2026, 2, 20);
            camp5.status = CampaignStatus.Active;
            camp5.totalEmployees = 2;
            camp5.totalAssets = 5;
            camp5.totalPeripherals = 10;
            camp5.verifiedCount = 2;
            camp5.pendingCount = 2;
            camp5.overdueCount = 1;
            camp5.exceptionCount = 0;
            camp5.filtersJson = "{\"teams\":[\"Dist Svcs\",\"Quality Assurance\"],\"assetTypes\":[\"Laptop\",\"Monitor\"]}";
            campaignService.create(camp5);
        }
    }
    
    private void seedEquipment() {
        if (equipmentService.findAll().isEmpty()) {
            // Network Equipment
            EquipmentCount eq1 = new EquipmentCount();
            eq1.category = EquipmentCategory.network;
            eq1.itemName = "Cisco Router 2900 Series";
            eq1.quantity = 45;
            eq1.itemValue = new BigDecimal("135000");
            eq1.location = "Data Center NY";
            eq1.uploadedBy = "NET001";
            eq1.verificationStatus = EquipmentCount.VerificationStatus.Verified;
            equipmentService.create(eq1);
            
            EquipmentCount eq2 = new EquipmentCount();
            eq2.category = EquipmentCategory.servers;
            eq2.itemName = "Dell PowerEdge R740";
            eq2.quantity = 32;
            eq2.itemValue = new BigDecimal("480000");
            eq2.location = "Data Center SF";
            eq2.uploadedBy = "NET001";
            eq2.verificationStatus = EquipmentCount.VerificationStatus.Verified;
            equipmentService.create(eq2);
            
            EquipmentCount eq3 = new EquipmentCount();
            eq3.category = EquipmentCategory.network;
            eq3.itemName = "HP Aruba Switch";
            eq3.quantity = 67;
            eq3.itemValue = new BigDecimal("201000");
            eq3.location = "Office NY";
            eq3.uploadedBy = "NET001";
            eq3.verificationStatus = EquipmentCount.VerificationStatus.Pending;
            equipmentService.create(eq3);
            
            // Audio Video Equipment
            EquipmentCount eq4 = new EquipmentCount();
            eq4.category = EquipmentCategory.audioVideo;
            eq4.itemName = "Sony Conference Camera";
            eq4.quantity = 28;
            eq4.itemValue = new BigDecimal("84000");
            eq4.location = "Office SF";
            eq4.uploadedBy = "AV001";
            eq4.verificationStatus = EquipmentCount.VerificationStatus.Verified;
            equipmentService.create(eq4);
            
            EquipmentCount eq5 = new EquipmentCount();
            eq5.category = EquipmentCategory.audioVideo;
            eq5.itemName = "Bose SoundTouch Speakers";
            eq5.quantity = 45;
            eq5.itemValue = new BigDecimal("67500");
            eq5.location = "Office NY";
            eq5.uploadedBy = "AV001";
            eq5.verificationStatus = EquipmentCount.VerificationStatus.Verified;
            equipmentService.create(eq5);
            
            EquipmentCount eq6 = new EquipmentCount();
            eq6.category = EquipmentCategory.audioVideo;
            eq6.itemName = "Polycom Video Conference System";
            eq6.quantity = 18;
            eq6.itemValue = new BigDecimal("90000");
            eq6.location = "Office Austin";
            eq6.uploadedBy = "AV001";
            eq6.verificationStatus = EquipmentCount.VerificationStatus.Overdue;
            equipmentService.create(eq6);
            
            // Furniture
            EquipmentCount eq7 = new EquipmentCount();
            eq7.category = EquipmentCategory.furniture;
            eq7.itemName = "Herman Miller Aeron Chairs";
            eq7.quantity = 320;
            eq7.itemValue = new BigDecimal("480000");
            eq7.location = "Office NY";
            eq7.uploadedBy = "FUR001";
            eq7.verificationStatus = EquipmentCount.VerificationStatus.Verified;
            equipmentService.create(eq7);
            
            EquipmentCount eq8 = new EquipmentCount();
            eq8.category = EquipmentCategory.furniture;
            eq8.itemName = "Standing Desks";
            eq8.quantity = 280;
            eq8.itemValue = new BigDecimal("420000");
            eq8.location = "Office SF";
            eq8.uploadedBy = "FUR001";
            eq8.verificationStatus = EquipmentCount.VerificationStatus.Verified;
            equipmentService.create(eq8);
            
            // Other
            EquipmentCount eq9 = new EquipmentCount();
            eq9.category = EquipmentCategory.other;
            eq9.itemName = "Whiteboards";
            eq9.quantity = 145;
            eq9.itemValue = new BigDecimal("43500");
            eq9.location = "Office Austin";
            eq9.uploadedBy = "FUR001";
            eq9.verificationStatus = EquipmentCount.VerificationStatus.Pending;
            equipmentService.create(eq9);
            
            EquipmentCount eq10 = new EquipmentCount();
            eq10.category = EquipmentCategory.other;
            eq10.itemName = "Filing Cabinets";
            eq10.quantity = 89;
            eq10.itemValue = new BigDecimal("35600");
            eq10.location = "Office Chicago";
            eq10.uploadedBy = "FUR001";
            eq10.verificationStatus = EquipmentCount.VerificationStatus.Exception;
            equipmentService.create(eq10);
        }
    }
}
