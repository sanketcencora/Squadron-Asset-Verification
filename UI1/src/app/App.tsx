import { useState } from 'react';
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
import { Navigation } from '@/components/Navigation';
import { UserRole, mockUsers } from '@/data/mockData';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showAssignPeripherals, setShowAssignPeripherals] = useState(false);

  const handleLogin = (role: UserRole, userId: string) => {
    setCurrentRole(role);
    setCurrentUserId(userId);
    setIsLoggedIn(true);
    
    // Route to appropriate initial page based on role
    if (role === 'employee') {
      setCurrentPage('verification');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentRole(null);
    setCurrentUserId(null);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const currentUser = mockUsers.find(u => u.id === currentUserId);

  // Login screen
  if (!isLoggedIn || !currentRole || !currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Employee verification flow (no internal navigation)
  if (currentRole === 'employee') {
    return (
      <EmployeeVerificationPage
        onSubmit={() => {
          alert('Thank you for completing your verification!');
          handleLogout();
        }}
      />
    );
  }

  // Specialized Equipment Managers (Network, Audio Video, Furniture)
  if (currentRole === 'networkEquipment' || currentRole === 'audioVideo' || currentRole === 'furniture') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation
          role={currentRole}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userName={currentUser.name}
        />

        <div className="pt-16 pl-64">
          {currentPage === 'dashboard' && (
            <>
              {currentRole === 'networkEquipment' && (
                <NetworkEquipmentDashboard userId={currentUserId} />
              )}
              {currentRole === 'audioVideo' && (
                <AudioVideoDashboard userId={currentUserId} />
              )}
              {currentRole === 'furniture' && (
                <FurnitureDashboard userId={currentUserId} />
              )}
            </>
          )}
          {currentPage === 'reports' && (
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Power BI Reports</h1>
              <p className="text-gray-600 mb-6">Access monthly and annual audit reports</p>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Power BI reports are integrated in the main dashboard view.</p>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Finance and Asset Manager dashboards with navigation
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        role={currentRole}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={currentUser.name}
      />

      {/* Main Content Area */}
      <div className="pt-16 pl-64">
        {/* Finance User Pages */}
        {currentRole === 'finance' && (
          <>
            {currentPage === 'dashboard' && (
              <FinanceDashboard
                onCreateCampaign={() => setShowCreateCampaign(true)}
                onViewReports={() => alert('Reports page - Export functionality')}
              />
            )}
            {currentPage === 'verification-review' && <VerificationReviewPage />}
            {currentPage === 'campaigns' && (
              <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Management</h1>
                <p className="text-gray-600">View and manage all verification campaigns</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateCampaign(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Create New Campaign
                  </button>
                </div>
              </div>
            )}
            {currentPage === 'reports' && (
              <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Audit Reports</h1>
                <p className="text-gray-600">Generate and export compliance reports</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">Asset Reconciliation Report</h3>
                    <p className="text-sm text-gray-600">Compare SAP GL data with verified assets</p>
                  </button>
                  <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">Verification Status Report</h3>
                    <p className="text-sm text-gray-600">Campaign completion and compliance rates</p>
                  </button>
                  <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">Exception Summary Report</h3>
                    <p className="text-sm text-gray-600">All mismatches and missing devices</p>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Asset Manager Pages */}
        {currentRole === 'assetManager' && (
          <>
            {currentPage === 'dashboard' && (
              <AssetManagerDashboard onAssignAsset={() => setShowAssignPeripherals(true)} />
            )}
            {currentPage === 'assets' && (
              <AssetManagerDashboard onAssignAsset={() => setShowAssignPeripherals(true)} />
            )}
            {currentPage === 'verification-review' && <VerificationReviewPage />}
          </>
        )}
      </div>

      {/* Modals */}
      {showCreateCampaign && (
        <CreateCampaignFlow
          onClose={() => setShowCreateCampaign(false)}
          onComplete={() => {
            setShowCreateCampaign(false);
            alert('Campaign created successfully! Emails will be sent to all employees in the selected scope.');
          }}
        />
      )}

      {showAssignPeripherals && (
        <AssignPeripheralsFlow
          onClose={() => setShowAssignPeripherals(false)}
          onComplete={() => {
            setShowAssignPeripherals(false);
            alert('Asset and peripherals assigned successfully! Assignment recorded in audit trail.');
          }}
        />
      )}
    </div>
  );
}