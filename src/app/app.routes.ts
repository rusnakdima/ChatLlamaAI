/* system libraries */
import { Routes } from "@angular/router";

/* guard */
import { canActivateAuth } from "./guards/auth.guard";

/* components */
import { HomeComponent } from "@views/home/home.component";
import { AboutComponent } from "@views/about/about.component";

import { LoginComponent } from "@views/login/login.component";
import { SignupComponent } from "@views/signup/signup.component";
import { ChangePasswordComponent } from "@views/change-password/change-password.component";
import { ResetPasswordComponent } from "@views/reset-password/reset-password.component";

import { ChatComponent } from "@views/chat/chat.component";
import { SharedLinksComponent } from "@views/shared-links/shared-links.component";

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home', canActivate: [canActivateAuth] },
  { path: 'about', component: AboutComponent, title: 'About', canActivate: [canActivateAuth] },

  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Signup' },
  { path: 'reset_password', component: ResetPasswordComponent, title: 'Reset Password', data: { breadcrumb: 'Reset Password' } },
  { path: 'change_password', component: ChangePasswordComponent, title: 'Change Password', data: { breadcrumb: 'Change Password' } },

  { path: 'chat/:id', component: ChatComponent, title: 'Chat', canActivate: [canActivateAuth] },
  { path: 'shared_links', component: SharedLinksComponent, title: 'Shared Links', canActivate: [canActivateAuth] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
