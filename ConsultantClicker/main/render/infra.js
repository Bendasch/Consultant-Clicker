import { addUpgradeRow } from './upgrades.js'
import { bindTabButtons } from './navbar.js'
import { bindOfficeButtons } from './office.js'
import { bindTrelloButtons } from '../utils/trello.js'
import { bindSettingsButtons } from './settings.js'

export const initializeUpgrades = () => {
    
    $("#upgradeTable").children().remove();
  
    var allUpgrades = $("body").data("upgrades")
    Object.keys(allUpgrades).forEach( (key) => {
        var upgrade = allUpgrades[key]
        addUpgradeRow(upgrade)
    });
}

export const initializeButtons = () => {
    bindTabButtons()  
    bindSettingsButtons()  
    bindTrelloButtons()  
    bindOfficeButtons()
}