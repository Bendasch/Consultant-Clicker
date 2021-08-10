import { resetGame } from '../logic/infra.js'
import { toggleTimesDisplay } from '../utils/utils.js'

export const bindSettingsButtons = () => {
    $("#resetGame").unbind().click(() => {resetGame()})
    $("#enableTimes").unbind().click(() => {toggleTimesDisplay()})
    $("#toggleName").unbind().click(() => {toggleCompanyName()})
}

const toggleCompanyName = () => {
    var container = $("#companyNameContainer")
    var display = container.css("display")
    if (display === "none") {
        container.css("display", "block")
    } else {
        container.css("display", "none")
    }
}