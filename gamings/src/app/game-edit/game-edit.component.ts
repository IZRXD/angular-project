import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../models/game';
import { Location } from '@angular/common'; // Import Location service
import { GameService } from '../game.service';
@Component({
  selector: 'app-game-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './game-edit.component.html',
  styleUrl: './game-edit.component.css',
})
export class GameEditComponent implements OnInit {
  game: Game = {} as Game;
  isEditing: boolean = false; // Flag to track if editing is in progress
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private location: Location,
     private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.isEditing = true; // Set editing flag
    const id = this.route.snapshot.params['gameId'];

    this.apiService.getSingleGame(id).subscribe({
      next: (game) => {
        this.game = game;
         this.gameService.setGame(game);
      },
      error: (error) => {
        console.error('Error fetching game:', error);
        // Handle error (e.g., display error message, redirect)
      },
    });
  }

  editGame(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    if (this.game._ownerId !== this.userService.getUserId()) {
      console.log("not allowed");
      
      return;
    }
    const gameData: Game = {
      _id: this.game._id as string,
      _ownerId: this.userService.getUserId() as string,
      title: formData.get('title')?.toString(),
      imageUrl: formData.get('imageUrl')?.toString(),
      creators: formData.get('creators')?.toString(),
      rating: formData.get('rating')?.toString(),
      downloads: formData.get('downloads')?.toString(),
      description: formData.get('description')?.toString(),
    };
    

    this.apiService.editGame(this.game._id as string, gameData).subscribe({
      next: () => {
        console.log(gameData);
        
        this.location.back();
      },
      error: (err) => {
        console.error('Error editing game:', err);
        // Handle errors (e.g., display error message)
      },
    });
  }
}
