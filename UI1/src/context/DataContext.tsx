import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  api, 
  HardwareAsset, 
  Peripheral, 
  Campaign, 
  VerificationRecord, 
  EquipmentCount,
  User
} from '../services/api';
import { 
  mockHardwareAssets, 
  mockPeripherals, 
  mockCampaigns, 
  mockVerificationRecords, 
  mockEquipmentCounts,
  mockUsers,
  HardwareAsset as MockHardwareAsset,
  Peripheral as MockPeripheral,
  VerificationCampaign,
  VerificationRecord as MockVerificationRecord,
  EquipmentCount as MockEquipmentCount,
  User as MockUser
} from '../data/mockData';

interface DataContextType {
  // Data
  assets: HardwareAsset[] | MockHardwareAsset[];
  peripherals: Peripheral[] | MockPeripheral[];
  campaigns: Campaign[] | VerificationCampaign[];
  verificationRecords: VerificationRecord[] | MockVerificationRecord[];
  equipment: EquipmentCount[] | MockEquipmentCount[];
  users: User[] | MockUser[];
  
  // Stats
  assetStats: Record<string, number>;
  peripheralStats: Record<string, number>;
  equipmentStats: Record<string, number>;
  verificationStats: Record<string, number>;
  
  // State
  loading: boolean;
  error: Error | null;
  isBackendConnected: boolean;
  
  // Actions
  refetchAll: () => Promise<void>;
  checkBackendHealth: () => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Data states
  const [assets, setAssets] = useState<HardwareAsset[] | MockHardwareAsset[]>([]);
  const [peripherals, setPeripherals] = useState<Peripheral[] | MockPeripheral[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[] | VerificationCampaign[]>([]);
  const [verificationRecords, setVerificationRecords] = useState<VerificationRecord[] | MockVerificationRecord[]>([]);
  const [equipment, setEquipment] = useState<EquipmentCount[] | MockEquipmentCount[]>([]);
  const [users, setUsers] = useState<User[] | MockUser[]>([]);
  
  // Stats states
  const [assetStats, setAssetStats] = useState<Record<string, number>>({});
  const [peripheralStats, setPeripheralStats] = useState<Record<string, number>>({});
  const [equipmentStats, setEquipmentStats] = useState<Record<string, number>>({});
  const [verificationStats, setVerificationStats] = useState<Record<string, number>>({});

  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    try {
      const health = await api.auth.health();
      setIsBackendConnected(health.ok === true);
      return health.ok === true;
    } catch {
      setIsBackendConnected(false);
      return false;
    }
  }, []);

  const loadMockData = useCallback(() => {
    setAssets(mockHardwareAssets);
    setPeripherals(mockPeripherals);
    setCampaigns(mockCampaigns);
    setVerificationRecords(mockVerificationRecords);
    setEquipment(mockEquipmentCounts);
    setUsers(mockUsers);
    
    // Calculate mock stats
    const instockAssets = mockHardwareAssets.filter(a => a.status === 'Instock');
    const assignedAssets = mockHardwareAssets.filter(a => a.status === 'Assigned');
    
    setAssetStats({
      total: mockHardwareAssets.length,
      instock: instockAssets.length,
      assigned: assignedAssets.length,
      verified: mockHardwareAssets.filter(a => a.verificationStatus === 'Verified').length,
      pending: mockHardwareAssets.filter(a => a.verificationStatus === 'Pending').length,
      overdue: mockHardwareAssets.filter(a => a.verificationStatus === 'Overdue').length,
      exception: mockHardwareAssets.filter(a => a.verificationStatus === 'Exception').length,
    });
    
    setPeripheralStats({
      total: mockPeripherals.length,
      verified: mockPeripherals.filter(p => p.verified).length,
      unverified: mockPeripherals.filter(p => !p.verified).length,
    });
    
    setEquipmentStats({
      networkCount: mockEquipmentCounts.filter(e => e.category === 'network').reduce((sum, e) => sum + e.quantity, 0),
      serverCount: mockEquipmentCounts.filter(e => e.category === 'servers').reduce((sum, e) => sum + e.quantity, 0),
      audioVideoCount: mockEquipmentCounts.filter(e => e.category === 'audioVideo').reduce((sum, e) => sum + e.quantity, 0),
      furnitureCount: mockEquipmentCounts.filter(e => e.category === 'furniture').reduce((sum, e) => sum + e.quantity, 0),
      otherCount: mockEquipmentCounts.filter(e => e.category === 'other').reduce((sum, e) => sum + e.quantity, 0),
    });
    
    setVerificationStats({
      total: mockVerificationRecords.length,
      verified: mockVerificationRecords.filter(r => r.status === 'Verified').length,
      pending: mockVerificationRecords.filter(r => r.status === 'Pending').length,
      overdue: mockVerificationRecords.filter(r => r.status === 'Overdue').length,
      exception: mockVerificationRecords.filter(r => r.status === 'Exception').length,
    });
  }, []);

  const fetchBackendData = useCallback(async () => {
    try {
      const [
        assetsData,
        peripheralsData,
        campaignsData,
        verificationsData,
        equipmentData,
        usersData,
        assetStatsData,
        peripheralStatsData,
        equipmentStatsData,
        verificationStatsData,
      ] = await Promise.all([
        api.assets.getAll(),
        api.peripherals.getAll(),
        api.campaigns.getAll(),
        api.verifications.getAll(),
        api.equipment.getAll(),
        api.users.getAll(),
        api.assets.getStats(),
        api.peripherals.getStats(),
        api.equipment.getStats(),
        api.verifications.getStats(),
      ]);
      
      setAssets(assetsData);
      setPeripherals(peripheralsData);
      setCampaigns(campaignsData);
      setVerificationRecords(verificationsData);
      setEquipment(equipmentData);
      setUsers(usersData);
      setAssetStats(assetStatsData);
      setPeripheralStats(peripheralStatsData);
      setEquipmentStats(equipmentStatsData);
      setVerificationStats(verificationStatsData);
    } catch (err) {
      throw err;
    }
  }, []);

  const refetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const backendAvailable = await checkBackendHealth();
      
      if (backendAvailable) {
        await fetchBackendData();
      } else {
        loadMockData();
      }
    } catch (err) {
      console.warn('Failed to fetch from backend, using mock data:', err);
      loadMockData();
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [checkBackendHealth, fetchBackendData, loadMockData]);

  // Initial data load
  useEffect(() => {
    refetchAll();
  }, []);

  const value: DataContextType = {
    assets,
    peripherals,
    campaigns,
    verificationRecords,
    equipment,
    users,
    assetStats,
    peripheralStats,
    equipmentStats,
    verificationStats,
    loading,
    error,
    isBackendConnected,
    refetchAll,
    checkBackendHealth,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Convenience hooks for specific data
export function useAssets() {
  const { assets, assetStats, loading, error, refetchAll } = useData();
  return { assets, stats: assetStats, loading, error, refetch: refetchAll };
}

export function usePeripheralsData() {
  const { peripherals, peripheralStats, loading, error, refetchAll } = useData();
  return { peripherals, stats: peripheralStats, loading, error, refetch: refetchAll };
}

export function useCampaignsData() {
  const { campaigns, loading, error, refetchAll } = useData();
  return { campaigns, loading, error, refetch: refetchAll };
}

export function useEquipmentData() {
  const { equipment, equipmentStats, loading, error, refetchAll } = useData();
  return { equipment, stats: equipmentStats, loading, error, refetch: refetchAll };
}

export function useVerificationsData() {
  const { verificationRecords, verificationStats, loading, error, refetchAll } = useData();
  return { verificationRecords, stats: verificationStats, loading, error, refetch: refetchAll };
}
