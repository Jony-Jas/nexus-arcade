import {
  Component,
  ViewEncapsulation,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  EventBusService,
  EventType,
  EventMessage,
} from '../services/event-bus.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

/**
 * Container component for remotely loaded modules.
 * Uses Shadow DOM encapsulation to isolate styles.
 */
@Component({
  selector: 'nexus-arcade-remote-module-container',
  standalone: true,
  imports: [RouterModule, LeaderboardComponent],
  template: `
    <nexus-arcade-leaderboard></nexus-arcade-leaderboard>
    <html>
      <head></head>
      <body>
        <router-outlet></router-outlet>
      </body>
    </html>
  `,
  styles: [
    `
      :host {
        all: initial;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class RemoteContainerComponent implements OnInit, OnDestroy {
  private stylesUrl?: string;
  private remoteName?: string;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private hostElement: ElementRef,
    private eventBus: EventBusService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.data.subscribe({
        next: (data) => {
          this.remoteName = data['remoteName'];
          this.stylesUrl = data['stylesUrl'];

          if (this.remoteName) {
            this.setupEventCommunication(this.remoteName);
          }

          if (this.stylesUrl) {
            this.loadStyles();
          }
        },
        error: (error) => {
          console.error('Error loading route data:', error);
        },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.remoteName) {
      this.eventBus.unregisterRemote(this.remoteName);
      this.sendMessage(EventType.UNREGISTER);
    }
    this.subscription.unsubscribe();
  }

  /**
   * Sets up communication with the remote module
   * @param remoteName Name of the remote module
   * @private
   */
  private setupEventCommunication(remoteName: string): void {
    this.eventBus.registerRemote(remoteName);

    this.subscription.add(
      this.eventBus.listenToRemote(remoteName).subscribe((message) => {
        this.handleRemoteMessage(message);
      })
    );
  }

  /**
   * Handles messages received from remote module
   * @param message The message received
   * @private
   */
  private handleRemoteMessage(message: EventMessage): void {
    console.log(`Message received from ${message.from}:`, message);

    switch (message.type) {
      case EventType.READY:
        console.log(`Remote module ${message.from} is ready`);
        break;
      case EventType.AUTH:
        this.sendAuthInfo();
        break;
      default:
        console.log(`Unhandled message type: ${message.type}`);
    }
  }

  /**
   * Sends authentication information to the remote module
   * @private
   */
  private sendAuthInfo(): void {
    if (!this.remoteName) return;

    // Mock user data - in a real app, this would come from an auth service
    const mockUser = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='));

    this.eventBus.sendMessage({
      type: EventType.AUTH,
      from: 'host',
      to: this.remoteName,
      payload: { user: mockUser },
    });
  }

  /**
   * Sends a message to the remote module
   * @param type Message type
   * @param payload Optional payload data
   * @private
   */
  private sendMessage(type: EventType, payload?: any): void {
    if (!this.remoteName) return;

    this.eventBus.sendMessage({
      type,
      from: 'host',
      to: this.remoteName,
      payload,
    });
  }

  /**
   * Loads external CSS styles into the component's shadow DOM.
   * @private
   */
  private loadStyles(): void {
    if (!this.stylesUrl) return;

    try {
      const shadowRoot = this.hostElement.nativeElement.shadowRoot;
      const head = shadowRoot?.querySelector('head');

      if (!shadowRoot || !head) {
        console.error('Shadow DOM or head element not found');
        return;
      }

      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = this.stylesUrl;
      linkElement.onerror = () =>
        console.error(`Failed to load styles from ${this.stylesUrl}`);

      head.appendChild(linkElement);
    } catch (error) {
      console.error('Error loading styles:', error);
    }
  }
}
