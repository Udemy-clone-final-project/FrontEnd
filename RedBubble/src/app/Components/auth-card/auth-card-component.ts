import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form-component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-card-component',
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './auth-card-component.html',
  styleUrl: './auth-card-component.css',
})

export class AuthCardComponent {
  @Input() mode: 'signup' | 'login' = 'signup';
  @Output() formSubmit = new EventEmitter<any>();


  selectedRole: 'artist' | 'customer' = 'customer';

  setRole(role: 'artist' | 'customer') {

    this.selectedRole = role;
  }

  onFormSubmit(formValue: any) {

    const payload = {
      ...formValue,
      role: this.selectedRole,
      mode: this.mode
    };

    this.formSubmit.emit(payload);
  }
}
