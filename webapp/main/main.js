import { sleep, update } from './base.js';
import { render } from './render.js';
import { initialize } from './index.js';

function main(tick, start, cycle) {  

  const d = new Date();
  var t = d.getTime();
  var delta = t - start;

  update(tick, cycle);
  render();
  sleep(2 * tick - delta).then(() => main(tick, t, cycle + 1));
}

initialize().then( () => {
  const d = new Date();
  main(50, d.getTime(), 0);
});