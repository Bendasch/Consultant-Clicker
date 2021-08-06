import { officeButtonOwned } from '../logic/upgrades.js'
import { officeClick } from '../logic/office.js'

export const renderOfficeButtons = () => {
    
    const body =  $("body");
    
    var buttons = body.data("buttons")
    Object.keys(buttons).forEach( (buttonId) => {

        var button = buttons[buttonId]
        var $button = $(`#${buttonId}`)

        if (!(officeButtonOwned(buttonId))) {
            $(`#${buttonId}Container`).removeClass("unlocked")
            return;
        }
        $(`#${buttonId}Container`).addClass("unlocked")

        setOfficeCooldown(buttonId, buttons[buttonId].cooldown)
        renderClick(buttons, buttonId)
        renderButtonGlow($button, buttonId)        
    });
}

export const setOfficeCooldown = (buttonId, cooldown) => {
    
    const powerups = $("body").data("powerups")

    var $btn = $(`#${buttonId}`)    
    var $container = $(`#${buttonId}Container`)

    if (cooldown <= 0) { 
        $btn.removeClass("cooldown")
        $btn.css("opacity", `100%`)
        $container.removeClass("cooldown")
        return
    }

    $container.addClass("cooldown")
    $btn.addClass("cooldown")

    // if the powerup is still active, return
    if (buttonId in powerups) return;

    // start at 35% opacity
    // and fade in depending on cd
    var maxCooldown;
    switch (buttonId) {
        case "powerpoint":  maxCooldown = 60; break
        case "excel":       maxCooldown = 90; break
        case "outlook":     maxCooldown = 90; break
    }    

    var opacity = 80 - 80 * (cooldown / maxCooldown)
    
    $btn.css("opacity", `${opacity}%`)
}

const renderClick = (buttons, buttonId) => {

    // these constants control the behaviour of the click animation
    const minPx = 50;
    const scaleVW = 5;
    const magicSlope = 0.2;
    const magicSlope2 = 0.0675;
    const minScale = 0.8; // %
    const numSteps = 20;

    var stepsLeft = buttons[buttonId].animationCyclesLeft;
    var newAnimation = buttons[buttonId].newAnimation;

    if (stepsLeft > 0 || newAnimation) {

        // calculate the next width
        var scale;
        var step = numSteps - stepsLeft;
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

        $(`#${buttonId}`).css("width", () => {
            return ("calc(" + scaleVW * scale + "vw + " + minPx + "px)");
        });

        buttons[buttonId].animationCyclesLeft = stepsLeft - 1;
        buttons[buttonId].newAnimation = false;
    } else {
        $(`#${buttonId}`).css("width", "100%")
    }

    $("body").data("buttons", buttons);
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

    if (glowCycles <= 0) {
        setGlow($button, 0)
        return
    }

    if (glowCycles % 8 == 0) {
        switch ((glowCycles / 8) % 3) {
            case 1: setGlow($button, 3); break
            case 2: setGlow($button, 2); break
            case 0: setGlow($button, 1); break
        }
    } 

    // update the glow index
    buttons[buttonId].glowCycles = glowCycles - 1;
    body.data("buttons", buttons)
}

export const startButtonGlow = (buttonId, cycles=120) => {
    var buttons = $('body').data('buttons')
    buttons[buttonId].glowCycles = cycles
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