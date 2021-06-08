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
  var oEquips = body.data("equipment");

  addToBalance(-1 * oEquips[equipId].cost);

  oEquips[equipId].owned = true;

  body.data("equipment", oEquips);

  logAction("Bought equipment '" + oEquips[equipId].name + "'.");
} 