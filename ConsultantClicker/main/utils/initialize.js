
import { initializeData } from '../logic/infra.js'
import { initializeUpgrades, initializeButtons, initializeAchievements } from '../render/infra.js'
import { destroyAllProjects } from '../render/project.js'

export const initialize = () => {

    // clear project DOM elements 
    // this is especially relevant in case of game resets
    destroyAllProjects()
  
    // when the (static) DOM is ready, bind click events
    $(document).ready(() => initializeButtons());
  
    // get data from local storage
    var json = window.localStorage.getItem("CONS_CLICKER") || null;
  
    // either continue the game
    if (json) {     
        return new Promise((resolve) => {  
            initializeData(JSON.parse(json)) 
            initializeUpgrades()  
            initializeAchievements()
            resolve(true)
        })
    } 
    
    // otherwise create a new game
    return fetch("./data/init.json").then(res => res.json()).then(json => { 
        initializeData(json)
        initializeUpgrades() 
        initializeAchievements()
    });
}