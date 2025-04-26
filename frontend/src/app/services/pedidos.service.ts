import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Plato {
  nombre: string;
  cantidad: number;
  observaciones?: string;
}

export interface Pedido {
  _id?: string;
  cliente: string;
  mesa: string;
  platos: Plato[];
  estado: 'pendiente' | 'en preparación' | 'cancelar' | 'entregado';
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private api = 'http://localhost:3000/api/pedidos';
  private http = inject(HttpClient);

  // Crear pedido
  crearPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.api, pedido).pipe(
      catchError(error => {
        console.error('Error al crear pedido:', error);
        return throwError(() => new Error('No se pudo crear el pedido'));
      })
    );
  }

  // Obtener todos los pedidos
  obtenerPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.api).pipe(
      catchError(error => {
        console.error('Error al obtener pedidos:', error);
        return throwError(() => new Error('No se pudo obtener la lista de pedidos'));
      })
    );
  }

  // Editar pedido
  editarPedido(_id: string, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.api}/${_id}`, pedido).pipe(
      catchError(error => {
        console.error('Error al editar pedido:', error);
        return throwError(() => new Error('No se pudo editar el pedido'));
      })
    );
  }

  // Eliminar pedido
  eliminarPedido(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar pedido:', error);
        return throwError(() => new Error('No se pudo eliminar el pedido'));
      })
    );
  }
}