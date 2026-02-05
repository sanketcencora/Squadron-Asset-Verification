import { useState, useEffect } from 'react';
import { X, Search, User, Package, CheckCircle, AlertCircle, Loader2, Minus, Plus, AlertTriangle } from 'lucide-react';
import { api, User as UserType, HardwareAsset, Peripheral, PeripheralType } from '../services/api';

interface AssignPeripheralsFlowProps {
  onClose: () => void;
  onComplete: () => void;
}

interface PeripheralSelection {
  type: PeripheralType;
  quantity: number;
}

export function AssignPeripheralsFlow({ onClose, onComplete }: AssignPeripheralsFlowProps) {
  const [step, setStep] = useState<'search' | 'selectPeripherals' | 'confirm'>('search');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<UserType | null>(null);
  const [employeeHardware, setEmployeeHardware] = useState<HardwareAsset[]>([]);
  const [employeePeripherals, setEmployeePeripherals] = useState<Peripheral[]>([]);
  const [selectedPeripherals, setSelectedPeripherals] = useState<PeripheralSelection[]>([]);
  const [auditNote, setAuditNote] = useState('');
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Data from backend
  const [employees, setEmployees] = useState<UserType[]>([]);
  const [allPeripherals, setAllPeripherals] = useState<Peripheral[]>([]);
  const [allAssets, setAllAssets] = useState<HardwareAsset[]>([]);
  const [stockByType, setStockByType] = useState<Record<string, number>>({});

  const availablePeripheralTypes: PeripheralType[] = ['Charger', 'Headphones', 'Dock', 'Mouse', 'Keyboard', 'USBCCable'];
  
  const peripheralDisplayNames: Record<string, string> = {
    'Charger': 'Charger',
    'Headphones': 'Headphones',
    'Dock': 'Docking Station',
    'Mouse': 'Mouse',
    'Keyboard': 'Keyboard',
    'USBCCable': 'USB-C Cable'
  };

  // Fetch initial data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, peripheralsData, assetsData, stockData] = await Promise.all([
          api.users.getAll(),
          api.peripherals.getAll(),
          api.assets.getAll(),
          api.peripherals.getStock()
        ]);
        
        // Filter only employees (those with hardware assigned)
        const employeesWithHardware = usersData.filter(u => 
          u.role === 'employee' || assetsData.some(a => a.assignedTo === u.employeeId)
        );
        
        setEmployees(employeesWithHardware);
        setAllPeripherals(peripheralsData);
        setAllAssets(assetsData);
        setStockByType(stockData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleEmployeeSelect = (employee: UserType) => {
    setSelectedEmployee(employee);
    
    // Get hardware assigned to this employee
    const assignedHardware = allAssets.filter(a => a.assignedTo === employee.employeeId);
    setEmployeeHardware(assignedHardware);
    
    // Get peripherals already assigned to this employee
    const assignedPeripherals = allPeripherals.filter(p => p.assignedTo === employee.employeeId);
    setEmployeePeripherals(assignedPeripherals);
    
    // Reset selections
    setSelectedPeripherals([]);
    setStep('selectPeripherals');
  };

  const getStockForType = (type: PeripheralType): number => {
    return stockByType[type] || 0;
  };

  const getSelectedQuantityForType = (type: PeripheralType): number => {
    const selection = selectedPeripherals.find(p => p.type === type);
    return selection?.quantity || 0;
  };

  const getAvailableStock = (type: PeripheralType): number => {
    // Calculate remaining stock after current selections
    return getStockForType(type) - getSelectedQuantityForType(type);
  };

  const handlePeripheralToggle = (type: PeripheralType) => {
    const existing = selectedPeripherals.find(p => p.type === type);
    if (existing) {
      setSelectedPeripherals(selectedPeripherals.filter(p => p.type !== type));
    } else {
      // Only allow selection if there's stock available
      if (getStockForType(type) > 0) {
        setSelectedPeripherals([...selectedPeripherals, { type, quantity: 1 }]);
      }
    }
  };

  const handleQuantityChange = (type: PeripheralType, delta: number) => {
    const stock = getStockForType(type);
    setSelectedPeripherals(prev => 
      prev.map(p => 
        p.type === type 
          ? { ...p, quantity: Math.max(1, Math.min(stock, p.quantity + delta)) }
          : p
      )
    );
  };

  const getPeripheralCountByType = (type: PeripheralType): number => {
    return employeePeripherals.filter(p => p.type === type).length;
  };

  const handleConfirm = async () => {
    if (!selectedEmployee) return;
    
    // Validate stock before submitting
    for (const selection of selectedPeripherals) {
      if (selection.quantity > getStockForType(selection.type)) {
        alert(`Not enough ${peripheralDisplayNames[selection.type]} in stock. Available: ${getStockForType(selection.type)}`);
        return;
      }
    }
    
    setSubmitting(true);
    
    try {
      // Assign peripherals from stock (one at a time)
      for (const selection of selectedPeripherals) {
        for (let i = 0; i < selection.quantity; i++) {
          const result = await api.peripherals.assign(
            selection.type,
            undefined, // No serial number - backend picks from stock
            selectedEmployee.employeeId,
            selectedEmployee.name
          );
          if (!result) {
            throw new Error(`Failed to assign ${peripheralDisplayNames[selection.type]} - no stock available`);
          }
        }
      }
      
      onComplete();
    } catch (error: any) {
      console.error('Failed to assign peripherals:', error);
      alert(error.message || 'Failed to assign peripherals. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.department?.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assign Peripherals to Employee</h2>
            <p className="text-gray-600 mt-1">
              {step === 'search' && 'Search and select an employee'}
              {step === 'selectPeripherals' && 'Review current assets and select peripherals to assign'}
              {step === 'confirm' && 'Confirm peripheral assignment'}
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
            <span className={`flex items-center space-x-1 ${step === 'search' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'search' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>1</span>
              <span>Select Employee</span>
            </span>
            <span className="text-gray-400">→</span>
            <span className={`flex items-center space-x-1 ${step === 'selectPeripherals' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'selectPeripherals' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>2</span>
              <span>Select Peripherals</span>
            </span>
            <span className="text-gray-400">→</span>
            <span className={`flex items-center space-x-1 ${step === 'confirm' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'confirm' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>3</span>
              <span>Confirm</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading employees...</span>
            </div>
          ) : (
            <>
              {/* Step 1: Search Employee */}
              {step === 'search' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1 text-sm text-blue-900">
                        <p className="font-medium mb-1">Hardware Assignment Note</p>
                        <p>
                          Hardware assets are assigned via ServiceNow CSV import. This form assigns peripherals
                          to employees who have hardware. Select an employee below to view their current assets.
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
                      placeholder="Search by name, employee ID, email, or department..."
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>

                  <div className="text-sm text-gray-500 mb-2">
                    Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredEmployees.map((employee) => {
                      const assignedHardware = allAssets.filter(a => a.assignedTo === employee.employeeId);
                      const assignedPeripheralsCount = allPeripherals.filter(p => p.assignedTo === employee.employeeId).length;
                      
                      return (
                        <button
                          key={employee.id}
                          onClick={() => handleEmployeeSelect(employee)}
                          className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-sm text-gray-600">{employee.employeeId} • {employee.email}</p>
                              <p className="text-sm text-gray-500">{employee.department}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {assignedHardware.length > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Package className="w-3 h-3 mr-1" />
                                  {assignedHardware.length} hardware
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  No hardware
                                </span>
                              )}
                              {assignedPeripheralsCount > 0 && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {assignedPeripheralsCount} peripherals
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    
                    {filteredEmployees.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p>No employees found matching "{employeeSearch}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Select Peripherals */}
              {step === 'selectPeripherals' && selectedEmployee && (
                <div className="space-y-6">
                  {/* Employee Info Card */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedEmployee.name}</p>
                        <p className="text-sm text-gray-600">{selectedEmployee.employeeId} • {selectedEmployee.department}</p>
                      </div>
                    </div>
                  </div>

                  {/* Currently Assigned Hardware */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-green-600" />
                      Assigned Hardware ({employeeHardware.length})
                    </h3>
                    {employeeHardware.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {employeeHardware.map((hw) => (
                          <div key={hw.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{hw.model}</p>
                                <p className="text-sm text-gray-600 font-mono">{hw.serviceTag}</p>
                                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                  {hw.assetType}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">No Hardware Assigned</p>
                        <p className="text-sm text-gray-500">Import hardware from ServiceNow first</p>
                      </div>
                    )}
                  </div>

                  {/* Currently Assigned Peripherals */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                      Currently Assigned Peripherals ({employeePeripherals.length})
                    </h3>
                    {employeePeripherals.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {employeePeripherals.map((p) => (
                          <span
                            key={p.id}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                              p.verified 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {peripheralDisplayNames[p.type] || p.type}
                            {p.verified && <CheckCircle className="w-3 h-3 ml-1 inline" />}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No peripherals currently assigned</p>
                    )}
                  </div>

                  {/* Select New Peripherals */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Plus className="w-5 h-5 mr-2 text-blue-600" />
                      Assign New Peripherals from Stock
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Select peripherals to assign from available inventory</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availablePeripheralTypes.map((type) => {
                        const isSelected = selectedPeripherals.some(p => p.type === type);
                        const selection = selectedPeripherals.find(p => p.type === type);
                        const currentCount = getPeripheralCountByType(type);
                        const stockAvailable = getStockForType(type);
                        const remainingStock = stockAvailable - (selection?.quantity || 0);
                        const isOutOfStock = stockAvailable === 0;
                        
                        return (
                          <div
                            key={type}
                            className={`p-4 border-2 rounded-lg transition-colors ${
                              isOutOfStock
                                ? 'border-gray-200 bg-gray-50 opacity-60'
                                : isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <label className={`flex items-center space-x-3 flex-1 ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handlePeripheralToggle(type)}
                                  disabled={isOutOfStock}
                                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                                />
                                <div>
                                  <span className="font-medium text-gray-900">{peripheralDisplayNames[type]}</span>
                                  {currentCount > 0 && (
                                    <span className="ml-2 text-xs text-gray-500">
                                      ({currentCount} assigned)
                                    </span>
                                  )}
                                  <div className="flex items-center mt-1">
                                    {isOutOfStock ? (
                                      <span className="inline-flex items-center text-xs text-red-600">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Out of stock
                                      </span>
                                    ) : (
                                      <span className={`inline-flex items-center text-xs ${
                                        remainingStock <= 2 ? 'text-orange-600' : 'text-green-600'
                                      }`}>
                                        <Package className="w-3 h-3 mr-1" />
                                        {isSelected ? `${remainingStock} remaining` : `${stockAvailable} in stock`}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </label>
                              
                              {isSelected && !isOutOfStock && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleQuantityChange(type, -1)}
                                    disabled={(selection?.quantity || 1) <= 1}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">{selection?.quantity || 1}</span>
                                  <button
                                    onClick={() => handleQuantityChange(type, 1)}
                                    disabled={(selection?.quantity || 1) >= stockAvailable}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Stock Summary */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Stock Summary</p>
                      <div className="flex flex-wrap gap-2">
                        {availablePeripheralTypes.map(type => {
                          const stock = getStockForType(type);
                          return (
                            <span
                              key={type}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                stock === 0
                                  ? 'bg-red-100 text-red-700'
                                  : stock <= 2
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {peripheralDisplayNames[type]}: {stock}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <button
                      onClick={() => {
                        setStep('search');
                        setSelectedEmployee(null);
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setStep('confirm')}
                      disabled={selectedPeripherals.length === 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Review →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 'confirm' && selectedEmployee && (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        Employee Information
                      </h4>
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
                          <dt className="text-gray-600">Department:</dt>
                          <dd className="font-medium text-gray-900">{selectedEmployee.department}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Email:</dt>
                          <dd className="font-medium text-gray-900 text-xs">{selectedEmployee.email}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-green-600" />
                        Hardware ({employeeHardware.length})
                      </h4>
                      <div className="space-y-2">
                        {employeeHardware.map((hw) => (
                          <div key={hw.id} className="text-sm flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-gray-900 truncate">{hw.model}</span>
                            <span className="font-mono text-gray-500 text-xs ml-2">{hw.assetType}</span>
                          </div>
                        ))}
                        {employeeHardware.length === 0 && (
                          <p className="text-sm text-gray-500 italic">No hardware assigned</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      New Peripherals to Assign ({selectedPeripherals.reduce((sum, p) => sum + p.quantity, 0)})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPeripherals.map((p) => (
                        <span
                          key={p.type}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-200"
                        >
                          {peripheralDisplayNames[p.type]}
                          {p.quantity > 1 && <span className="ml-1">×{p.quantity}</span>}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audit Note (Optional)
                    </label>
                    <textarea
                      value={auditNote}
                      onChange={(e) => setAuditNote(e.target.value)}
                      placeholder="Add any notes about this peripheral assignment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <button
                      onClick={() => setStep('selectPeripherals')}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={submitting}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Assigning...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Confirm Assignment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
