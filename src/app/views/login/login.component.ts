/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { Subject } from "rxjs";

/* services */
import { AuthService } from "@services/auth.service";

/* models */
import { Response } from "@models/response";
import { AuthForm } from "@models/auth_form";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-login",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  logForm: FormGroup<any>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.logForm = fb.group({
      username: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9]*")]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  dataNotify: Subject<INotify> = new Subject();

  isShowPassword: boolean = false;
  submitted: boolean = false;

  ngOnInit() {
    document.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.send();
      }
    });
  }

  get f() {
    return this.logForm.controls;
  }

  isInvalid(attr: string) {
    return (
      (this.submitted || this.f[attr].touched || this.f[attr].dirty) &&
      this.f[attr].errors
    );
  }

  async send() {
    this.submitted = true;

    if (this.logForm.invalid) {
      Object.values(this.logForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }

    if (this.logForm.valid) {
      const authData = new AuthForm(
        this.f["username"].value,
        this.f["password"].value,
        this.f["remember"].value
      );
      await this.authService
        .login(authData)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
          if (data.status == "success") {
            localStorage.setItem("token", data.data);
            setTimeout(() => {
              this.router.navigate(["/"]).then(() => {
                window.location.reload();
              });
            }, 500);
          }
        })
        .catch((err) => {
          console.error(err);
          this.dataNotify.next({
            status: "error",
            text: err.status + " — " + err.statusText,
          });
        });
    } else {
      this.dataNotify.next({
        status: "error",
        text: "Error sending data! Enter the data in the field.",
      });
    }
  }
}
