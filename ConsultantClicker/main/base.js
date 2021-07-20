import { Formatter, normRand, getRandomProjectName } from "./utils.js"
import { initialize } from "./index.js"
import { getActiveUpgradeKeys } from "./shop.js"
import { 
  logAction, 
  destroyProject, 
  createProgressIndicator, 
  startAddToBalanceAnimation,
  triggerOfficeAnimation,
  startButtonGlow
} from "./render.js"

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function update(tick, cycle) {
  projectCycle(tick, cycle);
  updateProjects(tick);
  updateRates();
}

function updateProjects(tick) {
  var body = $("body");

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

    startAddToBalanceAnimation(oProject.id, oProject.value);

    addFinishedProject();

    removeProject(oProject.id);
  }
}

function addFinishedProject() {
  var body = $("body");
  var project = body.data("projectMeta");
  project.totalProjectsFinished += 1;
  body.data("project", project);
}

function getActiveProject(projects) {
  var aProjects = Object.keys(projects);
  if (aProjects.length <= 0) {
    return undefined;
  }

  var project, projectId;
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

function projectCycle(tick, cycle) {

  var body = $("body")

  // try to find a project every x seconds
  const x = 1 // TODO: this should be dynamic later!
  var iFrequency = (1000 / tick) * x
  if (cycle % iFrequency !== 0) {
    return
  }

  // if the current buffer is full,
  // we don't need to find additional projects
  const project = body.data("projectMeta");
  const projects = body.data("projects");
  if (Object.keys(projects).length >= project.projectBufferSize) {
    return
  }

  // do we even have sales people
  // working at this moment?  
  const sales = body.data("sales")
  const salesActive = (Object.keys(sales).reduce( (total, key) => {
    if (sales[key].quantity > 0) return 1
  }, 0))
  if (!salesActive) return

  // try to find a project if there is pending project promise
  if (getProjectClickPending()) return
  setProjectClickPending(true)
  findProject().then(() => setProjectClickPending(false))
}

const findProject = async () => {

  console.assert(getProjectClickPending(), "findProject: clickPending not set true!")

  var body = $("body");
  var projectMeta = body.data("projectMeta");
  var projects = body.data("projects");

  // get a random number between 0 and 1
  // if the total sales rate is greater than the random number, we get a project
  const iRand = Math.random();
  if (body.data("totalSalesRate") < iRand) {
    logAction("Project proposal failed! Better luck next time.");
    return false;
  }

  // get random project name from API
  var data = await getRandomProjectName()

  // get an id for the new project
  projectMeta.totalProjectsFound += 1;
  var id = projectMeta.totalProjectsFound;
  var name = data.company;

  var newProject = {
    id: id,
    name: name,
    value: 0,
    effort: 0,
    progress: 0,
    active: Object.keys(projects).length == 0,
  };

  // get the project value (normal distribution, rounded to 500)
  var newValue = normRand(0, 2) * projectMeta.expectedValue;
  var quotient = Math.floor(newValue / 500);
  newProject.value = Math.max(quotient * 500, 500);

  // and effort (normal distribution, rounded to 250)
  var newEffort = Math.round(
    normRand(0, 2) * (newProject.value * projectMeta.effortConversionRate)
  );
  quotient = Math.floor(newEffort / 250);
  newProject.effort = Math.max(quotient * 250, 250);

  // add the new project to the datamodel
  projects[id] = newProject;

  body.data("projects", projects);
  body.data("project", projectMeta);

  // output success message
  logAction(
    "Project proposal successful! Project value " +
      Formatter.format(newProject.value) +
      " (effort " +
      newProject.effort +
      ")."
  );

  return true;
}

export function addToBalance(val) {
  const body = $("body");
  body.data("currentBalance", body.data("currentBalance") + val);
  if (val > 0) {
    body.data("totalEarnings", body.data("totalEarnings") + val);
  }
}

function updateRates() {

  const activeUpgradeKeys = getActiveUpgradeKeys()

  updateConsultantRates(activeUpgradeKeys)
  updateSalesRates(activeUpgradeKeys)
  updateClickingRate(activeUpgradeKeys)
}

export function officeClick(event, buttonId) {

  triggerOfficeAnimation(buttonId)

  const body = $("body");
  var clicking = body.data("clicking");
  const project = getActiveProject(body.data("projects"));

  // if there is no project, try to find one 
  if (project === undefined) {
    clicking = clickFindProject(event, buttonId, clicking)

  // otherwise progress the project
  } else {
    clicking = clickProgress(event, clicking)
  }
}

const clickFindProject = (event, buttonId, clicking) => {
  
  if (getProjectClickPending()) return

  // try to find a project for each click
  setProjectClickPending(true)
  findProject().then( projectFound => {

    setProjectClickPending(false)

    // give some additional visual feedback if a project was found
    if(projectFound) {
      startButtonGlow(buttonId)
    }

    // floating emojis
    createProgressIndicator(
      "click-" + clicking.clicks,
      event.clientX,
      event.clientY,
      "findProject",
      projectFound  // in this case the "value" is whether we found a project
    );
    
    clicking.clicks += 1
    $("body").data("clicking", clicking)
  })
}

const clickProgress = (event, clicking) => {

  addToProgress(clicking.value);

  createProgressIndicator(
    "click-" + clicking.clicks,
    event.clientX,
    event.clientY,
    "progress",
    clicking.value
  );

  clicking.totalProgress += clicking.value;
  clicking.clicks += 1

  $("body").data("clicking", clicking)
}

function updateProgress(projectId, tick) {
  var body = $("body");
  var projects = body.data("projects");
  var project = projects[projectId];

  // calculate the progress of the projects
  // the rates are per second, the tick rate is in milliseconds
  // e.g. tick = 250 means that we have to devide by 4
  project.progress = project.progress + (tick / 1000) * body.data("totalRate");

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
      projects[key].active = key == projectId;
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
    var firstProject = projects[keys[0]];
    firstProject.active = true;
    projects[keys[0]] = firstProject;
  }

  body.data("projects", projects);

  // remove the UI element
  destroyProject(projectId);
}

export const saveGame = () => {
  window.localStorage.setItem("CONS_CLICKER", JSON.stringify($("body").data()))
} 

export const resetGame = () => {
  window.localStorage.removeItem("CONS_CLICKER")
  logAction("The game is now reset!")
  initialize()
}

export const initData = (json) => {

  const body = $("body");

  body.data("totalEarnings", json.totalEarnings);
  body.data("currentBalance", json.currentBalance);

  body.data("totalRate", json.totalRate);
  body.data("totalSalesRate", json.totalSalesRate);
  body.data("totalFlatSalesRate", json.totalFlatSalesRate);
  body.data("totalFlatConsRate", json.totalFlatConsRate);

  body.data("projectMeta", json.projectMeta);
  body.data("projects", json.projects);

  body.data("consultants", json.consultants);
  body.data("sales", json.sales);

  body.data("clicking", json.clicking);
  body.data("upgrades", json.upgrades);
  body.data("buttons", json.buttons);
}


const updateConsultantRates = (activeUpgradeKeys=null) => {

  if (activeUpgradeKeys==null) {
    activeUpgradeKeys = getActiveUpgradeKeys()
  }

  const body = $("body")
  const upgrades = body.data("upgrades")

  var consultants = body.data("consultants")
  var flatConsRate = 0

  activeUpgradeKeys.forEach(key => {

    const upgrade = upgrades[key]
    
    if (upgrade.hasOwnProperty("flat")) {
      flatConsRate += upgrade.flat.consultants
    }

    if (upgrade.hasOwnProperty("rate")) {
      Object.keys(consultants).forEach(key => {
        const consultant = consultants[key] 
        consultants[key].rate += consultant.baseRate * upgrade.rate.consultants
      })
    }
  })
  
  var totalRate = flatConsRate
  Object.keys(consultants).forEach(key => {
    totalRate += consultants[key].quantity * consultants[key].rate
  })
  
  body.data("consultants", consultants)
  body.data("totalRate", totalRate)
}

const updateClickingRate = (activeUpgradeKeys=null) => {

  if (activeUpgradeKeys==null) {
    activeUpgradeKeys = getActiveUpgradeKeys()
  }

  const body = $("body")
  const upgrades = body.data("upgrades")
  var clicking = body.data("clicking")

  // calculate the base value
  clicking.baseValue = activeUpgradeKeys.reduce( (total, key) => {

    const upgrade = upgrades[key]

    if (upgrade.hasOwnProperty("flat")) {
      return total + upgrade.flat.clicking
    }

    return total
  }, 0)

  // calculate the full value (inkluding rates)
  clicking.value = activeUpgradeKeys.reduce( (total, key) => {

    const upgrade = upgrades[key]

    if (upgrade.hasOwnProperty("rate")) {
      return total * upgrade.rate.clicking;
    }

    return total
  }, clicking.baseValue)  

  body.data("clicking", clicking)
}

const updateSalesRates = (activeUpgradeKeys=null) => {

  if (activeUpgradeKeys==null) {
    activeUpgradeKeys = getActiveUpgradeKeys()
  }

  const body = $("body")
  const upgrades = body.data("upgrades")

  var sales = body.data("sales")
  var flatSalesRate = 0

  activeUpgradeKeys.forEach(key => {

    const upgrade = upgrades[key]
    
    if (upgrade.hasOwnProperty("flat")) {
      flatSalesRate += upgrade.flat.sales
    }

    if (upgrade.hasOwnProperty("rate")) {
      Object.keys(sales).forEach(key => {
        const salesMember = sales[key] 
        sales[key].rate += salesMember.baseRate * upgrade.rate.sales
      })
    }

    var totalSalesRate = flatSalesRate
    totalSalesRate += Object.keys(sales).reduce( (total, key) => {
      return total + sales[key].quantity * sales[key].rate
    }, 0)

    body.data("sales", sales)
    body.data("totalSalesRate", totalSalesRate)
  }, 0)
}

const setProjectClickPending = (val=true) => {
  const body = $("body")
  var projectMeta = body.data("projectMeta")
  projectMeta.clickPending = val
  body.data("projectMeta", projectMeta)
}

const getProjectClickPending = () => {
  return $("body").data("projectMeta").clickPending
}