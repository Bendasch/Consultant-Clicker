import { resetGame } from '../logic/infra.js'
import { toggleTrelloButton } from '../utils/trello.js'
import { toggleTimesDisplay } from '../utils/utils.js'
import { toggleLog } from '../render/log.js'

export const bindSettingsButtons = () => {
    $("#resetGame").unbind().click(() => {resetGame()})
    $("#enableTrello").unbind().click(() => {toggleTrelloButton()})
    $("#enableTimes").unbind().click(() => {toggleTimesDisplay()})
    $("#enableLog").unbind().click(() => {toggleLog()})
}