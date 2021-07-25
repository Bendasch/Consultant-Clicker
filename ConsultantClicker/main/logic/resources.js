import { logAction } from '../render/log.js'
import { addToBalance } from './project.js'

export const addResource = (category, resId) => {

  const body = $("body");

  var resources = body.data(category);
  resources[resId].quantity = resources[resId].quantity + 1;
  body.data(category, resources);

  // subtract the cost
  addToBalance(-1 * resources[resId].cost);

  // increase the price for future purchases
  setNewPrice(category, resId)

  logAction("1 " + resources[resId].name +  " was added.");
}

export const getTotalConsultantsQuantity = () => {

  const consultants = $("body").data("consultants")  
  return Object.keys(consultants).reduce( (total, key) => {
    return total + consultants[key].quantity
  }, 0)    
}

export const getTotalSalesQuantity = () => {

  const sales = $("body").data("sales")  
  return Object.keys(sales).reduce( (total, key) => {
    return total + sales[key].quantity
  }, 0)    
}

const setNewPrice = (category, resId) => {
  const body = $("body")
  var categoryData = body.data(category)
  const resource = categoryData[resId]

  categoryData[resId].cost = getNewPrice(resource.baseCost, resource.quantity)

  body.data(category, categoryData)
}

const getNewPrice = (baseCost, quantity) => {
  var roughValue = Math.pow((quantity + 1), 0.75) * baseCost   
  var quotient = Math.floor(roughValue / 500);
  return Math.max(quotient * 500, 500);
}