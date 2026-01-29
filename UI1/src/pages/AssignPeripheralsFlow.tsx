import { useState } from 'react';
import { X, Search, User, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { mockHardwareAssets, mockUsers, PeripheralType } from '@/data/mockData';

interface AssignPeripheralsFlowProps {
  onClose: () => void;
  onComplete: () => void;
}

export function AssignPeripheralsFlow({ onClose, onComplete }: AssignPeripheralsFlowProps) {
  const [step, setStep] = useState<'search' | 'selectPeripherals' | 'confirm'>('search');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeHardware, setEmployeeHardware] = useState<any[]>([]);
  const [selectedPeripherals, setSelectedPeripherals] = useState<{ type: PeripheralType; quantity: number }[]>([]);

  const employees = mockUsers.filter(u => u.role === 'employee');
  const availablePeripherals: PeripheralType[] = ['Charger', 'Headphones', 'Dock', 'Mouse', 'Keyboard', 'USB-C Cable'];

  const handleEmployeeSelect = (employee: any) => {
    setSelectedEmployee(employee);
    // Fetch hardware assigned to this employee from ServiceNow
    const assignedHardware = mockHardwareAssets.filter(a => a.assignedTo === employee.employeeId);
    setEmployeeHardware(assignedHardware);
    setStep('selectPeripherals');
  };

  const handlePeripheralToggle = (type: PeripheralType) => {
    const existing = selectedPeripherals.find(p => p.type === type);
    if (existing) {
      setSelectedPeripherals(selectedPeripherals.filter(p => p.type !== type));
    } else {
      setSelectedPeripherals([...selectedPeripherals, { type, quantity: 1 }]);
    }
  };

  const handleConfirm = () => {
    // In a real app, this would save the peripheral assignment
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assign Peripherals to Employee</h2>
            <p className="text-gray-600 mt-1">
              {step === 'search' && 'Search for employee'}
              {step === 'selectPeripherals' && 'Select peripherals to assign'}
              {step === 'confirm' && 'Confirm assignment'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Breadcrumb */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2 text-sm">
            <span className={step === 'search' ? 'text-blue-600 font-medium' : 'text-gray-600'}>
              1. Select Employee
            </span>
            <span className="text-gray-400">→</span>
            <span className={step === 'selectPeripherals' ? 'text-blue-600 font-medium' : 'text-gray-600'}>
              2. Select Peripherals
            </span>
            <span className="text-gray-400">→</span>
            <span className={step === 'confirm' ? 'text-blue-600 font-medium' : 'text-gray-600'}>
              3. Confirm
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Search Employee */}
          {step === 'search' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1 text-sm text-blue-900">
                    <p className="font-medium mb-1">Hardware Assignment Note</p>
                    <p>
                      Hardware assets must be assigned via ServiceNow CSV import. This form only assigns peripherals
                      to employees who already have hardware assigned from ServiceNow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  placeholder="Search by Employee ID, name, or email..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {employees
                  .filter(emp =>
                    emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                    emp.employeeId.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                    emp.email.toLowerCase().includes(employeeSearch.toLowerCase())
                  )
                  .map((employee) => {
                    const assignedHardware = mockHardwareAssets.filter(a => a.assignedTo === employee.employeeId);
                    return (
                      <button
                        key={employee.id}
                        onClick={() => handleEmployeeSelect(employee)}
                        className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{employee.name}</p>
                            <p className="text-sm text-gray-600">{employee.employeeId} • {employee.email}</p>
                            <p className="text-sm text-gray-500">{employee.team} • {employee.location}</p>
                            {assignedHardware.length > 0 && (
                              <p className="text-xs text-green-700 mt-1">
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                {assignedHardware.length} hardware asset{assignedHardware.length > 1 ? 's' : ''} assigned
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Step 2: Select Peripherals */}
          {step === 'selectPeripherals' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Assigning peripherals to:</p>
                <p className="text-sm text-blue-800">{selectedEmployee.name} ({selectedEmployee.employeeId})</p>
              </div>

              {/* Show Employee's Assigned Hardware */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Assigned Hardware (from ServiceNow)</h3>
                {employeeHardware.length > 0 ? (
                  <div className="space-y-2">
                    {employeeHardware.map((hw) => (
                      <div key={hw.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{hw.model}</p>
                            <p className="text-sm text-gray-600 font-mono">{hw.serviceTag}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">{hw.assetType}</span>
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                Assigned
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 mb-1">No Hardware Assigned</p>
                    <p className="text-sm text-gray-600">
                      This employee has no hardware assigned from ServiceNow. 
                      <br />Import hardware assignments before assigning peripherals.
                    </p>
                  </div>
                )}
              </div>

              {/* Select Peripherals */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Select Peripherals</h3>
                <p className="text-sm text-gray-600 mb-4">Choose all peripherals being assigned with the hardware above</p>

                <div className="grid grid-cols-2 gap-3">
                  {availablePeripherals.map((type) => {
                    const isSelected = selectedPeripherals.some(p => p.type === type);
                    return (
                      <label
                        key={type}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handlePeripheralToggle(type)}
                          className="mr-3 w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="font-medium text-gray-900">{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStep('search')}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={selectedPeripherals.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Review Peripheral Assignment</h3>
                    <p className="text-sm text-gray-600">Please verify the assignment details before confirming</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Employee Information</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Name:</dt>
                      <dd className="font-medium text-gray-900">{selectedEmployee.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Employee ID:</dt>
                      <dd className="font-medium text-gray-900">{selectedEmployee.employeeId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Team:</dt>
                      <dd className="font-medium text-gray-900">{selectedEmployee.team}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Location:</dt>
                      <dd className="font-medium text-gray-900">{selectedEmployee.location}</dd>
                    </div>
                  </dl>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Assigned Hardware ({employeeHardware.length})</h4>
                  <div className="space-y-2">
                    {employeeHardware.map((hw) => (
                      <div key={hw.id} className="text-sm flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-900">{hw.model}</span>
                        <span className="font-mono text-gray-600 text-xs">{hw.serviceTag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Peripherals to Assign ({selectedPeripherals.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPeripherals.map((p) => (
                      <span
                        key={p.type}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {p.type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audit Note (Optional)
                  </label>
                  <textarea
                    placeholder="Add any notes about this peripheral assignment..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStep('selectPeripherals')}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  ← Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Confirm Assignment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
