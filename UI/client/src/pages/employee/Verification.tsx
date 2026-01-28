import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubmitVerification } from "@/hooks/use-assets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Laptop, 
  Mouse, 
  BatteryCharging, 
  Headphones, 
  Check, 
  X,
  Camera,
  LogOut,
  AlertCircle,
  Plus,
  Package
} from "lucide-react";

export default function EmployeeVerification() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const submitVerification = useSubmitVerification();
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [showLaptopForm, setShowLaptopForm] = useState(false);
  const [laptopInfo, setLaptopInfo] = useState({
    serviceTag: '',
    model: '',
    condition: '',
    notes: ''
  });

  // Mock data since we're simulating the user's assigned assets
  const assignedAsset = {
    id: 1,
    model: "Dell Latitude 5540",
    serviceTag: "GH78K92",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
  };

  const peripherals = [
    { id: "p1", name: "Dell 65W Charger", icon: BatteryCharging },
    { id: "p2", name: "Logitech Mouse", icon: Mouse },
    { id: "p3", name: "Jabra Headset", icon: Headphones },
  ];

  const handlePeripheralToggle = (name: string, isPresent: boolean) => {
    setItems(prev => {
      const filtered = prev.filter(i => i.peripheralName !== name);
      return [...filtered, { peripheralName: name, isPresent }];
    });
  };

  const handleLaptopInfoChange = (field: string, value: string) => {
    setLaptopInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLaptop = () => {
    if (laptopInfo.serviceTag && laptopInfo.model) {
      // Here you would typically send this data to the server
      console.log('Adding laptop:', laptopInfo);
      toast({
        title: "Laptop Added Successfully",
        description: `Dell laptop with Service Tag ${laptopInfo.serviceTag} has been added.`,
      });
      
      // Reset form
      setLaptopInfo({
        serviceTag: '',
        model: '',
        condition: '',
        notes: ''
      });
      setShowLaptopForm(false);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in Service Tag and Model fields.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await submitVerification.mutateAsync({
        campaignId: 1, // Hardcoded for demo
        items: [
          { assetId: assignedAsset.id, isPresent: true }, // Assume laptop is present
          ...items
        ]
      });
      setStep(4);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again later."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-primary font-display">AssetVerify</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">Logged in as {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Hardware */}
            {step === 1 && !showLaptopForm && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl font-bold">Verify Your Hardware</h1>
                  <p className="text-muted-foreground">Please confirm you are in possession of this device.</p>
                </div>

                <Card className="overflow-hidden border-none shadow-xl">
                  <div className="h-48 bg-gray-100 relative">
                    {/* Unsplash image of laptop on desk */}
                    <img 
                      src={assignedAsset.image} 
                      alt="Assigned Laptop" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-medium">{assignedAsset.model}</p>
                      <p className="text-white/80 text-xs font-mono">ST: {assignedAsset.serviceTag}</p>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex gap-4">
                      <Button className="flex-1 gap-2" variant="outline">
                        <Camera className="w-4 h-4" />
                        Upload Photo
                      </Button>
                      <Button className="flex-1" onClick={() => setStep(2)}>
                        Confirm Device
                      </Button>
                    </div>
                    <div className="pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => setShowLaptopForm(true)}
                      >
                        <Plus className="w-4 h-4" />
                        Add Different Laptop
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Add Laptop Form */}
            {showLaptopForm && (
              <motion.div
                key="addLaptop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl font-bold">Add Dell Laptop Information</h1>
                  <p className="text-muted-foreground">Enter the details of your assigned Dell laptop</p>
                </div>

                <Card className="border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Laptop className="w-5 h-5" />
                      Laptop Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serviceTag">Service Tag *</Label>
                        <Input
                          id="serviceTag"
                          placeholder="ST-LT-2024-001"
                          value={laptopInfo.serviceTag}
                          onChange={(e) => handleLaptopInfoChange('serviceTag', e.target.value)}
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">Format: ST-LT-YYYY-XXX</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Model *</Label>
                        <Input
                          id="model"
                          placeholder="Dell Latitude 5540"
                          value={laptopInfo.model}
                          onChange={(e) => handleLaptopInfoChange('model', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Input
                        id="condition"
                        placeholder="Good, Excellent, Needs Repair"
                        value={laptopInfo.condition}
                        onChange={(e) => handleLaptopInfoChange('condition', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Input
                        id="notes"
                        placeholder="Any issues or special requirements"
                        value={laptopInfo.notes}
                        onChange={(e) => handleLaptopInfoChange('notes', e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowLaptopForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddLaptop}
                        className="flex-1 gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Laptop
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Peripherals */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl font-bold">Accessories Check</h1>
                  <p className="text-muted-foreground">Do you have these assigned items with you?</p>
                </div>

                <Card className="border-none shadow-xl">
                  <CardContent className="p-0 divide-y">
                    {peripherals.map((item) => {
                      const Icon = item.icon;
                      const status = items.find(i => i.peripheralName === item.name)?.isPresent;

                      return (
                        <div key={item.id} className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant={status === false ? "destructive" : "outline"}
                              className={status === false ? "" : "text-muted-foreground hover:text-destructive"}
                              onClick={() => handlePeripheralToggle(item.name, false)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Missing
                            </Button>
                            <Button 
                              size="sm" 
                              variant={status === true ? "default" : "outline"}
                              className={status === true ? "bg-green-600 hover:bg-green-700" : "text-muted-foreground hover:text-green-600"}
                              onClick={() => handlePeripheralToggle(item.name, true)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              I have it
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                  <div className="p-6 bg-gray-50 border-t flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                    <Button 
                      onClick={() => setStep(3)}
                      disabled={items.length < peripherals.length}
                    >
                      Continue
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Declaration */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl font-bold">Final Declaration</h1>
                  <p className="text-muted-foreground">Please review and submit your verification.</p>
                </div>

                <Card className="border-none shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">
                        By submitting this form, you certify that you are in possession of the assets marked as present. False declarations may result in disciplinary action.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
                      <Checkbox checked={confirmed} onCheckedChange={(c) => setConfirmed(!!c)} />
                      <div className="space-y-1">
                        <Label className="font-medium cursor-pointer">I confirm the information provided is accurate</Label>
                        <p className="text-xs text-muted-foreground">
                          Recorded at {new Date().toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                      <Button 
                        onClick={handleSubmit} 
                        disabled={!confirmed || submitVerification.isPending}
                        className="w-full sm:w-auto"
                      >
                        {submitVerification.isPending ? "Submitting..." : "Submit Verification"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold">Verification Complete!</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thank you for completing the Q4 Asset Verification. A confirmation email has been sent to you.
                </p>
                <Button onClick={() => logout()} variant="outline" className="mt-8">
                  Return to Home
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
