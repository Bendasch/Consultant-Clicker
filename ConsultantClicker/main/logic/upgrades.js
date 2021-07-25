import { addToBalance } from './project.js'
import { logAction } from '../render/log.js'

<<<<<<< HEAD:ConsultantClicker/main/shop.js
export function addResource(category, resId) {

  const body = $("body");

  var resources = body.data(category);
  resources[resId].quantity = resources[resId].quantity + 1;
  body.data(category, resources);

  addToBalance(-1 * resources[resId].cost);

  logAction("1 " + resources[resId].name +  " was added.");
}

export function buyUpgrade(upgradeId, upgradeSpecial=null) {
=======
export const buyUpgrade = (upgradeId, upgradeSpecial=null) => {
>>>>>>> achievements:ConsultantClicker/main/logic/upgrades.js

  const body = $("body")
  var upgrades = body.data("upgrades")

  addToBalance(-1 * upgrades[upgradeId].cost)
  upgrades[upgradeId].owned = true

  body.data("upgrades", upgrades)

  logAction("Bought upgrade '" + upgrades[upgradeId].name + "'.")
} 

export const officeButtonOwned = (buttonId) => {
  return $("body").data("upgrades")[`${buttonId}Upgrade`].owned
}

export const getActiveUpgradeKeys = () => {
  const upgrades = $("body").data("upgrades")
  return Object.keys(upgrades).filter(key => {return upgrades[key].owned})
}

export const getUnlockedUpgradeAmount = () => {
  return getActiveUpgradeKeys().length 
}