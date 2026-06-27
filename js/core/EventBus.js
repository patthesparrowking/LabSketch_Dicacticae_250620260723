export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    this.listeners.get(eventName).add(callback);

    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    const callbacks = this.listeners.get(eventName);
    if (!callbacks) return;

    callbacks.delete(callback);

    if (callbacks.size === 0) {
      this.listeners.delete(eventName);
    }
  }

  emit(eventName, payload = {}) {
    const callbacks = this.listeners.get(eventName);
    if (!callbacks) return;

    callbacks.forEach(callback => {
      callback(payload);
    });
  }
}