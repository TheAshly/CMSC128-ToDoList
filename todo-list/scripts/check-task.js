import { updateCheckbox } from './backend.js';
import { Delegator } from './delegator.js';

Delegator.delegateMany(".task-list .checkbox", "checkbox");

Delegator.getMany("checkbox").forEach(element => {
    element
    element.addEventListener("click", async e => {
        e.preventDefault();
        const row = element.closest('.task-row');  
        const id = row.querySelector('.id').textContent;

        const span = element.querySelector("span");
        if (span.classList.contains("fa-square")) {
            span.classList.remove("fa-regular")
            span.classList.remove("fa-square")
            span.classList.add("fa-solid")
            span.classList.add("fa-square-check")
            row.classList.add("strikeout")
        } else if (span.classList.contains("fa-square-check")) {
            span.classList.remove("fa-solid")
            span.classList.remove("fa-square-check");
            span.classList.add("fa-regular")
            span.classList.add("fa-square");
            row.classList.remove("strikeout")
        }

        await updateCheckbox(id);
    });
});
