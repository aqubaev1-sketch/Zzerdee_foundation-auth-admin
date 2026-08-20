'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

// Проверка роли — только через custom claim (useAuth().isAdmin), который читается
// из ID-токена. Это лишь UI-гейт для удобства навигации: настоящая защита данных —
// в firestore.rules (isAdmin()) и в requireAdmin() на API-роутах. Даже если кто-то
// обойдёт эту проверку на клиенте, записи в Firestore/вызовы /api/admin/* всё равно
// отклонятся сервером.
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!user.emailVerified) {
      router.replace(`/verify-email?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isAdmin) {
      router.replace('/');
    }
  }, [loading, user, isAdmin, router, pathname]);

  if (loading || !user || !user.emailVerified || !isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-[#6a7282] text-sm uppercase tracking-[1px]">Проверка доступа...</p>
      </div>
    );
  }

  return <>{children}</>;
}
