import { useState } from 'react';
import { teams, AssetType } from '@/data/mockData';
import { X, CheckCircle, Calendar, Users, Package, Mail, ChevronRight } from 'lucide-react';

interface CreateCampaignFlowProps {
  onClose: () => void;
  onComplete: () => void;
}

export function CreateCampaignFlow({ onClose, onComplete }: CreateCampaignFlowProps) {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    deadline: '',
    selectedTeams: [] as string[],
    selectedAssetTypes: [] as AssetType[],
    highValueOnly: false,
    emailReminders: 'weekly'
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleLaunch = () => {
    // In a real app, this would create the campaign
    onComplete();
  };

  const assetTypes: AssetType[] = ['Laptop', 'Monitor', 'Mobile'];

  // Calculate totals for review
  const estimatedEmployees = campaignData.selectedTeams.length * 45; // Mock calculation
  const estimatedAssets = estimatedEmployees * 1.5; // Mock calculation
  const estimatedPeripherals = estimatedAssets * 2; // Mock calculation

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Verification Campaign</h2>
            <p className="text-gray-600 mt-1">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className={`font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                Campaign Setup
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className={`font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                Asset Scope
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className={`font-medium ${step >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>
                Review & Launch
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  placeholder="e.g., Q1 2025 Annual Audit"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                  placeholder="Describe the purpose of this verification campaign..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Deadline *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={campaignData.deadline}
                    onChange={(e) => setCampaignData({ ...campaignData, deadline: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Employees will be notified to complete verification by this date
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> All employees in the selected scope will receive email notifications
                  with secure links to verify their assigned assets.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Teams *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {teams.map((team) => (
                    <label
                      key={team}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={campaignData.selectedTeams.includes(team)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCampaignData({
                              ...campaignData,
                              selectedTeams: [...campaignData.selectedTeams, team]
                            });
                          } else {
                            setCampaignData({
                              ...campaignData,
                              selectedTeams: campaignData.selectedTeams.filter(t => t !== team)
                            });
                          }
                        }}
                        className="mr-3 w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-medium text-gray-900">{team}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Asset Types *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {assetTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={campaignData.selectedAssetTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCampaignData({
                              ...campaignData,
                              selectedAssetTypes: [...campaignData.selectedAssetTypes, type]
                            });
                          } else {
                            setCampaignData({
                              ...campaignData,
                              selectedAssetTypes: campaignData.selectedAssetTypes.filter(t => t !== type)
                            });
                          }
                        }}
                        className="mr-3 w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-medium text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={campaignData.highValueOnly}
                    onChange={(e) => setCampaignData({ ...campaignData, highValueOnly: e.target.checked })}
                    className="mt-1 mr-3 w-4 h-4 text-blue-600 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900 block">High-Value Assets Only</span>
                    <span className="text-sm text-gray-600">Only include assets valued over $1,000</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">Campaign Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{estimatedEmployees}</p>
                        <p className="text-sm text-gray-600">Employees</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(estimatedAssets)}</p>
                        <p className="text-sm text-gray-600">Hardware Assets</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(estimatedPeripherals)}</p>
                        <p className="text-sm text-gray-600">Peripherals</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {campaignData.deadline ? new Date(campaignData.deadline).toLocaleDateString() : 'Not set'}
                        </p>
                        <p className="text-sm text-gray-600">Deadline</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Campaign Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Name:</dt>
                      <dd className="font-medium text-gray-900">{campaignData.name || 'Not specified'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Teams:</dt>
                      <dd className="font-medium text-gray-900">
                        {campaignData.selectedTeams.length > 0 ? campaignData.selectedTeams.join(', ') : 'None selected'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Asset Types:</dt>
                      <dd className="font-medium text-gray-900">
                        {campaignData.selectedAssetTypes.length > 0 ? campaignData.selectedAssetTypes.join(', ') : 'None selected'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">High-Value Only:</dt>
                      <dd className="font-medium text-gray-900">{campaignData.highValueOnly ? 'Yes' : 'No'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Email Reminder Cadence</h4>
                  <div className="space-y-2">
                    {['daily', 'weekly', 'biweekly'].map((frequency) => (
                      <label key={frequency} className="flex items-center">
                        <input
                          type="radio"
                          name="emailReminders"
                          value={frequency}
                          checked={campaignData.emailReminders === frequency}
                          onChange={(e) => setCampaignData({ ...campaignData, emailReminders: e.target.value })}
                          className="mr-3 w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 capitalize">{frequency} reminders</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900 mb-1">Ready to Launch</p>
                    <p className="text-sm text-yellow-800">
                      All selected employees will receive verification emails immediately after launch.
                      Make sure all details are correct before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!campaignData.name || !campaignData.description || !campaignData.deadline)) ||
                  (step === 2 && (campaignData.selectedTeams.length === 0 || campaignData.selectedAssetTypes.length === 0))
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleLaunch}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Launch Campaign</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
