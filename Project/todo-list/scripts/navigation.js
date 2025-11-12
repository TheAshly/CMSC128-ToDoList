import { logoutUser } from "./backend.js";
import { Delegator } from './delegator.js';

Delegator.delegate(".logout-btn", "logout-btn");
Delegator.delegate(".account-btn", "account-btn");

Delegator.get("logout-btn").addEventListener("click", async e => {
    e.preventDefault();
    await logoutUser()
})

Delegator.get("account-btn").addEventListener("click", async e => {
    e.preventDefault();
    window.location.href = "/";
})

