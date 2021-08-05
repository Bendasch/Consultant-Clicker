import { resetGame } from '../logic/infra.js'
import { toggleTrelloButton } from '../utils/trello.js'
import { toggleTimesDisplay } from '../utils/utils.js'

export const bindSettingsButtons = () => {
    $("#resetGame").unbind().click(() => {resetGame()})
    $("#enableTrello").unbind().click(() => {toggleTrelloButton()})
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