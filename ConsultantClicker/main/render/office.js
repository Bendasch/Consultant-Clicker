import { officeButtonOwned } from '../logic/upgrades.js'
import { officeClick } from '../logic/office.js'

export const renderOfficeButtons = () => {
    
    const minPx = 50;
    const scaleVH = 5;
    const magicSlope = 0.2;
    const magicSlope2 = 0.0675;
    const minScale = 0.8; // %
    const numSteps = 20;
    const body =  $("body");
    var stepsLeft, step, scale, newAnimation;
    
    var oButtons = body.data("buttons");
    Object.keys(oButtons).forEach( (buttonId) => {

        var oButton = oButtons[buttonId];
        var $button = $(`#${buttonId}`)

        if (!(officeButtonOwned(buttonId))) {
            $button.removeClass("unlocked")
            return;
        }

        $button.addClass("unlocked")

        stepsLeft = oButton.animationCyclesLeft;
        newAnimation = oButton.newAnimation;
  
        if (stepsLeft > 0 || newAnimation) {

            // calculate the next width
            step = numSteps - stepsLeft;
            if (step <= 5) {
                scale = minScale + magicSlope * Math.exp(-1 * step);
            } else if (step<20) {
                scale = minScale + magicSlope2 * Math.log(step - 5)
            } else {
                scale = 1;
            }

            // In case of a new click, we don't want to start the animation all over,
            // since this means resetting the button to full size first! Rather, we
            // find the next lowest value on the size curve's "way down"
            if (newAnimation) {
                
                // Calculate the first values of the curve until we find a value which is lower.
                // This will be our next value and this will also detemrine the "cycles left".
                var newScale;
                for (var i = 1; i <= 5; i++) {
                    newScale = minScale + magicSlope * Math.exp(-1 * i);
                    if (newScale < scale) {
                        scale = newScale;
                        stepsLeft = numSteps - i;
                        break;
                    }
                }
            }

            $button.css("width", () => {
                return ("calc(" + scaleVH * scale + "vw + " + minPx + "px)");
            });

            oButtons[buttonId].animationCyclesLeft = stepsLeft - 1;
            oButtons[buttonId].newAnimation = false;
        }   
        
        renderButtonGlow($button, buttonId)        
    });
    
    body.data("buttons", oButtons);
}

export const triggerOfficeAnimation = (buttonId) => {
    const body = $("body")
    var buttons = body.data("buttons")
    buttons[buttonId].newAnimation = true
    body.data("buttons", buttons)
}

const renderButtonGlow = ($button, buttonId) => {

    const body = $("body")
    var buttons = body.data("buttons")
    const glowCycles = buttons[buttonId].glowCycles

    // change the glow
    if (glowCycles > 0 && (glowCycles % 8 == 0)) {
        switch (glowCycles / 8) {
            case 10:
            case 6:
            case 2: setGlow($button, 1); break

            case 9:
            case 7:
            case 5:
            case 3: setGlow($button, 2); break

            case 8: 
            case 4: setGlow($button, 3); break

            case 1: setGlow($button, 0); break
        }
    }

    // update the glow index
    buttons[buttonId].glowCycles = glowCycles - 1;
    body.data("buttons", buttons)
}

export const startButtonGlow = (buttonId) => {
    const maxGlowCycles = 70
    var buttons = $('body').data('buttons')
    buttons[buttonId].glowCycles = maxGlowCycles
    $('body').data('buttons', buttons)
}

const setGlow = ($button, glowIdx) => {
    $button.removeClass(["glow1", "glow2", "glow3"])
    if (glowIdx != 0) $button.addClass(`glow${glowIdx}`)
}

export const bindOfficeButtons = () => { 
    $("#word").unbind().click((event) => officeClick(event, "word"))
    $("#excel").unbind().click((event) => officeClick(event, "excel"))
    $("#powerpoint").unbind().click((event) => officeClick(event, "powerpoint"))
    $("#outlook").unbind().click((event) => officeClick(event, "outlook"))
}