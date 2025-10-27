import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
    getFirestore, 
    collection, 
    addDoc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js" ;

const firebaseConfig = {
    // config deez nuts
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function addTask(nameArg, priorityArg, dateAddedArg, dateDueArg, checkedArg = false) {
    const tempDoc = doc(collection(db, 'tasks'));
    await setDoc(doc(db, "tasks", tempDoc.id), {
        id: tempDoc.id,
        name: nameArg,
        priority: priorityArg,
        dateAdded: dateAddedArg, 
        dateDue: dateDueArg,
        checked: checkedArg
    });    
}

export async function editTask(idArg, nameArg, priorityArg, dateDueArg) {
    await updateDoc(doc(db, "tasks", idArg), {
        name: nameArg,
        priority: priorityArg, 
        dateDue: dateDueArg,
    });    
}

export async function updateCheckbox(idArg) {
    const docRef = doc(db, "tasks", idArg);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const data = snapshot.data()
        const toggledChecked = (data.checked === "true") ? "false" : "true";
        await updateDoc(doc(db, "tasks", idArg), {
            checked: toggledChecked
        });    
    } else {
        console.error(`Document ${idArg} does not exist.`);
    }
}

export async function getTask(idArg) {
    const docRef = doc(db, "tasks", idArg);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const data = snapshot.data()
        return data; 
    } else {
        console.error(`Document ${idArg} does not exist.`);
    }
}

export async function getTasks() {
    const snapshot = await getDocs(collection(db, "tasks"));
    return snapshot.docs.map(doc => doc.data());
}

export async function deleteTask(id) {
    await deleteDoc(doc(db, "tasks", id));
}

