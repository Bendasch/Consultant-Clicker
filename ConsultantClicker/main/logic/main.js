import { autoFindProject, updateProjects } from './project.js'
import { updateRates } from './rates.js'

export const gameLogic = (tick, cycle) => {
  autoFindProject(tick, cycle)
  updateProjects(tick)
  updateRates()
}