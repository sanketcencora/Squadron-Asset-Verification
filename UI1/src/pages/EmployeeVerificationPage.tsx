import { useState } from 'react';
import { Upload, CheckCircle, Package, AlertCircle, FileText, Camera } from 'lucide-react';
import { PeripheralType } from '@/data/mockData';

interface EmployeeVerificationPageProps {
  onSubmit: () => void;
}

export function EmployeeVerificationPage({ onSubmit }: EmployeeVerificationPageProps) {
  const [step, setStep] = useState<'verify' | 'submitted'>('verify');
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string }>({});
  const [peripheralStatus, setPeripheralStatus] = useState<{
    [key: string]: 'confirmed' | 'notWithMe' | 'pending';
  }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Mock assigned assets - in real app, these would come from API
  const assignedHardware = [
    {
      id: 'hw1',
      serviceTag: 'ST-LT-2024-001',
      assetType: 'Laptop',
      model: 'Dell Latitude 5540'
    },
    {
      id: 'hw4',
      serviceTag: 'ST-MB-2024-004',
      assetType: 'Mobile',
      model: 'iPhone 15 Pro'
    }
  ];

  const assignedPeripherals: PeripheralType[] = ['Charger', 'Headphones', 'Mouse'];

  const handleImageUpload = (assetId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImages({ ...uploadedImages, [assetId]: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handlePeripheralStatus = (peripheral: PeripheralType, status: 'confirmed' | 'notWithMe') => {
    setPeripheralStatus({ ...peripheralStatus, [peripheral]: status });
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    setStep('submitted');
    setTimeout(() => onSubmit(), 2000);
  };

  const isFormValid = () => {
    // Check all hardware has images
    const allHardwareVerified = assignedHardware.every(hw => uploadedImages[hw.id]);
    // Check all peripherals have status
    const allPeripheralsVerified = assignedPeripherals.every(
      p => peripheralStatus[p] === 'confirmed' || peripheralStatus[p] === 'notWithMe'
    );
    return allHardwareVerified && allPeripheralsVerified && declarationAccepted;
  };

  if (step === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Verification Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for completing your asset verification. Your response has been recorded and will be reviewed by the Asset Management team.
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">Submission Confirmation</p>
            <p>Reference ID: VER-{Date.now()}</p>
            <p>Date: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header - No Internal Navigation */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Asset Verification System</h1>
            <p className="text-sm text-gray-600">Annual Audit Compliance</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 pb-32">
        {/* Introduction */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Asset Verification</h2>
          <p className="text-gray-600 mb-4">
            As part of our annual audit process, please verify all hardware and peripherals assigned to you.
            This process typically takes 3-5 minutes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Step 1</p>
                <p className="text-sm text-blue-800">Upload hardware images</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Step 2</p>
                <p className="text-sm text-blue-800">Confirm peripherals</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Step 3</p>
                <p className="text-sm text-blue-800">Submit declaration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section A: Assigned Hardware (Image Required) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Assigned Hardware</h3>
              <p className="text-sm text-gray-600">Upload clear photos showing the service tag for each device</p>
            </div>
          </div>

          <div className="space-y-4">
            {assignedHardware.map((asset) => (
              <div key={asset.id} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{asset.model}</h4>
                    <p className="text-sm text-gray-600 mt-1">{asset.assetType}</p>
                    <p className="text-sm font-mono text-blue-600 mt-1">Service Tag: {asset.serviceTag}</p>
                  </div>
                  {uploadedImages[asset.id] && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Image Uploaded
                    </span>
                  )}
                </div>

                {uploadedImages[asset.id] ? (
                  <div className="relative">
                    <img
                      src={uploadedImages[asset.id]}
                      alt="Uploaded verification"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => {
                        const newImages = { ...uploadedImages };
                        delete newImages[asset.id];
                        setUploadedImages(newImages);
                      }}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Upload Photo of {asset.assetType}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          Ensure service tag <span className="font-mono font-medium">{asset.serviceTag}</span> is clearly visible
                        </p>
                        <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                          <Camera className="w-4 h-4 mr-2" />
                          Choose Photo
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(asset.id, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Tip:</strong> Take a well-lit photo with the service tag in focus. Accepted formats: JPG, PNG
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Assigned Peripherals */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Assigned Peripherals</h3>
              <p className="text-sm text-gray-600">Confirm each peripheral currently in your possession</p>
            </div>
          </div>

          <div className="space-y-3">
            {assignedPeripherals.map((peripheral) => {
              const status = peripheralStatus[peripheral];
              return (
                <div key={peripheral} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{peripheral}</span>
                    </div>
                    {status === 'confirmed' && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        Confirmed
                      </span>
                    )}
                    {status === 'notWithMe' && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                        Not With Me
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handlePeripheralStatus(peripheral, 'confirmed')}
                      className={`flex-1 px-4 py-2.5 rounded-lg border-2 font-medium transition-colors ${
                        status === 'confirmed'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      I have this
                    </button>
                    <button
                      onClick={() => handlePeripheralStatus(peripheral, 'notWithMe')}
                      className={`flex-1 px-4 py-2.5 rounded-lg border-2 font-medium transition-colors ${
                        status === 'notWithMe'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      Not with me
                    </button>
                  </div>

                  {status === 'notWithMe' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Please explain (required)
                      </label>
                      <textarea
                        value={comments[peripheral] || ''}
                        onChange={(e) => setComments({ ...comments, [peripheral]: e.target.value })}
                        placeholder="e.g., Lost, returned to IT, never received..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section C: Declaration & Submit */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Declaration & Submission</h3>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1 text-sm text-yellow-900">
                <p className="font-medium mb-1">Important Notice</p>
                <p>
                  Your verification will be reviewed for audit compliance. Any discrepancies will be investigated.
                  Providing false information may result in disciplinary action.
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors mb-6">
            <input
              type="checkbox"
              checked={declarationAccepted}
              onChange={(e) => setDeclarationAccepted(e.target.checked)}
              className="mt-1 mr-3 w-5 h-5 text-blue-600 rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-1">I confirm the above information is accurate</p>
              <p className="text-sm text-gray-600">
                I certify that the hardware and peripheral information provided above is true and complete to the best of my knowledge.
                I understand this is for official audit purposes.
              </p>
            </div>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-lg"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Submit Verification</span>
          </button>

          {!isFormValid() && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Please complete all required fields:</strong>
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1 ml-4 list-disc">
                {assignedHardware.some(hw => !uploadedImages[hw.id]) && (
                  <li>Upload images for all hardware assets</li>
                )}
                {assignedPeripherals.some(p => !peripheralStatus[p]) && (
                  <li>Confirm status for all peripherals</li>
                )}
                {!declarationAccepted && (
                  <li>Accept the declaration statement</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-Friendly Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Verification
        </button>
      </div>
    </div>
  );
}
