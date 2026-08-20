'use client';

import {
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { auth, googleProvider } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Человеко-понятные сообщения об ошибках Firebase Auth (на русском)
export function getAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';

  const messages: Record<string, string> = {
    'auth/invalid-email': 'Некорректный email-адрес.',
    'auth/user-disabled': 'Этот аккаунт заблокирован.',
    'auth/user-not-found': 'Пользователь с таким email не найден.',
    'auth/wrong-password': 'Неверный пароль.',
    'auth/invalid-credential': 'Неверный email или пароль.',
    'auth/email-already-in-use': 'Этот email уже используется.',
    'auth/weak-password': 'Пароль слишком слабый (минимум 6 символов).',
    'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже.',
    'auth/popup-closed-by-user': 'Окно входа через Google было закрыто.',
    'auth/network-request-failed': 'Проблема с сетью. Проверьте подключение.',
    'auth/requires-recent-login': 'Нужно снова войти в аккаунт, чтобы выполнить это действие.',
  };

  return messages[code] ?? 'Произошла ошибка. Попробуйте ещё раз.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // onIdTokenChanged (а не onAuthStateChanged) — потому что нам нужно перечитывать
    // custom claims при каждом обновлении токена, не только при логине/логауте.
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // false = не форсить обновление токена лишний раз; после выдачи новой роли
        // скрипт setAdminClaim.mjs сам отзывает refresh token, так что при следующем
        // онлайн-заходе пользователь и так получит новый токен с claim.
        const tokenResult = await firebaseUser.getIdTokenResult();
        setIsAdmin(tokenResult.claims.admin === true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name?: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }
    // Отправляем письмо для подтверждения email сразу после регистрации
    await sendEmailVerification(credential.user);
    // Обновляем состояние, чтобы компоненты увидели свежего пользователя
    setUser(auth.currentUser ? { ...auth.currentUser } as User : null);
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error('Нет авторизованного пользователя.');
    }
    await sendEmailVerification(auth.currentUser);
  };

  // Перечитывает пользователя с сервера Firebase (нужно, чтобы узнать
  // актуальный статус emailVerified после перехода по ссылке из письма)
  const refreshUser = async () => {
    if (!auth.currentUser) {
      setUser(null);
      setIsAdmin(false);
      return null;
    }
    await auth.currentUser.reload();
    const refreshed = auth.currentUser ? ({ ...auth.currentUser } as User) : null;
    setUser(refreshed);
    if (auth.currentUser) {
      const tokenResult = await auth.currentUser.getIdTokenResult();
      setIsAdmin(tokenResult.claims.admin === true);
    }
    return refreshed;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      login,
      register,
      loginWithGoogle,
      logout,
      resetPassword,
      sendVerificationEmail,
      refreshUser,
    }),
    [user, loading, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри <AuthProvider>');
  }
  return context;
}
