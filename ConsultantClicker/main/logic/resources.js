import { logAction } from '../render/log.js'
import { addToBalance } from './project.js'

export function addResource(category, resId) {

    const body = $("body");
  
    var resources = body.data(category);
    resources[resId].quantity = resources[resId].quantity + 1;
    body.data(category, resources);
  
    addToBalance(-1 * resources[resId].cost);
  
    logAction("1 " + resources[resId].name +  " was added.");
  }