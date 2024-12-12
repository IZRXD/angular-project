import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Game } from '../models/game';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  constructor(private apiService: ApiService) {}
}
