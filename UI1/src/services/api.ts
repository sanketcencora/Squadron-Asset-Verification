// API Configuration and Base Service
// Allow override via Vite env; default to backend dev port 8080
export const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add a short timeout to avoid hanging UI when backend is down
  const controller = new AbortController();
  const timeoutMs = 3000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...defaultOptions, ...options, signal: controller.signal });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Type definitions matching backend
export type UserRole = 'finance' | 'assetManager' | 'employee' | 'networkEquipment' | 'audioVideo' | 'furniture';
export type AssetType = 'Laptop' | 'Monitor' | 'Mobile';
export type AssetStatus = 'Instock' | 'Assigned';
export type VerificationStatus = 'Verified' | 'Pending' | 'Overdue' | 'Exception' | 'NotStarted';
export type PeripheralType = 'Charger' | 'Headphones' | 'Dock' | 'Mouse' | 'Keyboard' | 'USBCCable';
export type CampaignStatus = 'Draft' | 'Active' | 'Completed';
export type EquipmentCategory = 'network' | 'servers' | 'audioVideo' | 'furniture' | 'other';
export type ExceptionType = 'NoResponse' | 'Mismatch' | 'NotWithEmployee' | 'MissingDevice';

export interface User {
  id: number;
  username: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  employeeId: string;
}

export interface HardwareAsset {
  id: number;
  serviceTag: string;
  assetType: AssetType;
  model: string;
  invoiceNumber: string;
  poNumber: string;
  cost: number;
  purchaseDate: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedDate?: string;
  status: AssetStatus;
  verificationStatus: VerificationStatus;
  lastVerifiedDate?: string;
  verificationImage?: string;
  isHighValue: boolean;
  location?: string;
  team?: string;
}

export interface Peripheral {
  id: number;
  type: PeripheralType;
  serialNumber?: string;
  assignedTo: string;
  assignedToName: string;
  verified: boolean;
  assignedDate: string;
  verifiedDate?: string;
}

export interface Campaign {
  id: number;
  name: string;
  description: string;
  createdBy: string;
  createdDate: string;
  startDate: string;
  deadline: string;
  status: CampaignStatus;
  totalEmployees: number;
  totalAssets: number;
  totalPeripherals: number;
  verifiedCount: number;
  pendingCount: number;
  overdueCount: number;
  exceptionCount: number;
  filtersJson?: string;
}

export interface VerificationRecord {
  id: number;
  employeeId: string;
  employeeName: string;
  assetId?: number;
  serviceTag: string;
  assetType: AssetType;
  status: VerificationStatus;
  uploadedImage?: string;
  recordedServiceTag?: string;
  peripheralsConfirmedJson?: string;
  peripheralsNotWithMeJson?: string;
  comment?: string;
  submittedDate?: string;
  reviewedBy?: string;
  exceptionType?: ExceptionType;
}

export interface EquipmentCount {
  id: number;
  category: EquipmentCategory;
  itemName: string;
  quantity: number;
  value: number;
  location: string;
  uploadedBy: string;
  uploadedDate: string;
  status: 'Active' | 'Archived';
  verificationStatus: VerificationStatus;
}

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<User> => {
    return fetchApi<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  logout: async (): Promise<void> => {
    return fetchApi<void>('/auth/logout', { method: 'POST' });
  },

  me: async (): Promise<User> => {
    return fetchApi<User>('/auth/me');
  },

  health: async (): Promise<{ ok: boolean; service: string }> => {
    return fetchApi('/auth/health');
  },

  register: async (data: {
    username: string;
    password: string;
    role: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    employeeId: string;
  }): Promise<User> => {
    return fetchApi<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Hardware Assets API
export const assetsApi = {
  getAll: async (): Promise<HardwareAsset[]> => {
    return fetchApi<HardwareAsset[]>('/assets');
  },

  getById: async (id: number): Promise<HardwareAsset> => {
    return fetchApi<HardwareAsset>(`/assets/${id}`);
  },

  getByServiceTag: async (serviceTag: string): Promise<HardwareAsset> => {
    return fetchApi<HardwareAsset>(`/assets/service-tag/${serviceTag}`);
  },

  getInstock: async (): Promise<HardwareAsset[]> => {
    return fetchApi<HardwareAsset[]>('/assets/instock');
  },

  getAssigned: async (): Promise<HardwareAsset[]> => {
    return fetchApi<HardwareAsset[]>('/assets/assigned');
  },

  getExceptions: async (): Promise<HardwareAsset[]> => {
    return fetchApi<HardwareAsset[]>('/assets/exceptions');
  },

  getByEmployee: async (employeeId: string): Promise<HardwareAsset[]> => {
    return fetchApi<HardwareAsset[]>(`/assets/employee/${employeeId}`);
  },

  getByType: async (assetType: AssetType): Promise<HardwareAsset[]> => {
    return fetchApi<HardwareAsset[]>(`/assets/type/${assetType}`);
  },

  getHighValue: async (): Promise<HardwareAsset[]> => {
    return fetchApi<HardwareAsset[]>('/assets/high-value');
  },

  getStats: async (): Promise<Record<string, number>> => {
    return fetchApi('/assets/stats');
  },

  create: async (asset: Partial<HardwareAsset>): Promise<HardwareAsset> => {
    return fetchApi<HardwareAsset>('/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  },

  update: async (id: number, asset: Partial<HardwareAsset>): Promise<HardwareAsset> => {
    return fetchApi<HardwareAsset>(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(asset),
    });
  },

  assign: async (id: number, employeeId: string, employeeName: string): Promise<HardwareAsset> => {
    return fetchApi<HardwareAsset>(`/assets/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ employeeId, employeeName }),
    });
  },

  verify: async (id: number, status: VerificationStatus, imageUrl?: string): Promise<HardwareAsset> => {
    return fetchApi<HardwareAsset>(`/assets/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ status, imageUrl }),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(`/assets/${id}`, { method: 'DELETE' });
  },
};

// Peripherals API
export const peripheralsApi = {
  getAll: async (): Promise<Peripheral[]> => {
    return fetchApi<Peripheral[]>('/peripherals');
  },

  getById: async (id: number): Promise<Peripheral> => {
    return fetchApi<Peripheral>(`/peripherals/${id}`);
  },

  getByEmployee: async (employeeId: string): Promise<Peripheral[]> => {
    return fetchApi<Peripheral[]>(`/peripherals/employee/${employeeId}`);
  },

  getByType: async (type: PeripheralType): Promise<Peripheral[]> => {
    return fetchApi<Peripheral[]>(`/peripherals/type/${type}`);
  },

  getVerified: async (): Promise<Peripheral[]> => {
    return fetchApi<Peripheral[]>('/peripherals/verified');
  },

  getUnverified: async (): Promise<Peripheral[]> => {
    return fetchApi<Peripheral[]>('/peripherals/unverified');
  },

  getStats: async (): Promise<Record<string, number>> => {
    return fetchApi('/peripherals/stats');
  },

  create: async (peripheral: Partial<Peripheral>): Promise<Peripheral> => {
    return fetchApi<Peripheral>('/peripherals', {
      method: 'POST',
      body: JSON.stringify(peripheral),
    });
  },

  update: async (id: number, peripheral: Partial<Peripheral>): Promise<Peripheral> => {
    return fetchApi<Peripheral>(`/peripherals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(peripheral),
    });
  },

  assign: async (
    type: PeripheralType,
    serialNumber: string | undefined,
    employeeId: string,
    employeeName: string
  ): Promise<Peripheral> => {
    return fetchApi<Peripheral>('/peripherals/assign', {
      method: 'POST',
      body: JSON.stringify({ type, serialNumber, employeeId, employeeName }),
    });
  },

  verify: async (id: number): Promise<Peripheral> => {
    return fetchApi<Peripheral>(`/peripherals/${id}/verify`, { method: 'POST' });
  },

  verifyMultiple: async (ids: number[]): Promise<Peripheral[]> => {
    return fetchApi<Peripheral[]>('/peripherals/verify-multiple', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(`/peripherals/${id}`, { method: 'DELETE' });
  },
};

// Campaigns API
export const campaignsApi = {
  getAll: async (): Promise<Campaign[]> => {
    return fetchApi<Campaign[]>('/campaigns');
  },

  getById: async (id: number): Promise<Campaign> => {
    return fetchApi<Campaign>(`/campaigns/${id}`);
  },

  getActive: async (): Promise<Campaign[]> => {
    return fetchApi<Campaign[]>('/campaigns/active');
  },

  getByStatus: async (status: CampaignStatus): Promise<Campaign[]> => {
    return fetchApi<Campaign[]>(`/campaigns/status/${status}`);
  },

  getByCreatedBy: async (userId: string): Promise<Campaign[]> => {
    return fetchApi<Campaign[]>(`/campaigns/created-by/${userId}`);
  },

  getStats: async (): Promise<Record<string, number>> => {
    return fetchApi('/campaigns/stats');
  },

  create: async (campaign: {
    name: string;
    description: string;
    createdBy: string;
    startDate: string;
    deadline: string;
    totalEmployees: number;
    totalAssets: number;
    totalPeripherals: number;
    filtersJson?: string;
  }): Promise<Campaign> => {
    return fetchApi<Campaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  },

  update: async (id: number, campaign: Partial<Campaign>): Promise<Campaign> => {
    return fetchApi<Campaign>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaign),
    });
  },

  launch: async (id: number): Promise<Campaign> => {
    return fetchApi<Campaign>(`/campaigns/${id}/launch`, { method: 'POST' });
  },

  complete: async (id: number): Promise<Campaign> => {
    return fetchApi<Campaign>(`/campaigns/${id}/complete`, { method: 'POST' });
  },

  updateCounts: async (id: number): Promise<Campaign> => {
    return fetchApi<Campaign>(`/campaigns/${id}/update-counts`, { method: 'POST' });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(`/campaigns/${id}`, { method: 'DELETE' });
  },
};

// Verifications API
export const verificationsApi = {
  getAll: async (): Promise<VerificationRecord[]> => {
    return fetchApi<VerificationRecord[]>('/verifications');
  },

  getById: async (id: number): Promise<VerificationRecord> => {
    return fetchApi<VerificationRecord>(`/verifications/${id}`);
  },

  getByCampaign: async (campaignId: number): Promise<VerificationRecord[]> => {
    return fetchApi<VerificationRecord[]>(`/verifications/campaign/${campaignId}`);
  },

  getByEmployee: async (employeeId: string): Promise<VerificationRecord[]> => {
    return fetchApi<VerificationRecord[]>(`/verifications/employee/${employeeId}`);
  },

  getPending: async (): Promise<VerificationRecord[]> => {
    return fetchApi<VerificationRecord[]>('/verifications/pending');
  },

  getExceptions: async (): Promise<VerificationRecord[]> => {
    return fetchApi<VerificationRecord[]>('/verifications/exceptions');
  },

  getByStatus: async (status: VerificationStatus): Promise<VerificationRecord[]> => {
    return fetchApi<VerificationRecord[]>(`/verifications/status/${status}`);
  },

  getStats: async (): Promise<Record<string, number>> => {
    return fetchApi('/verifications/stats');
  },

  create: async (record: Partial<VerificationRecord>): Promise<VerificationRecord> => {
    return fetchApi<VerificationRecord>('/verifications', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  },

  createForCampaign: async (data: {
    campaignId: number;
    employeeId: string;
    employeeName: string;
    assetId: number;
    serviceTag: string;
    assetType: AssetType;
  }): Promise<VerificationRecord> => {
    return fetchApi<VerificationRecord>('/verifications/campaign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submit: async (
    id: number,
    data: {
      recordedServiceTag: string;
      imageUrl?: string;
      peripheralsConfirmedJson?: string;
      peripheralsNotWithMeJson?: string;
      comment?: string;
    }
  ): Promise<VerificationRecord> => {
    return fetchApi<VerificationRecord>(`/verifications/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  review: async (
    id: number,
    reviewedBy: string,
    status: VerificationStatus,
    exceptionType?: ExceptionType
  ): Promise<VerificationRecord> => {
    return fetchApi<VerificationRecord>(`/verifications/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ reviewedBy, status, exceptionType }),
    });
  },

  markException: async (
    id: number,
    exceptionType: ExceptionType,
    comment?: string
  ): Promise<VerificationRecord> => {
    return fetchApi<VerificationRecord>(`/verifications/${id}/exception`, {
      method: 'POST',
      body: JSON.stringify({ exceptionType, comment }),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(`/verifications/${id}`, { method: 'DELETE' });
  },
};

// Equipment API
export const equipmentApi = {
  getAll: async (): Promise<EquipmentCount[]> => {
    return fetchApi<EquipmentCount[]>('/equipment');
  },

  getById: async (id: number): Promise<EquipmentCount> => {
    return fetchApi<EquipmentCount>(`/equipment/${id}`);
  },

  getByCategory: async (category: EquipmentCategory): Promise<EquipmentCount[]> => {
    return fetchApi<EquipmentCount[]>(`/equipment/category/${category}`);
  },

  getNetwork: async (): Promise<EquipmentCount[]> => {
    return fetchApi<EquipmentCount[]>('/equipment/network');
  },

  getServers: async (): Promise<EquipmentCount[]> => {
    return fetchApi<EquipmentCount[]>('/equipment/servers');
  },

  getAudioVideo: async (): Promise<EquipmentCount[]> => {
    return fetchApi<EquipmentCount[]>('/equipment/audio-video');
  },

  getFurniture: async (): Promise<EquipmentCount[]> => {
    return fetchApi<EquipmentCount[]>('/equipment/furniture');
  },

  getOther: async (): Promise<EquipmentCount[]> => {
    return fetchApi<EquipmentCount[]>('/equipment/other');
  },

  getByUploadedBy: async (employeeId: string): Promise<EquipmentCount[]> => {
    return fetchApi<EquipmentCount[]>(`/equipment/uploaded-by/${employeeId}`);
  },

  getByLocation: async (location: string): Promise<EquipmentCount[]> => {
    return fetchApi<EquipmentCount[]>(`/equipment/location/${location}`);
  },

  getStats: async (): Promise<Record<string, number>> => {
    return fetchApi('/equipment/stats');
  },

  create: async (equipment: {
    category: EquipmentCategory;
    itemName: string;
    quantity: number;
    value: number;
    location: string;
    uploadedBy: string;
  }): Promise<EquipmentCount> => {
    return fetchApi<EquipmentCount>('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipment),
    });
  },

  update: async (id: number, equipment: Partial<EquipmentCount>): Promise<EquipmentCount> => {
    return fetchApi<EquipmentCount>(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipment),
    });
  },

  verify: async (id: number, status: VerificationStatus): Promise<EquipmentCount> => {
    return fetchApi<EquipmentCount>(`/equipment/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  archive: async (id: number): Promise<EquipmentCount> => {
    return fetchApi<EquipmentCount>(`/equipment/${id}/archive`, { method: 'POST' });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(`/equipment/${id}`, { method: 'DELETE' });
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    return fetchApi<User[]>('/users');
  },

  getById: async (id: number): Promise<User> => {
    return fetchApi<User>(`/users/${id}`);
  },

  getByUsername: async (username: string): Promise<User> => {
    return fetchApi<User>(`/users/username/${username}`);
  },

  getByRole: async (role: string): Promise<User> => {
    return fetchApi<User>(`/users/role/${role}`);
  },

  getByEmployeeId: async (employeeId: string): Promise<User> => {
    return fetchApi<User>(`/users/employee/${employeeId}`);
  },

  getByDepartment: async (department: string): Promise<User[]> => {
    return fetchApi<User[]>(`/users/department/${encodeURIComponent(department)}`);
  },

  getByDepartments: async (departments: string[]): Promise<User[]> => {
    return fetchApi<User[]>('/users/by-departments', {
      method: 'POST',
      body: JSON.stringify(departments),
    });
  },

  getAllDepartments: async (): Promise<string[]> => {
    return fetchApi<string[]>('/users/departments');
  },
};

// Public Verification API (for employee verification via email link)
export interface VerificationData {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  campaignId: number;
  campaignName: string;
  deadline: string | null;
  assets: Array<{
    id: number;
    serviceTag: string;
    assetType: AssetType;
    model: string;
    verificationStatus: VerificationStatus;
    peripherals: string[];
  }>;
  allPeripherals: string[];
  expiresAt: string;
}

export const publicVerificationApi = {
  // Get verification data by token (from email link)
  getByToken: async (token: string): Promise<VerificationData> => {
    return fetchApi<VerificationData>(`/public/verify/${token}`);
  },

  // Submit verification for a single asset
  submitAsset: async (token: string, data: {
    assetId: number;
    recordedServiceTag: string;
    uploadedImage: string;
    peripheralsConfirmed: string[];
    peripheralsNotWithMe: string[];
    comment?: string;
  }): Promise<{ 
    message: string; 
    status: VerificationStatus; 
    recordId: number;
    ocrEnabled?: boolean;
    extractedServiceTag?: string;
    ocrMatch?: boolean;
    ocrMessage?: string;
  }> => {
    return fetchApi(`/public/verify/${token}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Extract service tag from image using OCR
  extractServiceTag: async (imageData: string, expectedTag?: string): Promise<{
    ocrEnabled: boolean;
    extractedTag?: string;
    expectedTag?: string;
    matches?: boolean;
    found?: boolean;
    message: string;
  }> => {
    return fetchApi('/public/verify/ocr/extract', {
      method: 'POST',
      body: JSON.stringify({ imageData, expectedTag }),
    });
  },

  // Complete all verifications (marks token as used)
  complete: async (token: string): Promise<{ message: string; submittedAt: string }> => {
    return fetchApi(`/public/verify/${token}/complete`, {
      method: 'POST',
    });
  },

  // Upload image (returns URL)
  uploadImage: async (file: File, assetId?: string): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (assetId) {
      formData.append('assetId', assetId);
    }
    
    const response = await fetch(`${API_BASE_URL}/public/upload/image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message);
    }
    
    return response.json();
  },

  // Upload base64 image
  uploadImageBase64: async (imageData: string, assetId?: string): Promise<{ url: string; filename: string }> => {
    return fetchApi('/public/upload/image-base64', {
      method: 'POST',
      body: JSON.stringify({ imageData, assetId }),
    });
  },
};

// Export all APIs as a single object for convenience
export const api = {
  auth: authApi,
  assets: assetsApi,
  peripherals: peripheralsApi,
  campaigns: campaignsApi,
  verifications: verificationsApi,
  equipment: equipmentApi,
  users: usersApi,
  publicVerification: publicVerificationApi,
};

export default api;
