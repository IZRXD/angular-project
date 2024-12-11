import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../types/game';
import { ApiService } from '../api.service';
import { LoaderComponent } from '../shared/loader/loader.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
  show: string = 'latest';
  genre: string = 'All';
  searchControl: FormControl = new FormControl();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames(): void {
    this.isLoading = true;
    this.apiService.getAllGames().subscribe(
      (games) => {
        this.games = games;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching games:', error);
        this.isLoading = false;
      }
    );
  }

  // updateQueryParams(): void {
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: {
  //       show: this.show,
  //       genre: this.genre,
  //       search: this.searchControl.value
  //     },
  //     queryParamsHandling: 'merge'
  //   })
  // }
}
