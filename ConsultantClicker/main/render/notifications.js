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

export const showNotification = (headerText, mainText, achImg=null, customFade=null) => {
    
    const body = $("body")
    var notifications = body.data("notifications")
    
    const time = (new Date()).getTime()
    var id = getNextId(notifications, `${time}_0`)
    var classes = "notification"
    var fade = customFade || 4

    if (achImg) {
        classes += ` achievement`
        fade = customFade || 2
    } 

    $("#notifications").append(`<div id='${id}' class='${classes}'></div>`)
    var $nofication = $(`#${id}`)
    
    if (achImg) $nofication.append(`<img src='./img/achievements/${achImg}.png'/>`)
    $nofication.append(`<h1>${headerText}</h1>`)
    if (mainText != "") $nofication.append(`<p>${mainText}</p>`)

    notifications[id] = fade
    body.data("notifications", notifications)
}

const destroyNotification = (id) => {
    $(`#${id}`).empty()
    var doc = document.getElementById(id)
    if (doc) doc.remove()
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

export const destroyAllNotifications = () => {
    $("body").data("notifications", {})
    $("#notifications").empty()
}

export const showNailedIt = () => {
    
    $("#notifications").append(`<div id='nailed-it' class='noficiation'></div>`)

    const body = $("body")
    var notifications = body.data("notifications")
    notifications["nailed-it"] = 6
    body.data("notifications", notifications)
}