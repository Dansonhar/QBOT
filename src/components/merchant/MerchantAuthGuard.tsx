import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';

export default function MerchantAuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useMerchantAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/tools/wa-order/login" replace />;
  }

  return <>{children}</>;
}
