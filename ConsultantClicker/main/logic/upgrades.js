import { addToBalance, getActiveProject } from './project.js'
import { showNotification } from '../render/notifications.js'
import { setStaffTab } from '../render/navbar.js'
import { addToProjectBuffer } from './projectMeta.js'

export const buyUpgrade = (upgradeId) => {

  const body = $("body")
  var upgrades = body.data("upgrades")

  addToBalance(-1 * upgrades[upgradeId].cost)
  upgrades[upgradeId].owned = true

  body.data("upgrades", upgrades)

  switch(upgradeId) {
    case "wordUpgrade":     wordNotification(); break
    case "staffUpgrade":    setStaffTab(); staffNotification(); break
    case "callForProposal": addToProjectBuffer(1); break
    case "salesTeam":       addToProjectBuffer(1); break 
    case "connections":     addToProjectBuffer(1); break 
    case "monopoly":        addToProjectBuffer(1); break
  }
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
    main = "Select your project to activate it. Then keep pressing the Word button."
  }
  showNotification(header, main)
}

const staffNotification = () => {
  const header = 'Staff Upgrade activated!'
  var main = "In the 'Staff' tab, you can now recruit employees who will make you rich."
  showNotification(header, main)
}

export const isUpgradeOwned = (upgradeId) => {
  const upgrades = $("body").data("upgrades")
  return upgrades[upgradeId].owned
}