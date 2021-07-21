
import { logAction } from '../render/log.js'
import { initialize } from '../index.js'

export const saveGame = () => {
  window.localStorage.setItem("CONS_CLICKER", JSON.stringify($("body").data()))
} 
  
export const resetGame = () => {
  window.localStorage.removeItem("CONS_CLICKER")
  logAction("The game is now reset!")
  initialize()
}
  
export const initializeData = (json) => {

  const body = $("body");

  body.data("totalEarnings", json.totalEarnings);
  body.data("currentBalance", json.currentBalance);

  body.data("totalRate", json.totalRate);
  body.data("totalSalesRate", json.totalSalesRate);
  body.data("totalFlatSalesRate", json.totalFlatSalesRate);
  body.data("totalFlatConsRate", json.totalFlatConsRate);

  body.data("projectMeta", json.projectMeta);
  body.data("projects", json.projects);

  body.data("consultants", json.consultants);
  body.data("sales", json.sales);
  body.data("clicking", json.clicking);
  
  body.data("upgrades", json.upgrades);
  body.data("buttons", json.buttons);
}