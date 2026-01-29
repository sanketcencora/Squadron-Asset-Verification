// Mock data for the IT Asset Verification System

export type UserRole = 'finance' | 'assetManager' | 'employee' | 'networkEquipment' | 'audioVideo' | 'furniture';

export type AssetType = 'Laptop' | 'Monitor' | 'Mobile';

export type VerificationStatus = 'Verified' | 'Pending' | 'Overdue' | 'Exception' | 'Not Started';

export type PeripheralType = 'Charger' | 'Headphones' | 'Dock' | 'Mouse' | 'Keyboard' | 'USB-C Cable';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
  team: string;
  location: string;
  verificationStatus?: VerificationStatus; // Add this for compatibility
  lastVerifiedDate?: string; // Add this for compatibility
}

export interface HardwareAsset {
  id: string;
  serviceTag: string;
  assetType: AssetType;
  model: string;
  invoiceNumber: string;
  poNumber: string;
  cost: number;
  purchaseDate: string;
  assignedTo?: string; // employee ID
  assignedToName?: string;
  status: 'Instock' | 'Assigned';
  verificationStatus: VerificationStatus;
  lastVerifiedDate?: string;
  verificationImage?: string;
  isHighValue: boolean;
}

export interface Peripheral {
  id: string;
  type: PeripheralType;
  serialNumber?: string;
  assignedTo: string; // employee ID
  assignedToName: string;
  verified: boolean;
  assignedDate: string;
}

export interface VerificationCampaign {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdDate: string;
  deadline: string;
  status: 'Draft' | 'Active' | 'Completed';
  totalEmployees: number;
  totalAssets: number;
  totalPeripherals: number;
  verifiedCount: number;
  pendingCount: number;
  overdueCount: number;
  exceptionCount: number;
  filters: {
    teams?: string[];
    assetTypes?: AssetType[];
    highValueOnly?: boolean;
  };
}

export interface VerificationRecord {
  id: string;
  campaignId: string;
  employeeId: string;
  employeeName: string;
  assetId: string;
  serviceTag: string;
  assetType: AssetType;
  status: VerificationStatus;
  uploadedImage?: string;
  recordedServiceTag?: string;
  peripheralsConfirmed: PeripheralType[];
  peripheralsNotWithMe: PeripheralType[];
  comment?: string;
  submittedDate?: string;
  reviewedBy?: string;
  exceptionType?: 'No Response' | 'Mismatch' | 'Not With Employee' | 'Missing Device';
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'finance',
    employeeId: 'FIN001',
    team: 'Finance',
    location: 'New York'
  },
  {
    id: '2',
    name: 'Michael Torres',
    email: 'michael.torres@company.com',
    role: 'assetManager',
    employeeId: 'IT002',
    team: 'IT Operations',
    location: 'San Francisco'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily.johnson@company.com',
    role: 'employee',
    employeeId: 'ENG003',
    team: 'Engineering',
    location: 'Austin'
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'employee',
    employeeId: 'ENG004',
    team: 'Engineering',
    location: 'Austin'
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    role: 'employee',
    employeeId: 'MKT005',
    team: 'Marketing',
    location: 'New York'
  },
  {
    id: '6',
    name: 'Debasish',
    email: 'debasish@company.com',
    role: 'networkEquipment',
    employeeId: 'NET001',
    team: 'Network & Servers',
    location: 'New York'
  },
  {
    id: '7',
    name: 'Pradeep',
    email: 'pradeep@company.com',
    role: 'audioVideo',
    employeeId: 'AV001',
    team: 'Audio Video Equipment',
    location: 'San Francisco'
  },
  {
    id: '8',
    name: 'Revant',
    email: 'revant@company.com',
    role: 'furniture',
    employeeId: 'FUR001',
    team: 'Furniture & Fixtures',
    location: 'Austin'
  }
];

// Mock Hardware Assets
export const mockHardwareAssets: HardwareAsset[] = [
  {
    id: 'hw1',
    serviceTag: 'ST-LT-2024-001',
    assetType: 'Laptop',
    model: 'Dell Latitude 5540',
    invoiceNumber: 'INV-2024-001',
    poNumber: 'PO-98765',
    cost: 1200,
    purchaseDate: '2024-01-15',
    assignedTo: 'ENG003',
    assignedToName: 'Emily Johnson',
    status: 'Assigned',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2025-01-10',
    isHighValue: true
  },
  {
    id: 'hw2',
    serviceTag: 'ST-LT-2024-002',
    assetType: 'Laptop',
    model: 'MacBook Pro 16"',
    invoiceNumber: 'INV-2024-002',
    poNumber: 'PO-98766',
    cost: 2800,
    purchaseDate: '2024-02-20',
    assignedTo: 'ENG004',
    assignedToName: 'James Wilson',
    status: 'Assigned',
    verificationStatus: 'Pending',
    isHighValue: true
  },
  {
    id: 'hw3',
    serviceTag: 'ST-MN-2024-003',
    assetType: 'Monitor',
    model: 'Dell UltraSharp 27"',
    invoiceNumber: 'INV-2024-003',
    poNumber: 'PO-98767',
    cost: 450,
    purchaseDate: '2024-03-10',
    assignedTo: 'MKT005',
    assignedToName: 'Lisa Anderson',
    status: 'Assigned',
    verificationStatus: 'Overdue',
    lastVerifiedDate: '2024-06-15',
    isHighValue: false
  },
  {
    id: 'hw4',
    serviceTag: 'ST-MB-2024-004',
    assetType: 'Mobile',
    model: 'iPhone 15 Pro',
    invoiceNumber: 'INV-2024-004',
    poNumber: 'PO-98768',
    cost: 1200,
    purchaseDate: '2024-04-05',
    assignedTo: 'ENG003',
    assignedToName: 'Emily Johnson',
    status: 'Assigned',
    verificationStatus: 'Exception',
    isHighValue: true
  },
  {
    id: 'hw5',
    serviceTag: 'ST-LT-2024-005',
    assetType: 'Laptop',
    model: 'HP EliteBook 840',
    invoiceNumber: 'INV-2024-005',
    poNumber: 'PO-98769',
    cost: 1400,
    purchaseDate: '2024-05-12',
    status: 'Instock',
    verificationStatus: 'Not Started',
    isHighValue: true
  },
  {
    id: 'hw6',
    serviceTag: 'ST-LT-2024-006',
    assetType: 'Laptop',
    model: 'Lenovo ThinkPad X1',
    invoiceNumber: 'INV-2024-006',
    poNumber: 'PO-98770',
    cost: 1600,
    purchaseDate: '2024-06-18',
    status: 'Instock',
    verificationStatus: 'Not Started',
    isHighValue: true
  },
  {
    id: 'hw7',
    serviceTag: 'ST-MN-2024-007',
    assetType: 'Monitor',
    model: 'LG UltraWide 34"',
    invoiceNumber: 'INV-2024-007',
    poNumber: 'PO-98771',
    cost: 650,
    purchaseDate: '2024-07-22',
    status: 'Instock',
    verificationStatus: 'Not Started',
    isHighValue: false
  }
];

// Mock Peripherals
export const mockPeripherals: Peripheral[] = [
  {
    id: 'p1',
    type: 'Charger',
    assignedTo: 'ENG003',
    assignedToName: 'Emily Johnson',
    verified: true,
    assignedDate: '2024-01-15'
  },
  {
    id: 'p2',
    type: 'Headphones',
    assignedTo: 'ENG003',
    assignedToName: 'Emily Johnson',
    verified: true,
    assignedDate: '2024-01-15'
  },
  {
    id: 'p3',
    type: 'Mouse',
    assignedTo: 'ENG003',
    assignedToName: 'Emily Johnson',
    verified: true,
    assignedDate: '2024-01-15'
  },
  {
    id: 'p4',
    type: 'Charger',
    assignedTo: 'ENG004',
    assignedToName: 'James Wilson',
    verified: false,
    assignedDate: '2024-02-20'
  },
  {
    id: 'p5',
    type: 'Dock',
    assignedTo: 'ENG004',
    assignedToName: 'James Wilson',
    verified: false,
    assignedDate: '2024-02-20'
  },
  {
    id: 'p6',
    type: 'Charger',
    assignedTo: 'MKT005',
    assignedToName: 'Lisa Anderson',
    verified: false,
    assignedDate: '2024-03-10'
  },
  {
    id: 'p7',
    type: 'Keyboard',
    assignedTo: 'MKT005',
    assignedToName: 'Lisa Anderson',
    verified: false,
    assignedDate: '2024-03-10'
  }
];

// Mock Verification Campaigns
export const mockCampaigns: VerificationCampaign[] = [
  {
    id: 'camp1',
    name: 'Q4 2024 Annual Audit',
    description: 'Annual hardware and peripheral verification for audit compliance',
    createdBy: 'FIN001',
    createdDate: '2024-12-01',
    deadline: '2025-01-31',
    status: 'Active',
    totalEmployees: 245,
    totalAssets: 680,
    totalPeripherals: 1240,
    verifiedCount: 156,
    pendingCount: 72,
    overdueCount: 14,
    exceptionCount: 3,
    filters: {
      teams: ['Engineering', 'Marketing', 'Sales'],
      assetTypes: ['Laptop', 'Monitor', 'Mobile']
    }
  },
  {
    id: 'camp2',
    name: 'High-Value Assets Q1 2025',
    description: 'Verification of assets valued over $1000',
    createdBy: 'FIN001',
    createdDate: '2025-01-05',
    deadline: '2025-02-15',
    status: 'Active',
    totalEmployees: 89,
    totalAssets: 234,
    totalPeripherals: 456,
    verifiedCount: 45,
    pendingCount: 38,
    overdueCount: 5,
    exceptionCount: 1,
    filters: {
      highValueOnly: true,
      assetTypes: ['Laptop', 'Mobile']
    }
  }
];

// Mock Verification Records
export const mockVerificationRecords: VerificationRecord[] = [
  {
    id: 'vr1',
    campaignId: 'camp1',
    employeeId: 'ENG003',
    employeeName: 'Emily Johnson',
    assetId: 'hw1',
    serviceTag: 'ST-LT-2024-001',
    assetType: 'Laptop',
    status: 'Verified',
    recordedServiceTag: 'ST-LT-2024-001',
    peripheralsConfirmed: ['Charger', 'Headphones', 'Mouse'],
    peripheralsNotWithMe: [],
    submittedDate: '2025-01-10',
    reviewedBy: 'IT002'
  },
  {
    id: 'vr2',
    campaignId: 'camp1',
    employeeId: 'ENG004',
    employeeName: 'James Wilson',
    assetId: 'hw2',
    serviceTag: 'ST-LT-2024-002',
    assetType: 'Laptop',
    status: 'Pending',
    peripheralsConfirmed: [],
    peripheralsNotWithMe: []
  },
  {
    id: 'vr3',
    campaignId: 'camp1',
    employeeId: 'MKT005',
    employeeName: 'Lisa Anderson',
    assetId: 'hw3',
    serviceTag: 'ST-MN-2024-003',
    assetType: 'Monitor',
    status: 'Overdue',
    peripheralsConfirmed: [],
    peripheralsNotWithMe: []
  },
  {
    id: 'vr4',
    campaignId: 'camp1',
    employeeId: 'ENG003',
    employeeName: 'Emily Johnson',
    assetId: 'hw4',
    serviceTag: 'ST-MB-2024-004',
    assetType: 'Mobile',
    status: 'Exception',
    recordedServiceTag: 'ST-MB-2024-999',
    peripheralsConfirmed: [],
    peripheralsNotWithMe: ['Charger'],
    comment: 'Service tag does not match. Device not in my possession.',
    submittedDate: '2025-01-12',
    exceptionType: 'Mismatch'
  }
];

export const teams = ['Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'IT'];
export const locations = ['New York', 'San Francisco', 'Austin', 'Chicago', 'Seattle', 'Boston'];

// Specialized Equipment Categories
export interface EquipmentCount {
  id: string;
  category: 'network' | 'servers' | 'audioVideo' | 'furniture' | 'other';
  itemName: string;
  quantity: number;
  value: number;
  location: string;
  uploadedBy: string;
  uploadedDate: string;
  status: 'Active' | 'Archived';
  verificationStatus: VerificationStatus;
}

export const mockEquipmentCounts: EquipmentCount[] = [
  {
    id: 'eq1',
    category: 'network',
    itemName: 'Cisco Router 2900 Series',
    quantity: 45,
    value: 135000,
    location: 'Data Center NY',
    uploadedBy: 'NET001',
    uploadedDate: '2025-01-15',
    status: 'Active',
    verificationStatus: 'Verified'
  },
  {
    id: 'eq2',
    category: 'servers',
    itemName: 'Dell PowerEdge R740',
    quantity: 32,
    value: 480000,
    location: 'Data Center SF',
    uploadedBy: 'NET001',
    uploadedDate: '2025-01-10',
    status: 'Active',
    verificationStatus: 'Verified'
  },
  {
    id: 'eq3',
    category: 'network',
    itemName: 'HP Aruba Switch',
    quantity: 67,
    value: 201000,
    location: 'Office NY',
    uploadedBy: 'NET001',
    uploadedDate: '2025-01-12',
    status: 'Active',
    verificationStatus: 'Pending'
  },
  {
    id: 'eq4',
    category: 'audioVideo',
    itemName: 'Sony Conference Camera',
    quantity: 28,
    value: 84000,
    location: 'Office SF',
    uploadedBy: 'AV001',
    uploadedDate: '2025-01-14',
    status: 'Active',
    verificationStatus: 'Verified'
  },
  {
    id: 'eq5',
    category: 'audioVideo',
    itemName: 'Bose SoundTouch Speakers',
    quantity: 45,
    value: 67500,
    location: 'Office NY',
    uploadedBy: 'AV001',
    uploadedDate: '2025-01-08',
    status: 'Active',
    verificationStatus: 'Verified'
  },
  {
    id: 'eq6',
    category: 'audioVideo',
    itemName: 'Polycom Video Conference System',
    quantity: 18,
    value: 90000,
    location: 'Office Austin',
    uploadedBy: 'AV001',
    uploadedDate: '2025-01-11',
    status: 'Active',
    verificationStatus: 'Overdue'
  },
  {
    id: 'eq7',
    category: 'furniture',
    itemName: 'Herman Miller Aeron Chairs',
    quantity: 320,
    value: 480000,
    location: 'Office NY',
    uploadedBy: 'FUR001',
    uploadedDate: '2025-01-09',
    status: 'Active',
    verificationStatus: 'Verified'
  },
  {
    id: 'eq8',
    category: 'furniture',
    itemName: 'Standing Desks',
    quantity: 280,
    value: 420000,
    location: 'Office SF',
    uploadedBy: 'FUR001',
    uploadedDate: '2025-01-13',
    status: 'Active',
    verificationStatus: 'Verified'
  },
  {
    id: 'eq9',
    category: 'other',
    itemName: 'Whiteboards',
    quantity: 145,
    value: 43500,
    location: 'Office Austin',
    uploadedBy: 'FUR001',
    uploadedDate: '2025-01-07',
    status: 'Active',
    verificationStatus: 'Pending'
  },
  {
    id: 'eq10',
    category: 'other',
    itemName: 'Filing Cabinets',
    quantity: 89,
    value: 35600,
    location: 'Office Chicago',
    uploadedBy: 'FUR001',
    uploadedDate: '2025-01-16',
    status: 'Active',
    verificationStatus: 'Exception'
  }
];