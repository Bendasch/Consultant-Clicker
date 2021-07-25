import { addToBalance } from './project.js'
import { logAction } from '../render/log.js'

export const buyUpgrade = (upgradeId, upgradeSpecial=null) => {

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