import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-game-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css',
})
export class GameCreateComponent {
  constructor(private apiService: ApiService , private router: Router,private userService: UserService) {}

  addGame(event: Event) {
    event.preventDefault(); // Prevent default form submission
    
    const formData = new FormData(event.target as HTMLFormElement);
    
    const gameData = { 
      _ownerId: this.userService.getCurrentUser().toString(),
      title: formData.get('title')?.toString(),
      imageUrl: formData.get('imageUrl')?.toString(),
      creators: formData.get('creators')?.toString(),
      rating: formData.get('rating')?.toString(),
      downloads: formData.get('downloads')?.toString(),
      description: formData.get('description')?.toString(),
    };
    this.apiService.createGame(localStorage.getItem('_ownerId')?.toString(), gameData.title, gameData.imageUrl, gameData.creators, gameData.rating, gameData.downloads, gameData.description).subscribe({
      next: (data) => {
         this.router.navigate(['/catalog']);
      },
      error: (err) => {
        console.error('Error creating game:', err);
        // Handle errors (e.g., display error message)
      },
    });
  }
}
