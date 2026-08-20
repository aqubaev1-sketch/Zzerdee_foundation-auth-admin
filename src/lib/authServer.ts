import { NextRequest } from 'next/server';
import { adminAuth } from './firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

// Достаёт и проверяет Firebase ID token из заголовка Authorization: Bearer <token>.
// Клиент должен слать этот заголовок на каждый запрос к /api/* (см. пример fetch ниже).
export async function requireUser(req: NextRequest): Promise<DecodedIdToken> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new AuthError('Не авторизован: отсутствует токен.', 401);
  }

  try {
    // checkRevoked: true — чтобы отозванные/забаненные аккаунты не проходили
    // по старому, ещё не истёкшему токену
    return await adminAuth.verifyIdToken(token, true);
  } catch {
    throw new AuthError('Не авторизован: недействительный токен.', 401);
  }
}

// То же самое, но дополнительно требует custom claim admin === true.
// Роль НИКОГДА не проверяется по email или по полю в Firestore — только по claim в токене.
export async function requireAdmin(req: NextRequest): Promise<DecodedIdToken> {
  const decoded = await requireUser(req);
  if (decoded.admin !== true) {
    throw new AuthError('Доступ запрещён: требуется роль администратора.', 403);
  }
  return decoded;
}

/*
Пример использования на клиенте (например, в админке при сохранении вопроса):

  const idToken = await auth.currentUser?.getIdToken();
  const res = await fetch('/api/admin/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });
*/
