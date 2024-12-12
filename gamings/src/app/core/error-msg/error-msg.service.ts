import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorMsgService {
  private apiError$$ = new BehaviorSubject<string | null>(null);
  public apiError$ = this.apiError$$.asObservable();

  constructor() { }

  setError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.apiError$$.next(error.error.message);
    } else if (error instanceof Error) {
      this.apiError$$.next(error.message);
    } else {
      this.apiError$$.next('Something is wrong!')
    }
  }

  clearError(): void {
    this.apiError$$.next(null);
  }
}
