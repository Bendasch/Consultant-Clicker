import { getTotalConsultantsQuantity, getTotalSalesQuantity } from './resources.js'
import { getUnlockedUpgradeAmount } from './upgrades.js'
import { unlockAchievement } from '../render/achievements.js'
import { showNotification } from '../render/notifications.js'

export const updateAchievements = (cycle) => {

    // only check the achievements every X cycles
    const everyX = 10
    if (cycle % everyX != 0) return; 

    // check each achievement type
    const body = $("body")
    var achievements = body.data("achievements")
    Object.keys(achievements).forEach( (type) => {

        var achievementGroup = achievements[type]

        // start from the next level which was not achieved 
        // currently there are only 7 levels
        const max = 7
        const next = achievementGroup.current + 1

        for (var level = next; level <= max; level++) {

            var achievement = achievementGroup[level]

            if (!(meetsThreshold(type, achievement.threshold))) break;

            unlockAchievement(`ach-${type}-${achievement.id}`)
            showNotification("New Achievement!", getNoficationText(achievementGroup, level), true)
            achievements[type].current = level
            achievements[type][level].unlocked = true
        }

        body.data("achievements", achievements)
    })
}

const getNoficationText = (achievementGroup, level) => {
    return `You reached ${achievementGroup.name}-level ${level}.`
}

const meetsThreshold = (type, threshold) => {
    const total = getTotalByAchievementType(type)
    return (total >= threshold)
}

const getTotalByAchievementType = (type) => {
    const body = $("body")

    switch (type) {
        case "clicks":          return body.data("clicking").clicks
        case "totalEarned":     return body.data("totalEarnings")
        case "balance":         return body.data("currentBalance")
        case "projects":        return body.data("projectMeta").totalProjectsFinished
        case "progress":        return body.data("totalProgress")
        case "consultants":     return getTotalConsultantsQuantity()
        case "sales":           return getTotalSalesQuantity()
        case "upgrades":        return getUnlockedUpgradeAmount()
        case "achievements":    return getUnlockedAchievementAmount()
    }
}

const getUnlockedAchievementAmount = () => {
  const achievements = $("body").data("achievements")  
  return Object.keys(achievements).reduce( (total, type) => { 
      var achievementGroup = Object.keys(achievements[type])
      var unlockedAchievements = achievementGroup.filter(key => {return achievements[type][key].unlocked})
      return total + unlockedAchievements.length
  }, 0)
}

export const getTypeAndLevelFromId = (achievementId) => {
    var parts = achievementId.split("-")
    return [parts[1], getLevelNumberFromId(parts[2])]
}

const getLevelNumberFromId = (level) => {
    switch(level) {
        case "beginner":    return 1
        case "common":      return 2
        case "uncommon":    return 3
        case "rare":        return 4
        case "epic":        return 5
        case "legendary":   return 6
        case "god":         return 7 
    }
}