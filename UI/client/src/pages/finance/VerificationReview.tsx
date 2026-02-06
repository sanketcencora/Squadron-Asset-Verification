import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useVerifications } from "@/hooks/use-assets";
import { format } from "date-fns";
import { Eye, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function VerificationReview() {
  const { data: verifications } = useVerifications();

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'verified': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'exception': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Exception</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#461e96' }}>Verification Review</h1>
              <p className="text-muted-foreground mt-1">Audit employee submissions and handle exceptions.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900" style={{ color: '#461e96' }}>Verified</p>
                    <p className="text-2xl font-bold text-blue-700">1,240</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-900" style={{ color: '#461e96' }}>Pending Review</p>
                    <p className="text-2xl font-bold text-amber-700">45</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg text-red-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900" style={{ color: '#461e96' }}>Exceptions</p>
                    <p className="text-2xl font-bold text-red-700">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg shadow-black/5">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifications?.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.user.name}</TableCell>
                      <TableCell>{v.user.department || "Engineering"}</TableCell>
                      <TableCell>{v.submittedAt ? format(new Date(v.submittedAt), 'MMM d, HH:mm') : '-'}</TableCell>
                      <TableCell>{getStatusBadge(v.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!verifications || verifications.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No submissions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
