export const updatePowerups = (tick) => {
    const body = $("body")
    var powerups = body.data("powerups")
    Object.keys(powerups).forEach( (key) => {
        powerups[key].secondsleft -= (tick / 1000)
        if (powerups[key].secondsleft <= 0) delete powerups[key]
    })
    body.data("powerups", powerups)
}