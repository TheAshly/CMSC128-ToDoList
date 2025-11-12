/**
 * This is to load each JS file one-by-one in the order desired.
 */

(async () => {
    await import('./backend.js');  
    await import('./delegator.js');
    await import('./alert.js');   
    await import('./load-navbar.js'); 
    await import('./load-tasks.js'); 
    await import('./add-task.js');  
    await import('./edit-task.js');  
    await import('./check-task.js');   
    await import('./delete-task.js'); 
    await import('./undo-delete-task.js'); 
    await import('./navigation.js');
    await import('./manage-collaborator.js'); 
    await import('./view-collaborator.js'); 
})();