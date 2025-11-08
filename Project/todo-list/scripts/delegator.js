/**
 * Class Delegator
 * @rationale
 *      Removes the need for variables. All are put inside the Delegator instead.
 *      The delegator can use tags, class names, or id.
 * 
 */

export class Delegator {
    static map = {};                // for single elements 
    static mapMany = {}             // for multiple elements


    /**
     * delegate() 
     * @description
     *      Stores a single element into the map variable above.
     *      
     * @param {*} component
     *      This is how it is refered in the document. Uses CSS 
     *      selector to refer to elements in the DOM. 
     *  
     * @param {*} name 
     *      This is to replace the complicated DOM name into a simpler name.
     */
    static delegate(component, name = "") {
        if (this.map[component]) {
            console.error(`Component "${component}" has been overwritten!`);
        }
        const key = name || component;
        this.map[key] = document.querySelector(component);
    }
    
    /**
     * delegateMany() 
     * @description
     *      Stores multple element into the mapMany variable above.
     *      
     * @param {*} component
     *      This is how it is refered in the document. Uses CSS 
     *      selector to refer to elements in the DOM. 
     *  
     * @param {*} name 
     *      This is to replace the complicated DOM name into a simpler name.
     * 
     *      
     */
    static delegateMany(component, name = "") {
        if (this.mapMany[component]) {
            console.error(`Component "${component}" has been overwritten!`);
        }
        const key = name || component;
        this.mapMany[key] = document.querySelectorAll(component);
    }

    /**
     * get() 
     * @description
     *      Gets the stored single element from the map variable above.  
     *      
     * @param {*} component
     *      This is the name given to the element in delegate().
     *  
     */
    static get(component) {
        if (this.map[component]) {
            return this.map[component];
        } else {
            console.error(`Component ${component} may be a list of components or does not exist. If it is a list of components, try getMany()`);
        }
    }

    /**
     * getMany() 
     * @description
     *      Gets the stored multiple element from the mapMany variable above.  
     *      
     * @param {*} component
     *      This is the name given to the element in delegateMany().
     *  
     */
    static getMany(component) {
        if (this.mapMany[component]) {
            return this.mapMany[component];
        } else {
            console.error(`Component ${component} may be a single component or does not exist. If it is a single component, try get()`);
        }
    }

    /**
     * getChild() 
     * @description
     *      Gets the first and nearest child element from a single component.  
     *      
     * @param {*} component
     *      This is the name given to the element in delegate().
     * 
     * @param {*} child
     *      This is the child element that you want to target. Uses CSS Selectors to 
     *      refer to the document in the DOM.
     *     
     *      As of now, if you want to access a child element of an element from multiple elements (elements stored)
     *      using delegateMany(), store that single using the delegate() method, and override it for succeeding elements. 
     *  
     */
    static getChild(component, child) {
        if (this.map[component]) {
            return this.map[component].querySelector(child);
        } else {
            console.error(`Component ${component} may be a list of components or does not exist. Use a single component only. `);
        }
    }

    /**
     * getClosest() 
     * @description
     *      Gets the first and nearest parent element from a single component.  
     *      
     * @param {*} component
     *      This is the name given to the element in delegate().
     * 
     * @param {*} parent
     *      This is the parent element that you want to target. Uses CSS Selectors to 
     *      refer to the document in the DOM.
     *     
     *      As of now, if you want to access a parent  element of an element from multiple elements (elements stored)
     *      using delegateMany(), store that single using the delegate() method, and override it for succeeding elements. 
     *  
     */
    static getClosest(component, parent) {
        if (this.map[component]) {
            return this.map[component].closest(parent);
        } else {
            console.error(`Component ${component} may be a list of components or does not exist. Use a single component only. `);
        }
    }

}


