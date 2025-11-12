import { addCollaborator, getCollaborators, removeCollaborator } from "./backend.js";
import { Delegator } from './delegator.js';

Delegator.delegate(".manage-collaborator-btn", "open-manage-collab-btn");
Delegator.delegate(".manage-collaborators-container .close-btn", "close-manage-collab-btn");
Delegator.delegate(".manage-collaborators-modal", "manage-collab-modal");
Delegator.delegate(".manage-collaborators-container", "manage-collab-container");


Delegator.delegate(".new-collaborator-btn", "open-add-collab-btn");
Delegator.delegate(".add-collab-modal .close-btn", "close-add-collab-btn");
Delegator.delegate(".add-collab-modal-container", "add-collab-container");
Delegator.delegate(".add-collab-modal", "add-collab-modal");
Delegator.delegate(".add-collab-btn", "add-collab-btn");

Delegator.get("open-manage-collab-btn").addEventListener("click", async e =>  {
    e.preventDefault();
    Delegator.get("manage-collab-container").classList.toggle("hidden");    
    loadCollaborators();
});

async function loadCollaborators() {
    const table = Delegator.getChild("manage-collab-container", "table");
    table.innerHTML = ""; 

    const collaborators = await getCollaborators();

    collaborators.forEach(collaborator => {
        const tr = document.createElement("tr");
        tr.id = collaborator.id;
        tr.innerHTML = `
            <td class="name">${collaborator.email}</td>
            <td><span class="fa-solid fa-trash delete-btn""></span></td>
        `;
        table.appendChild(tr);
        tr.querySelector(".delete-btn").addEventListener("click" , async e => {
            await removeCollaborator(collaborator.id);
            loadCollaborators();
        });
    });
}

Delegator.get("close-manage-collab-btn").addEventListener("click", e => {
    e.preventDefault();
    Delegator.get("manage-collab-container").classList.toggle("hidden");    
});


Delegator.get("open-add-collab-btn").addEventListener("click", e => {
    e.preventDefault();
    Delegator.getChild("add-collab-modal", ".name-error").textContent = ""
    Delegator.getChild("add-collab-modal", "input"  ).textContent = ""
    Delegator.get("add-collab-container").classList.toggle("hidden");
});

Delegator.get("close-add-collab-btn").addEventListener("click", e => {
    e.preventDefault();
    Delegator.getChild("add-collab-modal", ".name-field").value = "";

    Delegator.get("add-collab-container").classList.toggle("hidden");    
});

Delegator.get("add-collab-btn").addEventListener("click", async e => {
    e.preventDefault();
    const name = Delegator.getChild("add-collab-modal", ".name-field").value.trim();
    Delegator.getChild("add-collab-modal", ".name-error").textContent = ""
    
    if (!await addCollaborator(name)) {
        Delegator.getChild("add-collab-modal", ".name-error").textContent = "Username/Email is not a valid collaborator or already exists."
    } else {
        Delegator.get("add-collab-container").classList.toggle("hidden");   
        loadCollaborators(); 
    }
});



