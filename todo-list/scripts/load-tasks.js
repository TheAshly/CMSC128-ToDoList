import { getTasks } from "./backend.js";
import { Delegator } from "./delegator.js"

Delegator.delegate("tbody", "table-body");
Delegator.delegate(".sort-dropdown", "sort-dropdown");

Delegator.get("sort-dropdown").addEventListener("change", e => {
    e.preventDefault("");  
    window.location.href = `/?sortby=${Delegator.get("sort-dropdown").value}`;    
});


const urlParams = new URLSearchParams(window.location.search);
const sortby = urlParams.get('sortby') || "date-added";
const tasks = await getTasks();
Delegator.get("sort-dropdown").value = sortby;

switch (sortby) {
    case "date-added":
        tasks.sort((a, b) => { return new Date(a["dateAdded"]) - new Date(b["dateAdded"])}); 
        break;
    case "date-due": 
        tasks.sort((a, b) => { return new Date(a["dateDue"]) - new Date(b["dateDue"])}); 
        break;
    case "priority":
        tasks.sort((a, b) => { 
            const score = {
                "LOW": 1,
                "MEDIUM": 2,
                "HIGH": 3
            }
            return score[b["priority"]] - score[a["priority"]];
        });  
        break;
    default:
        console.error(`Sort ${sortby} is not defined!`); 
}

tasks.forEach(task => {
    let [dayName, month, day, year] = new Date(task.dateAdded).toDateString().split(" ");
    const dateAdded = month + ". " + day + ", " + year;
    const timeAdded = formatTime(new Date(task.dateAdded).toTimeString().split(" ")[0].substring(0, 5));
    
    [dayName, month, day, year] = new Date(task.dateDue).toDateString().split(" ");
    const dateDue = month + ". " + day + ", " + year;
    const timeDue = formatTime(new Date(task.dateDue).toTimeString().split(" ")[0].substring(0, 5));
    const checked = (task.checked === "true");

    let priorityType = "";
    switch (task.priority) {
        case "LOW":
            priorityType = "priority-ok" 
            break;
        case "MEDIUM":
            priorityType = "priority-warning" 
            break;
        case "HIGH":
            priorityType = "priority-danger" 
            break;
        default:
            console.error(`Priority type ${task.priority} is not defined!`);
            
    }

    const row = `
        <tr class="task-row ${ checked ? "strikeout": ""}">
            <td class="id" style="display: none;">${task.id}</td>
            <td class="checkbox">
                <span class="${ checked ? `fa-solid fa-square-check` : `fa-regular fa-square`}"></span>
            </td>
            <td class="name">${task.name}</td>
            <td class="priority">
                <div class="priority-type ${priorityType}">${task.priority}</div>
            </td>
            <td class="datetime-due">
                <span class="date">${dateDue}</span>
                <span class="time">${timeDue}</span>
            </td>
            <td class="datetime-added">
                <span class="date">${dateAdded}</span>
                <span class="time">${timeAdded}</span>
            </td>
            <td class="utils">
                <span class="fa-solid fa-pen-to-square edit-btn"></span>
                <span class="fa-solid fa-trash delete-btn"></span>
            </td>
        </tr>
    `;    

    Delegator.get("table-body").insertAdjacentHTML("beforeend", row);
});

function formatTime(timeString) {
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM");
}
 