import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'nexus-arcade-hero',
  imports: [CommonModule, CarouselModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit {
  heroImages: { src: string; alt: string }[] = [];

  ngOnInit() {
    this.heroImages = [{ src: 'assets/hero/hero-1.png', alt: 'Hero Image 1' }];
  }
}
