import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ErrorMsgService } from './error-msg.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-msg',
  standalone: true,
  imports: [],
  templateUrl: './error-msg.component.html',
  styleUrl: './error-msg.component.css'
})
export class ErrorMsgComponent implements OnInit, OnDestroy {
  errorMsg: string | undefined | null = '';

  timeoutHandle: any;

  errorSubscription: Subscription | null = null;

  constructor(private errorMsgService: ErrorMsgService) {}

  ngOnInit(): void {
    
    this.errorSubscription = this.errorMsgService.apiError$.subscribe((err: any) => {
      this.errorMsg = err;

      if (this.errorMsg) {
        if (this.timeoutHandle) {
          clearTimeout(this.timeoutHandle);
        }

         this.timeoutHandle = setTimeout(() => {
          this.errorMsg = null;
          this.errorMsgService.clearError();
        }, 4000);
      }
    })
  }
  ngOnDestroy(): void {
    this.errorSubscription?.unsubscribe();
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
  }

}