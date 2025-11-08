import { Delegator } from "./delegator.js";
const urlParams = new URLSearchParams(window.location.search);
const alertParam = urlParams.get('alert');
const name = urlParams.get('task');

if (alertParam && name) {
    Delegator.delegate(".alert-container", "alert");
    Delegator.delegate(".alert-message", "alert-message");
    Delegator.get("alert").classList.remove("hidden");
    
    let message = ""; 
    if (alertParam === "ADDED_SUCCESSFULLY") {
        message = `Succesfully added task <strong>${name}</strong>.`;
    } else if (alertParam === "EDITTED_SUCCESSFULLY") {
        message = `Succesfully editted task <strong>${name}</strong>.`;
    } else if (alertParam === "UNDO_TASK_DELETED_SUCCESSFULLY") {
        message = `Succesfully undo deleted task <strong>${name}</strong>.`;
    }
    Delegator.get("alert-message").innerHTML = message;
    
    setTimeout(() => {
        Delegator.get("alert").classList.add("hidden");
        Delegator.get("alert-message").texContent = "";
    }, 10000);
}

Delegator.delegate(".alert-container .close-btn", "alert-close-btn");
Delegator.get("alert-close-btn").addEventListener("click", e => {
    e.preventDefault();
    Delegator.get("alert").classList.add("hidden");
    Delegator.get("alert-message").texContent = "";
});



