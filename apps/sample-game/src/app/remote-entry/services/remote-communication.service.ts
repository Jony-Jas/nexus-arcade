import { Injectable } from '@angular/core';
import { Observable, from, fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * Enum of event types for communication between host and remote
 */
export enum EventType {
  READY = 'ready',
  UNREGISTER = 'unregister',
  AUTH = 'auth',
  ERROR = 'error',
  SCORE = 'score',
}

/**
 * Interface for messages sent between host and remote
 */
export interface EventMessage {
  type: EventType;
  from: string; // Identifier of the sender (remote or host)
  to: string; // Identifier of the recipient (remote or host)
  payload?: any;
}

/**
 * Service for managing communication between remote module and host application
 */
@Injectable({
  providedIn: 'root',
})
export class RemoteCommunicationService {
  private readonly REMOTE_NAME = 'sample-game'; // Unique identifier for this remote application

  /**
   * Listen for specific event types from the host application
   * @param eventType The event type to listen for
   * @returns Observable of payload data
   */
  private listenForEvents<T>(eventType: EventType): Observable<T> {
    return fromEvent<MessageEvent>(window, 'message').pipe(
      filter((event) => {
        const data = event.data as EventMessage;
        return data && data.type === eventType && data.from === 'host';
      }),
      map((event) => (event.data as EventMessage).payload as T)
    );
  }

  /**
   * Send a message to the host application
   * @param type Event type
   * @param payload Optional payload data
   */
  private sendMessage(type: EventType, payload?: any): void {
    const message: EventMessage = {
      type,
      from: this.REMOTE_NAME,
      to: 'host',
      payload,
    };

    // Use parent.postMessage for iframe scenarios, fall back to window.dispatchEvent
    if (window.parent !== window) {
      try {
        window.parent.postMessage(message, '*');
      } catch (e) {
        console.error('Failed to post message to parent window:', e);
        this.dispatchLocalMessage(message);
      }
    } else {
      this.dispatchLocalMessage(message);
    }
  }

  /**
   * Dispatch a message locally within the current window
   * @param message The message to dispatch
   */
  private dispatchLocalMessage(message: EventMessage): void {
    window.dispatchEvent(new MessageEvent('message', { data: message }));
  }

  /**
   * Send ready event to host application
   */
  sendReadyEvent(): void {
    console.log('Sending ready event to host');
    this.sendMessage(EventType.READY);
  }

  /**
   * Request authentication data from host
   */
  requestAuthData(): void {
    console.log('Requesting authentication data from host');
    this.sendMessage(EventType.AUTH);
  }

  /**
   * Listen for authentication events from host
   * @returns Observable of authentication data
   */
  listenForAuthEvents(): Observable<any> {
    return this.listenForEvents<any>(EventType.AUTH);
  }

  /**
   * Send score update to host
   * @param score Current score value
   */
  sendScoreUpdate(score: number): void {
    console.log(`Sending score update to host: ${score}`);
    this.sendMessage(EventType.SCORE, { score });
  }
}
