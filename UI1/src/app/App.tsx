import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import { LoginPage } from '@/pages/LoginPage';
import { FinanceDashboard } from '@/pages/FinanceDashboard';
import { AssetManagerDashboard } from '@/pages/AssetManagerDashboard';
import { EmployeeVerificationPage } from '@/pages/EmployeeVerificationPage';
import { CreateCampaignFlow } from '@/pages/CreateCampaignFlow';
import { AssignPeripheralsFlow } from '@/pages/AssignPeripheralsFlow';
import { VerificationReviewPage } from '@/pages/VerificationReviewPage';
import { NetworkEquipmentDashboard } from '@/pages/NetworkEquipmentDashboard';
import { AudioVideoDashboard } from '@/pages/AudioVideoDashboard';
import { FurnitureDashboard } from '@/pages/FurnitureDashboard';
import { CampaignsPage } from '@/pages/CampaignsPage';
import { Navigation } from '@/components/Navigation';
import { UserRole, mockUsers } from '@/data/mockData';
import { api } from '@/services/api';

// Auth Context
interface AuthContextType {
  isLoggedIn: boolean;
  currentRole: UserRole | null;
  currentUserId: string | null;
  currentUser: typeof mockUsers[0] | null;
  login: (role: UserRole, userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Auth Provider Component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    return sessionStorage.getItem('currentRole') as UserRole | null;
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return sessionStorage.getItem('currentUserId');
  });
  const [currentUserName, setCurrentUserName] = useState<string | null>(() => {
    return sessionStorage.getItem('currentUserName');
  });

  // Try to find user from mock data, or create a minimal user object from stored data
  const currentUser = mockUsers.find(u => u.id === currentUserId) || 
    (currentUserId && currentRole && currentUserName ? {
      id: currentUserId,
      name: currentUserName,
      email: sessionStorage.getItem('currentUserEmail') || '',
      role: currentRole,
      department: sessionStorage.getItem('currentUserDepartment') || '',
      verificationStatus: 'Pending' as const,
      location: 'Pune',
      team: sessionStorage.getItem('currentUserDepartment') || '',
      employeeId: currentUserId,
      lastVerifiedDate: null,
      assignedAssets: []
    } : null);

  const login = (role: UserRole, userId: string) => {
    setCurrentRole(role);
    setCurrentUserId(userId);
    setIsLoggedIn(true);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('currentRole', role);
    sessionStorage.setItem('currentUserId', userId);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentRole(null);
    setCurrentUserId(null);
    setCurrentUserName(null);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentRole');
    sessionStorage.removeItem('currentUserId');
    sessionStorage.removeItem('currentUserName');
    sessionStorage.removeItem('currentUserEmail');
    sessionStorage.removeItem('currentUserDepartment');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentRole, currentUserId, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: UserRole[] }) {
  const { isLoggedIn, currentRole } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && currentRole && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Layout Component with Navigation
function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentRole, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Map pathname to page ID for Navigation component
  const getPageFromPath = (pathname: string): string => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/campaigns': 'campaigns',
      '/reports': 'reports',
      '/verification-review': 'verification-review',
      '/assets': 'assets',
    };
    return pathMap[pathname] || 'dashboard';
  };

  const handleNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      'dashboard': '/dashboard',
      'campaigns': '/campaigns',
      'reports': '/reports',
      'verification-review': '/verification-review',
      'assets': '/assets',
    };
    navigate(routeMap[page] || '/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentRole || !currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        role={currentRole}
        currentPage={getPageFromPath(location.pathname)}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={currentUser.name}
      />
      <div className="pt-16 pl-64">
        {children}
      </div>
    </div>
  );
}

// Login Page Wrapper
function LoginPageWrapper() {
  const { isLoggedIn, currentRole, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && currentRole) {
      if (currentRole === 'employee') {
        navigate('/verification');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isLoggedIn, currentRole, navigate]);

  const handleLogin = (role: UserRole, userId: string) => {
    login(role, userId);
    if (role === 'employee') {
      navigate('/verification');
    } else {
      navigate('/dashboard');
    }
  };

  return <LoginPage onLogin={handleLogin} />;
}

// Finance Dashboard Page
function FinanceDashboardPage() {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <FinanceDashboard
        onCreateCampaign={() => setShowCreateCampaign(true)}
        onViewReports={() => navigate('/reports')}
      />
      {showCreateCampaign && (
        <CreateCampaignFlow
          onClose={() => setShowCreateCampaign(false)}
          onComplete={() => {
            setShowCreateCampaign(false);
            navigate('/campaigns');
          }}
        />
      )}
    </>
  );
}

// Campaigns Page Wrapper
function CampaignsPageWrapper() {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CampaignsPage
        key={refreshKey}
        onCreateCampaign={() => setShowCreateCampaign(true)}
      />
      {showCreateCampaign && (
        <CreateCampaignFlow
          onClose={() => setShowCreateCampaign(false)}
          onComplete={() => {
            setShowCreateCampaign(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </>
  );
}

// Reports Page
function ReportsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const downloadCSV = (data: any[], filename: string) => {
    // Convert data to CSV
    if (data.length === 0) {
      alert('No data available to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = value?.toString() || '';
          return stringValue.includes(',') || stringValue.includes('"') 
            ? `"${stringValue.replace(/"/g, '""')}"` 
            : stringValue;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAssetReconciliation = async () => {
    setLoading(true);
    try {
      // Fetch assets from backend
      const assets = await api.assets.getAll();
      
      // Format data for reconciliation report
      const reportData = assets.map(asset => ({
        'Service Tag': asset.serviceTag,
        'Asset Type': asset.assetType,
        'Model': asset.model,
        'Invoice Number': asset.invoiceNumber,
        'PO Number': asset.poNumber,
        'Cost': asset.cost,
        'Purchase Date': asset.purchaseDate,
        'Assigned To': asset.assignedToName || 'Unassigned',
        'Employee ID': asset.assignedTo || 'N/A',
        'Status': asset.status,
        'Verification Status': asset.verificationStatus,
        'Last Verified': asset.lastVerifiedDate || 'Never',
        'Location': asset.location || 'N/A',
        'Team': asset.team || 'N/A',
        'High Value': asset.isHighValue ? 'Yes' : 'No'
      }));

      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(reportData, `Asset_Reconciliation_Report_${timestamp}.csv`);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationStatus = async () => {
    setLoading(true);
    try {
      // Fetch verification records and campaigns
      const [verifications, campaigns, stats] = await Promise.all([
        api.verifications.getAll(),
        api.campaigns.getAll(),
        api.verifications.getStats()
      ]);

      // Format data for verification status report
      const reportData = verifications.map(record => ({
        'Employee ID': record.employeeId,
        'Employee Name': record.employeeName,
        'Service Tag': record.serviceTag,
        'Asset Type': record.assetType,
        'Status': record.status,
        'Submitted Date': record.submittedDate || 'Not Submitted',
        'Recorded Service Tag': record.recordedServiceTag || 'N/A',
        'Reviewed By': record.reviewedBy || 'N/A',
        'Exception Type': record.exceptionType || 'N/A',
        'Comment': record.comment || 'N/A'
      }));

      // Add summary row
      reportData.unshift({
        'Employee ID': 'SUMMARY',
        'Employee Name': `Total: ${stats.total || 0}, Verified: ${stats.verified || 0}, Pending: ${stats.pending || 0}, Overdue: ${stats.overdue || 0}`,
        'Service Tag': '',
        'Asset Type': '',
        'Status': '',
        'Submitted Date': '',
        'Recorded Service Tag': '',
        'Reviewed By': '',
        'Exception Type': '',
        'Comment': ''
      });

      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(reportData, `Verification_Status_Report_${timestamp}.csv`);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleExceptionSummary = async () => {
    setLoading(true);
    try {
      // Fetch exceptions from verification records
      const verifications = await api.verifications.getExceptions();

      // Format data for exception summary report
      const reportData = verifications.map(record => ({
        'Employee ID': record.employeeId,
        'Employee Name': record.employeeName,
        'Service Tag': record.serviceTag,
        'Asset Type': record.assetType,
        'Exception Type': record.exceptionType || 'Unknown',
        'Recorded Service Tag': record.recordedServiceTag || 'N/A',
        'Status': record.status,
        'Submitted Date': record.submittedDate || 'N/A',
        'Reviewed By': record.reviewedBy || 'Pending Review',
        'Comment': record.comment || 'No comment',
        'Image Uploaded': record.uploadedImage ? 'Yes' : 'No'
      }));

      if (reportData.length === 0) {
        alert('No exceptions found to export');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(reportData, `Exception_Summary_Report_${timestamp}.csv`);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Audit Reports</h1>
      <p className="text-gray-600">Generate and export compliance reports</p>
      {loading && (
        <div className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          Generating report...
        </div>
      )}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={handleAssetReconciliation}
          disabled={loading}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Asset Reconciliation Report</h3>
          <p className="text-sm text-gray-600">Compare SAP GL data with verified assets</p>
        </button>
        <button 
          onClick={handleVerificationStatus}
          disabled={loading}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Verification Status Report</h3>
          <p className="text-sm text-gray-600">Campaign completion and compliance rates</p>
        </button>
        <button 
          onClick={handleExceptionSummary}
          disabled={loading}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Exception Summary Report</h3>
          <p className="text-sm text-gray-600">All mismatches and missing devices</p>
        </button>
      </div>
    </div>
  );
}

// Asset Manager Dashboard Page
function AssetManagerDashboardPage() {
  const [showAssignPeripherals, setShowAssignPeripherals] = useState(false);

  return (
    <>
      <AssetManagerDashboard onAssignAsset={() => setShowAssignPeripherals(true)} />
      {showAssignPeripherals && (
        <AssignPeripheralsFlow
          onClose={() => setShowAssignPeripherals(false)}
          onComplete={() => {
            setShowAssignPeripherals(false);
            alert('Asset and peripherals assigned successfully! Assignment recorded in audit trail.');
          }}
        />
      )}
    </>
  );
}

// Equipment Manager Dashboard
function EquipmentManagerDashboard() {
  const { currentRole, currentUserId } = useAuth();
  
  return (
    <>
      {currentRole === 'networkEquipment' && (
        <NetworkEquipmentDashboard userId={currentUserId || ''} />
      )}
      {currentRole === 'audioVideo' && (
        <AudioVideoDashboard userId={currentUserId || ''} />
      )}
      {currentRole === 'furniture' && (
        <FurnitureDashboard userId={currentUserId || ''} />
      )}
    </>
  );
}

// Equipment Manager Reports Page
function EquipmentReportsPage() {
  const navigate = useNavigate();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Power BI Reports</h1>
      <p className="text-gray-600 mb-6">Access monthly and annual audit reports</p>
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Power BI reports are integrated in the main dashboard view.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

// Employee Verification Page Wrapper
function EmployeeVerificationWrapper() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <EmployeeVerificationPage
      onSubmit={() => {
        alert('Thank you for completing your verification!');
        logout();
        navigate('/login');
      }}
    />
  );
}

// Dynamic Dashboard based on role
function DashboardRouter() {
  const { currentRole } = useAuth();
  
  if (currentRole === 'finance') {
    return <FinanceDashboardPage />;
  }
  if (currentRole === 'assetManager') {
    return <AssetManagerDashboardPage />;
  }
  if (currentRole === 'networkEquipment' || currentRole === 'audioVideo' || currentRole === 'furniture') {
    return <EquipmentManagerDashboard />;
  }
  
  return <Navigate to="/login" replace />;
}

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPageWrapper />} />
          
          {/* Employee Verification (no navigation layout) */}
          <Route
            path="/verification"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeVerificationWrapper />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes with Navigation Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardRouter />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute allowedRoles={['finance']}>
                <AppLayout>
                  <CampaignsPageWrapper />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['finance', 'networkEquipment', 'audioVideo', 'furniture']}>
                <AppLayout>
                  <ReportsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/verification-review"
            element={
              <ProtectedRoute allowedRoles={['finance', 'assetManager']}>
                <AppLayout>
                  <VerificationReviewPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/assets"
            element={
              <ProtectedRoute allowedRoles={['assetManager']}>
                <AppLayout>
                  <AssetManagerDashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}