import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form-component.html',
  styleUrl: './auth-form-component.css'
})
export class AuthFormComponent implements OnInit {
  @Input() mode: 'signup' | 'login' = 'signup';
  @Input() role: 'artist' | 'customer' = 'customer';
  @Output() formSubmit = new EventEmitter<any>();


  authForm!: FormGroup;

  constructor(private fb: FormBuilder) {}


  ngOnInit(): void {
    this.buildForm();
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


    if(this.role === 'customer') {
      this.authForm.addControl('username', this.fb.control('', [Validators.required, Validators.minLength(2)]));
    }

    if(this.role === 'artist') {
      this.authForm.addControl('shopname', this.fb.control('', [Validators.required, Validators.minLength(2)]));
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
