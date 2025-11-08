import { addTask } from "./backend.js";
import { Delegator } from './delegator.js';

Delegator.delegate(".new-task-btn", "open-create-task-btn");
Delegator.delegate(".add-modal .close-btn", "close-create-task-btn");
Delegator.delegate(".add-task-btn", "create-task-btn")
Delegator.delegate(".add-task-modal-container", "add-container");
Delegator.delegate(".add-modal", "add-modal");

Delegator.get("open-create-task-btn").addEventListener("click", e => {
    e.preventDefault();
    Delegator.get("add-container").classList.toggle("hidden");
});

Delegator.get("close-create-task-btn").addEventListener("click", e => {
    e.preventDefault();
    Delegator.getChild("add-modal", ".name-field").value = "";
    Delegator.getChild("add-modal", ".priority-field").value = "MEDIUM";
    Delegator.getChild("add-modal", ".date-field").value = "";
    Delegator.getChild("add-modal", ".time-field").value = "";
    
    Delegator.getChild("add-modal", ".name-error").textContent = ""
    Delegator.getChild("add-modal", ".priority-error").textContent = ""
    Delegator.getChild("add-modal", ".date-error").textContent = ""
    Delegator.getChild("add-modal", ".time-error").textContent = ""

    Delegator.get("add-container").classList.toggle("hidden");    
});


Delegator.get("create-task-btn").addEventListener("click", async e => {
    e.preventDefault();
    const name = Delegator.getChild("add-modal", ".name-field").value.trim();
    const priority = Delegator.getChild("add-modal", ".priority-field").value.trim();
    const dateDue = Delegator.getChild("add-modal", ".date-field").value.trim();
    const timeDue = Delegator.getChild("add-modal", ".time-field").value.trim();
    
    Delegator.getChild("add-modal", ".name-error").textContent = ""
    Delegator.getChild("add-modal", ".priority-error").textContent = ""
    Delegator.getChild("add-modal", ".date-error").textContent = ""
    Delegator.getChild("add-modal", ".time-error").textContent = ""


    let error = false;
    if (!name) {
        Delegator.getChild("add-modal", ".name-error").textContent = "Name is required"
        error = true;
    }
    if (!priority) {
        Delegator.getChild("add-modal", ".priority-error").textContent = "Priority is required"
        error = true;
    }
    if (!dateDue) {
        Delegator.getChild("add-modal", ".date-error").textContent = "Date is required"
        error = true;
    }
    if (!timeDue) {
        Delegator.getChild("add-modal", ".time-error").textContent = "Time is required"
        error = true;
    }
    if (error) {
        return;
    }
    
    let [dateNow, timeNow] = new Date().toISOString().split("T");
    timeNow = timeNow.substring(0,5);

    await addTask(name, priority, dateNow + "T" + timeNow, dateDue + "T" + timeDue);

    window.location.href = `/?alert=ADDED_SUCCESSFULLY&task=${name}`;

});


