import { autoFindProject, updateProjects } from './project.js'
import { updateRates } from './rates.js'
import { updateAchievements } from './achievements.js'
import { updatePowerups } from './powerups.js'

export const gameLogic = (tick, cycle) => {
  autoFindProject(tick, cycle)
  updateProjects(tick)
  updateRates()
  updateAchievements(cycle)
  updatePowerups(tick)
}