import { resetGame } from '../logic/infra.js'

export const bindSettingsButtons = () => {
    $("#resetGame").unbind().click(() => {resetGame()})
}