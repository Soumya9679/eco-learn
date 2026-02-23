import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

let _db: Firestore | null = null;
let _auth: Auth | null = null;
let _initialized = false;

function init() {
  if (_initialized) return;
  _initialized = true;

  // Dynamic imports at runtime only
  const { initializeApp, getApps, cert } = require("firebase-admin/app");
  const { getFirestore } = require("firebase-admin/firestore");
  const { getAuth } = require("firebase-admin/auth");

  let app;
  if (getApps().length > 0) {
    app = getApps()[0];
  } else {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Firebase Admin credentials not configured");
      return;
    }

    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  _db = getFirestore(app);
  _auth = getAuth(app);
}

export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    init();
    if (!_db) throw new Error("Firebase Admin not initialized");
    return (_db as any)[prop];
  },
});

export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    init();
    if (!_auth) throw new Error("Firebase Admin not initialized");
    return (_auth as any)[prop];
  },
});

// Lazy FieldValue export - avoids importing firebase-admin/firestore at module evaluation time
let _FieldValue: any = null;
export function getFieldValue() {
  if (!_FieldValue) {
    const { FieldValue } = require("firebase-admin/firestore");
    _FieldValue = FieldValue;
  }
  return _FieldValue;
}
