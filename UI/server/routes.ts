import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import { assets, campaigns, users, verifications } from "@shared/schema";

const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === AUTHENTICATION & SESSION ===
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev_secret",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000,
      }),
      cookie: {
        secure: app.get("env") === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // === SEED DATA ===
  await seedDatabase();

  // === AUTH ROUTES ===
  app.post(api.auth.login.path, async (req, res) => {
    const { role, username } = req.body;
    console.log('[routes] /api/auth/login attempt:', { role, username, body: req.body });
    // Simple demo login logic
    let user;
    if (role === 'finance') {
      user = await storage.getUserByUsername('sarah.chen');
    } else if (role === 'manager') {
      user = await storage.getUserByUsername('michael.torres');
    } else if (role === 'hr_manager') {
      user = await storage.getUserByUsername('hr.manager');
    } else if (role === 'admin_manager') {
      user = await storage.getUserByUsername('admin.manager');
    } else if (role === 'it_manager') {
      user = await storage.getUserByUsername('it.manager');
    } else if (role === 'network_engineer') {
      user = await storage.getUserByUsername('network.engineer');
    } else if (role === 'network_equipment_manager') {
      user = await storage.getUserByUsername('network.equipment.manager');
    } else if (role === 'audio_video_manager') {
      user = await storage.getUserByUsername('audio.video.manager');
    } else if (role === 'furniture_manager') {
      user = await storage.getUserByUsername('furniture.manager');
    } else if (role === 'employee') {
      // For employee, default to Emily for demo, or match username if provided
      user = await storage.getUserByUsername('emily.johnson');
    }

    if (user) {
      (req.session as any).userId = user.id;
      res.json(user);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.get(api.auth.me.path, async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).send();
    const user = await storage.getUser(userId);
    if (user) res.json(user);
    else res.status(401).send();
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  // === DASHBOARD ROUTES ===
  app.get(api.dashboard.stats.path, async (req, res) => {
    // Mock stats based on screenshots
    res.json({
      totalAssets: 4,
      verificationCompleted: 23, // 23%
      pendingVerifications: 1,
      exceptions: 1,
    });
  });

  // === ASSET ROUTES ===
  app.get(api.assets.list.path, async (req, res) => {
    const assets = await storage.getAssets();
    res.json(assets);
  });

  app.post(api.assets.create.path, async (req, res) => {
    try {
      const input = api.assets.create.input.parse(req.body);
      const asset = await storage.createAsset(input);
      res.status(201).json(asset);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.assets.update.path, async (req, res) => {
    try {
      const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
      const input = api.assets.update.input.parse(req.body);
      const asset = await storage.updateAsset(id, input);
      res.json(asset);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.assets.delete.path, async (req, res) => {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    await storage.deleteAsset(id);
    res.status(204).send();
  });

  app.get(api.reports.get.path, async (req, res) => {
    const type = req.params.type;
    if (type === 'asset-value') {
      res.json([
        { category: 'Laptops', value: 125000, count: 45, department: 'IT' },
        { category: 'Desktops', value: 89000, count: 32, department: 'IT' },
        { category: 'Monitors', value: 45000, count: 60, department: 'IT' },
        { category: 'Servers', value: 340000, count: 8, department: 'IT' },
        { category: 'Network Equipment', value: 78000, count: 15, department: 'IT' },
      ]);
    } else if (type === 'compliance') {
      res.json([
        { month: 'Jan', rate: 85, exceptions: 12 },
        { month: 'Feb', rate: 92, exceptions: 8 },
        { month: 'Mar', rate: 88, exceptions: 15 },
        { month: 'Apr', rate: 94, exceptions: 6 },
        { month: 'May', rate: 91, exceptions: 9 },
        { month: 'Jun', rate: 96, exceptions: 4 },
      ]);
    } else if (type === 'financial-summary') {
      res.json([
        { month: 'Jan', totalValue: 677000, depreciation: 11200, netValue: 665800 },
        { month: 'Feb', totalValue: 677000, depreciation: 11200, netValue: 665800 },
        { month: 'Mar', totalValue: 689000, depreciation: 11480, netValue: 677520 },
        { month: 'Apr', totalValue: 689000, depreciation: 11480, netValue: 677520 },
        { month: 'May', totalValue: 702000, depreciation: 11700, netValue: 690300 },
        { month: 'Jun', totalValue: 702000, depreciation: 11700, netValue: 690300 },
      ]);
    } else if (type === 'exceptions') {
      res.json([
        { serviceTag: 'ST-MN-2024-003', issue: 'Missing physical tag', severity: 'High', date: '2024-06-15', resolved: false },
        { serviceTag: 'ST-LT-2024-007', issue: 'Location mismatch', severity: 'Medium', date: '2024-06-14', resolved: true },
        { serviceTag: 'ST-SV-2024-002', issue: 'User not found', severity: 'Medium', date: '2024-06-13', resolved: false },
        { serviceTag: 'ST-DT-2024-015', issue: 'Asset damaged', severity: 'High', date: '2024-06-12', resolved: true },
        { serviceTag: 'ST-MN-2024-008', issue: 'Status discrepancy', severity: 'Low', date: '2024-06-11', resolved: true },
      ]);
    } else if (type === 'audit-trail') {
      res.json([
        { action: 'Asset Added', user: 'sarah.chen', timestamp: '2024-06-15T10:30:00Z', details: 'Laptop - ST-LT-2024-018' },
        { action: 'Verification Completed', user: 'emily.johnson', timestamp: '2024-06-15T09:45:00Z', details: 'Campaign Q2-2024' },
        { action: 'Asset Updated', user: 'michael.torres', timestamp: '2024-06-14T16:20:00Z', details: 'Server location changed' },
        { action: 'Exception Logged', user: 'emily.johnson', timestamp: '2024-06-14T14:15:00Z', details: 'Missing tag - ST-MN-2024-003' },
        { action: 'Report Generated', user: 'sarah.chen', timestamp: '2024-06-14T11:00:00Z', details: 'Monthly compliance report' },
      ]);
    } else if (type === 'inventory') {
      res.json([
        { serviceTag: 'ST-LT-2024-001', type: 'Laptop', model: 'Dell Latitude 7420', status: 'Active', user: 'john.doe', location: 'Building A, Floor 3', department: 'IT' },
        { serviceTag: 'ST-DT-2024-002', type: 'Desktop', model: 'HP EliteDesk 800', status: 'Active', user: 'jane.smith', location: 'Building B, Floor 1', department: 'HR' },
        { serviceTag: 'ST-MN-2024-003', type: 'Monitor', model: 'Dell U2422H', status: 'Exception', user: 'mike.wilson', location: 'Building A, Floor 2', department: 'Finance' },
        { serviceTag: 'ST-SV-2024-004', type: 'Server', model: 'Dell PowerEdge R740', status: 'Active', user: 'admin', location: 'Data Center', department: 'IT' },
        { serviceTag: 'ST-NW-2024-005', type: 'Switch', model: 'Cisco Catalyst 2960', status: 'Active', user: 'admin', location: 'Data Center', department: 'IT' },
      ]);
    } else if (type === 'reconciliation') {
      res.json([
        { serviceTag: 'ST-LT-2024-001', sapStatus: 'Active', verifiedStatus: 'Verified', match: true },
        { serviceTag: 'ST-LT-2024-002', sapStatus: 'Active', verifiedStatus: 'Pending', match: false },
      ]);
    } else if (type === 'status') {
      res.json([
        { month: 'Jan', rate: 85 },
        { month: 'Feb', rate: 92 },
      ]);
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  });

  // === CAMPAIGN ROUTES ===
  app.get(api.campaigns.list.path, async (req, res) => {
    const campaigns = await storage.getCampaigns();
    res.json(campaigns);
  });

  app.get(api.campaigns.getActive.path, async (req, res) => {
    const campaign = await storage.getActiveCampaign();
    if (!campaign) return res.status(404).json({ message: "No active campaign" });
    res.json(campaign);
  });

  // === VERIFICATION ROUTES ===
  app.get(api.verifications.list.path, async (req, res) => {
    const verifications = await storage.getVerifications();
    res.json(verifications);
  });

  app.post(api.verifications.submit.path, async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const input = api.verifications.submit.input.parse(req.body);
    
    // Create verification record
    const verification = await storage.createVerification({
      campaignId: input.campaignId,
      userId: userId,
      status: "Verified",
      submittedAt: new Date(),
      reviewedAt: null,
      notes: null,
    } as any);

    // Create items
    await storage.createVerificationItems(input.items.map(item => ({
      verificationId: verification.id,
      assetId: item.assetId,
      peripheralName: item.peripheralName,
      isPresent: item.isPresent,
      photoUrl: item.photoUrl,
      status: "Verified",
    } as any)));

    res.status(201).json(verification);
  });

  return httpServer;
}

async function seedDatabase() {
  const existingUsers = await storage.getUserByUsername("sarah.chen");
  if (existingUsers) {
    // Add Audio Video Manager if not exists
    const audioVideoManager = await storage.getUserByUsername('audio.video.manager');
    if (!audioVideoManager) {
      await storage.createUser({
        username: 'audio.video.manager',
        password: 'avm123',
        role: 'audio_video_manager',
        name: 'Audio Video Manager',
        department: 'Audio Video'
      });
    }

    // Add Furniture Manager if not exists
    const furnitureManager = await storage.getUserByUsername('furniture.manager');
    if (!furnitureManager) {
      await storage.createUser({
        username: 'furniture.manager',
        password: 'fm123',
        role: 'furniture_manager',
        name: 'Furniture Manager',
        department: 'Facilities'
      });
    }
    return; // Already seeded
  }

  // 1. Create Users
  const finance = await storage.createUser({
    username: "sarah.chen",
    password: "password", // In real app, hash this
    role: "finance",
    name: "Sarah Chen",
    department: "Finance",
    avatar: "SC"
  } as any);

  const manager = await storage.createUser({
    username: "michael.torres",
    password: "password",
    role: "manager",
    name: "Michael Torres",
    department: "IT Asset Management",
    avatar: "MT"
  } as any);

  const emily = await storage.createUser({
    username: "emily.johnson",
    password: "password",
    role: "employee",
    name: "Emily Johnson",
    department: "Engineering",
    avatar: "EJ"
  } as any);

  const james = await storage.createUser({
    username: "james.wilson",
    password: "password",
    role: "employee",
    name: "James Wilson",
    department: "Engineering",
    avatar: "JW"
  } as any);

  const lisa = await storage.createUser({
    username: "lisa.anderson",
    password: "password",
    role: "employee",
    name: "Lisa Anderson",
    department: "Marketing",
    avatar: "LA"
  } as any);

  const hrManager = await storage.createUser({
    username: "hr.manager",
    password: "password",
    role: "hr_manager",
    name: "Jennifer Davis",
    department: "Human Resources",
    avatar: "JD"
  } as any);

  const adminManager = await storage.createUser({
    username: "admin.manager",
    password: "password",
    role: "admin_manager",
    name: "Robert Miller",
    department: "System Administration",
    avatar: "RM"
  } as any);

  const itManager = await storage.createUser({
    username: "it.manager",
    password: "password",
    role: "it_manager",
    name: "David Chen",
    department: "IT Infrastructure",
    avatar: "DC"
  } as any);

  const networkEngineer = await storage.createUser({
    username: "network.engineer",
    password: "password",
    role: "network_engineer",
    name: "Alex Thompson",
    department: "Network Engineering",
    avatar: "AT"
  } as any);

  const networkEquipmentManager = await storage.createUser({
    username: "network.equipment.manager",
    password: "password",
    role: "network_equipment_manager",
    name: "Robert Wilson",
    department: "Network Equipment Management",
    avatar: "RW"
  } as any);

  const audioVideoManager = await storage.createUser({
    username: "audio.video.manager",
    password: "password",
    role: "audio_video_manager",
    name: "Michael Davis",
    department: "Audio Video Management",
    avatar: "MD"
  } as any);

  // 2. Create Assets
  const laptop1 = await storage.createAsset({
    serviceTag: "ST-LT-2024-001",
    name: "Dell Latitude 5540",
    type: "Laptop",
    model: "Dell Latitude 5540",
    cost: 1200,
    purchaseDate: new Date("2024-01-15"),
    status: "Assigned",
    assignedToId: emily.id,
    specs: { processor: "i7", ram: "32GB" }
  } as any);

  await storage.createAsset({
    serviceTag: "ST-MB-2024-004",
    name: "iPhone 15 Pro",
    type: "Mobile",
    model: "iPhone 15 Pro",
    cost: 999,
    purchaseDate: new Date("2024-02-10"),
    status: "Assigned",
    assignedToId: emily.id,
    specs: { storage: "256GB" }
  } as any);

  await storage.createAsset({
    serviceTag: "ST-LT-2024-002",
    name: "HP EliteBook 840",
    type: "Laptop",
    model: "HP EliteBook 840 G10",
    cost: 1400,
    purchaseDate: new Date("2024-05-12"),
    status: "Assigned",
    assignedToId: james.id,
    specs: { processor: "i5", ram: "16GB" }
  } as any);

  await storage.createAsset({
    serviceTag: "ST-MN-2024-003",
    name: "LG UltraWide 34\"",
    type: "Monitor",
    model: "LG 34WP65C-B",
    cost: 650,
    purchaseDate: new Date("2024-07-22"),
    status: "Assigned",
    assignedToId: lisa.id,
    specs: { resolution: "3440 x 1440" }
  } as any);

  // 3. Create Campaign
  const campaign = await storage.createCampaign({
    name: "Q4 2024 Annual Audit",
    status: "Active",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-01-31"),
    totalEmployees: 245,
    verifiedCount: 156
  } as any);

  // 4. Create Verifications (to match dashboard stats)
  // Emily - Verified
  await storage.createVerification({
    campaignId: campaign.id,
    userId: emily.id,
    status: "Verified",
    submittedAt: new Date("2025-01-10"),
  } as any);

  // James - Pending
  await storage.createVerification({
    campaignId: campaign.id,
    userId: james.id,
    status: "Pending",
    submittedAt: null,
  } as any);

  // Lisa - Overdue
  await storage.createVerification({
    campaignId: campaign.id,
    userId: lisa.id,
    status: "Overdue",
    submittedAt: null,
  } as any);
}
