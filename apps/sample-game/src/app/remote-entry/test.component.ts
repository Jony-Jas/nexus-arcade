import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RemoteCommunicationService } from './services/remote-communication.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test',
  template: `<div>Test Component</div>
    <router-outlet></router-outlet>
    <img src="assets/sample-game/counter.png" alt="Counter Logo" />
    <div>Sample Game: {{ counter }}</div>
    <button (click)="click()">Click Me</button>
    <button (click)="naviateToHelp()">Help</button>
    @if (user) {
    <div>User: {{ user }}</div>
    } `,
  styles: [
    `
      div {
        background: lightblue;
        color: blue;
      }
    `,
  ],
  standalone: true,
  imports: [RouterModule],
})
export class TestComponent implements OnInit, OnDestroy {
  counter = 0;
  user = 'loading...';
  private subscription = new Subscription();

  constructor(
    private remoteCommunicationService: RemoteCommunicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('TestComponent initialized!');

    // Register this component with the host
    this.remoteCommunicationService.sendReadyEvent();

    // Listen for authentication events from the host
    this.subscription.add(
      this.remoteCommunicationService
        .listenForAuthEvents()
        .subscribe((userData) => {
          if (userData && userData.user) {
            this.user = userData.user;
            console.log('User authenticated:', this.user);
          }
        })
    );

    // Request authentication data from host
    this.remoteCommunicationService.requestAuthData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  click() {
    this.counter++;
    console.log('Button clicked!');

    // Send score update to host when counter changes
    if (this.counter % 5 === 0) {
      this.remoteCommunicationService.sendScoreUpdate(this.counter);
    }
  }
  naviateToHelp() {
    console.log('Navigating to help...');
    this.router.navigate(['help'], { relativeTo: this.route });
  }
}
