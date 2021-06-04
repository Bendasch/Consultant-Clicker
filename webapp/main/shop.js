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

export function buyEquipment(equipId) {

  const body = $("body");
  var oEquip = body.data(equipId);

  addToBalance(-1 * oEquip.cost);

  oEquip.owned = true;
  body.data(equipId, oEquip);

  logAction("Bought equipment '" + oEquip.name + "'. Productivity increased by " + (oEquip.rate*100).toFixed(2) + "%!");
} 