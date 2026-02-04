import { useState } from 'react';
import { Package, ArrowRight, Loader2 } from 'lucide-react';
import { UserRole, mockUsers } from '@/data/mockData';
import { authApi } from '@/services/api';

interface LoginPageProps {
  onLogin: (role: UserRole, userId: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
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
      demoEmail: 'sarah.chen@company.com'
    },
    {
      id: 'assetManager' as UserRole,
      title: 'Asset Manager',
      description: 'Manage inventory, assign assets, review exceptions',
      demoEmail: 'michael.torres@company.com'
    },
    {
      id: 'employee' as UserRole,
      title: 'Employee',
      description: 'Verify assigned hardware and peripherals',
      demoEmail: 'emily.johnson@company.com'
    },
    {
      id: 'networkEquipment' as UserRole,
      title: 'Network Equipment Manager',
      description: 'Manage network equipment and servers with Power BI reports',
      demoEmail: 'debasish@company.com'
    },
    {
      id: 'audioVideo' as UserRole,
      title: 'Audio Video Manager',
      description: 'Manage audio video equipment with Power BI reports',
      demoEmail: 'pradeep@company.com'
    },
    {
      id: 'furniture' as UserRole,
      title: 'Furniture Manager',
      description: 'Manage furniture and fixtures with Power BI reports',
      demoEmail: 'revant@company.com'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Automated Hardware & Peripheral Verification System
          </h1>
          <p className="text-gray-600">
            Enterprise IT Asset Management for Audit Compliance
          </p>
        </div>

        {!selectedRole ? (
          <div>
            <h2 className="text-center text-xl font-semibold text-gray-900 mb-6">
              Select Your Role to Continue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {role.description}
                  </p>
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    Continue as {role.title}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-sm text-gray-600 hover:text-gray-900 mb-6"
              >
                ← Change Role
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sign In
              </h2>
              <p className="text-gray-600 mb-6">
                {roles.find(r => r.id === selectedRole)?.title}
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={roles.find(r => r.id === selectedRole)?.demoEmail}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
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