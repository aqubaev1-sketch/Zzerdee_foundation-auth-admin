// Одноразовый скрипт: выдаёт/снимает custom claim admin для пользователя по email.
//
// Использование:
//   node scripts/setAdminClaim.mjs a.qubaev1@gmail.com          -> выдать роль admin
//   node scripts/setAdminClaim.mjs a.qubaev1@gmail.com --revoke -> снять роль admin
//
// Требуется файл service-account.json в корне проекта (НЕ коммитить, уже в .gitignore).
// Скачать: Firebase Console -> Project settings -> Service accounts -> Generate new private key.

import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const email = process.argv[2];
const revoke = process.argv.includes('--revoke');

if (!email) {
  console.error('Укажи email: node scripts/setAdminClaim.mjs user@example.com [--revoke]');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();

const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { admin: revoke ? null : true });

// Токены с уже выданным старым claim остаются валидны до истечения (обычно 1 час)
// или до принудительного revokeRefreshTokens — форсим, чтобы роль применилась сразу.
await auth.revokeRefreshTokens(user.uid);

console.log(
  revoke
    ? `Роль admin снята с ${email} (uid: ${user.uid}).`
    : `Роль admin выдана ${email} (uid: ${user.uid}).`,
);
console.log('Пользователю нужно перелогиниться (или дождаться обновления токена), чтобы claim применился на клиенте.');
