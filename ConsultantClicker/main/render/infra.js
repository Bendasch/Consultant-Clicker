import { addUpgradeRow } from './upgrades.js'
import { bindTabButtons } from './navbar.js'
import { bindOfficeButtons } from './office.js'
import { bindSettingsButtons } from './settings.js'
import { lockAchievement, unlockAchievement } from './achievements.js'

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
    bindOfficeButtons()
}

export const initializeInputs = () => {
    var $name = $("#companyName")
    $name.val($("body").data("companyName") || "My Consulting Firm")
    $name.unbind().change((event)=>{
        $("body").data("companyName", $(event.target).val())
    })
}

export const initializeAchievements = () => {
    const max = 7
    const achievements = $("body").data("achievements")
    Object.keys(achievements).forEach( type => {
        const current = achievements[type].current
        for (var level = 1; level <= max; level++) {
            (level <= current) ? unlockAchievement(type, level) : lockAchievement(type, level)
        }
    }) 
}