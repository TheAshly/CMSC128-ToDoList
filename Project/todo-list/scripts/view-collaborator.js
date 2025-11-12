import { getCollaborators, leaveCollaboratorTDL } from "./backend.js";
import { Delegator } from "./delegator.js"

Delegator.delegate(".view-collaborator-btn", "open-view-collab-btn");
Delegator.delegate(".view-collaborators-container .close-btn", "close-view-collab-btn");
Delegator.delegate(".view-collaborators-modal", "view-collab-modal");
Delegator.delegate(".view-collaborators-container", "view-collab-container");

Delegator.delegate(".leave-todo-list-btn", "leave-collab-btn");


Delegator.get("open-view-collab-btn").addEventListener("click", async e =>  {
    e.preventDefault();
    Delegator.get("view-collab-container").classList.toggle("hidden");    
    loadViewCollaborators();
});

async function loadViewCollaborators() {
    const table = Delegator.getChild("view-collab-container", "table");
    table.innerHTML = ""; 

    const collaborators = await getCollaborators();

    collaborators.forEach(collaborator => {
        const tr = document.createElement("tr");
        tr.id = collaborator.id;
        tr.innerHTML = `
            <td class="name">${collaborator.email}</td>
        `;
        table.appendChild(tr);
    });
}

Delegator.get("close-view-collab-btn").addEventListener("click", e => {
    e.preventDefault();
    Delegator.get("view-collab-container").classList.toggle("hidden");    
});

Delegator.get("leave-collab-btn").addEventListener("click", async e => {
    e.preventDefault();
    await leaveCollaboratorTDL();
    window.location.href="/todo-list.html"
})

