import { getTotalConsultantsQuantity, getTotalSalesQuantity } from './resources.js'
import { getUnlockedUpgradeAmount } from './upgrades.js'
import { unlockAchievement } from '../render/achievements.js'
import { showNotification, showNailedIt } from '../render/notifications.js'

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

            unlockAchievement(type, level)
            achievements[type].current = level
            achievements[type][level].unlocked = true

            if (type=="achievements" && level == 7) {
                // this means that the person has beat the game!
                showNotification(
                    "You beat the game!", 
                    "You're a consultant clicker GOD.", 
                    getAchievementImg(type, level),
                    6
                )

                showNailedIt()
            } else {
                showNotification("New Achievement!", "", getAchievementImg(type, level))
            }
        }

        body.data("achievements", achievements)
    })
}

const getAchievementImg = (type, level) => {
    return `${type}-${$("body").data("achievements")[type][level].id}`
}

const meetsThreshold = (type, threshold) => {
    const total = getTotalByAchievementType(type)
    if (threshold != "all") return (total >= threshold)
    return (total == getTotalNumberForAchievement(type))
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
        case "sales":           return 100 * body.data("totalSalesRateWithoutBoost")
        case "upgrades":        return getUnlockedUpgradeAmount()
        case "achievements":    return getUnlockedAchievementAmount()
    }
}

export const getUnlockedAchievementAmount = () => {
  const achievements = $("body").data("achievements")  
  return Object.keys(achievements).reduce( (total, type) => { 
      var achievementGroup = Object.keys(achievements[type])
      var unlockedAchievements = achievementGroup.filter(key => {return achievements[type][key].unlocked})
      return total + unlockedAchievements.length
  }, 0)
}

export const setAchievementNotNew = (type, level) => {
    var achievements = $("body").data("achievements")
    achievements[type][level].new = false
    $("body").data("achievements", achievements)
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

export const getTotalNumberForAchievement = (type) => {
    switch(type) {
        case "achievements":    return 62
        case "upgrades":        return 20   
    }
}