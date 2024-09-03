/* system libraries */
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { Subject } from "rxjs";

/* services */
import { AuthService } from "@services/auth.service";

/* models */
import { Response } from "@models/response";
import { RegForm } from "@models/reg_form";

/* components */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-signup",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./signup.component.html",
})
export class SignupComponent {
  regForm: FormGroup<any>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.regForm = fb.group({
      email: ["", [Validators.required, Validators.email]],
      username: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9]*")]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirm_password: [
        "",
        [Validators.required, Validators.minLength(6), this.checkPasswords()],
      ],
    });
  }

  dataNotify: Subject<INotify> = new Subject();

  isShowPassword: boolean = false;
  isShowConfirmPassword: boolean = false;
  submitted: boolean = false;

  ngOnInit() {
    document.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.send();
      }
    });
  }

  get f() {
    return this.regForm.controls;
  }

  isInvalid(attr: string) {
    return (
      (this.submitted || this.f[attr].touched || this.f[attr].dirty) &&
      this.f[attr].errors
    );
  }

  checkPasswords(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.regForm) {
        const password = this.regForm.controls["password"].value;
        const confirmPassword = control.value;
        if (password != confirmPassword) {
          return { passwordMismatch: true };
        }
      }
      return null;
    };
  }

  async send() {
    this.submitted = true;

    if (this.regForm.invalid) {
      Object.values(this.regForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }

    if (this.regForm.valid) {
      const authData = new RegForm(
        this.f["email"].value,
        this.f["username"].value,
        this.f["password"].value
      );
      await this.authService
        .signup(authData)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
          if (data.status == "success") {
            setTimeout(() => {
              this.router.navigate(["/login"]);
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
