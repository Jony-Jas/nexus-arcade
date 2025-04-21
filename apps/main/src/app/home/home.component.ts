import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { HeroComponent } from './sections/hero/hero.component';
import { NavComponent } from './sections/nav/nav.component';
import { MarketplaceComponent } from './sections/marketplace/marketplace.component';
import { RecentlyPlayedComponent } from './sections/recently-played/recently-played.component';
import { MyGamesComponent } from './sections/my-games/my-games.component';

@Component({
  selector: 'nexus-arcade-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    ButtonModule,
    HeroComponent,
    NavComponent,
    RecentlyPlayedComponent,
    MyGamesComponent,
    MarketplaceComponent,
  ],
})
export class HomeComponent {}
