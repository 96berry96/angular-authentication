import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../model/AuthResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  authObs: Observable<AuthResponse>;

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode
  }

  onFormSubmitted(form:NgForm){
    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode){
      this.isLoading = true;
      this.authObs = this.authService.login(email, password)
    }else{
      this.isLoading = true;
      this.authObs = this.authService.signup(email, password)
    }

    this.authObs.subscribe({
      next: (response)=>{
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error)=>{
        console.log(error);
        
        this.isLoading = false;

        this.errorMessage = error;
        this.hideSnackbar();
      }
    })

    form.reset();
  }

  hideSnackbar(){
    setTimeout(() => {
      this.errorMessage = null
    },3000);
  }
}
