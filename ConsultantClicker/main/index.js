import { render } from './render/main.js'
import { gameLogic } from './logic/main.js'
import { initializeData, saveGame } from './logic/infra.js'
import { 
  initializeUpgrades, 
  initializeButtons, 
  initializeAchievements 
} from './render/infra.js'
import { sleep, setTime } from './utils/utils.js'
import { logAction } from './render/log.js'
import { destroyAllProjects } from './render/project.js'

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
    const p = new Promise((resolve, reject) => {  
      initializeData(JSON.parse(json)) 
      initializeUpgrades()  
      initializeAchievements()
      welcomeMessage(false)  
      render()
      resolve() 
    }); 
    return p;
  } 
  
  // otherwise create a new game
  return fetch("./data/init.json").then( response => response.json() ).then( json => { 
    initializeData(json)
    initializeUpgrades() 
    welcomeMessage(true)     
    render()
  });
}

const welcomeMessage = (newGame=true) => {
  if (newGame) {
    logAction("Welcome to a fresh game of Consultant Clicker!");
    logAction("Select a project to start the game.");
    logAction("Good luck!");
  } else {
    logAction("Welcome back to Consultant Clicker!");
    logAction("Good luck!");
  }
}

// this is the main game loop
const main = (tick, start, cycle) => {  

  const T_START = (new Date()).getTime();
  var delta = T_START - start;

  gameLogic(tick, cycle);
  setTime("update", T_START);

  const T_PRE_RENDER = (new Date()).getTime();
  render();
  setTime("render", T_PRE_RENDER);

  if ((cycle % 250) == 0) { saveGame() }

  sleep(2 * tick - delta).then(
    () => main(tick, T_START, cycle + 1)
  );
}

// on start-up, the game data is first prepared
// then the first game cycle is started
initialize().then( () => {
  const TICK = 20;
  setTime("tick", TICK);
  const d = new Date();
  main(TICK, d.getTime(), 0);
});