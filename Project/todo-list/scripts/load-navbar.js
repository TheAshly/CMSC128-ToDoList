import { getMainDatabase, getUser, updateState, setLocation, resetLocation } from "./backend.js";
import { Delegator } from "./delegator.js"

Delegator.delegate(".nav-container", "navbar");
Delegator.delegate(".personal", "personal");
Delegator.delegate(".collabing", "collabing");
Delegator.delegateMany(".destination", "choices");

const databases = await getMainDatabase();
const user = await getUser();

if(user.collabing.location === user.uid){
    if(user.collabing.state) Delegator.get("collabing").classList.toggle("selected"); 
    else Delegator.get("personal").classList.toggle("selected"); 
}

databases.forEach(database => {
    if(database.collaborators.includes(user.uid)){
        const choice = `
            <h4>${database.username}'s CTDL</h4>
        `;

        // Create a temporary container and get the actual element node
        const tempElem = document.createElement('selection');
        tempElem.innerHTML = choice.trim();
        tempElem.classList = "destination";
    
        const initialUID = database.uid; 

        if(user.collabing.location === initialUID)  tempElem.classList.toggle("selected"); 

        tempElem.addEventListener('click', async function() {
            const temptUID = initialUID;
            if(!tempElem.classList.contains("selected")){
                Delegator.get("selected").classList.toggle("selected");
                tempElem.classList.toggle("selected"); 
                await setLocation(temptUID);

                window.location.reload();
            }
        });


        Delegator.get("navbar").appendChild(tempElem);
    }
});

Delegator.delegate(".selected", "selected");

Delegator.get("personal").addEventListener("click", async e => {
    if(!Delegator.get("personal").classList.contains("selected")){
        e.preventDefault();

        Delegator.get("selected").classList.toggle("selected");
        Delegator.get("personal").classList.toggle("selected"); 
        await updateState(false);
        await resetLocation();

        window.location.reload();
    }
});

Delegator.get("collabing").addEventListener("click", async e => {
    if(!Delegator.get("collabing").classList.contains("selected")){
        e.preventDefault();

        Delegator.get("selected").classList.toggle("selected");
        Delegator.get("collabing").classList.toggle("selected"); 
        await updateState(true);
        await resetLocation();

        window.location.reload();
    }
});

 