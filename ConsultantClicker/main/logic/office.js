import { triggerOfficeAnimation, startButtonGlow } from '../render/office.js'
import { getActiveProject, addToProgress, findProject } from './project.js'
import { createProgressIndicator } from '../render/flyingIndicators.js'
import { getProjectClickPending, setProjectClickPending, isProjectBufferFull } from './projectMeta.js'

export function officeClick(event, buttonId) {

  triggerOfficeAnimation(buttonId)

  switch(buttonId) {
    case "word": wordClick(event); break
    case "excel": excelClick(event); break
    case "powerpoint": powerpointClick(event); break 
    case "outlook": outlookClick(event); break
  }
}

const wordClick = (event) => {
  const body = $("body");
  var clicking = body.data("clicking");
  const project = getActiveProject(body.data("projects"));

  // if there is no project, try to find one 
  if (project == undefined) {
    
    if (isProjectBufferFull()) return // unless the project buffer is full!
    clickFindProject(event, "word", clicking)

  // otherwise progress the project
  } else {
    clickProgress(event, clicking)
  }
}

const excelClick = (event) => {
  return
}

const powerpointClick = (event) => {
  return
}

const outlookClick = () => {
  const body = $("body")
  const salesboost = body.data("upgrades").outlook.powerupValue
  var powerups = body.data("powerups")
  powerups["outlook"] = {"secondsleft": 30, "salesboost": salesboost}
  body.data("powerups", powerups)
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