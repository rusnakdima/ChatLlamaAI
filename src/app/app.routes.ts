/* system libraries */
import { Routes } from "@angular/router";

/* guard */
import { canActivateAuth } from "./guards/auth.guard";

/* components */
import { AboutComponent } from "@views/about/about.component";
import { ChangePasswordComponent } from "@views/change-password/change-password.component";
import { HomeComponent } from "@views/home/home.component";
import { LoginComponent } from "@views/login/login.component";
import { ResetPasswordComponent } from "@views/reset-password/reset-password.component";
import { SignupComponent } from "@views/signup/signup.component";

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home', canActivate: [canActivateAuth] },
  { path: 'about', component: AboutComponent, title: 'About', canActivate: [canActivateAuth] },

  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Signup' },
  { path: 'reset_password', component: ResetPasswordComponent, title: 'Reset Password', data: { breadcrumb: 'Reset Password' } },
  { path: 'change_password', component: ChangePasswordComponent, title: 'Change Password', data: { breadcrumb: 'Change Password' } },

  { path: 'chat/:id', component: HomeComponent, title: 'Chat', canActivate: [canActivateAuth] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
