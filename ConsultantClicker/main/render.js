import { Formatter, FormatterNoDec, FormatterDec } from './utils.js';
import { officeButtonOwned, addResource, buyUpgrade } from './shop.js';
import { projectClick, resetGame, officeClick } from './base.js';

export function render() {
    renderCashews()
    renderStats()
    renderConsultants()
    renderSales()
    renderResourceButtons()
    renderUpgradeButtons()
    renderProjects()
    renderOfficeButtons()
    renderFlyingNumbers()
}

const renderCashews = () => {
    $("#cashews").text(FormatterNoDec.format($("body").data("currentBalance")));
};

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

export const initialBinding = () => {
    // bind event handlers to navbar
    $("#statsTab").unbind().click((event) => {toggleTab(event, "stats")});
    $("#staffTab").unbind().click((event) => {toggleTab(event, "staff")});
    $("#upgradeTab").unbind().click((event) => {toggleTab(event, "upgrades")});
    $("#logTab").unbind().click((event) => {toggleTab(event, "log")})
    $("#settingsTab").unbind().click((event) => {toggleTab(event, "settings")})

    // settings 
    $("#resetGame").unbind().click(() => {resetGame()});

    // trello popup
    $("#trelloButton").unbind().click(() => {popup("#trello")});
    $("#trelloSend").unbind().click((event) => {createTrelloCard(event)});

    // initialize the office buttons
    $("#word").unbind().click((event) => officeClick(event, "word"))
    $("#excel").unbind().click((event) => officeClick(event, "excel"))
    $("#powerpoint").unbind().click((event) => officeClick(event, "powerpoint"))
    $("#outlook").unbind().click((event) => officeClick(event, "outlook"))
}

export function toggleTab(event, tabId) {

    var i, tabcontent, tablinks;
    
    var isActive = $(event.currentTarget).hasClass("active");

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", " inactive");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    var menu =  $("#menu");
    if (!isActive) {
        document.getElementById(tabId).style.display = "block";
        menu.css("display", "block");
        event.currentTarget.className = event.currentTarget.className.replace(" inactive", " active");
    } else {
        menu.css("display", "none");
    }
}

function renderStats() {

    const body = $( "body" );

    // earnings
    $("#totalEarnings").text(Formatter.format(body.data("totalEarnings")));
    $("#currentBalance").text(Formatter.format(body.data("currentBalance")));

    // total rates
    $("#rate").text(body.data( "totalRate" ));  
    $("#totalSalesRate").text((body.data("totalSalesRate")*100).toFixed(2) + " %");


    const oClicking = body.data("clicking");

    $("#clickingRate").text(
        FormatterDec.format(oClicking.value)
    );
    $("#totalClickProgress").text(
        FormatterDec.format(oClicking.totalProgress)
    );
    $("#totalClicks").text(
        FormatterDec.format(oClicking.clicks)
    );

    $("#totalProjectsFinished").text(
        FormatterDec.format(body.data("projectMeta").totalProjectsFinished)
    );
}

function renderConsultants() {

    const consultants = $("body").data("consultants");

    Object.keys(consultants).forEach( key => {
        const consultant = consultants[key]
        $(`#${key}Count`).text(consultant.quantity)
        $(`#${key}Rate`).text("× " + consultant.rate)
        $(`#${key}Cost`).text("-" + FormatterNoDec.format(consultant.cost))
    })
}

function renderResourceButtons() {

    const body = $( "body" );
    const balance = body.data( "currentBalance")
    
    // consultants     
    const consultants = body.data("consultants")
    Object.keys(consultants).forEach( key => {
        const consultant = consultants[key];
        if (consultant.cost <= balance) { 
            enableResButton(`#${key}Button`, "consultants", key)
        } else {
            disableButton(`#${key}Button`)
        } 
    })

    // sales
    const sales = body.data("sales")
    Object.keys(sales).forEach( key => {
        const salesMember = sales[key];
        if (salesMember.cost <= balance) { 
            enableResButton(`#${key}Button`, "sales", key)
         } else {
            disableButton(`#${key}Button`)
         } 
    })
}


function renderUpgradeButtons() {

    const body = $( "body" );
    const allUpgrades = body.data("upgrades");
    const balance = body.data("currentBalance");

    Object.keys(allUpgrades).forEach( (key) => {
        const upgrade = allUpgrades[key];
        if (upgrade.owned) {
            $("#" + upgrade.id).removeClass("not-owned");
            $("#" + upgrade.id).addClass("owned");
        } else {
            $("#" + upgrade.id).removeClass("owned");
            $("#" + upgrade.id).addClass("not-owned");
        }

        if (upgrade.cost <= balance && !(upgrade.owned)) {
            enableUpgradeButton(upgrade.id);
        } else {
            disableButton("#" + upgrade.id);
        } 
    });
}
  
function enableUpgradeButton(upgradeId) {   
    $("#" + upgradeId).unbind().click(() => buyUpgrade(upgradeId)); 
    $("#" + upgradeId).removeClass("disabled");
    $("#" + upgradeId).addClass("enabled");
}
  
function enableResButton(selector, category, resId) {   
    $(selector).unbind().click(() => addResource(category, resId)); 
    $(selector).removeClass("disabled");
    $(selector).addClass("enabled");
}

function disableButton(selector) {
    $(selector).unbind();
    $(selector).removeClass("enabled");
    $(selector).addClass("disabled");
}

function renderOfficeButtons() {
    
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

function addUpgradeRow(upgrade) {

    // row 
    const oRow = $("<div id='" + upgrade.id + "' class='upgradeRow'></div>");
    $("#upgradeTable").append(oRow);

    // cells
    oRow.append("<div id='" + upgrade.id + "-name' class='upgradeName'></div>");
    oRow.append("<div id='" + upgrade.id + "-description' class='upgradeDescription'></div>");
    oRow.append("<div id='" + upgrade.id + "-cost' class='upgradeCost'></div>");

    // values
    $("#" + upgrade.id + "-name").append('<p>' + upgrade.name + '</p>');
    $("#" + upgrade.id + "-description").append('<p>' + upgrade.description + '</p>');
    $("#" + upgrade.id + "-cost").append('<p>' + Formatter.format(upgrade.cost) + '</p>');
}

export const setUpgrades = () => {
    
    // clear the table
    $("#upgradeTable").children().remove();

    // rebuild it
    var allUpgrades = $("body").data("upgrades")
    Object.keys(allUpgrades).forEach( (key) => {
        var upgrade = allUpgrades[key]
        addUpgradeRow(upgrade)
    });
}

function renderProjects() {
    
    const body = $("body");
    const projectMeta = body.data("projectMeta");
    var projects = body.data("projects");

    var width = ($("#projectBar").width() / Object.keys(projects).length) - 4;

    var projectBuffer = $("#projectBuffer");
    projectBuffer.text(Object.keys(projects).length + " / " + projectMeta.projectBufferSize);
    (projectMeta.projectBufferSize > Object.keys(projects).length) ? setNotFull(projectBuffer) : setFull(projectBuffer);

    Object.keys(projects).forEach( (projectId) => {
        renderProject(projects[projectId], width);
    });
}

function renderProject(oProject, width) {

    const projectBar = $("#projectBar");
    const projectId = oProject.id;
    var projectDiv; 

    // creat the div if it does not exist
    if ($("#" + projectId).length == 0) {

        // project itself
        projectBar.append("<div id='" + projectId + "' class='project'></div>");
        projectDiv = $("#"+projectId);

        // the details
        projectDiv.append('<p>' + oProject.name + '</p>');
        projectDiv.append('<p>' + Formatter.format(oProject.value) + '</p>');

        // the progress bar and prog + effort numbers
        var progressWrapper = $("<div id='" + projectId + "-progressWrapper' class='progressWrapper'></div>")
        projectDiv.append(progressWrapper);
        progressWrapper.append("<div id='" + projectId + "-progressBar' class='progressBar'></div>");
        progressWrapper.append("<p id='" + projectId + "-projectProgress'></p>");

        // click event
        projectDiv.unbind().click(() => projectClick(projectId));

    } else {        

        projectDiv = $("#"+projectId);
    }

    oProject.active ? setActive(projectDiv) : setInactive(projectDiv);
    projectDiv.css("width", width);

    setProjectProgress(projectId, oProject.progress, oProject.effort)
    setProgressBar(projectId, oProject.progress, oProject.effort);
}

function setProjectProgress(projectId, progress, effort) {
    $("#" + projectId + "-projectProgress").text(FormatterDec.format(progress.toFixed(0)) + " / " + FormatterDec.format(effort));
}

function setActive(div) {
    div.removeClass("inactive");
    div.addClass("active");
}

function setInactive(div) {
    div.removeClass("active");
    div.addClass("inactive");
}

function setFull(div) {
    div.removeClass("not-full");
    div.addClass("full");
}

function setNotFull(div) {
    div.removeClass("full");
    div.addClass("not-full");
}

export function destroyProject(projectId) {
    $("#" + projectId).empty();
    document.getElementById(projectId).remove();
}

export const destroyAllProjects = () => {
    var projects = $("#projectBar").children(".project")
    projects.remove()
}

function setProgressBar(projectId, progress, effort) {
    var percentage = (progress / effort) * 100;
    $("#" + projectId + "-progressBar").width(percentage + "%");
    $("#" + projectId + "projectProgress").text(progress.toFixed(2) + " / " + effort.toFixed(2));
}

function renderFlyingNumbers() {
    renderProgressNumbers();
    renderBalanceNumbers();
}

function renderBalanceNumbers() {
    
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

function renderProgressNumbers() {
    
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

export function createProgressIndicator(id, x, y, type=null, value=null) {

    const body = $("body");
    
    if (type == 'progress') {
        var dot = $("<div id='" + id + "' class='clickProgressIndicator'>" + "+" + value + "</div>");
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

export function setTime(type, value) {
    const T_NOW = (new Date()).getTime(); 
    if (type == "update") { $("#updateTime").text("Update time: " + (T_NOW - value) + "ms"); return}
    if (type == "render") { $("#renderTime").text("Render time: " + (T_NOW - value) + "ms"); return}
    if (type == "tick") { $("#tick").text("Tick rate: " + (1000 / value) + "Hz"); return}
} 

export function startAddToBalanceAnimation(projectId, projectValue) {
    const body = $("body");
    
    const ID = projectId + "-balance";
    const $project = $("#" + projectId);
    const X = $project.offset().left + ($project.width() / 2);
    const Y = $project.offset().top + ($project.height() / 2);
    var dot = $("<div id='" + ID + "' class='addToBalanceIndicator'>" + "+" + Formatter.format(projectValue) + "</div>");
    styleAnimationDot(dot, X, Y);
    $("#projectBalanceContainer").append(dot);

    // cache ticks for indication
    var project = body.data("projectMeta");
    project.indicators[ID] = 50;
    body.data("project", project);
}

function styleAnimationDot($dot, x, y) {

    const WIDTH = $dot.text().length * 7;
    const HEIGHT = WIDTH / 2;
    const X = x - (WIDTH / 2);
    const Y = y - (HEIGHT / 2);

    $dot.css("width", WIDTH + "px");
    $dot.css("height", HEIGHT + "px");   
    $dot.css("line-height", HEIGHT + "px"); 
    
    $dot.css("left", X + "px");
    $dot.css("top", Y + "px");
}

// toggles the popup with the parent div #<domId>
// the default display is 'inline'
export function popup(domId, display="inline") {

    var main = $(domId);
    var state;
    (main.css("display") == "none") ? state = display : state = "none";
    main.css("display", state);
}

export function trelloCardSuccess() {
    var button = $("#trelloSend");
    button.css("background-color", "#06d280");
    button.text("Issue created");
    $("#trelloName").prop("disabled", true);
    $("#trelloDescr").prop("disabled", true);
}


export function resetTrelloPopup() {

    // reset button
    var button = $("#trelloSend");
    button.css("background-color", "brown");
    button.text("Create issue");    

    // reset name
    var nameInput = $("#trelloName");
    nameInput.prop("disabled", false);
    nameInput.val("");

    // reset description
    var descArea = $("#trelloDescr");
    descArea.prop("disabled", false);
    descArea.val("");
}

const renderSales = () => {
    
    const sales = $("body").data("sales");

    Object.keys(sales).forEach(key => {
        const salesMember = sales[key]
        $(`#${key}Count`).text(salesMember.quantity);
        $(`#${key}Rate`).text((salesMember.rate*100).toFixed(2) + " %");
        $(`#${key}Cost`).text("-" + FormatterNoDec.format(salesMember.cost));
    })
}

export const triggerOfficeAnimation = (buttonId) => {
    const body = $("body")
    var buttons = body.data("buttons")
    buttons[buttonId].newAnimation = true
    body.data("buttons", buttons)
}

export const startButtonGlow = (buttonId) => {
    const maxGlowCycles = 70
    var buttons = $('body').data('buttons')
    buttons[buttonId].glowCycles = maxGlowCycles
    $('body').data('buttons', buttons)
}

export const setGlow = ($button, glowIdx) => {
    $button.removeClass(["glow1", "glow2", "glow3"])
    if (glowIdx != 0) $button.addClass(`glow${glowIdx}`)
}
