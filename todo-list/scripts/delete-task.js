import { deleteTask, getTask } from "./backend.js";
import { Delegator } from "./delegator.js";

Delegator.delegateMany(".task-list .delete-btn", "open-delete-task-btn");
Delegator.delegateMany(".delete-modal .cancel-btn", "close-delete-task-btn");
Delegator.delegateMany(".delete-task-btn", "delete-task-btn");
Delegator.delegate(".delete-task-modal-container", "delete-container");
Delegator.delegate(".delete-modal", "delete-modal");

Delegator.getMany("open-delete-task-btn").forEach(element => {
    element.addEventListener("click", e => {
        e.preventDefault();
        const row = element.closest('.task-row');  
        const id = row.querySelector('.id').textContent;
        const name = row.querySelector('.name').textContent;
        Delegator.getChild("delete-container", ".id-field").textContent = id;
        Delegator.getChild("delete-container", ".name-field").textContent = name;
        Delegator.get("delete-container").classList.toggle("hidden");           
    });
});

Delegator.getMany("close-delete-task-btn").forEach(element => {
    element.addEventListener("click", e => {
        e.preventDefault();
        Delegator.get("delete-container").classList.toggle("hidden");
    });
});

Delegator.getMany("delete-task-btn").forEach(element => {
    element.addEventListener("click", async e => {
        e.preventDefault();
        const id = Delegator.getChild("delete-modal", ".id-field").textContent;
        const name = Delegator.getChild("delete-modal", ".name-field").textContent;
        const task = await getTask(id);
    
        await deleteTask(id);    
        window.location.href = `/?toast=DELETED_SUCCESSFULLY&task=${name}&checked=${task["checked"]}&dateadded=${task["dateAdded"]}&datedue=${task["dateDue"]}&priority=${task["priority"]}`;    
    });
});

