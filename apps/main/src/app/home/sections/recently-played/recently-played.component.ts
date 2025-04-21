import { Component } from '@angular/core';
import { CardComponent } from '../../../components/card/card.component';
import { RouterModule } from '@angular/router';
import { SplashScreenService } from '../../../services/splash-screen.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'nexus-arcade-recently-played',
  imports: [CardComponent, RouterModule],
  templateUrl: './recently-played.component.html',
  styleUrl: './recently-played.component.css',
})
export class RecentlyPlayedComponent {
  games: any[] = [];
  splashScreen: SplashScreenService = new SplashScreenService();

  constructor(private http: HttpClient) {
    this.fetchGames(); // Call fetchGames to load games on initialization
  }

  fetchGames() {
    this.http
      .get<any[]>('http://localhost:3000/api/games')
      .subscribe((data) => {
        this.games = data;
        console.log('Fetched games:', this.games);
      });
  }

  buildRoute(gamemf: any): string {
    return `/game/${Object.keys(gamemf)[0]}`;
  }

  trackGameClick(game: any) {
    //route by reloading the page
    window.location.href = this.buildRoute(game.mf);
  }
}
