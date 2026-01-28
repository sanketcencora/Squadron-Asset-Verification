import { Sidebar } from "@/components/layout/Sidebar";
import { StatCard } from "@/components/ui/stat-card";
import { useDashboardStats, useActiveCampaign } from "@/hooks/use-assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Monitor, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function FinanceDashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: activeCampaign, isLoading: campaignLoading, error: campaignError } = useActiveCampaign();

  // Show loading state
  if (statsLoading || campaignLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50/50">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financial Overview</h1>
                <p className="text-muted-foreground mt-1">Track asset value, verification progress, and compliance.</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (statsError || campaignError) {
    return (
      <div className="flex min-h-screen bg-gray-50/50">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financial Overview</h1>
                <p className="text-muted-foreground mt-1">Track asset value, verification progress, and compliance.</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error loading dashboard data. Please refresh the page.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Fallback data
  const fallbackStats = {
    totalAssets: 156,
    verificationCompleted: 142,
    pendingVerifications: 14,
    exceptions: 3
  };

  const fallbackCampaign = {
    name: "Q2 2024 Asset Verification",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    totalEmployees: 156,
    verifiedCount: 142
  };

  const displayStats = stats || fallbackStats;
  const displayCampaign = activeCampaign || fallbackCampaign;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financial Overview</h1>
              <p className="text-muted-foreground mt-1">Track asset value, verification progress, and compliance.</p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              <Calendar className="w-4 h-4" />
              New Audit Campaign
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={item}>
              <StatCard
                title="Total Assets"
                value={displayStats.totalAssets}
                icon={Monitor}
                variant="primary"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatCard
                title="Verified"
                value={displayStats.verificationCompleted}
                icon={CheckCircle2}
                trend="12%"
                trendUp={true}
              />
            </motion.div>
            <motion.div variants={item}>
              <StatCard
                title="Pending"
                value={displayStats.pendingVerifications}
                icon={Clock}
                variant="warning"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatCard
                title="Exceptions"
                value={displayStats.exceptions}
                icon={AlertTriangle}
                variant="destructive"
              />
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <motion.div variants={item} className="md:col-span-2">
              <Card className="h-full border-none shadow-lg shadow-black/5">
                <CardHeader>
                  <CardTitle>Active Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  {displayCampaign ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <div>
                          <h3 className="font-semibold text-lg text-primary">{displayCampaign.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(displayCampaign.startDate), "MMM d, yyyy")} - {format(new Date(displayCampaign.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Overall Progress</span>
                          <span className="text-muted-foreground">
                            {Math.round(((displayCampaign.verifiedCount || 0) / (displayCampaign.totalEmployees || 1)) * 100)}%
                          </span>
                        </div>
                        <Progress value={((displayCampaign.verifiedCount || 0) / (displayCampaign.totalEmployees || 1)) * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="text-2xl font-bold text-gray-900">{displayCampaign.totalEmployees}</div>
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Staff</div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="text-2xl font-bold text-gray-900">{displayCampaign.verifiedCount}</div>
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Responses</div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="text-2xl font-bold text-gray-900">
                            {(displayCampaign.totalEmployees || 0) - (displayCampaign.verifiedCount || 0)}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Remaining</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                      <p>No active campaign</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg shadow-black/5 bg-gradient-to-b from-primary to-primary/90 text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="secondary" className="w-full justify-between" size="lg">
                    Generate Report
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 text-white border-0" size="lg">
                    Review Exceptions
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 text-white border-0" size="lg">
                    Export Data
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
