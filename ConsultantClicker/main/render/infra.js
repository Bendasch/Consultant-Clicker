import { addUpgradeRow } from './upgrades.js'
import { bindTabButtons } from './navbar.js'
import { bindOfficeButtons } from './office.js'
import { bindTrelloButtons } from '../utils/trello.js'
import { bindSettingsButtons } from './settings.js'
import { unlockAchievement } from './achievements.js'

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

export const initializeAchievements = () => {
    const achievements = $("body").data("achievements")
    Object.keys(achievements).forEach( type => {
        const current = achievements[type].current
        for (var level = 1; level <= current; level++) {
            const id = achievements[type][level].id
            unlockAchievement(`ach-${type}-${id}`)
        }
    }) 
}