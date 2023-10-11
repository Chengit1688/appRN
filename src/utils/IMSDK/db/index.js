import * as Comlink from '../comlink'
import Worker from '../worker'
import obj from './index.worker';

export function initComlink() {
  const worker = new Worker('./index.worker.js');
  return new Comlink.wrap(obj);
}
