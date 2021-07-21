export function logAction(str) {
    const logBox = $("#logBox");
    const d = new Date()
    var time = String(d.getHours()).padStart(2,0) + ":" + String(d.getMinutes()).padStart(2,0) + ":" + String(d.getSeconds()).padStart(2,0);

    if (str != "") {
        logBox.append("<p><strong>" + time + "</strong> - " + str + "</p>");
    } else {
        logBox.append("<p> </p>");
    }

    // scroll down animation
    logBox.animate({scrollTop: logBox.prop("scrollHeight")}, 75);
}