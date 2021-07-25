import { addToBalance, getActiveProject } from './project.js'
import { logAction } from '../render/log.js'
import { showNotification } from '../render/notifications.js'

export const buyUpgrade = (upgradeId) => {

  const body = $("body")
  var upgrades = body.data("upgrades")

  addToBalance(-1 * upgrades[upgradeId].cost)
  upgrades[upgradeId].owned = true

  body.data("upgrades", upgrades)

  logAction("Bought upgrade '" + upgrades[upgradeId].name + "'.")

  if (upgradeId=="wordUpgrade") wordNotification()
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

const wordNotification = () => {
  const header = 'Word Upgrade activated!'
  var main;
  if (getActiveProject($("body").data("projects"))) {
    main = "You can progress your active project by clicking the Word button."
  } else {
    main = "Select your project to activate it. Then press the Word button to progress it."
  }
  showNotification(header, main)
}