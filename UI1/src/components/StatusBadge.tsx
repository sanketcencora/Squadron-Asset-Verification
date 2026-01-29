import { VerificationStatus } from '@/data/mockData';

interface StatusBadgeProps {
  status: VerificationStatus | 'Instock' | 'Assigned' | 'Active' | 'Completed' | 'Draft';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Verified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Overdue':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Exception':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Not Started':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Instock':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Draft':
        return 'bg-gray-50 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${getStatusStyles()} ${sizeClasses}`}>
      {status}
    </span>
  );
}
