import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

// Custom Validator Function
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordsMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-auth-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form-component.html',
  styleUrl: './auth-form-component.css'
})
export class AuthFormComponent implements OnInit, OnChanges {
  @Input() mode: 'signup' | 'login' = 'signup';
  @Input() role: 'artist' | 'customer' = 'customer';
  @Output() formSubmit = new EventEmitter<any>();


  authForm!: FormGroup;

  constructor(private fb: FormBuilder) {}


  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] && !changes['role'].firstChange) {
      this.updateFormForRole(this.role);
    }
  }

  buildForm() {

// Old way for references and reminder

// email: new FormControl('', [Validators.required, Validators.email]),
// username: new FormControl('', [Validators.required, Validators.minLength(2)]),
// shopName: new FormControl('', [Validators.required, Validators.minLength(2)]),
// password: new FormControl('', [Validators.required, Validators.minLength(6)]),


    this.authForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(6)]],
    });

    if (this.mode === 'signup') {
      this.authForm.addControl('confirmPassword', this.fb.control('', [Validators.required]));
      this.authForm.setValidators(passwordsMatchValidator);
      this.updateFormForRole(this.role);
      this.authForm.addControl('specialOffers', this.fb.control(false));
    }


  }

  updateFormForRole(role: 'artist' | 'customer') {
    if (this.mode !== 'signup') return;

    if (role === 'customer') {
      this.authForm.addControl('username', this.fb.control('', [Validators.required, Validators.minLength(2)]));
      this.authForm.removeControl('shopname');
    } else if (role === 'artist') {
      this.authForm.addControl('shopname', this.fb.control('', [Validators.required, Validators.minLength(2)]));
      this.authForm.removeControl('username');
    }
  }

  onSubmit() {
    if(this.authForm.valid) {
      this.formSubmit.emit(this.authForm.value);
    } else {
      this.authForm.markAllAsTouched();
    }
  }


}
