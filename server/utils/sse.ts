import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

export function onSseEvent(handler: (type: string, data: unknown) => void): () => void {
  emitter.on('event', handler);
  return () => emitter.off('event', handler);
}

export function broadcastSseEvent(type: string, data: unknown): void {
  emitter.emit('event', type, data);
}
