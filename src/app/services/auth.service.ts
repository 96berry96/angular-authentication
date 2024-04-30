import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthResponse } from '../model/AuthResponse';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from '../model/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null); 

  private tokenExpireTimer:any;
  
  url: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC1Gw8JhP3kOMKgPil0XjFWtmttnlB680Q';

  signup(email, password){
    const data = {email: email, password: password, returnSecureToken: true}

    return this.http.post<AuthResponse>(this.url, data)
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleCreateUser(res);
        })
      )
  }

  login(email, password){
    const loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC1Gw8JhP3kOMKgPil0XjFWtmttnlB680Q';

    const data = {email: email, password: password, returnSecureToken: true};

    return this.http.post<AuthResponse>(loginUrl, data)
      .pipe(catchError(this.handleError),
      tap((res) => {
        this.handleCreateUser(res);
      }))

  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('user');

    if(this.tokenExpireTimer){
      clearTimeout(this.tokenExpireTimer);
    }
    this.tokenExpireTimer = null;
  }

  autoLogin(){
    //Preserve the user session
    const user = JSON.parse(localStorage.getItem('user'));

    if(!user){
      return;
    } 

    const loggedUser = new User(user.email, user.id, user._token, user.expiresIn);

    if(loggedUser.token){
      this.user.next(loggedUser);
      const timerValue = user._expiresIn.getTime() - new Date().getTime();
      this.autoLogout(timerValue);
    }
  }

  autoLogout(expireTime: number){
    this.tokenExpireTimer = setTimeout(() => {
      this.logout();
    }, expireTime);
  }

  private handleCreateUser(res){
    let expiresInTs =  new Date().getTime() + +res.expiresIn * 1000;
          let expiresIn = new Date(expiresInTs);
          const user = new User(res.email, res.localId, res.idToken, expiresIn);
          this.user.next(user);
          this.autoLogout(res.expiresIn * 1000);
          localStorage.setItem('user', JSON.stringify(user));
  }

  private handleError(err){
    let errorMessage = 'An unknown error has occured';
        if(!err.error || !err.error.error){
           return throwError(()=>errorMessage);
        }
        switch(err.error.error.message){
          case 'EMAIL_EXISTS':
            errorMessage = 'Email already exists';
            break;
          case 'OPERATION_NOT_ALLOWED':
            errorMessage = 'Operation not allowed';
            break;
          case 'INVALID_LOGIN_CREDENTIALS':
            errorMessage = 'The email or password does not exist';
            break;
          case 'USER_DISABLED':
            errorMessage = 'User disabled';
            break;
        }
        return throwError(()=>errorMessage);
  }
}
