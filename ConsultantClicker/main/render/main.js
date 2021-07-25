import { renderCashews, renderStats } from './stats.js'
import { renderConsultants, renderSales, renderResourceButtons } from './resources.js'
import { renderUpgradeButtons } from './upgrades.js'
import { renderProjects } from './project.js'
import { renderOfficeButtons } from './office.js'
import { renderFlyingNumbers } from './flyingIndicators.js'
import { renderNotifications } from './notifications.js'

export const render = () => {
    renderCashews()
    renderStats()
    renderConsultants()
    renderSales()
    renderResourceButtons()
    renderUpgradeButtons()
    renderProjects()
    renderOfficeButtons()
    renderFlyingNumbers()
    renderNotifications()
}