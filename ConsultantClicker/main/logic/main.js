import { autoFindProject, updateProjects } from './project.js'
import { updateRates } from './rates.js'
import { updateAchievements } from './achievements.js'

export const gameLogic = (tick, cycle) => {
  autoFindProject(tick, cycle)
  updateProjects(tick)
  updateRates()
  updateAchievements(cycle)
}