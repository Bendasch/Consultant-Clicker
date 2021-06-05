import { Formatter, FormatterNoDec } from './utils.js';
import { addResource, buyEquipment } from './shop.js';

export function render() {
    renderStats();
    renderResources();
    renderResourceButtons();
    renderEquipmentButtons();
    renderOfficeButtons();
}

export function logAction(str) {
    const logBox = $("#logBox");
    const d = new Date()
    var time = String(d.getHours()).padStart(2,0) + ":" + String(d.getMinutes()).padStart(2,0) + ":" + String(d.getSeconds()).padStart(2,0);
    logBox.append("<p>" + time + " - " + str + "</p>");

    // scroll down animation
    logBox.animate({scrollTop: logBox.prop("scrollHeight")}, 75);
}

function setProgressBar(progress, effort) {
    var percentage = (progress / effort) * 100;
    $("#progressBar").width(percentage + "%");
}

export function openTab(event, tabId) {

    var i, tabcontent, tablinks;
  
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
    document.getElementById(tabId).style.display = "block";
    event.currentTarget.className = event.currentTarget.className.replace(" inactive", " active");
}

function renderStats() {

    const body = $( "body" );

    // earnings
    $("#totalEarnings").text(Formatter.format(body.data("totalEarnings")));
    $("#currentBalance").text(Formatter.format(body.data("currentBalance")));

    // current project
    const oProject = body.data("project");


    if (oProject.value == 0) {
        $("#projectValue").text("there is no active project");
    } else {
        $("#projectValue").text(Formatter.format(oProject.value));
    }

    if (oProject.effort == 0) {
        setProgressBar(0, 1);
        $("#projectProgress").text(0 + " / " + 0);
    } else {
        setProgressBar(oProject.progress, oProject.effort);
        $("#projectProgress").text(oProject.progress.toFixed(2) + " / " + oProject.effort.toFixed(2));
    }

    // total rates
    $("#rate").text(body.data( "totalRate" ));  
    $("#totalSalesRate").text((body.data("totalSalesRate")*100).toFixed(2) + " %");
}

function renderResources() {

    const body = $( "body" );

    const oJunior = body.data( "junior");
    const oConsultant = body.data( "consultant");
    const oSenior = body.data( "senior");
    const oSalesPerson = body.data( "salesPerson");

    // counts
    $("#juniorCount").text(oJunior.quantity);
    $("#consultantCount").text(oConsultant.quantity);
    $("#seniorCount").text(oSenior.quantity);
    $("#salesPersonCount").text(oSalesPerson.quantity);

    // rates
    $("#juniorRate").text("× " + oJunior.rate);
    $("#consultantRate").text("× " + oConsultant.rate);
    $("#seniorRate").text("× " + oSenior.rate);
    $("#salesPersonRate").text((oSalesPerson.rate*100).toFixed(2) + " %");

    // costs
    $("#juniorCost").text("-" + FormatterNoDec.format(oJunior.cost));
    $("#consultantCost").text("-" + FormatterNoDec.format(oConsultant.cost));
    $("#seniorCost").text("-" + FormatterNoDec.format(oSenior.cost));
    $("#salesPersonCost").text("-" + FormatterNoDec.format(oSalesPerson.cost));
}


function renderResourceButtons() {

    const body = $( "body" );
    
    const balance = body.data( "currentBalance");
    const oJunior = body.data( "junior");
    const oConsultant = body.data( "consultant");
    const oSenior = body.data( "senior");
    const oSalesPerson = body.data( "salesPerson");
  
    (oJunior.cost <= balance) ? enableResButton("#juniorButton", "junior") : disableButton("#juniorButton");
    (oConsultant.cost <= balance) ? enableResButton("#consultantButton", "consultant") : disableButton("#consultantButton");
    (oSenior.cost <= balance) ? enableResButton("#seniorButton", "senior") : disableButton("#seniorButton");
    (oSalesPerson.cost <= balance) ? enableResButton("#salesPersonButton", "salesPerson") : disableButton("#salesPersonButton");
}


function renderEquipmentButtons() {

    const body = $( "body" );

    var balance = body.data("currentBalance");
    var oMonitor = body.data("secondMonitor");

    if (oMonitor.owned) {
        $("#secondMonitor").removeClass("not-owned");
        $("#secondMonitor").addClass("owned");
    } else {
        $("#secondMonitor").removeClass("owned");
        $("#secondMonitor").addClass("not-owned");
    }

    if (oMonitor.cost <= balance && !(oMonitor.owned)) {
        enableEquipButton("#secondMonitor", "secondMonitor");
    } else {
        disableButton("#secondMonitor");
    } 
}
  
function enableEquipButton(sSelector, equipId) {   
    $(sSelector).unbind().click(() => buyEquipment(equipId)); 
    $(sSelector).removeClass("disabled");
    $(sSelector).addClass("enabled");
}
  
function enableResButton(sSelector, sResId) {   
    $(sSelector).unbind().click(() => addResource(sResId)); 
    $(sSelector).removeClass("disabled");
    $(sSelector).addClass("enabled");
}

function disableButton(sSelector) {
    $(sSelector).unbind();
    $(sSelector).removeClass("enabled");
    $(sSelector).addClass("disabled");
}

function renderOfficeButtons() {
    
    const maxPx = 108;
    const minScale = 0.8; // %
    const numSteps = 20;
    const body =  $("body");
    var stepsLeft, step, scale;
    
    const aButtons = ["word", "excel", "powerpoint", "outlook"];
    aButtons.forEach( (buttonId) => {

        stepsLeft = body.data(buttonId + "AnimationCyclesLeft");
        if (stepsLeft >= 0) {

            step = numSteps - stepsLeft;
            if (step <= 5) {
                scale = minScale + 0.2 * Math.exp(-1 * step);
            } else if (step<20) {
                scale = minScale + 0.0675 * Math.log(step - 5)
            } else {
                scale = 1;
            }

            $("#" + buttonId).css("width", () => {
                return ((maxPx * scale) + "px");
            });
            body.data(buttonId + "AnimationCyclesLeft", stepsLeft - 1);
        }
    });
}