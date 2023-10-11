import {Endpoint} from 'comlink';

type Transferable = any;
type EventListenerOrEventListenerObject = any;

class Worker implements Endpoint {
  private events: Map<string, Function[]> = new Map();

  constructor(url?: string, options?: object) {
    console.debug('new Worker-----', url, options);
  }

  postMessage(message: any, transfer?: Transferable[]) {
    console.debug('Worker message----', message);
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: {},
  ) {
    const fns = this.events.get(type);
    if (fns) {
      fns.push(listener);
    } else {
      this.events.set(type, [listener]);
    }
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: {},
  ) {
    const fns = this.events.get(type);
    if (fns) {
      let fns2 = fns.filter(fn => fn != listener);
      if (fns2.length !== fns.length) this.events.set(type, fns);
    }
  }

  start() {
    console.debug('Worker start-----');
  }

  close() {
    console.debug('Worker close-----');
  }

  terminate() {
    console.debug('Worker terminate-----');
  }
}

export default Worker;
