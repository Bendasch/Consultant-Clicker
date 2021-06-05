import { logAction } from './render.js';

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function update(tick, cycle) {
  findProject(tick, cycle);
  updateProject(tick);
  updateRate();
}

function updateProject(tick) {

  const body = $( "body" );

  const oProject = body.data("project");

  if (oProject.effort <= 0) { return; } 

  // calculate the progress of the projects
  // the rates are per second, the tick rate is in milliseconds
  // e.g. tick = 250 means that we have to devide by 4
  oProject.progress = oProject.progress + (tick/1000) * body.data("totalRate");

  // update the progress
  // update the earnings if 
  if (oProject.progress >= oProject.effort) {

    // add the project value to the earnings and balance
    addToBalance(oProject.value);

    // display a success message
    logAction("Project finished! Earned " + oProject.value.toFixed(2) + "€.");

    // reset the current project
    oProject.value = 0;
    oProject.effort = 0;
    oProject.progress = 0;
  } 

  body.data( "project", oProject);
};

function findProject(tick, cycle) {
  
  const body = $( "body" );

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

  // in this case get further random numbers to determine the value and effort
  oProject.value = Math.random() * 45000;
  oProject.effort = Math.round(Math.random() * 7500);
  body.data("project", oProject);

  // output success message
  logAction("Project proposal successful! Project value " + oProject.value.toFixed(2) + "€ (effort " + oProject.effort + ").");
};

export function addToBalance(val) {

  const body = $( "body" );
  body.data("totalEarnings", body.data("totalEarnings") + val);
  body.data("currentBalance", body.data("currentBalance") + val);
};

function updateRate() {

  const body = $( "body" );

  // get staff data
  const oJunior = body.data( "junior");
  const oConsultant = body.data( "consultant");
  const oSenior = body.data( "senior");
  const oSalesPerson = body.data( "salesPerson");

  // get the equipments
  const oSecondMonitor = body.data( "secondMonitor" );

  // update the staff rates
  if (oSecondMonitor.owned) {
    oJunior.rate = oJunior.baseRate * oSecondMonitor.rate;
    oConsultant.rate = oConsultant.baseRate * oSecondMonitor.rate;
    oSenior.rate = oSenior.baseRate * oSecondMonitor.rate;
    oSalesPerson.rate = oSalesPerson.baseRate * oSecondMonitor.rate;
  }
  body.data( "junior", oJunior);
  body.data( "consultant", oConsultant);
  body.data( "senior", oSenior);
  body.data( "salesPerson", oSalesPerson);

  // calculate the new total rates
  const totalRate = oJunior.rate * oJunior.quantity + oConsultant.rate * oConsultant.quantity + oSenior.rate * oSenior.quantity;
  const totalSalesRate = oSalesPerson.rate * oSalesPerson.quantity;
  body.data( "totalRate", totalRate);
  body.data( "totalSalesRate", totalSalesRate);
}

export function officeClick(buttonId) {

  const body = $("body");
  const oCicking = body.data("clicking");

  // here we simply start the animation,
  // i.e. set the "animationCyclesLeft" property
  // the actual rendering happens after
  body.data( buttonId + "AnimationCyclesLeft", 20);

  addToBalance(oCicking.value);

  var actionStr;
  switch(buttonId) {
    case "word": actionStr = "Awesome work on that requirements document!"; break;
    case "excel": actionStr = "Nice spreadsheet!"; break;
    case "powerpoint": actionStr = "Cool presentation!"; break;
    case "outlook":  actionStr = "Great mail, keep going!"; break;
  }
  logAction(actionStr + " This earned you " + oCicking.value + "€!");
}