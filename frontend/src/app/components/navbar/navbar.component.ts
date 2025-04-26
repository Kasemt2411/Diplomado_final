import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public router: Router) {}

  // Devuelve verdadero si la ruta actual es Home ("/") o Login ("/login")
  get isHomeOrLogin(): boolean {
    const current = this.router.url;
    return current === '/' || current === '/login';
  }

  // Devuelve verdadero si la ruta actual es el Dashboard
  get isDashboard(): boolean {
    return this.router.url.startsWith('/dashboard');
  }

  // Función para hacer logout y redirigir al Home
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}