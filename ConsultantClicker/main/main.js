import { sleep, update } from './base.js';
import { render, setTime } from './render.js';
import { initialize } from './index.js';

function main(tick, start, cycle) {  

  const T_START = (new Date()).getTime();
  var delta = T_START - start;

  update(tick, cycle);
  setTime("update", T_START);

  const T_PRE_RENDER = (new Date()).getTime();
  render();
  setTime("render", T_PRE_RENDER);

  sleep(2 * tick - delta).then(() => main(tick, T_START, cycle + 1));
}

initialize().then( () => {
  const TICK = 20;
  setTime("tick", TICK);
  const d = new Date();
  main(TICK, d.getTime(), 0);
});