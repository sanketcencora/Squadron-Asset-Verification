import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { UserRole, mockUsers } from '@/data/mockData';

interface RoleSignInPageProps {
  role: UserRole;
  onLogin: (
    role: UserRole,
    userId: string,
    assetDepartment?: 'IT Endpoint Team' | 'Network Equipment Team' | 'Workspace Team'
  ) => void;
  onBack: () => void;
}

export function RoleSignInPage({ role, onLogin, onBack }: RoleSignInPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAssetDepartment, setSelectedAssetDepartment] = useState<
    'IT Endpoint Team' | 'Network Equipment Team' | 'Workspace Team' | null
  >(null);

  const roleMeta = {
    finance: {
      title: 'Finance Department',
      demoEmail: 'sarah.chen@company.com',
      description: 'Import SAP data, launch campaigns, track compliance',
    },
    assetManager: {
      title: 'Asset Manager',
      demoEmail: 'michael.torres@company.com',
      description: 'Manage inventory, assign assets, review exceptions',
    },
    employee: {
      title: 'Employee',
      demoEmail: 'emily.johnson@company.com',
      description: 'Verify assigned hardware and peripherals',
    },
    networkEquipment: {
      title: 'Network Equipment Manager',
      demoEmail: 'net.manager@company.com',
      description: 'Network hardware & equipment management',
    },
    audioVideo: {
      title: 'Audio Video Manager',
      demoEmail: 'av.manager@company.com',
      description: 'Audio/video equipment & systems management',
    },
    furniture: {
      title: 'Workspace Manager',
      demoEmail: 'workspace.manager@company.com',
      description: 'Furniture & office equipment management',
    },
  } as const;

  const assetDepartments = [
    'IT Endpoint Team',
    'Network Equipment Team',
    'Workspace Team',
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find((u) => u.role === role);
    if (!user) {
      alert('Demo user not found for the selected role');
      return;
    }
    const dept = role === 'assetManager' ? selectedAssetDepartment ?? undefined : undefined;
    onLogin(role, user.id, dept);
  };

  const meta = roleMeta[role];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Top-left brand logo (registration page only) */}
      <div className="fixed top-4 left-4 flex items-center space-x-2">
        <Logo className="h-8 w-auto select-none" />
      </div>
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Department Selection
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-600 mb-6">{meta.title}</p>

          {role === 'assetManager' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset Manager Department</label>
              <div className="grid grid-cols-3 gap-2">
                {assetDepartments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedAssetDepartment(dept)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      selectedAssetDepartment === dept
                        ? 'border-[#461e96] text-[#461e96] bg-[#F1EDFB]'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={meta.demoEmail}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#461e96] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#461e96] focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-[#461e96] hover:text-[#351778]">Forgot password?</a>
            </div>
            <button type="submit" className="w-full bg-[#461e96] text-white py-2.5 rounded-lg font-medium hover:bg-[#351778] transition-colors">Sign In</button>
          </form>

          {/* Demo Mode note removed per request */}
        </div>
      </div>
    </div>
  );
}
