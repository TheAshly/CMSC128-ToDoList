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
    // we need a firebase config file for this para no need na mag sagi ctrl c + ctrl v  :>
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Added Variables Here due to dynamic changing of file handling and location
let userTDLState = "Tasks"   // = Points to user state, either in Personal TDL or Collabing TDL(s)
let currentIDLocation          // = If User in Collabing TDL, This points to which one


// BandAid Solution if the user is in a Collaborative CDL of another person
// And they got removed from that CDL
// So if the tab is new, force the user to go to Personal TDL
var hasVisited = sessionStorage.getItem('was_here');


// Determines where and what kind of TDL will be shown to the user based on their inputs
// e.g. Personal TDL, Their Own Collabing TDL, or Others Collabing TDL
onAuthStateChanged(auth, async (user) => {    
    const docRef = doc(db, "Accounts", user.uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const data = snapshot.data()
        if (!hasVisited){
            currentIDLocation = user.uid;
            await updateDoc(docRef, {
                "collabing.state" : false
            });  
            sessionStorage.setItem('was_here', true);
        } else if(data.collabing.state) {
            userTDLState = "Collaboration";
            currentIDLocation = data.collabing.location;
        } else if(user.uid != data.collabing.location){
            userTDLState = "Collaboration";
            currentIDLocation = data.collabing.location;
            await updateDoc(docRef, {
                "collabing.state" : true
            });  
        } else currentIDLocation = user.uid;
    } else {
        console.error(`Document ${idArg} does not exist.`);
    }
});


export async function addTask(nameArg, priorityArg, dateAddedArg, dateDueArg, checkedArg = false) {
    const tempDoc = collection(db, "Accounts", currentIDLocation, userTDLState); 
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
    await updateDoc(doc(db, "Accounts", currentIDLocation, userTDLState, idArg), {
        name: nameArg,
        priority: priorityArg, 
        dateDue: dateDueArg,
    });  
}

export async function updateCheckbox(idArg) {
    const docRef = doc(db, "Accounts", currentIDLocation, userTDLState, idArg);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        const data = snapshot.data()
        const toggledChecked = (data.checked) ? false : true;
        await updateDoc(doc(db, "Accounts", currentIDLocation, userTDLState, idArg), {
            checked: toggledChecked
        });    

    } else {
        console.error(`Document ${idArg} does not exist.`);
    
    }
}


export async function getTask(idArg) {
    const docRef = doc(db, "Accounts", currentIDLocation, userTDLState, idArg);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const data = snapshot.data()
        return data; 
    } else {
        console.error(`Document ${idArg} does not exist.`);
    }
}

export async function getTasks() {
    const snapshot = await getDocs(collection(db, "Accounts", currentIDLocation, userTDLState));
    return (snapshot.docs.map(doc => doc.data()));
}

export async function deleteTask(id) {
    await deleteDoc(doc(db, "Accounts", currentIDLocation, userTDLState, id));
}

// New Functions
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

// Assume na if may show all ta like daw same sa tasks, and may remove task
// diri may remove collaborator and ang gina accept ya nga parameter
// is ang UID sang gin remove 
// Wala ni dapat button kung wala ang user sa ila own na CTDL (Collabing TDL)   
export async function removeCollaborator(idArg) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("No authenticated user.");
        return false;
    }

    try {
        const docRef = doc(db, "Accounts", user.uid);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            console.error(`Document for user ${user.uid} does not exist.`);
            return false;
        }

        const data = snapshot.data();
        let tempCollabArray = data.collaborators || [];
        tempCollabArray = tempCollabArray.filter(uid => uid !== idArg);

        await updateDoc(docRef, {
           collaborators: tempCollabArray
        });

        console.log(`Collaborator ${idArg} removed.`);
        return true;
    } catch (error) {
        console.error("Error removing collaborator:", error);
        return false;
    }
}

// Assume na if may show all ta like daw same sa tasks, and may add task
// diri may add collaborator and ang gina accept ya nga parameter
// is ang uid/username sang gin add 
// Wala ni dapat button kung wala ang user sa ila own na CTDL (Collabing TDL)   
// Ga return sya guro boolean meaning if ara ang gin try add sa system or wala
export async function addCollaborator(collaborator) {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                reject("No authenticated user.");
                return;
            }
            try {
                const databases = await getMainDatabase();
                let found = false;

                for (const database of databases) {
                    if (
                        database.uid !== user.uid &&
                        (database.username === collaborator || database.email === collaborator)
                    ) {
                        found = true;

                        const docRef = doc(db, "Accounts", user.uid);
                        const snapshot = await getDoc(docRef);

                        if (!snapshot.exists()) {
                            resolve(false);
                            return;
                        }

                        const data = snapshot.data();
                        if (data.collaborators.includes(database.uid)) {
                            resolve(false);
                            return;
                        }

                        const tempCollabArray = Array.isArray(data.collaborators)
                        ? [...data.collaborators, database.uid]
                        : [database.uid];
        
                        await updateDoc(docRef, { collaborators: tempCollabArray });
                        resolve(true);
                        return; 
                    }
                }
                if (!found) resolve(false);
            } catch (error) {
                console.error("Error adding collaborator:", error);
                reject(false);
            }
        });
    }); 
}

// Gin baylo lng ikaw naman gin remove kung diin kaman currently
export async function leaveCollaboratorTDL() {  
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("No authenticated user.");
        return false;
    }

    try {
        const docRef = doc(db, "Accounts", currentIDLocation);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            console.error(`Document for user ${user.uid} does not exist.`);
            return false;
        }

        const data = snapshot.data();
        let tempCollabArray = data.collaborators || [];
        tempCollabArray = tempCollabArray.filter(uid => uid !== user.uid);

        await updateDoc(docRef, {
           collaborators: tempCollabArray
        });
        await resetLocation();
        
        return true;
    } catch (error) {
        console.error("Error leaving collaboration:", error);
        return false;
    }
     
}

// Gina return ya ang array sang email daan naka uid ang array na stores sa database
export async function getCollaborators() {
    const docRef = doc(db, "Accounts", currentIDLocation);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        console.error(`Document ${currentIDLocation} does not exist.`);
        return [];
    }

    const collaboratorsArray = snapshot.data().collaborators || [];
    const collaboratorInfo = [];

    for (const collaboratorID of collaboratorsArray) {

        const collaboratorRef = doc(db, "Accounts", collaboratorID);
        const collaboratorSnap = await getDoc(collaboratorRef);

        if (collaboratorSnap.exists()) {
           const collaboratorData = collaboratorSnap.data();
            collaboratorInfo.push({
                id: collaboratorID,
                username: collaboratorData.username,
                email: collaboratorData.email 
            });
        }
    }
    return collaboratorInfo;
}

export async function logoutUser() {
    await signOut(auth);
    window.location.href = "/"; 
}