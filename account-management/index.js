import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
    getFirestore, 
    collection, 
    addDoc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    doc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js" ;
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    updatePassword
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


// configs
const firebaseConfig = {
// Config deez nuts
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app)

onAuthStateChanged(auth, async (user) => {    
    if (user) {
        homeContainer.classList.remove("hidden");
        editForm.classList.add("hidden");
        loginContainer.classList.add("hidden");
        registerContainer.classList.add("hidden");    
    
        const loginUser = await getDoc(doc(db, "Accounts", user.uid));
        if (loginUser.exists()) {
            const data = loginUser.data();
            console.log("Welcome:", data.username);
            
            homeContainer.querySelector("#edit-user-name").value = data.username;

            homeContainer.querySelector("#user-name").textContent = data.username;
            homeContainer.querySelector("#user-email").textContent = data.email;
        } else {
            console.log("No such document!");
        }     
    } else {
        console.log("No accounts!");
    }

    submitEditBtn.addEventListener("click", async e => {
        e.preventDefault();
        
        const name = homeContainer.querySelector("#edit-user-name").value.trim();
        const password = homeContainer.querySelector("#edit-password").value;

        try {
            const userRef = doc(db, "Accounts", user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
            await updateDoc(userRef, { username: name });
            const updatedSnap = await getDoc(userRef);
            const updatedData = updatedSnap.data();

            homeContainer.querySelector("#user-name").textContent = updatedData.username;
            accountForm.classList.remove("hidden");
            editForm.classList.add("hidden");

            console.log("Username updated to:", updatedData.username);
                
            const newPassword = password;
            updatePassword(user, newPassword).then(() => {
               console.log("Password Update Successfully")
            }).catch((error) => {
                // An error occurred
                // ...
            });
        
            } else {
            console.log("No such document!");
            }            
        } catch (e) {
            console.error("Unhandled error:", e.message);
        }
    })
});

// errors 
const EMPTYFIELD = "Please enter an appropriate input";
const INCORRECTEMAIL = "Email must contain @gmail.com";
const NULLEMAIL = "Email doesn't exist";
const WRONGPASS = "Wrong password";
const EMAILEXISITNG = "Email already exists";
const INCORRECTPASS = "Password is not the same";
const NOACCOUNT = "Email or password is incorrect";
const SMALLPASSWORDLENGTH = "Password must be a length of seven or higher";
const USERLOGGEDIN = "userloggedin";
const ACCOUNTNAME = "accountname";
const ACCOUNTEMAIL = "accountemail";
const ACCOUNTPASS = "accountpassword";

const registerContainer = document.getElementById("register-field");
const loginContainer = document.getElementById("login-field");
const homeContainer = document.getElementById("account-field");

const toRegisterContainer = document.getElementById("sign-up");
const toLoginContainer = document.getElementById("register-close-btn");

toLoginContainer.addEventListener("click", e => {
    e.preventDefault();
    registerContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
});

toRegisterContainer.addEventListener("click", e => {
    e.preventDefault();
    registerContainer.classList.remove("hidden");
    loginContainer.classList.add("hidden");
});


const registerForm = document.getElementById("register-inputs");
const loginForm = document.getElementById("login-inputs");
const editForm = document.getElementById("edit-inputs");
const accountForm = document.getElementById("account-data");
const forgotForm = document.getElementById("forgot-field");

const forgotPasswordLink = document.querySelector(".forgot-password");
const forgotCloseBtn = document.getElementById("forgot-close-btn");
const searchPassword = document.getElementById("find-password-account");
const registerBtn = document.getElementById("create-account");
const loginBtn = document.getElementById("retrieve-account");
const editBtn = document.getElementById("edit-info");
const cancelEditBtn = document.getElementById("cancel-edit");
const logoutBtn = document.getElementById("log-out");
const submitEditBtn = document.getElementById("edit-account");
const darkOverlay = document.getElementById("dark-overlay");

forgotPasswordLink.addEventListener("click", async e => {
    e.preventDefault();
    forgotForm.classList.remove("hidden");
    darkOverlay.classList.remove("hidden");
});

forgotCloseBtn.addEventListener("click", async e => {
    e.preventDefault();
    forgotForm.classList.add("hidden");
    darkOverlay.classList.add("hidden");
});

searchPassword.addEventListener("click", async e => {
    e.preventDefault();
    try {
        const email = document.getElementById("forgot-email").value.trim();    
        console.log("Sent password to " + email);
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Error sending password reset email:", error.message);
    }
});


registerBtn.addEventListener("click", async e => {
    e.preventDefault();

    const username = registerForm.querySelector("#register-user-name").value.trim();
    const email = registerForm.querySelector("#register-email").value.trim();
    const password = registerForm.querySelector("#register-password").value;
    const confirmPassword = registerForm.querySelector("#register-repeat-password").value;

    const errorUsername =  registerForm.querySelector("#reg-name-error");
    const errorEmail =  registerForm.querySelector("#reg-mail-error");
    const errorPassword =  registerForm.querySelector("#reg-pass-error");
    const errorConfirmPassword =  registerForm.querySelector("#reg-repass-error");
    const errors = [errorUsername, errorEmail, errorPassword, errorConfirmPassword]; 
    
    for (let error of errors) {
        error.classList.add("hidden");
        error.textContent = "";
    }

    // if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    //     errorEmail.classList.remove("hidden");
    //     errorEmail.textContent = INCORRECTEMAIL;
    //     return;
    // }

    if (password !== confirmPassword) {
        errorPassword.classList.remove("hidden");
        errorPassword.textContent = INCORRECTPASS;  
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(" User registered:", userCredential.user.email);

        await setDoc(doc(db, "Accounts", userCredential.user.uid), {
            uid: userCredential.user.uid,
            username: username,
            email: email
        });
    } catch (e) {
        if (e.code === "auth/email-already-in-use") {
            errorEmail.classList.remove("hidden");
            errorEmail.textContent = EMAILEXISITNG;
        } else if (e.code === "auth/weak-password") {
            errorPassword.classList.remove("hidden");
            errorPassword.textContent = SMALLPASSWORDLENGTH;
        } else {
            console.error("Unhandled error:", e.message);
        }
    }
});

loginBtn.addEventListener("click", async e => {
    e.preventDefault();
    
    const email = loginForm.querySelector("#login-email").value.trim();
    const password = loginForm.querySelector("#log-view-password").value.trim();
    const errorLogin = loginForm.querySelector("#login-pass-error");

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const loginUser = await getDoc(doc(db, "Accounts", userCredential.user.uid));
        if (loginUser.exists()) {
            const data = loginUser.data();
            console.log("Welcome:", data.username);
    
            homeContainer.querySelector("#edit-user-name").value = data.username;
            homeContainer.querySelector("#user-name").textContent = data.username;
            homeContainer.querySelector("#user-email").textContent = data.email;
        } else {
            console.log("No such document!");
        }        
    } catch (e) {
        if (e.code === "auth/invalid-credential") {
            errorLogin.classList.remove("hidden");
            errorLogin.textContent = NOACCOUNT;
        } else {
            console.error("Unhandled error:", e.message);
        }
    }
});

editBtn.addEventListener("click", e => {
    e.preventDefault();
    editForm.classList.remove("hidden"); 
    accountForm.classList.add("hidden");   
})    

cancelEditBtn.addEventListener("click", e => {
    e.preventDefault();
    editForm.classList.add("hidden"); 
    accountForm.classList.remove("hidden");
    homeContainer.querySelector("#edit-user-name").value = homeContainer.querySelector("#user-name").textContent;      
})    

logoutBtn.addEventListener("click", async e => {
    e.preventDefault();
    await signOut(auth);
    homeContainer.classList.add("hidden");
    registerContainer.classList.add("hidden");    
    loginContainer.classList.remove("hidden");
})

