'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminRoute from '../components/admin-route/AdminRoute';

function AdminContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const stats = [
    { label: 'Пользователь', value: user?.displayName || user?.email || '—' },
    { label: 'Email', value: user?.email || '—' },
    { label: 'Роль', value: 'Администратор' },
  ];

  return (
    <section className="flex-1 py-32 px-4 bg-white">
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[1px] text-[#6960C5] mb-2">
              Панель управления
            </p>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#1b1b1b] font-['Space_Grotesk',sans-serif]">
              Админ-панель
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-[18px] border border-[#1b1b1b] px-5 py-3 text-[14px] font-bold uppercase tracking-[1px] text-[#1b1b1b] hover:bg-[#1b1b1b] hover:text-white transition-colors"
          >
            Выйти
          </button>
        </div>

        <div className="rounded-[12px] border border-[#d1d5db] divide-y divide-[#e5e7eb] mb-10">
          {stats.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-4">
              <span className="text-[12px] font-bold uppercase tracking-[1px] text-[#6a7282]">
                {item.label}
              </span>
              <span className="text-sm text-[#1b1b1b] truncate max-w-[260px]">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/admin/questions"
            className="rounded-[12px] border border-[#d1d5db] p-6 hover:border-[#1b1b1b] transition-colors"
          >
            <h2 className="text-[14px] font-bold uppercase tracking-[1px] text-[#1b1b1b] mb-2 font-['Space_Grotesk',sans-serif]">
              Банк вопросов
            </h2>
            <p className="text-sm text-[#6a7282]">
              Добавление, редактирование и тегирование вопросов по всем предметам.
            </p>
          </Link>

          <Link
            href="/admin/tests"
            className="rounded-[12px] border border-[#d1d5db] p-6 hover:border-[#1b1b1b] transition-colors"
          >
            <h2 className="text-[14px] font-bold uppercase tracking-[1px] text-[#1b1b1b] mb-2 font-['Space_Grotesk',sans-serif]">
              Варианты тестов
            </h2>
            <p className="text-sm text-[#6a7282]">
              Сборка фиксированных вариантов ЕНТ и управление публикацией.
            </p>
          </Link>

          <div className="rounded-[12px] border border-[#d1d5db] p-6">
            <h2 className="text-[14px] font-bold uppercase tracking-[1px] text-[#1b1b1b] mb-2 font-['Space_Grotesk',sans-serif]">
              Пользователи
            </h2>
            <p className="text-sm text-[#6a7282]">
              Раздел для управления пользователями появится здесь.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminContent />
    </AdminRoute>
  );
}
