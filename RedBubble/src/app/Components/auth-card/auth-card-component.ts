import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form-component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-auth-card-component',
  imports: [AuthFormComponent, RouterLink, AlertComponent],
  templateUrl: './auth-card-component.html',
  styleUrls: ['./auth-card-component.css'],
})

export class AuthCardComponent {
  @Input() mode: 'signup' | 'login' = 'signup';
  @Output() formSubmit = new EventEmitter<any>();


  selectedRole: 'artist' | 'customer' = 'customer';
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  alertMessage: string = '';
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'info';

  setRole(role: 'artist' | 'customer') {
    this.selectedRole = role;
  }

  onFormSubmit(formValue: any) {
    this.alertMessage = ''; // Reset alert

    if(this.mode === 'signup'){
      const registerPayload = {
        displayName: formValue.username || formValue.shopname || 'User',
        email: formValue.email,
        password: formValue.password
      };
      this.authService.signup(registerPayload).subscribe({
        next: (res: any) => {
          console.log("Signup successful",res);
          this.alertMessage = 'Signup successful! You will now be logged in.';
          this.alertType = 'success';

          // Automatically log the user in
          this.authService.login({ email: formValue.email, password: formValue.password }).subscribe({
            next: (loginRes: any) => {
              console.log("Auto-login successful", loginRes);
              this.router.navigate(['/home']);
            },
            error: (loginErr) => {
              console.log("Auto-login failed", loginErr);
              const serverMsg = (loginErr?.error && typeof loginErr.error === 'string') ? loginErr.error : loginErr?.error?.message;
              this.alertMessage = `Login failed (${loginErr.status}): ${serverMsg || loginErr.message}`;
              this.alertType = 'danger';
              this.router.navigate(['/auth/login']); // Fallback to manual login
            }
          });
        },
        error: (err) => {
          console.log("Signup failed", err);
          const serverMsg = (err?.error && typeof err.error === 'string') ? err.error : err?.error?.message;
          this.alertMessage = `Signup failed (${err.status}): ${serverMsg || err.message}`;
          this.alertType = 'danger';
        }
      });
    } else {
      this.authService.login({ email: formValue.email, password: formValue.password }).subscribe({
        next: (res: any) => {
          console.log("Login successful", res);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log("Login failed", err);
          const serverMsg = (err?.error && typeof err.error === 'string') ? err.error : err?.error?.message;
          this.alertMessage = `Login failed (${err.status}): ${serverMsg || err.message}`;
          this.alertType = 'danger';
        }
      });
    }


    const payload = {
      ...formValue,
      role: this.selectedRole,
      mode: this.mode
    };

    this.formSubmit.emit(payload);
  }
}
