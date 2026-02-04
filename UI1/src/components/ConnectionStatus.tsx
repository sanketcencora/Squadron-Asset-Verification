import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Database, Server } from 'lucide-react';
import { useData } from '../context/DataContext';
import { API_BASE_URL } from '../services/api';

export function ConnectionStatus() {
  const { isBackendConnected, loading, refetchAll, checkBackendHealth } = useData();
  const [isChecking, setIsChecking] = useState(false);

  const handleRefresh = async () => {
    setIsChecking(true);
    await checkBackendHealth();
    await refetchAll();
    setIsChecking(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleRefresh}
        disabled={isChecking || loading}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
        title="Refresh data"
      >
        <RefreshCw 
          className={`w-4 h-4 text-gray-500 ${(isChecking || loading) ? 'animate-spin' : ''}`} 
        />
      </button>
      
      <div 
        className={`flex items-center space-x-1.5 px-2 py-1 rounded-full text-xs font-medium ${
          isBackendConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}
        title={isBackendConnected ? 'Connected to backend' : 'Using mock data'}
      >
        {isBackendConnected ? (
          <>
            <Server className="w-3 h-3" />
            <span>Backend</span>
          </>
        ) : (
          <>
            <Database className="w-3 h-3" />
            <span>Mock Data</span>
          </>
        )}
      </div>
    </div>
  );
}

export function ConnectionBanner() {
  const { isBackendConnected, error } = useData();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || isBackendConnected) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 text-yellow-600" />
        <p className="text-sm text-yellow-800">
          Backend not connected. Using mock data. Start the backend server at{' '}
          <code className="bg-yellow-100 px-1 rounded">{API_BASE_URL.replace(/\/api\/?$/, '')}</code> to connect.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
      >
        Dismiss
      </button>
    </div>
  );
}
