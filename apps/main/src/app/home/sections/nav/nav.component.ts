import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundButtonComponent } from '../../../components/round-button/round-button.component';
import { RouterModule } from '@angular/router';

interface NavItem {
  icon: string;
  tooltip: string;
  index: number;
  link?: string; // Optional link property
}

@Component({
  selector: 'nexus-arcade-nav',
  imports: [CommonModule, RoundButtonComponent, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  activeButtonIndex = signal(2); // Default active button (index starts from 0)

  navigationItems: NavItem[] = [
    { icon: '/assets/nav-icons/gaming.png', tooltip: 'My Games', index: 0 },
    {
      icon: '/assets/nav-icons/leaderboard.png',
      tooltip: 'Leaderboard',
      index: 1,
      link: '/leaderboard',
    },
    { icon: '/assets/nav-icons/home.png', tooltip: 'Home', index: 2 },
    {
      icon: '/assets/nav-icons/game-store.png',
      tooltip: 'Game Store',
      index: 3,
      link: '/sample-game',
    },
    { icon: '/assets/nav-icons/user.png', tooltip: 'Profile', index: 4 },
  ];

  setActiveButton(index: number): void {
    this.activeButtonIndex.set(index);
  }
}
