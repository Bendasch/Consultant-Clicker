import { getTypeAndLevelFromId } from '../logic/achievements.js'
import { mobileCheck } from '../utils/utils.js'

export const unlockAchievement = (divId) => {
    $(`#${divId}`).addClass("unlocked")

    if (mobileCheck()) {

        $(`#${divId}`).click( (event) => {toogleTooltip(event)} )
        
    } else {

        $(`#${divId}`).unbind().hover(
            (event) => {showTooltip(event)},
            () => {destroyTooltip()}    
        )
    }
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