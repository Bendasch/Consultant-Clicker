import { render, logAction, initialBinding, setUpgrades, destroyAllProjects } from './render.js';
import { initData } from './base.js';

export function initialize() {

  // clear project DOM elements 
  // this is especially relevant in case of game resets
  destroyAllProjects()

  // when the (static) DOM is ready,
  // bind click events
  $(document).ready(function() {
    initialBinding()
  });

  // get data from local storage
  var json = window.localStorage.getItem("CONS_CLICKER") || null;

  // either continue the game
  if (json) {     
    const p = new Promise((resolve, reject) => {  
      initData(JSON.parse(json)) 
      setUpgrades()  
      welcomeMessage(false)  
      render()
      resolve() 
    }); 
    return p;
  } 
  
  // otherwise create a new game
  return fetch("./data/init.json").then( response => response.json() ).then( json => { 
    initData(json)
    setUpgrades() 
    welcomeMessage(true)     
    render()
  });
}

let welcomeMessage = (newGame=true) => {
  if (newGame) {
    logAction("Welcome to a fresh game of Consultant Clicker!");
    logAction("Select a project to start the game.");
    logAction("Good luck!");
  } else {
    logAction("Welcome back to Consultant Clicker!");
    logAction("Good luck!");
  }
}