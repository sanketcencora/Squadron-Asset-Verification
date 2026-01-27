import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

// Pages
import Login from "@/pages/Login";
import Registration from "@/pages/Registration";
import FinanceDashboard from "@/pages/finance/Dashboard";
import CampaignsPage from "@/pages/finance/Campaigns";
import ReportsPage from "@/pages/finance/Reports";
import ManagerDashboard from "@/pages/manager/Dashboard";
import ManagerInventoryPage from "@/pages/manager/Inventory";
import ManagerExceptionsPage from "@/pages/manager/Exceptions";
import HRManagerDashboard from "@/pages/hr/Dashboard";
import AdminManagerDashboard from "@/pages/admin/Dashboard";
import ITManagerDashboard from "@/pages/it/Dashboard";
import NetworkEquipmentManagerDashboard from "@/pages/network-equipment/Dashboard";
import AudioVideoManagerDashboard from "@/pages/audio-video/Dashboard";
import FurnitureManagerDashboard from "@/pages/furniture/Dashboard";
import EmployeeVerification from "@/pages/employee/Verification";
import VerificationReview from "@/pages/finance/VerificationReview";

function ProtectedRoute({ 
  component: Component, 
  allowedRoles 
}: { 
  component: React.ComponentType, 
  allowedRoles: string[] 
}) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to registration page for manager routes
    if (location.startsWith('/manager') || location.startsWith('/hr') || location.startsWith('/admin') || location.startsWith('/it')) {
      window.location.href = '/register';
      return null;
    }
    // For other routes, redirect to login
    window.location.href = '/';
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    window.location.href = '/';
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/register" component={Registration} />
      
      {/* Finance Routes - UNCHANGED */}
      <Route path="/finance">
        <ProtectedRoute component={FinanceDashboard} allowedRoles={['finance']} />
      </Route>
      <Route path="/finance/campaigns">
        <ProtectedRoute component={CampaignsPage} allowedRoles={['finance']} />
      </Route>
      <Route path="/finance/reports">
        <ProtectedRoute component={ReportsPage} allowedRoles={['finance']} />
      </Route>
      <Route path="/finance/reviews">
        <ProtectedRoute component={VerificationReview} allowedRoles={['finance']} />
      </Route>

      {/* Manager Routes - NEW ASSET MANAGER PAGES */}
      <Route path="/manager">
        <ProtectedRoute component={ManagerDashboard} allowedRoles={['manager']} />
      </Route>
      <Route path="/manager/inventory">
        <ProtectedRoute component={ManagerInventoryPage} allowedRoles={['manager']} />
      </Route>
      <Route path="/manager/exceptions">
        <ProtectedRoute component={ManagerExceptionsPage} allowedRoles={['manager']} />
      </Route>

      {/* HR Manager Routes */}
      <Route path="/hr">
        <ProtectedRoute component={HRManagerDashboard} allowedRoles={['hr_manager']} />
      </Route>

      {/* Admin Manager Routes */}
      <Route path="/admin">
        <ProtectedRoute component={AdminManagerDashboard} allowedRoles={['admin_manager']} />
      </Route>

      {/* IT Manager Routes */}
      <Route path="/it">
        <ProtectedRoute component={ITManagerDashboard} allowedRoles={['it_manager']} />
      </Route>

      {/* Network Equipment Manager Routes */}
      <Route path="/network-equipment">
        <ProtectedRoute component={NetworkEquipmentManagerDashboard} allowedRoles={['network_equipment_manager']} />
      </Route>

      {/* Audio Video Manager Routes */}
      <Route path="/audio-video">
        <ProtectedRoute component={AudioVideoManagerDashboard} allowedRoles={['audio_video_manager']} />
      </Route>

      {/* Furniture Manager Routes */}
      <Route path="/furniture">
        <ProtectedRoute component={FurnitureManagerDashboard} allowedRoles={['furniture_manager']} />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee">
        <ProtectedRoute component={EmployeeVerification} allowedRoles={['employee']} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
