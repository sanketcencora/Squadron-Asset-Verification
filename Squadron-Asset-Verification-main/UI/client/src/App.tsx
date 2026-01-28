import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

// Pages
import Login from "@/pages/Login";
import FinanceDashboard from "@/pages/finance/Dashboard";
import CampaignsPage from "@/pages/finance/Campaigns";
import ReportsPage from "@/pages/finance/Reports";
import ManagerDashboard from "@/pages/manager/Dashboard";
import ManagerInventoryPage from "@/pages/manager/Inventory";
import ManagerExceptionsPage from "@/pages/manager/Exceptions";
import EmployeeVerification from "@/pages/employee/Verification";
import VerificationReview from "@/pages/finance/VerificationReview";
import NetworkEquipmentDashboard from "@/pages/network-equipment/Dashboard";
import AudioVideoDashboard from "@/pages/audio-video/Dashboard";
import FurnitureDashboard from "@/pages/furniture/Dashboard";

function ProtectedRoute({ 
  component: Component, 
  allowedRoles 
}: { 
  component: React.ComponentType, 
  allowedRoles: string[] 
}) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    setLocation("/");
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    setLocation("/"); // Or unauthorized page
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      
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

      {/* Employee Routes */}
      <Route path="/employee">
        <ProtectedRoute component={EmployeeVerification} allowedRoles={['employee']} />
      </Route>

      {/* Network Equipment Manager Routes */}
      <Route path="/network-equipment">
        <ProtectedRoute component={NetworkEquipmentDashboard} allowedRoles={['network_equipment_manager']} />
      </Route>

      {/* Audio Video Manager Routes */}
      <Route path="/audio-video">
        <ProtectedRoute component={AudioVideoDashboard} allowedRoles={['audio_video_manager']} />
      </Route>

      {/* Furniture Manager Routes */}
      <Route path="/furniture">
        <ProtectedRoute component={FurnitureDashboard} allowedRoles={['furniture_manager']} />
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
