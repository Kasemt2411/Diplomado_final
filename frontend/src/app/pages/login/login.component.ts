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
    // Formulario de login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Formulario de registro
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Cambia entre los formularios de Login y Registro
  toggleForm() {
    this.isRegistering = !this.isRegistering;
    this.errorMsg = '';
  }

  // Maneja la acción de iniciar sesión
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

  // Maneja la acción de registro
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

  // Función para verificar si un formulario es inválido y mostrar errores
  isInvalid(form: FormGroup, control: string): boolean {
    const controlForm = form.get(control);
    return controlForm ? controlForm.invalid && controlForm.touched : false;
  }

  // Función para obtener el mensaje de error para un control
  getErrorMessage(form: FormGroup, control: string): string {
    const controlObj = form.get(control);
    if (!controlObj || !controlObj.errors) {
      return '';
    }
    if (controlObj.hasError('required')) {
      return `${control} es requerido`;
    }
    if (controlObj.hasError('email')) {
      return 'Ingresa un correo válido';
    }
    if (controlObj.hasError('minlength')) {
      const minlengthError = controlObj.errors['minlength'];
      if (minlengthError) {
        return `La contraseña debe tener al menos ${minlengthError.requiredLength} caracteres`;
      }
    }
    return '';
  }
}