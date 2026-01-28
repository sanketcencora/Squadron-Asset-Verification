import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Users,
  Target,
  Clock,
  Play,
  Pause,
  CheckCircle,
  Upload,
  FileSpreadsheet,
  Mail,
  Plus,
  Menu
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function CampaignsPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // Mock campaigns data
  const campaigns = [
    {
      id: 1,
      name: "Q2 2024 Asset Verification",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      status: "active",
      totalEmployees: 156,
      verifiedCount: 142,
      description: "Quarterly asset verification campaign for all departments"
    },
    {
      id: 2,
      name: "IT Equipment Audit",
      startDate: "2024-05-15",
      endDate: "2024-05-30",
      status: "completed",
      totalEmployees: 45,
      verifiedCount: 45,
      description: "Focused audit on IT department equipment"
    },
    {
      id: 3,
      name: "New Hire Onboarding",
      startDate: "2024-07-01",
      endDate: "2024-07-15",
      status: "scheduled",
      totalEmployees: 12,
      verifiedCount: 0,
      description: "Asset verification for new employees"
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      setUploadedFile(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    
    // Simulate file processing and email triggering
    setTimeout(() => {
      console.log('Processing file:', uploadedFile.name);
      console.log('Triggering emails to employees...');
      
      // Mock file processing
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('File content processed:', content);
        
        // Here you would typically:
        // 1. Parse CSV/Excel data
        // 2. Validate employee data
        // 3. Generate audit assignments
        // 4. Trigger emails to employees
        // 5. Create campaign records in database
      };
      reader.readAsText(uploadedFile);
      
      setTimeout(() => {
        setIsUploading(false);
        setShowUploadModal(false);
        setUploadedFile(null);
        alert('Campaign created successfully! Emails have been sent to employees.');
      }, 2000);
    }, 1500);
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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Campaigns</h1>
              <p className="text-muted-foreground mt-1">Manage and monitor audit campaigns.</p>
            </div>
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="w-4 h-4" />
                Create Campaign from File
              </Button>
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                <Calendar className="w-4 h-4" />
                New Campaign
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <motion.div key={campaign.id} variants={item}>
                <Card className="border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{campaign.name}</CardTitle>
                        <p className="text-muted-foreground mt-1">{campaign.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.status === 'active' && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            <Play className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        )}
                        {campaign.status === 'completed' && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </span>
                        )}
                        {campaign.status === 'scheduled' && (
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                            <Clock className="w-3 h-3 mr-1" />
                            Scheduled
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(campaign.startDate), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Target className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">End Date</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(campaign.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Participants</p>
                          <p className="text-sm text-muted-foreground">
                            {campaign.totalEmployees} employees
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Progress</p>
                          <p className="text-sm text-muted-foreground">
                            {campaign.verifiedCount} completed
                          </p>
                        </div>
                      </div>
                    </div>

                    {campaign.status !== 'scheduled' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Completion Rate</span>
                          <span className="text-muted-foreground">
                            {Math.round((campaign.verifiedCount / campaign.totalEmployees) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(campaign.verifiedCount / campaign.totalEmployees) * 100} 
                          className="h-2" 
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {campaign.status === 'active' && (
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      {campaign.status === 'scheduled' && (
                        <Button size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Start Campaign
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-1" />
                        Send Reminders
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create Campaign from File</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Upload a CSV or Excel file containing employee information to create a new audit campaign. 
                This will automatically trigger verification emails to all employees in the file.
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <label className="cursor-pointer">
                  <span className="text-sm font-medium text-gray-600">
                    {uploadedFile ? uploadedFile.name : 'Click to upload CSV or Excel file'}
                  </span>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>File selected: {uploadedFile.name}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUploadSubmit}
                  disabled={!uploadedFile || isUploading}
                  className="flex-1 gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Create Campaign & Send Emails
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
