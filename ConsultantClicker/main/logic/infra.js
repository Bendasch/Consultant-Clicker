import { initialize } from '../utils/initialize.js'
import { initializeProjectMeta } from '../logic/projectMeta.js'

export const saveGame = () => {
  window.localStorage.setItem("CONS_CLICKER", JSON.stringify($("body").data()))
} 
  
export const resetGame = () => {
  window.localStorage.removeItem("CONS_CLICKER")
  initialize()
}
  
export const initializeData = (json) => {

  const body = $("body")

  body.data("companyName", json.companyName)

  body.data("totalEarnings", json.totalEarnings)
  body.data("currentBalance", json.currentBalance)
  body.data("totalProgress", json.totalProgress)

  body.data("totalRate", json.totalRate)
  body.data("totalSalesRate", json.totalSalesRate)
  body.data("totalFlatSalesRate", json.totalFlatSalesRate)
  body.data("totalFlatConsRate", json.totalFlatConsRate)

  initializeProjectMeta(json.projectMeta)
  body.data("projects", json.projects)

  body.data("consultants", json.consultants)
  body.data("sales", json.sales)
  body.data("clicking", json.clicking)
  
  body.data("upgrades", json.upgrades)
  body.data("buttons", json.buttons)
  body.data("achievements", json.achievements)
  body.data("notifications", json.notifications)
  body.data("powerups", json.powerups)
}
