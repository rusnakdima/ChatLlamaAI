/* system libraries */
import { CommonModule, Location } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Subject } from "rxjs";

/* services */
import { AuthService } from "@services/auth.service";
import { ResetPasswordService } from "@services/reset-password.service";

/* models */
import { Response } from "@models/response";

/* component */
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-reset-password",
  standalone: true,
  providers: [AuthService, ResetPasswordService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WindowNotifyComponent,
  ],
  templateUrl: "./reset-password.component.html",
})
export class ResetPasswordComponent {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private authService: AuthService,
    private resetPasswordService: ResetPasswordService
  ) {
    this.resetForm = fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  dataNotify: Subject<INotify> = new Subject();

  role: string = "";

  ngOnInit() {
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

  onSubmit() {
    if (this.resetForm.invalid) {
      Object.values(this.resetForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }

    if (this.resetForm.valid) {
      this.resetPasswordService
        .sendRequest(this.resetForm.controls["email"].value)
        .then((data: Response) => {
          this.dataNotify.next({ status: data.status, text: data.message });
          if (data.status == "success" && data.data != '') {
            setTimeout(() => {
              document.location.href = `/change_password?username=${data.data['username']}&token=${data.data['token']}`;
            }, 500);
          }
        })
        .catch((err) => {
          console.log(err);
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
