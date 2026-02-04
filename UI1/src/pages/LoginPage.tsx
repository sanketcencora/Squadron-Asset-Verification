import { useState } from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { UserRole } from '@/data/mockData';
import { RoleSignInPage } from '@/pages/RoleSignInPage';

interface LoginPageProps {
  onLogin: (
    role: UserRole,
    userId: string,
    assetDepartment?: 'IT Endpoint Team' | 'Network Equipment Team' | 'Workspace Team'
  ) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    {
      id: 'finance' as UserRole,
      title: 'Finance User',
      description: 'Import SAP data, launch campaigns, track compliance'
    },
    {
      id: 'assetManager' as UserRole,
      title: 'Asset Manager',
      description: 'Manage inventory, assign assets, review exceptions'
    },
    {
      id: 'employee' as UserRole,
      title: 'Employee',
      description: 'Verify assigned hardware and peripherals'
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f2effa] via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Logo className="h-8 w-auto" />
      </div>
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#461e96] rounded-2xl mb-4">
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
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:border-[#461e96] hover:shadow-lg transition-all group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#461e96]">
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {role.description}
                  </p>
                  <div className="flex items-center text-sm text-[#461e96] font-medium">
                    Continue as {role.title}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <RoleSignInPage
              role={selectedRole}
              onLogin={onLogin}
              onBack={() => setSelectedRole(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}