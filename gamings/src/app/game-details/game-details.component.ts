// game-details.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Game } from '../models/game';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { Location } from '@angular/common';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css',
})
export class GameDetailsComponent implements OnInit {
  game$: Game | null = null;
  isLoading: boolean = true;
  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public gameService: GameService,
    private location: Location,
    private userService: UserService // Inject UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['gameId'];
    this.apiService.getSingleGame(id).subscribe({
      next: (game) => {
        this.gameService.setGame(game);
        this.isLoading = false;
        this.checkOwnership(game);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching game:', error);
      },
    });
  }
  // In your GameDetailsComponent
  checkOwnership(game: Game) {
    const userId = this.userService.getUserId(); // Get userId directly
    if (userId && game._ownerId === userId) {
      this.isOwner = true;
    }
  }

  deleteGame(game: string | undefined) {
    console.log('Deleting game:', game);
    if (game ) {
      this.apiService.deleteGame(game).subscribe({
        next: () => {
          this.location.back(); // Navigate back to catalog
        },
        error: (error) => {
          console.error('Error deleting game:', error);
        },
      });
    } else {
      console.error('Game or game ID is undefined.');
    }
  }
}
