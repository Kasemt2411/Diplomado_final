import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Inventario {
  _id?: string;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  unidad: string;
  stockMinimo?: number;
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private apiUrl = 'http://localhost:3000/api/inventario';

  constructor(private http: HttpClient) {}

  obtenerInventario(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  agregarProducto(producto: Inventario): Observable<Inventario> {
    return this.http.post<Inventario>(this.apiUrl, producto);
  }

  actualizarProducto(id: string, producto: Inventario): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}