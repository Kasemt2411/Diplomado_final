import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../pages/dashboard/dashboard.component';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private api = 'http://localhost:3000/api/usuarios';
  private http = inject(HttpClient);

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.api, usuario);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api);
  }

  editarUsuarios(_id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.api}/${_id}`, usuario);
  }  

  eliminarUsuario(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar usuario:', error);
        return throwError(() => new Error('No se pudo eliminar el usuario'));
      })
    );
  }
}