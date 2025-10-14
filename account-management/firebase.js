// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
    getFirestore, collection, addDoc, getDocs, updateDoc, doc
}  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js" ;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// NOTE! Delete firebaseConfig every before any commit attempt

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

// === Firestore helper functions ===
export async function addTaskToDB (userName, email, password) {
    const docRef = await addDoc(collection (db, "Accounts"), { userName, email, password});
    return docRef.id;
}
export async function getTasksFromDB() {
    const snapshot = await getDocs(collection (db, "Accounts"));
    return snapshot.docs.map(docSnap => ({ id: docSnap.id,...docSnap.data() }));
}
export async function updateTaskInDB(id, newName, newEmail, newPassword) {
    await updateDoc(doc(db, "Accounts", id), { userName: newName, email: newEmail, password: newPassword});
}