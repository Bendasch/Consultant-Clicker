import { 
    getTypeAndLevelFromId, 
    getUnlockedAchievementAmount, 
    getTotalNumberForAchievement, 
    setAchievementNotNew
} from '../logic/achievements.js'
import { mobileCheck } from '../utils/utils.js'

export const renderAchievementCount = () => {
    const reached = getUnlockedAchievementAmount()
    const total = getTotalNumberForAchievement("achievements") + 1
    $("#achievementHeading").text(`Achievements (${reached}/${total})`)
}

export const unlockAchievement = (type, level) => {

    const achievements = $("body").data("achievements")
    const achievement = achievements[type][level]

    var $div = $(`#ach-${type}-${achievement.id}`)

    $div.addClass("unlocked")
    if (achievement.new || achievement.new == undefined) {
        $div.addClass("new")
    } 

    if (mobileCheck()) {
        $div.click( (event) => {
            toogleTooltip(event)
            $(event.target).removeClass("new")
            setAchievementNotNew(type, level)
        })        
    } else {
        $div.unbind().hover(
            (event) => {
                showTooltip(event)
                $(event.target).removeClass("new")
                setAchievementNotNew(type, level)
            },
            () => {destroyTooltip()}    
        )
    }
}

export const lockAchievement = (type, level) => {
    const achievements = $("body").data("achievements")
    const achievement = achievements[type][level]
    var $div = $(`#ach-${type}-${achievement.id}`)
    $div.removeClass("unlocked")
    $div.unbind()
}

const toogleTooltip = (event) => {
    const tooltipId = "ach-tooltip"
    if ($(`#${tooltipId}`).length <= 0) { 
        showTooltip(event)
    } else {
        destroyTooltip()
    }
}

const showTooltip = (event) => { 
    
    const $achievement = $(event.currentTarget)

    const tooltip = getTooltip($achievement.attr("id"))
    const tooltipId = "ach-tooltip"
    const X = $achievement.offset().left 
    const Y = $achievement.offset().top

    setTooltip(tooltipId, tooltip, X, Y)
}

export const destroyTooltip = () => { 
    const tooltipId = "ach-tooltip"
    $(`#${tooltipId}`).empty()
    var tooltip = document.getElementById(tooltipId)
    if (tooltip) tooltip.remove()
}

const setTooltip = (tooltipId, tooltip, X, Y) => {
    $("#menu").append(`<div id='${tooltipId}' class='tooltip'>${tooltip}</div>`)
    $(`#${tooltipId}`).css("left", X + "px")
    $(`#${tooltipId}`).css("top", Y + "px")
}

const getTooltip = (achievementId) => {
    
    const [type, level] = getTypeAndLevelFromId(achievementId)
    const achievements = $("body").data("achievements")
    var tooltip = achievements[type].tooltip
    const threshold = achievements[type][level].threshold

    return tooltip.replace("{THRESHOLD}", threshold)
}