import { useState, useEffect, useCallback } from 'react';
import { 
  api, 
  HardwareAsset, 
  Peripheral, 
  Campaign, 
  VerificationRecord, 
  EquipmentCount,
  User
} from '../services/api';

// Generic hook for fetching data
function useApiData<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch, setData };
}

// Hardware Assets Hooks
export function useHardwareAssets() {
  return useApiData(() => api.assets.getAll(), []);
}

export function useInstockAssets() {
  return useApiData(() => api.assets.getInstock(), []);
}

export function useAssignedAssets() {
  return useApiData(() => api.assets.getAssigned(), []);
}

export function useExceptionAssets() {
  return useApiData(() => api.assets.getExceptions(), []);
}

export function useEmployeeAssets(employeeId: string) {
  return useApiData(() => api.assets.getByEmployee(employeeId), [employeeId]);
}

export function useAssetStats() {
  return useApiData(() => api.assets.getStats(), []);
}

// Peripherals Hooks
export function usePeripherals() {
  return useApiData(() => api.peripherals.getAll(), []);
}

export function useEmployeePeripherals(employeeId: string) {
  return useApiData(() => api.peripherals.getByEmployee(employeeId), [employeeId]);
}

export function usePeripheralStats() {
  return useApiData(() => api.peripherals.getStats(), []);
}

// Campaigns Hooks
export function useCampaigns() {
  return useApiData(() => api.campaigns.getAll(), []);
}

export function useActiveCampaigns() {
  return useApiData(() => api.campaigns.getActive(), []);
}

export function useCampaignStats() {
  return useApiData(() => api.campaigns.getStats(), []);
}

// Verifications Hooks
export function useVerifications() {
  return useApiData(() => api.verifications.getAll(), []);
}

export function usePendingVerifications() {
  return useApiData(() => api.verifications.getPending(), []);
}

export function useExceptionVerifications() {
  return useApiData(() => api.verifications.getExceptions(), []);
}

export function useVerificationStats() {
  return useApiData(() => api.verifications.getStats(), []);
}

// Equipment Hooks
export function useEquipment() {
  return useApiData(() => api.equipment.getAll(), []);
}

export function useNetworkEquipment() {
  return useApiData(() => api.equipment.getNetwork(), []);
}

export function useServers() {
  return useApiData(() => api.equipment.getServers(), []);
}

export function useAudioVideoEquipment() {
  return useApiData(() => api.equipment.getAudioVideo(), []);
}

export function useFurniture() {
  return useApiData(() => api.equipment.getFurniture(), []);
}

export function useEquipmentStats() {
  return useApiData(() => api.equipment.getStats(), []);
}

// Users Hooks
export function useUsers() {
  return useApiData(() => api.users.getAll(), []);
}

// Combined dashboard data hook
export function useDashboardData() {
  const assets = useHardwareAssets();
  const peripherals = usePeripherals();
  const campaigns = useCampaigns();
  const equipment = useEquipment();
  const assetStats = useAssetStats();
  const equipmentStats = useEquipmentStats();

  const loading = 
    assets.loading || 
    peripherals.loading || 
    campaigns.loading || 
    equipment.loading ||
    assetStats.loading ||
    equipmentStats.loading;

  const error = 
    assets.error || 
    peripherals.error || 
    campaigns.error || 
    equipment.error ||
    assetStats.error ||
    equipmentStats.error;

  const refetchAll = useCallback(async () => {
    await Promise.all([
      assets.refetch(),
      peripherals.refetch(),
      campaigns.refetch(),
      equipment.refetch(),
      assetStats.refetch(),
      equipmentStats.refetch(),
    ]);
  }, [assets, peripherals, campaigns, equipment, assetStats, equipmentStats]);

  return {
    assets: assets.data || [],
    peripherals: peripherals.data || [],
    campaigns: campaigns.data || [],
    equipment: equipment.data || [],
    assetStats: assetStats.data || {},
    equipmentStats: equipmentStats.data || {},
    loading,
    error,
    refetchAll,
  };
}

// Asset Manager specific data
export function useAssetManagerData() {
  const instockAssets = useInstockAssets();
  const assignedAssets = useAssignedAssets();
  const exceptionAssets = useExceptionAssets();
  const peripherals = usePeripherals();
  const assetStats = useAssetStats();

  const loading = 
    instockAssets.loading || 
    assignedAssets.loading || 
    exceptionAssets.loading ||
    peripherals.loading ||
    assetStats.loading;

  const error = 
    instockAssets.error || 
    assignedAssets.error || 
    exceptionAssets.error ||
    peripherals.error ||
    assetStats.error;

  return {
    instockAssets: instockAssets.data || [],
    assignedAssets: assignedAssets.data || [],
    exceptionAssets: exceptionAssets.data || [],
    peripherals: peripherals.data || [],
    stats: assetStats.data || {},
    loading,
    error,
    refetch: {
      instock: instockAssets.refetch,
      assigned: assignedAssets.refetch,
      exceptions: exceptionAssets.refetch,
      peripherals: peripherals.refetch,
      stats: assetStats.refetch,
    },
  };
}

// Finance Dashboard specific data
export function useFinanceDashboardData() {
  const campaigns = useCampaigns();
  const assets = useHardwareAssets();
  const equipment = useEquipment();
  const assetStats = useAssetStats();
  const equipmentStats = useEquipmentStats();
  const verificationStats = useVerificationStats();

  const loading = 
    campaigns.loading || 
    assets.loading || 
    equipment.loading ||
    assetStats.loading ||
    equipmentStats.loading ||
    verificationStats.loading;

  const error = 
    campaigns.error || 
    assets.error || 
    equipment.error ||
    assetStats.error ||
    equipmentStats.error ||
    verificationStats.error;

  return {
    campaigns: campaigns.data || [],
    assets: assets.data || [],
    equipment: equipment.data || [],
    assetStats: assetStats.data || {},
    equipmentStats: equipmentStats.data || {},
    verificationStats: verificationStats.data || {},
    loading,
    error,
  };
}
