import { Formatter, normRand, getRandomProjectName } from "../utils/utils.js"
import { startAddToBalanceAnimation } from "../render/flyingIndicators.js"
import { destroyProjectDOM } from '../render/project.js'
import { getProjectClickPending, setProjectClickPending, getTotalProjectsFinished, addFinishedProject } from './projectMeta.js'
import { logAction } from '../render/log.js'
import { showNotification } from '../render/notifications.js'

export const updateProjects = (tick) => {

    var project = getActiveProject($("body").data("projects"))
  
    if (project === undefined) return

    project = updateProgress(project.id, tick)
  
    if (project.progress >= project.effort) finishProject(project)
}

const finishProject = (project) => {
  startAddToBalanceAnimation(project.id, project.value)  
  addToBalance(project.value)  
  addFinishedProject()      
  addTotalEffort(project.effort)
  removeProject(project.id)
  if (getTotalProjectsFinished() == 1) findProjectNotification()
  if (getTotalProjectsFinished() == 2) suggestShopNotification()
}

const addTotalEffort = (effort) => {
  const body = $("body")
  body.data("totalProgress", body.data("totalProgress") + effort)
}

const findProjectNotification = () => {
  const header = 'First project finished!'
  const main = 'In order to find another project keep pressing the Word button.'
  showNotification(header, main)
}

const suggestShopNotification = () => {
  const header = 'Second project finished!'
  const main = `Check the 'Upgrades' tab in order to spend your money.`
  showNotification(header, main)
}

export const getActiveProject = (projects) => {
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
  
export const autoFindProject = (tick, cycle) => {
  
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
  
export const findProject = async () => {
  
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
    var name = await getRandomProjectName()
    
    // get an id for the new project
    projectMeta.totalProjectsFound += 1;
    var id = projectMeta.totalProjectsFound;
  
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

const updateProgress = (projectId, tick) => {

    var body = $("body");
    var projects = body.data("projects");
    var project = projects[projectId];
  
    // calculate the progress of the projects
    // the rates are per second, the tick rate is in milliseconds
    // e.g. tick = 250 means that we have to devide by 4
    project.progress = project.progress + (tick / 1000) * body.data("totalRate");
  
    projects[projectId] = project;
    body.data("projects", projects);

    return project
}
  
export const addToProgress = (progress) => {
    var body = $("body");
    var projects = body.data("projects");
    var project = getActiveProject(projects);
  
    project.progress += progress;
  
    projects[project.id] = project;
    body.data("projects", projects);
}
  
export const projectClick = (projectId) => {
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
  
const removeProject = (projectId) => {
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
    destroyProjectDOM(projectId);
}

export const addToBalance = (val) => {
  const body = $("body")
  body.data("currentBalance", body.data("currentBalance") + val)
  if (val > 0) {
    body.data("totalEarnings", body.data("totalEarnings") + val)
  }
}