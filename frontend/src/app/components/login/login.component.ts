import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (email === 'admin@admin.com' && password === '123456') {
        localStorage.setItem('token', 'fake-jwt-token');
        this.errorMsg = '';
        alert('Login correcto');
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMsg = 'Credenciales inválidas';
      }
    } else {
      this.errorMsg = 'Por favor completa el formulario correctamente';
    }
  }
}