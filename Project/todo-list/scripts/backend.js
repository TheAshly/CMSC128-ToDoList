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
import { 
    getAuth, 
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


const firebaseConfig = {
    //firebaseConfig goes boom
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let accessPoint = "Tasks"
let accessPointLoc 


// BandAid solution muna for a problem that will probably not happen but just my ocd is just triggering
var hasVisited = sessionStorage.getItem('was_here');

onAuthStateChanged(auth, async (user) => {    
    const docRef = doc(db, "Accounts", user.uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const data = snapshot.data()
        if (!hasVisited){
            accessPointLoc = user.uid;
            await updateDoc(docRef, {
                "collabing.state" : false
            });  
            sessionStorage.setItem('was_here', true);
        } else if(data.collabing.state) {
            accessPoint = "Collaboration";
            accessPointLoc = data.collabing.location;
        } else if(user.uid != data.collabing.location){
            accessPoint = "Collaboration";
            accessPointLoc = data.collabing.location;
            await updateDoc(docRef, {
                "collabing.state" : true
            });  
        } else accessPointLoc = user.uid;
    } else {
        console.error(`Document ${idArg} does not exist.`);
    }
});


export async function addTask(nameArg, priorityArg, dateAddedArg, dateDueArg, checkedArg = false) {
    const tempDoc = collection(db, "Accounts", accessPointLoc, accessPoint); 
    const newDoc = doc(tempDoc); 
    await setDoc(newDoc, {
        id: newDoc.id,
        name: nameArg,
        priority: priorityArg,
        dateAdded: dateAddedArg, 
        dateDue: dateDueArg,
        checked: checkedArg
    });  

}

export async function editTask(idArg, nameArg, priorityArg, dateDueArg) {  
    await updateDoc(doc(db, "Accounts", accessPointLoc, accessPoint, idArg), {
        name: nameArg,
        priority: priorityArg, 
        dateDue: dateDueArg,
    });  
}

export async function updateCheckbox(idArg) {
    const docRef = doc(db, "Accounts", accessPointLoc, accessPoint, idArg);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        const data = snapshot.data()
        const toggledChecked = (data.checked) ? false : true;
        await updateDoc(doc(db, "Accounts", accessPointLoc, accessPoint, idArg), {
            checked: toggledChecked
        });    

    } else {
        console.error(`Document ${idArg} does not exist.`);
    
    }
}


export async function getTask(idArg) {
    const docRef = doc(db, "Accounts", accessPointLoc, accessPoint, idArg);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const data = snapshot.data()
        return data; 
    } else {
        console.error(`Document ${idArg} does not exist.`);
    }
}

export async function getTasks() {
    const snapshot = await getDocs(collection(db, "Accounts", accessPointLoc, accessPoint));
    return (snapshot.docs.map(doc => doc.data()));
}

export async function deleteTask(id) {
    await deleteDoc(doc(db, "Accounts", accessPointLoc, accessPoint, id));
}

export async function getUser() {
    return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {    
            const docRef = doc(db, "Accounts", user.uid);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                const data = snapshot.data()
                resolve(data); 
            } else {
                console.error(`Document ${idArg} does not exist.`);
                reject(); 
            }
        });
    });  
}

export async function getMainDatabase() {
    const snapshot = await getDocs(collection(db, "Accounts"));
    return (snapshot.docs.map(doc => doc.data()));
}

export async function updateState(state) {    
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {  
            const docRef = doc(db, "Accounts", user.uid);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                await updateDoc(docRef, {
                    "collabing.state" : state
                
                });    
                resolve();
            } else {
                console.error(`Document ${idArg} does not exist.`);
                reject();
            }
        });  
    }); 
}

export async function setLocation(location) {    
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {  
            const docRef = doc(db, "Accounts", user.uid);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                await updateDoc(docRef, {
                    "collabing.location" : location
                
                });    
                resolve();
            } else {
                console.error(`Document ${idArg} does not exist.`);
                reject();
            }
        });  
    }); 
}

export async function resetLocation() {    
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {  
            const docRef = doc(db, "Accounts", user.uid);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                await updateDoc(docRef, {
                    "collabing.location" : user.uid
                
                });    
                resolve();
            } else {
                console.error(`Document ${idArg} does not exist.`);
                reject();
            }
        });  
    }); 
}