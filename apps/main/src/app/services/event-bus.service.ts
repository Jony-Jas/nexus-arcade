import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export enum EventType {
  READY = 'ready',
  UNREGISTER = 'unregister',
  AUTH = 'auth',
  ERROR = 'error',
  SCORE = 'score',
}

export interface EventMessage {
  type: EventType;
  from: string;
  to: string;
  payload?: any;
}

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private listeners: Set<string> = new Set();
  private messageSubject = new Subject<EventMessage>();
  public messageObservable = this.messageSubject.asObservable();

  constructor() {
    this.initGlobalEventListener();
  }

  /**
   * Initialize global event listener for cross-window communication
   */
  private initGlobalEventListener(): void {
    window.addEventListener('message', (event) => {
      const data = event.data as EventMessage;
      if (data && data.type && data.from && this.listeners.has(data.from)) {
        this.messageSubject.next(data);
      }
    });
  }

  /**
   * Listen to events from a specific remote module
   * @param remoteName Name of the remote module
   * @returns Observable of events from the remote module
   */
  listenToRemote(remoteName: string): Observable<EventMessage> {
    console.log(`Setting up listener for remote: ${remoteName}`);
    return this.messageObservable.pipe(
      filter((message) => message.from === remoteName)
    );
  }

  /**
   * Send a message to a remote module
   * @param message Message to send
   */
  sendMessage(message: EventMessage): void {
    window.dispatchEvent(new MessageEvent('message', { data: message }));
  }

  /**
   * Register a remote module
   * @param remoteName Name of the remote module
   */
  registerRemote(remoteName: string): void {
    this.listeners.add(remoteName);
    console.log(`Remote ${remoteName} is registered`);
  }

  /**
   * Unregister a remote module
   * @param remoteName Name of the remote module
   */
  unregisterRemote(remoteName: string): void {
    this.listeners.delete(remoteName);
    console.log(`Remote ${remoteName} is unregistered`);
  }

  /**
   * Get registered remotes
   * @returns Array of registered remote names
   */
  getRegisteredRemotes(): string[] {
    return Array.from(this.listeners);
  }
}
