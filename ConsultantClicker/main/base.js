import { logAction } from './render.js';
import { Formatter, normRand } from './utils.js';


export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function update(tick, cycle) {
  findProject(tick, cycle);
  updateProject(tick);
  updateRates();
}


function updateProject(tick) {

  const body = $( "body" );

  const oProject = body.data("project");

  if (oProject.effort <= 0) { return; } 
  
  updateProgress(tick);

  // update the progress
  // update the earnings if 
  if (oProject.progress >= oProject.effort) {

    // add the project value to the earnings and balance
    addToBalance(oProject.value);

    // display a success message
    logAction("Project finished! Earned " + Formatter.format(oProject.value) + ".");

    // reset the current project
    oProject.value = 0;
    oProject.effort = 0;
    oProject.progress = 0;
  } 

  body.data( "project", oProject);
};


function findProject(tick, cycle) {
  
  const body = $( "body" );
  var quotient;

  // if there is a current project, we don't need to find one 
  const oProject = body.data("project");
  if  (oProject.value != 0) {
    return;
  }
  
  // try to find a project every x seconds
  var x = 1;
  var iFrequency = (1000 / tick) * x;
  if (cycle % iFrequency !== 0) {
    return;
  }

  // get a random number between 0 and 1
  // if the total sales rate is greater than the random number, we get a project
  var iRand = Math.random();
  if (body.data("totalSalesRate") < iRand) {
    logAction("Project proposal failed! Total Sales Rate < " + iRand.toFixed(5) + ".");  
    return;
  } 

  // get the project value (normal distribution, rounded to 500)
  oProject.value = normRand(0,2) * oProject.expectedValue;
  quotient = Math.floor(oProject.value / 500);
  oProject.value = Math.max(quotient * 500, 500); 

  // and effort (normal distribution, rounded to 250)  
  oProject.effort = Math.round(normRand(0,2) * (oProject.value * oProject.effortConversionRate));
  quotient = Math.floor(oProject.effort / 250);
  oProject.effort = Math.max(quotient * 250, 250); 

  body.data("project", oProject);

  // output success message
  logAction("Project proposal successful! Project value " + Formatter.format(oProject.value) + " (effort " + oProject.effort + ").");
};


export function addToBalance(val) {

  const body = $( "body" );
  body.data("currentBalance", body.data("currentBalance") + val);
  if (val > 0) {
    body.data("totalEarnings", body.data("totalEarnings") + val);
  }
};


function updateRates() {

  const body = $( "body" );

  // consultants
  const oJunior = body.data("junior");
  const oConsultant = body.data("consultant");
  const oSenior = body.data("senior");
  var juniorRate = oJunior.baseRate; 
  var consultantRate = oConsultant.baseRate;
  var seniorRate = oSenior.baseRate;

  // sales
  const oSalesPerson = body.data("salesPerson");
  var salesPersonRate = oSalesPerson.baseRate;
  
  // click data
  const oClicking = body.data("clicking");
  var clickingValue = oClicking.baseValue;

  // get the equipments
  const oAllEquips = body.data("equipment");
  Object.keys(oAllEquips).forEach( (key) => {
    const oEquip = oAllEquips[key];
    if (oEquip.owned) {      
      juniorRate = juniorRate * oEquip.rate.consultants;
      consultantRate = consultantRate * oEquip.rate.consultants;
      seniorRate = seniorRate * oEquip.rate.consultants;
      salesPersonRate = salesPersonRate * oEquip.rate.sales;  
      clickingValue = clickingValue * oEquip.rate.clicking;
    }
  });
      
  oJunior.rate = juniorRate;
  oConsultant.rate = consultantRate;
  oSenior.rate = seniorRate;
  oSalesPerson.rate = salesPersonRate;
  oClicking.value = clickingValue;

  body.data("junior", oJunior);
  body.data("consultant", oConsultant);
  body.data("senior", oSenior);
  body.data("salesPerson", oSalesPerson);
  body.data("clicking", oClicking); 

  // calculate the new total rates
  const totalRate = oJunior.rate * oJunior.quantity + oConsultant.rate * oConsultant.quantity + oSenior.rate * oSenior.quantity;
  const totalSalesRate = oSalesPerson.rate * oSalesPerson.quantity;
  body.data("totalRate", totalRate);
  body.data("totalSalesRate", totalSalesRate);

}

export function officeClick(buttonId) {

  const body = $("body");
  const oClicking = body.data("clicking");
  oClicking.clicks += 1;

  // here we simply mark the animation to be started
  var oButtons = body.data("buttons");
  oButtons[buttonId].newAnimation = true;
  body.data("buttons", oButtons);

  // we need to check whether there is a project to progress
  if (body.data("project").effort > 0) {

    addToProgress(oClicking.value);

    oClicking.totalProgress += oClicking.value;
  
    var actionStr;
    switch(buttonId) {
      case "word": actionStr = "Awesome work on that requirements document!"; break;
      case "excel": actionStr = "Nice spreadsheet!"; break;
      case "powerpoint": actionStr = "Cool presentation!"; break;
      case "outlook":  actionStr = "Great mail, keep going!"; break;
    }
    logAction(actionStr + " You helped progress the project by " + oClicking.value + "!");

  } else {
    logAction("There is no project for you. You need to wait for your friends at sales to hook you up!");
  }
  
  body.data("clicking", oClicking);
}


function updateProgress(tick) {

  const body = $("body");
  const oProject = body.data("project");

  // calculate the progress of the projects
  // the rates are per second, the tick rate is in milliseconds
  // e.g. tick = 250 means that we have to devide by 4
  oProject.progress = oProject.progress + (tick/1000) * body.data("totalRate");

  body.data("project", oProject);
}


function addToProgress(progress) {

  const body = $("body");
  const oProject = body.data("project");
  oProject.progress += progress;
  body.data("project", oProject);
}