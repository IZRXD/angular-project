import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from './models/game';

@Injectable({ providedIn: 'root' })
export class GameService {
  private gameSubject = new BehaviorSubject<Game | null>(null);
  game$ = this.gameSubject.asObservable();

  setGame(game: Game | null) {
    this.gameSubject.next(game);
  }
}
