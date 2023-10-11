// import {IMSDK,MessageGroupNotify} from '../types'

// interface EventsMap extends Record<keyof typeof IMSDK.Event,unknown> {
//     [MessageGroupNotify]:IMSDK.GroupDetail
// }
import {EventsMap,EventKey} from '../types'

export class Emitter {
    private events: Map<EventKey, Function[]> = new Map();

    on<K extends EventKey, V extends EventsMap[K]>(event:K,fn:(data:V) => void)
    // on(event: string | IMSDK.DataType, fn: Function): Emitter 
    {
        const fns = this.events.get(event);
        if (fns) {
            fns.push(fn);
        } else {
            this.events.set(event, [fn]);
        }

        // return this;
    }

    once<K extends EventKey ,V extends EventsMap[K]>(event:K,fn:(data:V) => void)
    // once(event: IMSDK.DataType | string, fn: Function): Emitter 
    {
        const _this = this;
        function on() {
            _this.off(event, on);
            fn.apply(_this, arguments as unknown as [data: V]);
        }

        this.on(event, on);

        // return this;
    }

    async emit(event: EventKey, ...payload: any[]) {
        const fns = this.events.get(event);
        // console.error(fns)
        if (fns) {
            // if (fns.length > 1) {
            //     debugger
            // }
            for (const fn of fns) {
                await fn(...payload);
            }
        }

        // return this;
    }

    off(event: EventKey, fn?: Function) {
        const fns = this.events.get(event);

        if (fns) {
            if (fn) {
                const index = fns.indexOf(fn);
                index > -1 && fns.splice(index, 1);
            } else {
                this.events.delete(event);
            }
        }

        // return this;
    }
}
