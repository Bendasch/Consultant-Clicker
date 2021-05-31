import { 
  updateColor,
  updateProject,
  findProject,
  updateRate,
  updateResourceButtons
 } from './base.js';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function main(tick, start, cycle) {  

  // get time in ms since last cycle
  var d = new Date();
  var t = d.getTime();
  var delta = t - start;

  // try to find a project, when there is none
  findProject(tick, cycle);

  // update earnings && balance using the old rate
  updateProject(tick);

  // update project color according to effort and progress
  updateColor(jQuery.data(document.body, "projectEffort"), jQuery.data(document.body, "projectProgress"));

  // update the rate
  updateRate();

  // update resource purchase buttons (active / inactive)
  updateResourceButtons();

  // call new cycle with a tick that adjusts for previous inaccuracies
  sleep(2 * tick - delta).then(() => main(tick, t, cycle + 1));
}


var tick = 50; // refresh every <tick> milliseconds
var d0 = new Date();
var t0 = d0.getTime(); // start time of the cycle

main(tick, t0, 0, 0);