import { editTask } from './backend.js';
import { Delegator } from './delegator.js';

Delegator.delegateMany(".task-list .edit-btn", "open-edit-task-btn");
Delegator.delegateMany(".edit-modal .close-btn", "close-edit-task-btn");
Delegator.delegateMany(".edit-task-btn", "edit-task-btn");
Delegator.delegate(".edit-task-modal-container", "edit-container");
Delegator.delegate(".edit-modal", "edit-modal");

Delegator.getMany("open-edit-task-btn").forEach(element => {
    element.addEventListener("click", e => {
        e.preventDefault();
        
        const row = element.closest('.task-row');  
        const id = row.querySelector('.id').textContent;
        const name = row.querySelector('.name').textContent;
        const priority = row.querySelector('.priority-type').textContent;
        const dateDue = toIsoDate(row.querySelector('.datetime-due .date').textContent);
        const timeDue = toIsoTime(row.querySelector('.datetime-due .time').textContent);

        Delegator.getChild("edit-container", ".id-field").value = id;
        Delegator.getChild("edit-container", ".name-field").value = name;
        Delegator.getChild("edit-container", ".priority-field").value = priority;    
        Delegator.getChild("edit-container", ".date-field").value = dateDue;
        Delegator.getChild("edit-container", ".time-field").value = timeDue;

        Delegator.get("edit-container").classList.toggle("hidden");
    });
});

Delegator.getMany("close-edit-task-btn").forEach(element => {
    element.addEventListener("click", e => {
        e.preventDefault();
    
        Delegator.getChild("edit-modal", ".name-field").value = "";
        Delegator.getChild("edit-modal", ".priority-field").value = "MEDIUM";
        Delegator.getChild("edit-modal", ".date-field").value = "";
        Delegator.getChild("edit-modal", ".time-field").value = "";

        Delegator.getChild("edit-modal", ".name-error").textContent = ""
        Delegator.getChild("edit-modal", ".priority-error").textContent = ""
        Delegator.getChild("edit-modal", ".date-error").textContent = ""
        Delegator.getChild("edit-modal", ".time-error").textContent = ""

        Delegator.get("edit-container").classList.toggle("hidden");
    });
});

Delegator.getMany("edit-task-btn").forEach(element => {
    element.addEventListener("click", async e => {
        e.preventDefault();

        const id = Delegator.getChild("edit-modal", ".id-field").value.trim();
        const name = Delegator.getChild("edit-modal", ".name-field").value.trim();
        const priority = Delegator.getChild("edit-modal", ".priority-field").value.trim();
        const dateDue = Delegator.getChild("edit-modal", ".date-field").value.trim();
        const timeDue = Delegator.getChild("edit-modal", ".time-field").value.trim();
        
        Delegator.getChild("edit-modal", ".name-error").textContent = ""
        Delegator.getChild("edit-modal", ".priority-error").textContent = ""
        Delegator.getChild("edit-modal", ".date-error").textContent = ""
        Delegator.getChild("edit-modal", ".time-error").textContent = ""

        let error = false;
        if (!name) {
            Delegator.getChild("edit-modal", ".name-error").textContent = "Name is required"
            error = true;
        }
        if (!priority) {
            Delegator.getChild("edit-modal", ".priority-error").textContent = "Priority is required"
            error = true;
        }
        if (!dateDue) {
            Delegator.getChild("edit-modal", ".date-error").textContent = "Date is required"
            error = true;
        }
        if (!timeDue) {
            Delegator.getChild("edit-modal", ".time-error").textContent = "Time is required"
            error = true;
        }
        if (error) {
            return;
        }

        await editTask(id, name, priority, dateDue + "T" + timeDue);
        window.location.href = `/?alert=EDITTED_SUCCESSFULLY&task=${name}`;
    });
});


function toIsoDate(dateStr) {
    // converts readable date (like Sep. 11, 2009) into an ISO DATE (like 2009-09-11)
    return new Date(dateStr).toISOString().split("T")[0];
}

function toIsoTime(timeStr) {
    // converts AM/PM Time (like 11:59 PM) into an ISO TIME (like 23:59)
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    // Accounts for the 12AM and 12PM shenanigans
    if (modifier?.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${minutes}`;
}


