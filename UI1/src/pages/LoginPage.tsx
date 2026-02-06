import { useState } from 'react';
import { Package, ArrowRight, Loader2, ChevronDown } from 'lucide-react';
import { UserRole, mockUsers } from '@/data/mockData';
import { authApi } from '@/services/api';

interface LoginPageProps {
  onLogin: (role: UserRole, userId: string) => void;
}

// Asset Manager sub-roles
type AssetManagerSubRole = 'assetManager' | 'networkEquipment' | 'audioVideo' | 'furniture';

const assetManagerSubRoles: { id: AssetManagerSubRole; title: string; description: string; demoEmail: string }[] = [
  { id: 'assetManager', title: 'IT Manager', description: 'Manage IT hardware inventory and assignments', demoEmail: 'nadim.mujawar@cencora.com' },
  { id: 'networkEquipment', title: 'Network Equipment Manager', description: 'Manage network equipment and servers', demoEmail: 'debasish@company.com' },
  { id: 'audioVideo', title: 'Audio Video Manager', description: 'Manage audio video equipment', demoEmail: 'pradeep@company.com' },
  { id: 'furniture', title: 'Furniture Manager', description: 'Manage furniture and fixtures', demoEmail: 'revant@company.com' },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedSubRole, setSelectedSubRole] = useState<AssetManagerSubRole | null>(null);
  const [showSubRoleDropdown, setShowSubRoleDropdown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useBackend, setUseBackend] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Try to connect to backend - no fallback allowed
      // Extract username from email (before @)
      const username = email.split('@')[0];
      const loginPassword = password || 'password';
      
      console.log('Attempting login with username:', username);
      
      const user = await authApi.login(username, loginPassword);
      
      console.log('Login successful, user:', user);
      
      // Store user details in sessionStorage for Navigation
      sessionStorage.setItem('currentUserName', user.name);
      sessionStorage.setItem('currentUserEmail', user.email);
      sessionStorage.setItem('currentUserDepartment', user.department);
      
      // Map backend role to frontend role
      const roleMap: Record<string, UserRole> = {
        'finance': 'finance',
        'assetManager': 'assetManager',
        'employee': 'employee',
        'networkEquipment': 'networkEquipment',
        'audioVideo': 'audioVideo',
        'furniture': 'furniture',
      };
      
      const role = roleMap[user.role] || selectedRole!;
      
      // Verify that the user's actual role matches the selected role
      if (selectedRole && role !== selectedRole) {
        setError(`Access denied. You are logged in as ${role}, not ${selectedRole}. Please select the correct role.`);
        setLoading(false);
        return;
      }
      
      onLogin(role, user.id.toString());
      setLoading(false);
    } catch (err: any) {
      console.error('Backend login failed:', err);
      setLoading(false);
      
      // Show appropriate error message
      if (err.message && err.message.includes('Access restricted')) {
        setError('Access restricted. Only finance users are allowed to login.');
      } else if (err.message && err.message.includes('Invalid credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message && err.message.includes('Failed to fetch')) {
        setError('Cannot connect to backend server. Please ensure it is running on http://localhost:8080');
      } else {
        setError(`Login failed: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const roles = [
    {
      id: 'finance' as UserRole,
      title: 'Finance User',
      description: 'Import SAP data, launch campaigns, track compliance',
      demoEmail: 'dhruv.khullar@cencora.com'
    },
    {
      id: 'assetManager' as UserRole,
      title: 'Asset Manager',
      description: 'Manage inventory, assign assets, review exceptions',
      demoEmail: 'nadim.mujawar@cencora.com',
      hasSubRoles: true
    }
  ];

  // Get current role info based on selection
  const getCurrentRoleInfo = () => {
    if (selectedRole === 'finance') {
      return roles.find(r => r.id === 'finance');
    }
    if (selectedSubRole) {
      return assetManagerSubRoles.find(r => r.id === selectedSubRole);
    }
    return null;
  };

  const handleAssetManagerClick = () => {
    setShowSubRoleDropdown(!showSubRoleDropdown);
  };

  const handleSubRoleSelect = (subRole: AssetManagerSubRole) => {
    setSelectedSubRole(subRole);
    setSelectedRole(subRole as UserRole);
    setShowSubRoleDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center w-50 h-12">
              <img 
                src="/cencoraLogo.png" 
                alt="Cencora Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to Package icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <Package className="w-12 h-12 text-[#461e96] hidden" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {/* Asset<br /> */}
            <span className="text-[#461e96]">Asset Verification System</span>
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
            <span>Enterprise IT Asset Management for Audit Compliance</span>
          </div>
          <div className="flex justify-center">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-[#461e96]">Powered by Cencora</span>
            </div>
          </div>
        </div>

        {!selectedRole ? (
          <div>
            <h2 className="text-center text-2xl font-semibold text-gray-900 mb-10">
              Select Your Role to Continue
            </h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {/* Finance User */}
                <div
                  onClick={() => setSelectedRole('finance')}
                  className="group cursor-pointer bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-[#461e96] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[280px] flex flex-col justify-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#461e96] to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#461e96] transition-colors">
                    Finance User
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Import SAP data, launch verification campaigns, and track compliance across the organization
                  </p>
                  <div className="flex items-center justify-center text-[#461e96] font-semibold group-hover:gap-2 transition-all">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Asset Manager with Sub-roles */}
                <div className="relative">
                  <div
                    onClick={handleAssetManagerClick}
                    className="group cursor-pointer bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-[#461e96] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[280px] flex flex-col justify-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#461e96] to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#461e96] transition-colors">
                      Asset Manager
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Manage inventory, assign assets, review verifications, and handle equipment across departments
                    </p>
                    <div className="flex items-center justify-center text-[#461e96] font-semibold group-hover:gap-2 transition-all">
                      <span>Choose Role</span>
                      <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-300 ${showSubRoleDropdown ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                    </div>
                  </div>

                  {/* Sub-role Dropdown */}
                  {showSubRoleDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-200 rounded-2xl shadow-2xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2">
                        {assetManagerSubRoles.map((subRole, index) => (
                          <button
                            key={subRole.id}
                            onClick={() => handleSubRoleSelect(subRole.id)}
                            className="w-full px-6 py-4 text-left hover:bg-gradient-to-r hover:from-[#461e96]/5 hover:to-purple-50 rounded-xl transition-all duration-200 group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#461e96] to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                <span className="text-white text-sm font-bold">
                                  {index === 0 ? 'IT' : index === 1 ? 'NET' : index === 2 ? 'AV' : 'FUR'}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 group-hover:text-[#461e96] transition-colors">{subRole.title}</p>
                                <p className="text-sm text-gray-500">{subRole.description}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-10">
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setSelectedSubRole(null);
                  setError(null);
                }}
                className="text-sm text-gray-600 hover:text-[#461e96] mb-8 flex items-center space-x-2 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Change Role</span>
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#461e96] to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {selectedRole === 'finance' ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ) : (
                    <Package className="w-8 h-8 text-white" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-lg">
                  {getCurrentRoleInfo()?.title || 'Selected Role'}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={getCurrentRoleInfo()?.demoEmail}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#461e96] focus:border-[#461e96] transition-all text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#461e96] focus:border-[#461e96] transition-all text-lg"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded accent-[#461e96]" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-[#461e96] hover:text-purple-700 font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#461e96] to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 mb-2">
                  <strong>Demo Mode:</strong> Click "Sign In" to access the system as{' '}
                  {roles.find(r => r.id === selectedRole)?.title}
                </p>
                <p className="text-xs text-gray-600">
                  Demo credentials: Use email shown in placeholder, password: <code className="bg-gray-100 px-1 rounded">password</code>
                </p>
                <label className="flex items-center mt-2 text-xs text-gray-600">
                  <input 
                    type="checkbox" 
                    checked={useBackend}
                    onChange={(e) => setUseBackend(e.target.checked)}
                    className="mr-2 rounded" 
                  />
                  <span>Connect to Backend (http://localhost:8080)</span>
                </label>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}