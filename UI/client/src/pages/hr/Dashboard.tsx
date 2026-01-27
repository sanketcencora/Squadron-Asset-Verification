import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users,
  UserCheck,
  Briefcase,
  TrendingUp,
  Calendar,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

export default function HRManagerDashboard() {
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

  // Mock HR stats
  const stats = [
    {
      title: "Total Employees",
      value: "247",
      icon: Users,
      variant: "primary" as const,
      trend: "+8%",
      trendUp: true
    },
    {
      title: "New Hires This Month",
      value: "12",
      icon: UserCheck,
      variant: "default" as const,
      trend: "+25%",
      trendUp: true
    },
    {
      title: "Assets Assigned",
      value: "189",
      icon: Briefcase,
      variant: "success" as const,
      trend: "+15%",
      trendUp: true
    },
    {
      title: "Pending Onboarding",
      value: "5",
      icon: Calendar,
      variant: "warning" as const,
      trend: "-20%",
      trendUp: false
    }
  ];

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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">HR Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage employee assets and onboarding.</p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              <Users className="w-4 h-4" />
              Add Employee
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={item}>
                <Card className="border-none shadow-lg shadow-black/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <stat.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      {stat.trend && (
                        <span className={`text-xs font-medium flex items-center gap-1 ${
                          stat.trendUp ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.trendUp ? '↑' : '↓'} {stat.trend}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-none shadow-lg shadow-black/5">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <UserCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New employee onboarded</p>
                        <p className="text-xs text-muted-foreground">John Smith - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Assets assigned</p>
                        <p className="text-xs text-muted-foreground">3 laptops assigned - 4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Onboarding scheduled</p>
                        <p className="text-xs text-muted-foreground">5 new hires - Tomorrow</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-none shadow-lg shadow-black/5">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="w-4 h-4" />
                    Add New Employee
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Briefcase className="w-4 h-4" />
                    Assign Assets
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule Onboarding
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="w-4 h-4" />
                    Generate HR Report
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
