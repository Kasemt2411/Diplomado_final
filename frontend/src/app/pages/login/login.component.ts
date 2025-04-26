import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMsg: string = '';
  isRegistering: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
    this.errorMsg = '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (res) => {
          this.authService.guardarToken(res.token);
          this.errorMsg = '';
          alert('Login exitoso');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMsg = err.error?.mensaje || 'Error al iniciar sesión';
        }
      });
    } else {
      this.errorMsg = 'Por favor completa el formulario correctamente';
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register(name, email, password).subscribe({
        next: () => {
          alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
          this.isRegistering = false;
          this.registerForm.reset();
          this.errorMsg = '';
        },
        error: (err) => {
          this.errorMsg = err.error?.mensaje || 'Error al registrar usuario';
        }
      });
    } else {
      this.errorMsg = 'Por favor completa el formulario correctamente';
    }
  }
}