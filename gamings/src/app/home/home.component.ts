import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Game } from '../models/game';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
  games: Game[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) {}

 
}
