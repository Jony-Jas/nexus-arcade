import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  EventBusService,
  EventType,
  EventMessage,
} from '../services/event-bus.service';
import { CommonModule } from '@angular/common';

interface ScoreData {
  remoteName: string;
  score: number;
  lastUpdated: Date;
}

@Component({
  selector: 'nexus-arcade-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Nexus Arcade Leaderboard</h2>

      <h3>Games</h3>
      <div class="remotes-list">
        @if (registeredRemotes.length === 0) {
        <p>No active remotes</p>
        } @else {
        <ul>
          @for (remote of registeredRemotes; track remote) {
          <li>{{ remote }}</li>
          }
        </ul>
        }
      </div>

      <h3>Latest Scores</h3>
      <div class="scores-list">
        @if (scores.length === 0) {
        <p>No scores reported yet</p>
        } @else {
        <table>
          <thead>
            <tr>
              <th>Remote</th>
              <th>Score</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            @for (score of scores; track score.remoteName) {
            <tr>
              <td>{{ score.remoteName }}</td>
              <td>{{ score.score }}</td>
              <td>{{ score.lastUpdated | date : 'medium' }}</td>
            </tr>
            }
          </tbody>
        </table>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 20px;
        background-color: #f5f5f5;
        border-radius: 8px;
        margin: 20px;
      }

      h2 {
        color: #333;
        margin-top: 0;
      }

      h3 {
        color: #555;
        margin-top: 20px;
      }

      .remotes-list,
      .scores-list {
        margin-top: 10px;
        background: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        text-align: left;
        padding: 8px;
        border-bottom: 1px solid #ddd;
      }

      th {
        background-color: #f2f2f2;
      }

      p {
        color: #888;
        font-style: italic;
      }
    `,
  ],
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  registeredRemotes: string[] = [];
  scores: ScoreData[] = [];
  private subscription = new Subscription();

  constructor(private eventBus: EventBusService) {}

  async ngOnInit() {
    // Get initial list of registered remotes
    this.updateRegisteredRemotes();

    // Listen for all events to update UI accordingly
    this.subscription.add(
      this.eventBus.messageObservable.subscribe((message) => {
        this.handleMessage(message);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private handleMessage(message: EventMessage): void {
    switch (message.type) {
      case EventType.READY:
        this.updateRegisteredRemotes();
        break;

      case EventType.UNREGISTER:
        this.updateRegisteredRemotes();
        // Remove scores for unregistered remote
        this.scores = this.scores.filter(
          (score) => score.remoteName !== message.from
        );
        break;

      case EventType.SCORE:
        this.updateScore(message.from, message.payload?.score);
        break;
    }
  }

  private updateRegisteredRemotes(): void {
    this.registeredRemotes = this.eventBus.getRegisteredRemotes();
    console.log(this.registeredRemotes);
  }

  private updateScore(remoteName: string, score: number): void {
    if (score === undefined || score === null) return;

    const existingScoreIndex = this.scores.findIndex(
      (s) => s.remoteName === remoteName
    );

    if (existingScoreIndex >= 0) {
      this.scores[existingScoreIndex] = {
        ...this.scores[existingScoreIndex],
        score,
        lastUpdated: new Date(),
      };
    } else {
      this.scores.push({
        remoteName,
        score,
        lastUpdated: new Date(),
      });
    }

    // Sort scores by most recently updated
    this.scores.sort(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
    );
  }
}
