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

    // clicking
    const oClicking = body.data("clicking");
    $("#clickingRate").text(oClicking.value);
    $("#totalClickProgress").text(oClicking.totalProgress);
    $("#totalClicks").text(oClicking.clicks);
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
    const oAllEquips = body.data("equipment");
    const balance = body.data("currentBalance");

    Object.keys(oAllEquips).forEach( (key) => {
        const oEquip = oAllEquips[key];
        if (oEquip.owned) {
            $("#" + oEquip.id).removeClass("not-owned");
            $("#" + oEquip.id).addClass("owned");
        } else {
            $("#" + oEquip.id).removeClass("owned");
            $("#" + oEquip.id).addClass("not-owned");
        }

        if (oEquip.cost <= balance && !(oEquip.owned)) {
            enableEquipButton(oEquip.id);
        } else {
            disableButton("#" + oEquip.id);
        } 
    });
}
  
function enableEquipButton(equipId) {   
    $("#" + equipId).unbind().click(() => buyEquipment(equipId)); 
    $("#" + equipId).removeClass("disabled");
    $("#" + equipId).addClass("enabled");
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
    var stepsLeft, step, scale, newAnimation;
    
    var oButtons = body.data("buttons");
    Object.keys(oButtons).forEach( (buttonId) => {

        var oButton = oButtons[buttonId];

        stepsLeft = oButton.animationCyclesLeft;
        newAnimation = oButton.newAnimation;
  
        if (stepsLeft > 0 || newAnimation) {

            // calculate the next width
            step = numSteps - stepsLeft;
            if (step <= 5) {
                scale = minScale + 0.2 * Math.exp(-1 * step);
            } else if (step<20) {
                scale = minScale + 0.0675 * Math.log(step - 5)
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
                    newScale = minScale + 0.2 * Math.exp(-1 * i);
                    if (newScale < scale) {
                        scale = newScale;
                        stepsLeft = numSteps - i;
                        break;
                    }
                }
            }

            $("#" + buttonId).css("width", () => {
                return ((maxPx * scale) + "px");
            });

            oButtons[buttonId].animationCyclesLeft = stepsLeft - 1;
            oButtons[buttonId].newAnimation = false;
        }        
    });
    
    body.data("buttons", oButtons);
}

export function addEquipmentRow(oEquip) {

    // row 
    const oRow = $("<div id='" + oEquip.id + "' class='equipmentRow'></div>");
    $("#equipmentTable").append(oRow);

    // cells
    oRow.append("<div id='" + oEquip.id + "-name' class='equipmentName'></div>");
    oRow.append("<div id='" + oEquip.id + "-description' class='equipmentDescription'></div>");
    oRow.append("<div id='" + oEquip.id + "-cost' class='equipmentCost'></div>");

    // values
    $("#" + oEquip.id + "-name").append('<p>' + oEquip.name + '</p>');
    $("#" + oEquip.id + "-description").append('<p>' + oEquip.description + '</p>');
    $("#" + oEquip.id + "-cost").append('<p>' + Formatter.format(oEquip.cost) + '</p>');
}