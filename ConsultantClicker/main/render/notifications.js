export const renderNotifications = (cycle) => {

    const body = $("body")
    var notifications = body.data("notifications")
    Object.keys(notifications).forEach(key => {
        notifications[key] -= 0.01
        if (notifications[key]<=0) {
            delete notifications[key]
            destroyNotification(key)
        } else {
            $(`#${key}`).css("opacity", notifications[key])
        }
    })
    body.data("notifications", notifications)
}

export const showNotification = (headerText, mainText, achievement=false) => {
    const body = $("body")
    var notifications = body.data("notifications")
    const time = (new Date()).getTime()
    var id = getNextId(notifications, `${time}_0`)
    var classes = "notification"
    var fade;
    if (achievement) {
        classes += ` achievement`
        fade = 2.5
    } else {
        fade = 4
    }

    $("#notifications").append(`<div id='${id}' class='${classes}'></div>`)
    $(`#${id}`).append(`<h1>${headerText}</h1>`)
    $(`#${id}`).append(`<p>${mainText}</p>`)

    // set the fade of the current element

    notifications[id] = fade
}

const destroyNotification = (id) => {
    $(`#${id}`).empty()
    document.getElementById(id).remove()
}

const getNextId = (notifications, id) => {
    var [pre, post] = id.split("_")
    var nextId = `${pre}_${parseInt(post) + 1}`
    if (nextId in notifications) {
        return getNextId(notifications, nextId)
    } else {
        return nextId
    }
}