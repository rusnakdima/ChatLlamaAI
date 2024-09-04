/* system libraries */
import { CommonModule, Location } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
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
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";

/* services */
import { ChangePasswordService } from "@services/change-password.service";
import { AuthService } from "@services/auth.service";

/* models */
import { Response } from "@models/response";

/* component */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-change-password",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ChangePasswordService, AuthService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./change-password.component.html",
})
export class ChangePasswordComponent {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private changePasswordService: ChangePasswordService,
    private authService: AuthService
  ) {
    this.resetForm = fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      confirm_password: ["", [Validators.required, this.matchPasswords()]],
      token: ["", Validators.required],
    });
  }

  dataNotify: Subject<INotify> = new Subject();

  role: string = "";

  errorText: string = "";

  isShowPassword: boolean = false;
  isShowConfirmPassword: boolean = false;
  isExpired: boolean = true;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["username"] && params["token"]) {
        this.f["username"].setValue(params["username"]);
        this.f["token"].setValue(params["token"]);
        this.checkToken();
      }
    });

    this.role = this.authService.getValueByKey("role") ?? "player";
  }

  back() {
    this.location.back();
  }

  get f() {
    return this.resetForm.controls;
  }

  isInvalid(attr: string) {
    return (this.f[attr].touched || this.f[attr].dirty) && this.f[attr].errors;
  }

  checkToken() {
    this.changePasswordService
      .checkToken({
        username: this.f["username"].value,
        token: this.f["token"].value,
      })
      .then((data: Response) => {
        if (data.status == "success") {
          this.isExpired = false;
        } else {
          this.errorText = data.message;
        }
      })
      .catch((err) => {
        console.error(err);
        this.dataNotify.next({
          status: "error",
          text: `${
            this.role == "admin"
              ? err.status + " — " + err.message
              : "Server error!"
          }`,
        });
      });
  }

  matchPasswords(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.resetForm) {
        const password = this.resetForm.controls["password"].value;
        const confirmPassword = control.value;

        if (password != confirmPassword) {
          return { passwordMismatch: true };
        }
      }
      return null;
    };
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      Object.values(this.resetForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }

    if (this.resetForm.valid) {
      this.changePasswordService
        .sendRequest(this.resetForm.value)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
          if (data.status == "success") {
            document.location.href = "/login";
          }
        })
        .catch((err) => {
          console.error(err);
          this.dataNotify.next({
            status: "error",
            text: `${
              this.role == "admin"
                ? err.status + " — " + err.message
                : "Server error!"
            }`,
          });
        });
    }
  }
}
