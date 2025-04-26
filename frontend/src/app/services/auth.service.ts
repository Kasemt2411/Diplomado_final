import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  // Login
  login(correo: string, contraseña: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { correo, contraseña });
  }

  // Registro
  register(nombre: string, correo: string, contraseña: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { nombre, correo, contraseña });
  }

  // Guardar token en localStorage
  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtener token
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // Cerrar sesión
  cerrarSesion(): void {
    localStorage.removeItem('token');
  }
}