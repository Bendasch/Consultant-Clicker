import { logAction, destroyProject } from './render.js';
import { Formatter, normRand } from './utils.js';


export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function update(tick, cycle) {
  findProject(tick, cycle);
  updateProjects(tick);
  updateRates();
}


function updateProjects(tick) {

  var body = $( "body" );

  var projects = body.data("projects");
  var oProject = getActiveProject(projects);

  if (oProject === undefined) {
    return;
  }
  
  // update the progress
  updateProgress(oProject.id, tick);

  // update the earnings if the project is done
  if (oProject.progress >= oProject.effort) {

    addToBalance(oProject.value);

    addFinishedProject();
    logAction("Project finished! Earned " + Formatter.format(oProject.value) + ".");

    removeProject(oProject.id);
  } 
};

function addFinishedProject() {
  var body = $("body");
  var project = body.data("project");
  project.totalProjectsFinished += 1;
  body.data("project", project);
}

function getActiveProject(projects) {
  
  var aProjects = Object.keys(projects);
  if (aProjects.length <= 0) {
    return undefined;
  }

  var project, projectId
  do {
    projectId = aProjects.pop();
    project = projects[projectId];
  } while (!project.active && aProjects.length != 0);
  
  if (project.active) {
    return project;
  } else {
    return undefined;
  }
}

function findProject(tick, cycle) {
  
  var body = $( "body" );
  var quotient;

  // if there is a current project, we don't need to find one 
  var projects = body.data("projects");
  if (Object.keys(projects).length > 0) {
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

  const oProjectMeta = body.data("project");

  // get an id for the new project
  var id = oProjectMeta.totalProjectsFinished + 1;
  var name = "Project " + id;
  var newProject = {
    "id": id,
    "name": name,
    "value": 0,
    "effort": 0,
    "progress": 0,
    "active": false
  }

  // get the project value (normal distribution, rounded to 500)
  var newValue = normRand(0,2) * oProjectMeta.expectedValue;
  quotient = Math.floor(newValue / 500);
  newProject.value = Math.max(quotient * 500, 500); 

  // and effort (normal distribution, rounded to 250) 
  var newEffort = Math.round(normRand(0,2) * (newProject.value * oProjectMeta.effortConversionRate));
  quotient = Math.floor(newEffort / 250);
  newProject.effort = Math.max(quotient * 250, 250); 

  // add the new project to the datamodel
  projects[id] = newProject;

  body.data("projects", projects);

  // output success message
  logAction("Project proposal successful! Project value " + Formatter.format(newProject.value) + " (effort " + newProject.effort + ").");
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
  var project = getActiveProject(body.data("projects"));
  if (!(project === undefined)) {

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
    logAction("Choose a project or wait for the sales team to find one!");
  }
  
  body.data("clicking", oClicking);
}


function updateProgress(projectId, tick) {

  var body = $("body");
  var projects = body.data("projects");
  var project = projects[projectId];

  // calculate the progress of the projects
  // the rates are per second, the tick rate is in milliseconds
  // e.g. tick = 250 means that we have to devide by 4
  project.progress = project.progress + (tick/1000) * body.data("totalRate");

  projects[projectId] = project;
  body.data("projects", projects);
}


function addToProgress(progress) {

  var body = $("body");
  var projects = body.data("projects");
  var project = getActiveProject(projects);

  project.progress += progress;

  projects[project.id] = project;
  body.data("projects", projects);
}


export function projectClick(projectId) {

  var body = $("body");
  var projects = body.data("projects");
  if (projects[projectId].active) {
    projects[projectId].active = false;
  } else {
    // set all projects to inactive except the clicked one
    Object.keys(projects).forEach((key) => {
      projects[key].active = (key == projectId);
    });
  }

  body.data("projects", projects);
}

function removeProject(projectId) {

  // remove the DM entry
  var body = $("body");
  var projects = body.data("projects");
  delete projects[projectId];

  // chose new active project
  var keys = Object.keys(projects);
  if (keys.length > 0) {
    var firstProject = projects[keys[0]]
    firstProject.active = true;
    projects[keys[0]] = firstProject;
  }

  body.data("projects", projects);

  // remove the UI element
  destroyProject(projectId);
}