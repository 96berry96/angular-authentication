import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'angular-authentication';
  authService:AuthService = inject(AuthService);

  ngOnInit(): void {
    this.authService.autoLogin();
  }

}
