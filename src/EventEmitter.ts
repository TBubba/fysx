import { IDict } from './interfaces';

type AnyFunction = (...args: any[]) => void;

export interface IEventEmitter {
  on(event: string | symbol, callback: AnyFunction): this;
  once(event: string | symbol, callback: AnyFunction): this;
  off(event: string | symbol, callback: AnyFunction): this;
  emit(event: string | symbol, ...args: any[]): void;
}

/** Generic Event Emitter Class. */
export class EventEmitter implements IEventEmitter {
  /** The registered listeners ordered by event. */
  private listeners: IDict<AnyFunction[]> = {};
  /** Indices of listeners registered as "once" ordered by event. */
  private onceMap: IDict<number[]> = {};

  on(event: string | symbol, listener: AnyFunction): this {
    let array = this.listeners[event as any];
    if (!array) { array = this.listeners[event as any] = []; }
    array.push(listener);
    return this;
  }
  
  once(event: string | symbol, listener: AnyFunction): this {
    this.on(event, wrapOnceListener(listener));
    let onceMap = this.onceMap[event as any];
    if (!onceMap) { onceMap = this.onceMap[event as any] = []; }
    onceMap.push((this.listeners[event as any] as AnyFunction[]).length);
    return this;
  }

  off(event: string | symbol, listener: AnyFunction): this {
    const array = this.listeners[event as any];
    if (array) {
      if (array.length > 1) {
        const index = array.indexOf(listener);
        if (index >= 0) { array.splice(index, 1); }
      } else {
        delete this.listeners[event as any];
      }
    }
    return this;
  }

  emit(event: string | symbol, ...args: any[]): void {
    const funcs = this.listeners[event as any];
    if (funcs) {
      const funcsCopy = funcs.slice();
      const once = this.onceMap[event as any];
      // Remove all listeners flagged as "once"
      if (once) {
        const onceSorted = once.sort();
        for (let i = onceSorted.length - 1; i >= 0; i--) {
          funcs.splice(onceSorted[i], 1);
        }
        delete this.onceMap[event as any];
      }
      // Call all listeners (even the removed "once" listeners)
      for (let i = 0; i < funcsCopy.length; i++) {
        funcsCopy[i](...args);
      }
    }
  }
}

function wrapOnceListener(listener: AnyFunction): AnyFunction {
  return function(...args: any[]) {
    return listener(...args);
  }
}
