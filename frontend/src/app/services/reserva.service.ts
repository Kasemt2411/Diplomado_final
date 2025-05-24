import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  _id?: string;
  nombreCliente: string;
  correo: string;
  fecha: string;
  hora: string;
  cantidadPersonas: number;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private apiUrl = 'http://localhost:3000/api/reservas';

  constructor(private http: HttpClient) {}

  obtenerReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  crearReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  editarReserva(id: string, reserva: Reserva): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}`, reserva);
  }

  eliminarReserva(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}