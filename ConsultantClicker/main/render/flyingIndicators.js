import { Formatter } from '../utils/utils.js'

export const renderFlyingNumbers = () => {
    renderProgressNumbers()
    renderBalanceNumbers()
}

const renderBalanceNumbers = () => {
    
    const body = $("body");
    const container = $("#projectBalanceContainer");

    var project = body.data("projectMeta");
    var indicators = container.children("div");

    if (indicators.length <=  0) { return; }

    indicators.each( index => {

        var indicatorId = indicators[index].id;
        var $indicator = $("#" + indicatorId)
        var ticksleft = project.indicators[indicatorId];

        if (ticksleft == 0) {      
            $indicator.remove();      
            delete project.indicators[indicatorId];
        } else {            
            $indicator.css("top", ($indicator.css("top").replace(/[^-\d\.]/g, '') - 2) + "px");
            project.indicators[indicatorId] = ticksleft - 1;
        }

        body.data("project", project);
    });
}

const renderProgressNumbers = () => {
    
    const body = $("body");
    const container = $("#clickProgressContainer");

    var clicking = body.data("clicking");
    var indicators = container.children("div");

    if (indicators.length <=  0) { return; }

    indicators.each( index => {

        var indicatorId = indicators[index].id;
        var $indicator = $("#" + indicatorId)
        var ticksleft = clicking.indicators[indicatorId];

        if (ticksleft == 0) {      
            $indicator.remove();      
            delete clicking.indicators[indicatorId];
        } else {            
            $indicator.css("top", ($indicator.css("top").replace(/[^-\d\.]/g, '') - 5) + "px");
            clicking.indicators[indicatorId] = ticksleft - 1;
        }

        body.data("clicking", clicking);
    });
}

export const createProgressIndicator = (id, x, y, type=null, value=null) => {

    const body = $("body");
    
    if (type == 'progress') {
        var dot = $("<div id='" + id + "' class='clickProgressIndicator'>" + "+" + value + "&#128170;</div>");
    } else if (type == 'findProject') {
        var emoji;
        value ? emoji = '&#127881;' : emoji = '&#128169;' // the value is whether a project was found
        var dot = $("<div id='" + id + "' class='clickProgressIndicator'>" + emoji + "</div>")
    } else { 
        console.error("No click type was provided. This should not happen!")
        return
    }
    
    styleAnimationDot(dot, x, y);        
    $("#clickProgressContainer").append(dot);

    // cache
    var clicking = body.data("clicking");
    clicking.indicators[id] = 25;
    body.data("clicking", clicking);
}

export const startAddToBalanceAnimation = (projectId, projectValue) => {
    const body = $("body");
    
    const ID = projectId + "-balance";
    const $project = $("#" + projectId);
    if (!$project) return
    const X = $project.offset().left + ($project.width() / 2);
    const Y = $project.offset().top + ($project.height() / 2);
    var dot = $("<div id='" + ID + "' class='addToBalanceIndicator'>" + Formatter.format(projectValue) + "&#128184;</div>");
    styleAnimationDot(dot, X, Y);
    $("#projectBalanceContainer").append(dot);

    // cache ticks for indication
    var project = body.data("projectMeta");
    project.indicators[ID] = 50;
    body.data("project", project);
}

const styleAnimationDot = ($dot, x, y) => {

    const WIDTH = $dot.text().length * 20;
    const HEIGHT = WIDTH / 2;
    const X = x - (WIDTH / 2);
    const Y = y - (HEIGHT / 2);

    $dot.css("width", WIDTH + "px");
    $dot.css("height", HEIGHT + "px");   
    $dot.css("line-height", HEIGHT + "px"); 
    
    $dot.css("left", X + "px");
    $dot.css("top", Y + "px");
}