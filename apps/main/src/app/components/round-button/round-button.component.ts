import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'nexus-arcade-round-button',
  imports: [CommonModule, CardModule, ButtonModule, TooltipModule],
  templateUrl: './round-button.component.html',
  styleUrl: './round-button.component.css',
})
export class RoundButtonComponent {
  //get navIcon as input
  navIcon = input<string>('');
  active = input<boolean>(false);
  navTooltip = input<string>('');
}
