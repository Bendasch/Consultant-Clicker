import { triggerOfficeAnimation, startButtonGlow } from '../render/office.js'
import { getActiveProject, addToProgress, findProject } from './project.js'
import { createProgressIndicator } from '../render/flyingIndicators.js'
import { getProjectClickPending, setProjectClickPending } from './projectMeta.js'

export function officeClick(event, buttonId) {

    triggerOfficeAnimation(buttonId)
  
    const body = $("body");
    var clicking = body.data("clicking");
    const project = getActiveProject(body.data("projects"));
  
    // if there is no project, try to find one 
    if (project == undefined) {
      clickFindProject(event, buttonId, clicking)
  
    // otherwise progress the project
    } else {
      clickProgress(event, clicking)
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