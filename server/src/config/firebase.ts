import admin from "firebase-admin"

//@ts-ignore
import serviceAccountKey from "../../firebase.key.json"

const initializeFirebase = () => {
  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      })

      console.log("Firebase Admin SDK initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Firebase Admin SDK:", error)
      throw error
    }
  }

  return admin
}

// Get Firestore database instance
export const getFirestore = () => {
  initializeFirebase()
  return admin.firestore()
}

export default initializeFirebase
