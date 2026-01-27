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
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Package,
  DollarSign,
  BarChart3,
  PieChart,
  FileText,
  Download,
  Upload,
  Settings,
  Users,
  Building
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

          {/* New Dashboard Sections */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Asset Overview */}
            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    Asset Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Enhanced Pie Chart Visualization */}
                    <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">247</div>
                          <div className="text-sm text-muted-foreground font-medium">Total Assets</div>
                        </div>
                      </div>
                      {/* Enhanced Pie chart segments visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-48 h-48 transform -rotate-90">
                          <circle cx="96" cy="96" r="72" fill="none" stroke="url(#blue-gradient)" strokeWidth="48" strokeDasharray="75 25" opacity="0.9" />
                          <circle cx="96" cy="96" r="72" fill="none" stroke="url(#green-gradient)" strokeWidth="48" strokeDasharray="15 85" opacity="0.9" strokeDashoffset="-75" />
                          <circle cx="96" cy="96" r="72" fill="none" stroke="url(#amber-gradient)" strokeWidth="48" strokeDasharray="10 90" opacity="0.9" strokeDashoffset="-90" />
                          <defs>
                            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                            <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#34d399" />
                            </linearGradient>
                            <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#fbbf24" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Enhanced Legend */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div>
                          <div className="font-semibold text-sm">Laptops</div>
                          <div className="text-xs text-muted-foreground">75% • 185 units</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                        <div>
                          <div className="font-semibold text-sm">Monitors</div>
                          <div className="text-xs text-muted-foreground">15% • 37 units</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                        <div>
                          <div className="font-semibold text-sm">Other</div>
                          <div className="text-xs text-muted-foreground">10% • 25 units</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Asset Value Trend */}
            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    Asset Value Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Enhanced Line Chart Visualization */}
                    <div className="h-64 bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 rounded-2xl p-6">
                      <div className="flex items-end justify-between h-full gap-3">
                        {[65, 80, 45, 90, 70, 85, 95].map((height, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div 
                              className="w-full bg-gradient-to-t from-emerald-500 via-green-500 to-blue-500 rounded-t-lg shadow-lg"
                              style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-xs font-semibold text-muted-foreground bg-white/80 px-2 py-1 rounded">
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Enhanced Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">$2.4M</div>
                        <div className="text-sm text-muted-foreground font-medium">Current Value</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">+12%</div>
                        <div className="text-sm text-muted-foreground font-medium">YoY Growth</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top 5 Most Valuable Assets */}
          <motion.div variants={item}>
            <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  Top 5 Most Valuable Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'Dell Precision 7560', value: '$3,450', user: 'Sarah Chen', status: 'Active', trend: '+5%' },
                    { name: 'MacBook Pro 16"', value: '$2,899', user: 'Michael Torres', status: 'Active', trend: '+3%' },
                    { name: 'ThinkPad P1 Gen 4', value: '$2,750', user: 'Emily Johnson', status: 'Active', trend: '+2%' },
                    { name: 'Surface Studio 2', value: '$2,500', user: 'James Wilson', status: 'Active', trend: '+4%' },
                    { name: 'HP ZBook Studio', value: '$2,299', user: 'Lisa Anderson', status: 'Active', trend: '+1%' }
                  ].map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl transition-all duration-200 group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${
                          index === 0 ? 'from-amber-400 to-orange-500' :
                          index === 1 ? 'from-gray-400 to-gray-500' :
                          index === 2 ? 'from-orange-400 to-red-500' :
                          index === 3 ? 'from-blue-400 to-indigo-500' :
                          'from-purple-400 to-pink-500'
                        } rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-base group-hover:text-blue-600 transition-colors">{asset.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            {asset.user}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-blue-600">{asset.value}</div>
                        <div className="flex items-center gap-1 justify-end">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">{asset.trend}</span>
                          <span className="text-xs text-green-600 font-medium">{asset.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div variants={item}>
            <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'New asset assigned', item: 'Dell Latitude 5540', user: 'Emily Johnson', time: '2 hours ago', icon: Package, color: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-indigo-50' },
                    { action: 'Verification completed', item: 'MacBook Pro 14"', user: 'Michael Torres', time: '4 hours ago', icon: CheckCircle2, color: 'from-green-500 to-emerald-600', bg: 'from-green-50 to-emerald-50' },
                    { action: 'Exception reported', item: 'Monitor - LG 27"', user: 'James Wilson', time: '6 hours ago', icon: AlertTriangle, color: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50' },
                    { action: 'Asset returned', item: 'ThinkPad X1 Carbon', user: 'Lisa Anderson', time: '1 day ago', icon: Package, color: 'from-gray-500 to-gray-600', bg: 'from-gray-50 to-slate-50' },
                    { action: 'Maintenance completed', item: 'Surface Laptop 4', user: 'Sarah Chen', time: '2 days ago', icon: Settings, color: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-50' }
                  ].map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center gap-4 p-4 hover:bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl transition-all duration-200 group">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.bg} shadow-lg`}>
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${activity.color}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-base group-hover:text-purple-600 transition-colors">{activity.action}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Package className="w-3 h-3" />
                            {activity.item}
                            <span className="text-gray-400">•</span>
                            <Users className="w-3 h-3" />
                            {activity.user}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium text-muted-foreground bg-white/80 px-3 py-1 rounded-full border">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
