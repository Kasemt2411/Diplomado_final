import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // Datos del formulario de contacto
  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  // Método para enviar el formulario (puedes adaptarlo para backend)
  sendMessage() {
    if (this.contactForm.name && this.contactForm.email && this.contactForm.message) {
      console.log('Mensaje enviado:', this.contactForm);
      alert('Gracias por contactarnos, te responderemos pronto.');
      this.contactForm = { name: '', email: '', message: '' };
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}