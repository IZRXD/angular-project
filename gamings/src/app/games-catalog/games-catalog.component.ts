import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { ApiService } from '../api.service';
import { routes } from '../app.routes';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-games-catalog',
  standalone: true,
  imports: [RouterLink, LoaderComponent, ReactiveFormsModule],
  templateUrl: './games-catalog.component.html',
  styleUrl: './games-catalog.component.css',
})
export class GamesCatalogComponent implements OnInit {
  games: Game[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames(): void {
    this.isLoading = true;
    this.error = null;
    this.apiService.getAllGames().subscribe({
      next: (response) => {
        console.log('Games:', response);
        this.games = Object.values(response).map((gameObj: any) => ({
          _ownerId: gameObj._ownerId,
          title: gameObj.title,
          imageUrl: gameObj.imageUrl,
          rating: gameObj.rating,
          downloads: gameObj.downloads,
          creators: gameObj.creators,
          description: gameObj.description,
          _id: gameObj._id,
        })
        
      );
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error fetching games. Please try again later.';
        console.error('Error fetching games:', err);
      },
    });
  }
}
