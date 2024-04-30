import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateTaskComponent } from './dashboard/create-task/create-task.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TaskDetailsComponent } from './dashboard/task-details/task-details.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { loggingInterceptorService } from './services/logging-interceptor.service';
import { LoaderComponent } from './utility/loader/loader.component';
import { SnackbarComponent } from './utility/snackbar/snackbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    CreateTaskComponent,
    TaskDetailsComponent,
    HomeComponent,
    LoaderComponent,
    SnackbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: loggingInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
