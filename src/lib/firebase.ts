import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Конфигурация берётся из переменных окружения (см. .env.local.example).
// Значения нужно взять в консоли Firebase:
// https://console.firebase.google.com/ -> Project settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// initializeApp повторно не вызываем при hot-reload в dev-режиме
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// ВАЖНО: клиентский db читает только "публичные" данные согласно firestore.rules
// (например, questions без поля correctAnswer/explanation при чтении студентом —
// эти поля вообще не должны быть читаемы студентом по Rules, см. firestore.rules).
// Всё, что требует проверки правильных ответов, идёт через /api/* (см. src/lib/firebase-admin.ts).

export default app;
