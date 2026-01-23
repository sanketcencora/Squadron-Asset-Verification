import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/use-assets";
import { 
  FileText,
  Download,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Calendar,
  Monitor
} from "lucide-react";
import { motion } from "framer-motion";

export default function ReportsPage() {
  const { data: assetValueReport } = useReports('asset-value');
  const { data: complianceReport } = useReports('compliance');
  const { data: financialSummary } = useReports('financial-summary');
  const { data: exceptionsReport } = useReports('exceptions');
  const { data: auditTrail } = useReports('audit-trail');
  const { data: inventoryReport } = useReports('inventory');

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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financial Reports</h1>
              <p className="text-muted-foreground mt-1">Generate and download comprehensive financial reports.</p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              <FileText className="w-4 h-4" />
              Generate Custom Report
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Asset Value Report</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comprehensive breakdown of asset values by category and department
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>2 hours ago</span>
                  </div>
                  <Button className="w-full gap-2" onClick={() => {
                    const dataStr = JSON.stringify(assetValueReport || [], null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'asset-value-report.json';
                    link.click();
                  }}>
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">Compliance Report</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Verification compliance status and exception analysis
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>1 day ago</span>
                  </div>
                  <Button className="w-full gap-2" onClick={() => {
                    const dataStr = JSON.stringify(complianceReport || [], null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'compliance-report.json';
                    link.click();
                  }}>
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Financial Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Monthly financial overview with asset depreciation tracking
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>3 days ago</span>
                  </div>
                  <Button className="w-full gap-2" onClick={() => {
                    const dataStr = JSON.stringify(financialSummary || [], null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'financial-summary.json';
                    link.click();
                  }}>
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">Exception Report</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Detailed analysis of verification exceptions and resolutions
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>5 hours ago</span>
                  </div>
                  <Button className="w-full gap-2" onClick={() => {
                    const dataStr = JSON.stringify(exceptionsReport || [], null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'exceptions-report.json';
                    link.click();
                  }}>
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-red-600" />
                    </div>
                    <CardTitle className="text-lg">Audit Trail</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Complete audit history with timestamps and user actions
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>1 week ago</span>
                  </div>
                  <Button className="w-full gap-2" onClick={() => {
                    const dataStr = JSON.stringify(auditTrail || [], null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'audit-trail.json';
                    link.click();
                  }}>
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Monitor className="w-5 h-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg">Asset Inventory</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Complete asset inventory list with status and location details
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>6 hours ago</span>
                  </div>
                  <Button className="w-full gap-2" onClick={() => {
                    const dataStr = JSON.stringify(inventoryReport || [], null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'inventory-report.json';
                    link.click();
                  }}>
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Type</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Asset Summary</option>
                      <option>Compliance Report</option>
                      <option>Financial Analysis</option>
                      <option>Custom Query</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Last 30 days</option>
                      <option>Last Quarter</option>
                      <option>Last Year</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                      <option>JSON</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="gap-2">
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    Schedule Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
