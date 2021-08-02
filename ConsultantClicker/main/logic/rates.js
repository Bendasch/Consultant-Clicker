import { getActiveUpgradeKeys } from "./upgrades.js"

export function updateRates() {

    const activeUpgradeKeys = getActiveUpgradeKeys()
  
    updateConsultantRates(activeUpgradeKeys)
    updateSalesRates(activeUpgradeKeys)
    updateClickingRate(activeUpgradeKeys)
}

const updateConsultantRates = (activeUpgradeKeys=null) => {

    if (activeUpgradeKeys==null) {
      activeUpgradeKeys = getActiveUpgradeKeys()
    }
  
    const body = $("body")
    const upgrades = body.data("upgrades")
    var consultants = body.data("consultants")
  
    Object.keys(consultants).forEach(consId => {
      const consultant = consultants[consId] 
  
      consultants[consId].rate = consultant.baseRate
      activeUpgradeKeys.forEach(key => {
        const upgrade = upgrades[key]
        
        if (upgrade.hasOwnProperty("rate")) {
            consultants[consId].rate *= upgrade.rate.consultants
        }
      })
    })
      
    var totalFlatRate = activeUpgradeKeys.reduce( (t,key) => {
      const upgrade = upgrades[key]
      if (upgrade.hasOwnProperty("flat")) {
        return t + upgrade.flat.consultants
      }
      return t
    }, 0)
  
    var totalRate = Object.keys(consultants).reduce( (t,key) => {
      return t + consultants[key].quantity * consultants[key].rate
    }, totalFlatRate)
    
    // handle power-ups
    const powerups = body.data("powerups")
    Object.keys(powerups).forEach((key) => {
        var powerup = powerups[key]
        if ("consultantBoost" in powerup) totalRate *= powerup["consultantBoost"]
    })

    body.data("consultants", consultants)
    body.data("totalRate", totalRate)
    body.data("totalFlatRate", totalFlatRate)
}
  
const updateClickingRate = (activeUpgradeKeys=null) => {

    if (activeUpgradeKeys==null) {
        activeUpgradeKeys = getActiveUpgradeKeys()
    }

    const body = $("body")
    const upgrades = body.data("upgrades")
    var clicking = body.data("clicking")

    // calculate the base value
    clicking.baseValue = activeUpgradeKeys.reduce( (total, key) => {

        const upgrade = upgrades[key]

        if (upgrade.hasOwnProperty("flat")) {
        return total + upgrade.flat.clicking
        }

        return total
    }, 0)

    // calculate the full value (inkluding rates)
    clicking.value = activeUpgradeKeys.reduce( (total, key) => {

        const upgrade = upgrades[key]

        if (upgrade.hasOwnProperty("rate")) {
        return total * upgrade.rate.clicking;
        }

        return total
    }, clicking.baseValue)  

    body.data("clicking", clicking)
}
  
const updateSalesRates = (activeUpgradeKeys=null) => {

    if (activeUpgradeKeys==null) {
        activeUpgradeKeys = getActiveUpgradeKeys()
    }

    const body = $("body")
    const upgrades = body.data("upgrades")
    var sales = body.data("sales")

    // upgrade rate for each sales member
    Object.keys(sales).forEach(salesId => {
        
        const salesMember = sales[salesId] 
        sales[salesId].rate = salesMember.baseRate

        activeUpgradeKeys.forEach(key => {
            const upgrade = upgrades[key]  
            if (upgrade.hasOwnProperty("rate")) sales[salesId].rate *= upgrade.rate.sales
        })
    })

    var totalSalesFlatRate = activeUpgradeKeys.reduce( (total, key) => {
        const upgrade = upgrades[key]  
        if (upgrade.hasOwnProperty("flat")) return total + upgrade.flat.sales
        return total
    }, 0)

    var totalSalesRate = Object.keys(sales).reduce( (total, key) => {
        return total + sales[key].quantity * sales[key].rate
    }, totalSalesFlatRate)

    // handle power-ups
    const powerups = body.data("powerups")
    Object.keys(powerups).forEach((key) => {
        var powerup = powerups[key]
        if ("salesboost" in powerup) totalSalesRate *= powerup["salesboost"]
    })

    // save the final results
    body.data("sales", sales)
    body.data("totalSalesRate", totalSalesRate)
    body.data("totalSalesFlatRate", totalSalesFlatRate)         
}