import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
import { PedidosService, Pedido } from '../../services/pedidos.service';

export interface Usuario {
  _id?: string;
  nombre: string;
  correo: string;
  contraseña: string;
  rol: 'admin' | 'usuario';
}

export interface Plato {
  nombre: string;
  cantidad: number;
  observaciones?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  usuarioForm: FormGroup;
  pedidoForm: FormGroup;
  usuarios2: any;
  id: string | null = null;

  usuarioServices = inject(UsuariosService);
  pedidoService = inject(PedidosService);

  usuarios: Usuario[] = [];
  pedidos: Pedido[] = [];

  editando: boolean = false;
  editandoPedido: boolean = false;
  usuarioEnEdicion: Usuario | null = null;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', [Validators.required]]
    });

    this.pedidoForm = this.fb.group({
      cliente: ['', Validators.required],
      mesa: ['', Validators.required],
      platos: this.fb.array([]),
      total: [0]
    });

    this.agregarPlato();
  }

  ngOnInit(): void {
    this.listarUsuarios();
    this.obtenerPedidosDesdeApi();
  }

  listarUsuarios(): void {
    this.usuarioServices.obtenerUsuarios().subscribe(u => {
      this.usuarios2 = u;
      this.usuarios = u;
    });
  }

  obtenerPedidosDesdeApi(): void {
    this.pedidoService.obtenerPedidos().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error('Error al obtener pedidos:', err)
    });
  }

  guardarUsuario() {
    const formData = this.usuarioForm.value;
    if (this.usuarioForm.invalid) return;

    if (this.editando && this.usuarioEnEdicion) {
      this.usuarioServices.editarUsuarios(this.id!, formData).subscribe(() => {
        this.listarUsuarios();
        this.cancelarEdicion();
      });
    } else {
      this.usuarioServices.crearUsuario(formData).subscribe(() => {
        this.listarUsuarios();
        this.usuarioForm.reset();
      });
    }
  }

  editarUsuario(usuario: Usuario) {
    this.editando = true;
    this.usuarioEnEdicion = usuario;
    this.id = usuario._id!;
    this.usuarioForm.setValue({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contraseña: usuario.contraseña,
      rol: usuario.rol
    });
  }

  eliminarUsuario(usuario: Usuario) {
    if (!usuario._id) return;
    if (!confirm(`¿Eliminar a ${usuario.nombre}?`)) return;

    this.usuarioServices.eliminarUsuario(usuario._id).subscribe({
      next: () => {
        this.listarUsuarios();
        if (this.usuarioEnEdicion === usuario) this.cancelarEdicion();
      },
      error: err => alert('Error al eliminar usuario')
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.usuarioEnEdicion = null;
    this.usuarioForm.reset();
  }

  get platos(): FormArray {
    return this.pedidoForm.get('platos') as FormArray;
  }

  agregarPlato() {
    const platoForm = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      observaciones: ['']
    });
    this.platos.push(platoForm);
    this.calcularTotal();
  }

  eliminarPlato(index: number) {
    this.platos.removeAt(index);
    this.calcularTotal();
  }

  calcularTotal() {
    const total = this.platos.controls.reduce((sum, control) =>
      sum + (control.get('cantidad')?.value || 0) * 15000, 0);
    this.pedidoForm.patchValue({ total });
  }

  crearPedido() {
    if (this.pedidoForm.invalid) return;

    if (this.editandoPedido && this.id) {
      this.editarPedidoConfirmado();
    } else {
      const nuevoPedido: Pedido = {
        ...this.pedidoForm.value,
        estado: 'pendiente'
      };

      this.pedidoService.crearPedido(nuevoPedido).subscribe({
        next: () => {
          this.obtenerPedidosDesdeApi();
          this.pedidoForm.reset();
          this.platos.clear();
          this.agregarPlato();
        },
        error: (err) => alert('Error al crear pedido')
      });
    }
  }

  // ... (los imports y declaraciones anteriores se mantienen igual)

  editarPedido(pedido: Pedido) {
    if (!pedido._id) return;
    this.id = pedido._id;
    this.editandoPedido = true;

    // Crear un nuevo FormArray de platos
    const nuevosPlatos = this.fb.array(
      pedido.platos.map(p => this.fb.group({
        nombre: [p.nombre, Validators.required],
        cantidad: [p.cantidad, [Validators.required, Validators.min(1)]],
        observaciones: [p.observaciones || '']
      }))
    );

    // Reemplazar el array completo de platos y setear el resto del formulario
    this.pedidoForm.setControl('platos', nuevosPlatos);
    this.pedidoForm.patchValue({
      cliente: pedido.cliente,
      mesa: pedido.mesa,
      total: pedido.total
    });

    this.calcularTotal(); // recalcular el total visualmente
  }


  editarPedidoConfirmado() {
    if (!this.id || this.pedidoForm.invalid) return;

    const pedidoActualizado: Pedido = {
      ...this.pedidoForm.value,
      estado: 'pendiente'
    };

    this.pedidoService.editarPedido(this.id, pedidoActualizado).subscribe({
      next: () => {
        this.obtenerPedidosDesdeApi();
        this.pedidoForm.reset();
        this.platos.clear();
        this.agregarPlato();
        this.id = null;
        this.editandoPedido = false;
      },
      error: (err) => alert('Error al actualizar el pedido')
    });
  }

  eliminarPedido(pedido: Pedido) {
    if (!pedido._id) return;
    if (!confirm(`¿Eliminar el pedido de ${pedido.cliente}?`)) return;

    this.pedidoService.eliminarPedido(pedido._id).subscribe({
      next: () => this.obtenerPedidosDesdeApi(),
      error: (err) => alert('Error al eliminar el pedido')
    });
  }

  verDetallePedido(pedido: Pedido) {
    const detalle = pedido.platos
      .map(p => `• ${p.nombre} x${p.cantidad} ${p.observaciones ? `(${p.observaciones})` : ''}`)
      .join('\n');
    alert(`Cliente: ${pedido.cliente}\nMesa: ${pedido.mesa}\nEstado: ${pedido.estado}\nPlatos:\n${detalle}\nTotal: $${pedido.total}`);
  }

  cambiarEstadoPedido(pedido: Pedido) {
    const flujo: { [key in Pedido['estado']]: Pedido['estado'] } = {
      'pendiente': 'en preparación',
      'en preparación': 'entregado',
      'entregado': 'pendiente',
      'cancelar': 'pendiente'
    };
    pedido.estado = flujo[pedido.estado];
  }

  marcarComoEntregado(pedido: Pedido) {
    pedido.estado = 'entregado';
  }

  cancelarPedido(pedido: Pedido) {
    this.eliminarPedido(pedido);
  }
}