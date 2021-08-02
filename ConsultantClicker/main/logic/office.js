import { triggerOfficeAnimation, startButtonGlow, setOfficeCooldown } from '../render/office.js'
import { getActiveProject, addToProgress, findProject } from './project.js'
import { createProgressIndicator } from '../render/flyingIndicators.js'
import { getProjectClickPending, setProjectClickPending, isProjectBufferFull } from './projectMeta.js'

export const officeClick = (event, buttonId) => {


  if ($("body").data("buttons")[buttonId].cooldown > 0) return

  triggerOfficeAnimation(buttonId)

  switch(buttonId) {
    case "word": wordClick(event); break
    case "excel": excelClick(event); break
    case "powerpoint": powerpointClick(event); break 
    case "outlook": outlookClick(event); break
  }
}

export const updateCooldowns = (tick) => {
  var buttons = $("body").data("buttons")
  Object.keys(buttons).forEach(key => {
    if (buttons[key].cooldown > 0) buttons[key].cooldown -= (tick / 1000)
  })
  $("body").data("buttons", buttons)
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

const excelClick = () => {

  startButtonGlow("excel", 1500)

  // start the sales boost 
  const body = $("body")
  var buttons = body.data("buttons")
  var powerups = body.data("powerups")

  const consultantBoost = buttons.outlook.powerupValue
  powerups["excel"] = {
    "secondsleft": 30, 
    "consultantBoost": consultantBoost
  }  
  body.data("powerups", powerups)

  // set the cooldown 
  // logic
  buttons.excel.cooldown = 90
  body.data("buttons", buttons)
  
  // render
  setOfficeCooldown("excel")
}

const powerpointClick = () => {

  // glow
  startButtonGlow("powerpoint", 100)
  
  // logic
  const body = $("body")
  var buttons = body.data("buttons")
  // fill the project buffer!

  // cooldown
  buttons.powerpoint.cooldown = 60
  body.data("buttons", buttons)
  setOfficeCooldown("powerpoint")
}

const outlookClick = () => {

  startButtonGlow("outlook", 1500)

  // start the sales boost 
  const body = $("body")
  var buttons = body.data("buttons")
  var powerups = body.data("powerups")

  const salesboost = buttons.outlook.powerupValue
  powerups["outlook"] = {"secondsleft": 30, "salesboost": salesboost}  
  body.data("powerups", powerups)

  // set the cooldown 
  // logic
  buttons.outlook.cooldown = 90
  body.data("buttons", buttons)
  
  // render
  setOfficeCooldown("outlook")
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