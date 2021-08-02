import { autoFindProject, updateProjects } from './project.js'
import { updateRates } from './rates.js'
import { updateAchievements } from './achievements.js'
import { updatePowerups } from './powerups.js'
import { updateCooldowns } from './office.js'

export const gameLogic = (tick, cycle) => {
  autoFindProject(tick, cycle)
  updateProjects(tick)
  updateRates()
  updateAchievements(cycle)
  updatePowerups(tick)
  updateCooldowns(tick)
}