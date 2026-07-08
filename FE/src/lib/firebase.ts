import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDWlkD1OgSqA6cUV-TaZc3ZMLpJCCbkN1U',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'bakti-udara.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'bakti-udara',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'bakti-udara.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1066653906311',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1066653906311:web:568487a6194f87b00e4f22',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-W3V94R26BP',
}

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export let analytics: Analytics | null = null

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

export default app
