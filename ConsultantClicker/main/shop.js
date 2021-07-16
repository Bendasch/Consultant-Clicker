import { addToBalance } from './base.js';
import { logAction } from './render.js';

export function addResource(sResId) {

  const body = $( "body" );

  const oResource = body.data( sResId );
  oResource.quantity = oResource.quantity + 1;
  body.data( sResId, oResource );

  addToBalance(-1 * oResource.cost);

  logAction("1 " + oResource.name +  " was added.");
}

export function buyUpgrade(upgradeId) {

  const body = $("body");
  var upgrades = body.data("upgrades");

  addToBalance(-1 * upgrades[upgradeId].cost);

  upgrades[upgradeId].owned = true;

  body.data("upgrades", upgrades);

  logAction("Bought upgrade '" + upgrades[upgradeId].name + "'.");
} 