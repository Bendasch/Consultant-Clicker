import { autoFindProject, updateProjects } from './project.js'
import { updateRates } from './rates.js'

export const gameLogic = (tick, cycle) => {
  (tick, cycle)
  updateProjects(tick)
  updateRates()
}