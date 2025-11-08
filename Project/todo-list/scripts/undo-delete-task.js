import { deleteTask, getTask, addTask } from "./backend.js";
import { Delegator } from "./delegator.js";

Delegator.delegate(".undo-delete", "undo-delete-btn");
Delegator.delegate(".toast-container", "toast-container");

const urlParams = new URLSearchParams(window.location.search);
const toastParam = urlParams.get('toast');
const name = urlParams.get('task');
const checked = urlParams.get('checked');
const priority = urlParams.get('priority');
const dateAdded = urlParams.get('dateadded');
const dateDue = urlParams.get('datedue');

if (toastParam && name) {
    Delegator.get("toast-container").classList.remove("hidden");

    Delegator.getChild("toast-container", ".task-name").textContent = name;
    Delegator.getChild("toast-container", ".checked").textContent = checked;
    Delegator.getChild("toast-container", ".date-added").textContent = dateAdded;
    Delegator.getChild("toast-container", ".date-due").textContent = dateDue;
    Delegator.getChild("toast-container", ".priority").textContent = priority;

    setTimeout(() => {
        Delegator.get("toast-container").classList.add("hidden");
        Delegator.getChild("toast-container", ".task-name").textContent = 
            Delegator.getChild("toast-container", ".checked").textContent = 
            Delegator.getChild("toast-container", ".date-added").textContent = 
            Delegator.getChild("toast-container", ".date-due").textContent = 
            Delegator.getChild("toast-container", ".priority").textContent = "";    
    }, 10000);
}

Delegator.get("undo-delete-btn").addEventListener("click", async e => {
    e.preventDefault();
    const name = Delegator.getChild("toast-container", ".task-name").textContent; 
    const checked = Delegator.getChild("toast-container", ".checked").textContent;
    const dateAdded = Delegator.getChild("toast-container", ".date-added").textContent;
    const dateDue = Delegator.getChild("toast-container", ".date-due").textContent;
    const priority = Delegator.getChild("toast-container", ".priority").textContent;

    await addTask(name, priority, dateAdded, dateDue, checked);
    Delegator.getChild("toast-container", ".task-name").textContent = 
        Delegator.getChild("toast-container", ".checked").textContent = 
        Delegator.getChild("toast-container", ".date-added").textContent = 
        Delegator.getChild("toast-container", ".date-due").textContent = 
        Delegator.getChild("toast-container", ".priority").textContent = "";    

    window.location.href = `/?alert=UNDO_TASK_DELETED_SUCCESSFULLY&task=${name}`;    
});



