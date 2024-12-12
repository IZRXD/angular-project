import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes'; 
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html', // Re-added templateUrl
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
  ],
})
export class AppComponent {
  title = 'Gamings';
}
