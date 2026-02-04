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
        if (userService.findByUsername("dhruv.khullar").isEmpty()) {
            userService.registerFull("dhruv.khullar", "password", "finance", "Dhruv Khullar", 
                "dhruv.khullar@cencora.com", "555-0101", "CBS PMO", "a139208");
        }
        // Asset Manager
        if (userService.findByUsername("nadim.mujawar").isEmpty()) {
            userService.registerFull("nadim.mujawar", "password", "assetManager", "Nadim Mujawar",
                "nadim.mujawar@cencora.com", "555-0102", "Digital Workplace", "a156144");
        }
        // Employees
        if (userService.findByUsername("sanket.disale").isEmpty()) {
            userService.registerFull("sanket.disale", "password", "employee", "Sanket Disale",
                "sanketsopan.disale@cencora.com", "555-0103", "eCommerce & Portal", "a157202");
        }
        if (userService.findByUsername("kamlesh.badade").isEmpty()) {
            userService.registerFull("kamlesh.badade", "password", "employee", "Kamlesh Badade",
                "kamleshbhausaheb.badade@cencora.com", "555-0104", "eCommerce & Portal", "a157196");
        }
        if (userService.findByUsername("nitin.krishna").isEmpty()) {
            userService.registerFull("nitin.krishna", "password", "employee", "Nitin Krishna",
                "nitin.krishna2@cencora.com", "555-0104", "BG Data Analytics IT", "a147083");
        }
        if (userService.findByUsername("ritika.mokashi").isEmpty()) {
            userService.registerFull("ritika.mokashi", "password", "employee", "Ritika Mokashi",
                "ritika.shekharmokashi@cencora.com", "555-0104", "BG Data Analytics IT", "a154096");
        }
        if (userService.findByUsername("aishwarya.somadale").isEmpty()) {
            userService.registerFull("aishwarya.somadale", "password", "employee", "Aishwarya Somadale",
                "aishwarya.bandusomadale@cencora.com", "555-0104", "BG Data Analytics IT", "a154098");
        }
        if (userService.findByUsername("arati.pisal").isEmpty()) {
            userService.registerFull("arati.pisal", "password", "employee", "Arati Pisal",
                "aratiramchandra.pisal@cencora.com", "555-0105", "eCommerce & Portal", "a157201");
        }
        if (userService.findByUsername("ritu.tak").isEmpty()) {
            userService.registerFull("ritu.tak", "password", "employee", "Ritu Tak",
                "ritu.tak@cencora.com", "555-0105", "Alliance IT BusApps", "a154795");
        }
        if (userService.findByUsername("rajas.nandgaonkar").isEmpty()) {
            userService.registerFull("rajas.nandgaonkar", "password", "employee", "Rajas Nandgaonkar",
                "rajassuhas.nandgaonkar@cencora.com", "555-0105", "Alliance IT BusApps", "a157279");
        }
        if (userService.findByUsername("anmol.shukla").isEmpty()) {
            userService.registerFull("anmol.shukla", "password", "employee", "Anmol Shukla",
                "anmol.shukla@cencora.com", "555-0105", "Cloud Provisioning", "MKT005");
        }
        // if (userService.findByUsername("anmol.shukla").isEmpty()) {
        //     userService.registerFull("anmol.shukla", "password", "employee", "Anmol Shukla",
        //         "anmol.shukla@cencora.com", "555-0105", "Cloud Provisioning", "MKT005");
        // }
        // Network Equipment Manager
        if (userService.findByUsername("debasish.pal").isEmpty()) {
            userService.registerFull("debasish.pal", "password", "networkEquipment", "Debasish Pal",
                "debasish.pal@cencora.com", "555-0106", "Dist Svcs", "NET001");
        }
        // // Audio Video Manager
        // if (userService.findByUsername("pradeep").isEmpty()) {
        //     userService.registerFull("pradeep", "password", "audioVideo", "Pradeep",
        //         "pradeep@company.com", "555-0107", "Quality Assurance", "AV001");
        // }
        // Furniture Manager
        if (userService.findByUsername("revant.sharma").isEmpty()) {
            userService.registerFull("revant.sharma", "password", "furniture", "Revant Sharma",
                "revant.sharma@cencora.com", "555-0108", "Replenish IT", "FUR001");
        }
    }
    
    private void seedHardwareAssets() {
        if (assetService.findAll().isEmpty()) {
            // Asset 1 - Assigned, Verified
             HardwareAsset hw1 = new HardwareAsset();
            hw1.serviceTag = "ST-LT-2023-001";
            hw1.assetType = AssetType.Laptop;
            hw1.model = "Dell Latitude 5540";
            hw1.invoiceNumber = "INV-2023-001";
            hw1.poNumber = "PO-98765";
            hw1.cost = new BigDecimal("1200");
            hw1.purchaseDate = LocalDate.of(2023, 11, 21);
            hw1.assignedTo = "a139208";
            hw1.assignedToName = "Dhruv Khullar";
            hw1.status = AssetStatus.Assigned;
            hw1.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw1.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw1.isHighValue = true;
            hw1.location = "Pune";
            hw1.team = "CBS PMO";
            assetService.create(hw1);
            
             HardwareAsset hw2 = new HardwareAsset();
            hw2.serviceTag = "ST-LT-2023-002";
            hw2.assetType = AssetType.Laptop;
            hw2.model = "Dell Latitude 5540";
            hw2.invoiceNumber = "INV-2023-002";
            hw2.poNumber = "PO-98765";
            hw2.cost = new BigDecimal("1200");
            hw2.purchaseDate = LocalDate.of(2023, 12, 5);
            hw2.assignedTo = "a156144";
            hw2.assignedToName = "Nadim Mujawar";
            hw2.status = AssetStatus.Assigned;
            hw2.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw2.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw2.isHighValue = true;
            hw2.location = "Pune";
            hw2.team = "Digital Workplace";
            assetService.create(hw2);

            HardwareAsset hw3 = new HardwareAsset();
            hw3.serviceTag = "ST-LT-2024-001";
            hw3.assetType = AssetType.Laptop;
            hw3.model = "Dell Pro 14 Plus";
            hw3.invoiceNumber = "INV-2024-001";
            hw3.poNumber = "PO-98765";
            hw3.cost = new BigDecimal("1200");
            hw3.purchaseDate = LocalDate.of(2024, 9, 27);
            hw3.assignedTo = "a157202";
            hw3.assignedToName = "Sanket Disale";
            hw3.status = AssetStatus.Assigned;
            hw3.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw3.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw3.isHighValue = true;
            hw3.location = "Pune";
            hw3.team = "eCommerce & Portal";
            assetService.create(hw3);

            HardwareAsset hw4 = new HardwareAsset();
            hw4.serviceTag = "ST-LT-2024-002";
            hw4.assetType = AssetType.Laptop;
            hw4.model = "Dell Pro 14 Plus";
            hw4.invoiceNumber = "INV-2024-002";
            hw4.poNumber = "PO-98765";
            hw4.cost = new BigDecimal("1200");
            hw4.purchaseDate = LocalDate.of(2024, 9, 27);
            hw4.assignedTo = "a157196";
            hw4.assignedToName = "Kamlesh Badade";
            hw4.status = AssetStatus.Assigned;
            hw4.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw4.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw4.isHighValue = true;
            hw4.location = "Pune";
            hw4.team = "eCommerce & Portal";
            assetService.create(hw4);

             HardwareAsset hw5 = new HardwareAsset();
            hw5.serviceTag = "ST-LT-2024-003";
            hw5.assetType = AssetType.Laptop;
            hw5.model = "Dell Pro 14 Plus";
            hw5.invoiceNumber = "INV-2024-003";
            hw5.poNumber = "PO-98765";
            hw5.cost = new BigDecimal("1200");
            hw5.purchaseDate = LocalDate.of(2024, 9, 27);
            hw5.assignedTo = "a147083";
            hw5.assignedToName = "Nitin Krishna";
            hw5.status = AssetStatus.Assigned;
            hw5.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw5.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw5.isHighValue = true;
            hw5.location = "Pune";
            hw5.team = "BG Data Analytics IT";
            assetService.create(hw5);

            HardwareAsset hw6 = new HardwareAsset();
            hw6.serviceTag = "ST-LT-2024-004";
            hw6.assetType = AssetType.Laptop;
            hw6.model = "Dell Pro 14 Plus";
            hw6.invoiceNumber = "INV-2024-004";
            hw6.poNumber = "PO-98765";
            hw6.cost = new BigDecimal("1200");
            hw6.purchaseDate = LocalDate.of(2024, 9, 27);
            hw6.assignedTo = "a154096";
            hw6.assignedToName = "Ritika Mokashi";
            hw6.status = AssetStatus.Assigned;
            hw6.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw6.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw6.isHighValue = true;
            hw6.location = "Pune";
            hw6.team = "BG Data Analytics IT";
            assetService.create(hw6);

            HardwareAsset hw7 = new HardwareAsset();
            hw7.serviceTag = "ST-LT-2024-005";
            hw7.assetType = AssetType.Laptop;
            hw7.model = "Dell Pro 14 Plus";
            hw7.invoiceNumber = "INV-2024-005";
            hw7.poNumber = "PO-98765";
            hw7.cost = new BigDecimal("1200");
            hw7.purchaseDate = LocalDate.of(2024, 9, 27);
            hw7.assignedTo = "a154098";
            hw7.assignedToName = "Aishwarya Somadale";
            hw7.status = AssetStatus.Assigned;
            hw7.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw7.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw7.isHighValue = true;
            hw7.location = "Pune";
            hw7.team = "BG Data Analytics IT";
            assetService.create(hw7);

            HardwareAsset hw8 = new HardwareAsset();
            hw8.serviceTag = "ST-LT-2024-006";
            hw8.assetType = AssetType.Laptop;
            hw8.model = "Dell Pro 14 Plus";
            hw8.invoiceNumber = "INV-2024-006";
            hw8.poNumber = "PO-98765";
            hw8.cost = new BigDecimal("1200");
            hw8.purchaseDate = LocalDate.of(2024, 9, 27);
            hw8.assignedTo = "a157201";
            hw8.assignedToName = "Arati Pisal";
            hw8.status = AssetStatus.Assigned;
            hw8.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw8.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw8.isHighValue = true;
            hw8.location = "Pune";
            hw8.team = "eCommerce & Portal";
            assetService.create(hw8);
            
             HardwareAsset hw9 = new HardwareAsset();
            hw9.serviceTag = "ST-LT-2024-007";
            hw9.assetType = AssetType.Laptop;
            hw9.model = "Dell Pro 14 Plus";
            hw9.invoiceNumber = "INV-2024-007";
            hw9.poNumber = "PO-98765";
            hw9.cost = new BigDecimal("1200");
            hw9.purchaseDate = LocalDate.of(2024, 9, 27);
            hw9.assignedTo = "a154795";
            hw9.assignedToName = "Ritu Tak";
            hw9.status = AssetStatus.Assigned;
            hw9.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw9.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw9.isHighValue = true;
            hw9.location = "Pune";
            hw9.team = "Alliance IT BusApps";
            assetService.create(hw9);

            HardwareAsset hw10 = new HardwareAsset();
            hw10.serviceTag = "ST-LT-2024-008";
            hw10.assetType = AssetType.Laptop;
            hw10.model = "Dell Pro 14 Plus";
            hw10.invoiceNumber = "INV-2024-008";
            hw10.poNumber = "PO-98765";
            hw10.cost = new BigDecimal("1200");
            hw10.purchaseDate = LocalDate.of(2024, 9, 27);
            hw10.assignedTo = "a157279";
            hw10.assignedToName = "Rajas Nandgaonkar";
            hw10.status = AssetStatus.Assigned;
            hw10.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw10.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw10.isHighValue = true;
            hw10.location = "Pune";
            hw10.team = "Alliance IT BusApps";
            assetService.create(hw10);

             HardwareAsset hw11 = new HardwareAsset();
            hw11.serviceTag = "ST-LT-2024-009";
            hw11.assetType = AssetType.Laptop;
            hw11.model = "Dell Latitude 5540";
            hw11.invoiceNumber = "INV-2024-009";
            hw11.poNumber = "PO-98765";
            hw11.cost = new BigDecimal("1200");
            hw11.purchaseDate = LocalDate.of(2024, 11, 15);
            hw11.assignedTo = "MKT005";
            hw11.assignedToName = "Anmol Shukla";
            hw11.status = AssetStatus.Assigned;
            hw11.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw11.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw11.isHighValue = true;
            hw11.location = "Pune";
            hw11.team = "Cloud Provisioning";
            assetService.create(hw11);

             HardwareAsset hw12 = new HardwareAsset();
            hw12.serviceTag = "ST-LT-2024-010";
            hw12.assetType = AssetType.Laptop;
            hw12.model = "Dell Latitude 5540";
            hw12.invoiceNumber = "INV-2024-010";
            hw12.poNumber = "PO-98765";
            hw12.cost = new BigDecimal("1200");
            hw12.purchaseDate = LocalDate.of(2024, 11, 20);
            hw12.assignedTo = "NET001";
            hw12.assignedToName = "Debasish Pal";
            hw12.status = AssetStatus.Assigned;
            hw12.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw12.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw12.isHighValue = true;
            hw12.location = "Pune";
            hw12.team = "Dist Svcs";
            assetService.create(hw12);

            HardwareAsset hw13 = new HardwareAsset();
            hw13.serviceTag = "ST-LT-2024-011";
            hw13.assetType = AssetType.Laptop;
            hw13.model = "Dell Latitude 5540";
            hw13.invoiceNumber = "INV-2024-011";
            hw13.poNumber = "PO-98765";
            hw13.cost = new BigDecimal("1200");
            hw13.purchaseDate = LocalDate.of(2024, 12, 1);
            hw13.assignedTo = "FUR001";
            hw13.assignedToName = "Revant Sharma";
            hw13.status = AssetStatus.Assigned;
            hw13.verificationStatus = HardwareAsset.VerificationStatus.Pending;
            hw13.lastVerifiedDate = LocalDate.of(2025, 1, 10);
            hw13.isHighValue = true;
            hw13.location = "Pune";
            hw13.team = "Replenish IT";
            assetService.create(hw13);
        }
    }
    
    private void seedPeripherals() {
        if (peripheralService.findAll().isEmpty()) {
            // Emily Johnson peripherals
            // Dhruv — a139208 — 2024-01-15 — (2 items)
            Peripheral p1 = new Peripheral();
            p1.type = PeripheralType.Headphones;
            p1.assignedTo = "a139208";
            p1.assignedToName = "Dhruv Khullar";
            p1.verified = false;
            p1.assignedDate = LocalDate.of(2024, 1, 15);
            peripheralService.create(p1);
            
            Peripheral p2 = new Peripheral();
            p2.type = PeripheralType.Mouse;
            p2.assignedTo = "a139208";
            p2.assignedToName = "Dhruv Khullar";
            p2.verified = false;
            p2.assignedDate = LocalDate.of(2024, 1, 15);
            peripheralService.create(p2);
            
            // Ritu — a154795 — 2024-01-16 — (3 items)
            Peripheral p3 = new Peripheral();
            p3.type = PeripheralType.Dock;
            p3.assignedTo = "a154795";
            p3.assignedToName = "Ritu Tak";
            p3.verified = false;
            p3.assignedDate = LocalDate.of(2024, 1, 16);
            peripheralService.create(p3);
            
            Peripheral p4 = new Peripheral();
            p4.type = PeripheralType.Keyboard;
            p4.assignedTo = "a154795";
            p4.assignedToName = "Ritu Tak";
            p4.verified = false;
            p4.assignedDate = LocalDate.of(2024, 1, 16);
            peripheralService.create(p4);
            
            Peripheral p5 = new Peripheral();
            p5.type = PeripheralType.USBCCable;
            p5.assignedTo = "a154795";
            p5.assignedToName = "Ritu Tak";
            p5.verified = false;
            p5.assignedDate = LocalDate.of(2024, 1, 16);
            peripheralService.create(p5);
            
            // Nitin — a147083 — 2024-01-17 — (2 items)
            Peripheral p6 = new Peripheral();
            p6.type = PeripheralType.Charger;
            p6.assignedTo = "a147083";
            p6.assignedToName = "Nitin Krishna";
            p6.verified = false;
            p6.assignedDate = LocalDate.of(2024, 1, 17);
            peripheralService.create(p6);
            
            Peripheral p7 = new Peripheral();
            p7.type = PeripheralType.USBCCable;
            p7.assignedTo = "a147083";
            p7.assignedToName = "Nitin Krishnha";
            p7.verified = false;
            p7.assignedDate = LocalDate.of(2024, 1, 17);
            peripheralService.create(p7);
            
            // Rajas — a157279 — 2024-01-18 — (3 items)
            Peripheral p8 = new Peripheral();
            p8.type = PeripheralType.Charger;
            p8.assignedTo = "a157279";
            p8.assignedToName = "Rajas Nandgaonkar";
            p8.verified = false;
            p8.assignedDate = LocalDate.of(2024, 1, 18);
            peripheralService.create(p8);
            
            Peripheral p9 = new Peripheral();
            p9.type = PeripheralType.Mouse;
            p9.assignedTo = "a157279";
            p9.assignedToName = "Rajas Nandgaonkar";
            p9.verified = false;
            p9.assignedDate = LocalDate.of(2024, 1, 18);
            peripheralService.create(p9);
            
            Peripheral p10 = new Peripheral();
            p10.type = PeripheralType.Keyboard;
            p10.assignedTo = "a157279";
            p10.assignedToName = "Rajas Nandgaonkar";
            p10.verified = false;
            p10.assignedDate = LocalDate.of(2024, 1, 18);
            peripheralService.create(p10);
            
            // Sanket — a157202 — 2024-01-19 — (2 items)
            Peripheral p11 = new Peripheral();
            p11.type = PeripheralType.Headphones;
            p11.assignedTo = "a157202";
            p11.assignedToName = "Sanket Disale";
            p11.verified = false;
            p11.assignedDate = LocalDate.of(2024, 1, 19);
            peripheralService.create(p11);
            
            Peripheral p12 = new Peripheral();
            p12.type = PeripheralType.Dock;
            p12.assignedTo = "a157202";
            p12.assignedToName = "Sanket Disale";
            p12.verified = false;
            p12.assignedDate = LocalDate.of(2024, 1, 19);
            peripheralService.create(p12);
            
            // Aishwarya — a154098 — 2024-01-20 — (3 items)
            Peripheral p13 = new Peripheral();
            p13.type = PeripheralType.Charger;
            p13.assignedTo = "a154098";
            p13.assignedToName = "Aishwarya Somadale";
            p13.verified = false;
            p13.assignedDate = LocalDate.of(2024, 1, 20);
            peripheralService.create(p13);
            
            Peripheral p14 = new Peripheral();
            p14.type = PeripheralType.Headphones;
            p14.assignedTo = "a154098";
            p14.assignedToName = "Aishwarya Somadale";
            p14.verified = false;
            p14.assignedDate = LocalDate.of(2024, 1, 20);
            peripheralService.create(p14);
            
            Peripheral p15 = new Peripheral();
            p15.type = PeripheralType.Dock;
            p15.assignedTo = "a154098";
            p15.assignedToName = "Aishwarya Somadale";
            p15.verified = false;
            p15.assignedDate = LocalDate.of(2024, 1, 20);
            peripheralService.create(p15);
            
            // Kamlesh — a157196 — 2024-01-21 — (2 items)
            Peripheral p16 = new Peripheral();
            p16.type = PeripheralType.Keyboard;
            p16.assignedTo = "a157196";
            p16.assignedToName = "Kamlesh Badade";
            p16.verified = false;
            p16.assignedDate = LocalDate.of(2024, 1, 21);
            peripheralService.create(p16);
            
            Peripheral p17 = new Peripheral();
            p17.type = PeripheralType.USBCCable;
            p17.assignedTo = "a157196";
            p17.assignedToName = "Kamlesh Badade";
            p17.verified = false;
            p17.assignedDate = LocalDate.of(2024, 1, 21);
            peripheralService.create(p17);
            
            // Arati — a157201 — 2024-01-22 — (3 items)
            Peripheral p18 = new Peripheral();
            p18.type = PeripheralType.Charger;
            p18.assignedTo = "a157201";
            p18.assignedToName = "Arati Pisal";
            p18.verified = false;
            p18.assignedDate = LocalDate.of(2024, 1, 22);
            peripheralService.create(p18);
            
            Peripheral p19 = new Peripheral();
            p19.type = PeripheralType.Mouse;
            p19.assignedTo = "a157201";
            p19.assignedToName = "Arati Pisal";
            p19.verified = false;
            p19.assignedDate = LocalDate.of(2024, 1, 22);
            peripheralService.create(p19);
            
            Peripheral p20 = new Peripheral();
            p20.type = PeripheralType.Dock;
            p20.assignedTo = "a157201";
            p20.assignedToName = "Arati Pisal";
            p20.verified = false;
            p20.assignedDate = LocalDate.of(2024, 1, 22);
            peripheralService.create(p20);
            
            // Ritika — a154096 — 2024-01-23 — (2 items)
            Peripheral p21 = new Peripheral();
            p21.type = PeripheralType.Headphones;
            p21.assignedTo = "a154096";
            p21.assignedToName = "Ritika Mokashi";
            p21.verified = false;
            p21.assignedDate = LocalDate.of(2024, 1, 23);
            peripheralService.create(p21);
            
            Peripheral p22 = new Peripheral();
            p22.type = PeripheralType.Keyboard;
            p22.assignedTo = "a154096";
            p22.assignedToName = "Ritika Mokashi";
            p22.verified = false;
            p22.assignedDate = LocalDate.of(2024, 1, 23);
            peripheralService.create(p22);
            
            // Nadeem — a156144 — 2024-01-24 — (3 items)
            Peripheral p23 = new Peripheral();
            p23.type = PeripheralType.Mouse;
            p23.assignedTo = "a156144";
            p23.assignedToName = "Nadeem Mujawar";
            p23.verified = false;
            p23.assignedDate = LocalDate.of(2024, 1, 24);
            peripheralService.create(p23);
            
            Peripheral p24 = new Peripheral();
            p24.type = PeripheralType.Dock;
            p24.assignedTo = "a156144";
            p24.assignedToName = "Nadeem Mujawar";
            p24.verified = false;
            p24.assignedDate = LocalDate.of(2024, 1, 24);
            peripheralService.create(p24);
            
            Peripheral p25 = new Peripheral();
            p25.type = PeripheralType.USBCCable;
            p25.assignedTo = "a156144";
            p25.assignedToName = "Nadeem Mujawar";
            p25.verified = false;
            p25.assignedDate = LocalDate.of(2024, 1, 24);
            peripheralService.create(p25);
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
