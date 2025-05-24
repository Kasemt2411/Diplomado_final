import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsuariosService } from '../../services/usuarios.service';
import { PedidosService, Pedido } from '../../services/pedidos.service';
import { ReservasService, Reserva } from '../../services/reserva.service';
import { InventarioService, Inventario } from '../../services/inventario.service';

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
  // Forms
  usuarioForm: FormGroup;
  pedidoForm: FormGroup;
  reservaForm: FormGroup;
  inventarioForm: FormGroup;

  // Data arrays
  usuarios2: Usuario[] = [];
  usuarios: Usuario[] = [];
  pedidos: Pedido[] = [];
  reservas: Reserva[] = [];
  inventarios: Inventario[] = [];

  // IDs para edición
  idUsuario: string | null = null;
  idPedido: string | null = null;
  idReserva: string | null = null;
  idInventario: string | null = null;

  // Servicios inyectados
  usuarioServices = inject(UsuariosService);
  pedidoService = inject(PedidosService);
  reservaService = inject(ReservasService);
  inventarioService = inject(InventarioService);

  // Flags de edición
  editando = false;
  editandoPedido = false;
  editandoReserva = false;
  editandoInventario = false;

  // Entidades en edición
  usuarioEnEdicion: Usuario | null = null;
  reservaEnEdicion: Reserva | null = null;
  inventarioEnEdicion: Inventario | null = null;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required]
    });

    this.pedidoForm = this.fb.group({
      cliente: ['', Validators.required],
      mesa: ['', Validators.required],
      platos: this.fb.array([]),
      total: [0]
    });

    this.reservaForm = this.fb.group({
      nombreCliente: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      cantidadPersonas: ['', [Validators.required, Validators.min(1)]],
      estado: ['pendiente', Validators.required]
    });

    this.inventarioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      cantidad: [0, Validators.required],
      unidad: ['', Validators.required],
      stockMinimo: [0]
    });

    // Inicializar con un plato
    this.agregarPlato();
  }

  ngOnInit(): void {
    this.listarUsuarios();
    this.obtenerPedidosDesdeApi();
    this.obtenerReservasDesdeApi();
    this.obtenerInventario();
  }

  // --------- Usuarios ---------

  listarUsuarios(): void {
    this.usuarioServices.obtenerUsuarios().subscribe(u => {
      this.usuarios2 = u;
      this.usuarios = u;
    });
  }

  guardarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.marcarCamposComoTocados(this.usuarioForm);
      return;
    }

    const formData = this.usuarioForm.value;

    if (this.editando && this.usuarioEnEdicion) {
      this.usuarioServices.editarUsuarios(this.idUsuario!, formData).subscribe(() => {
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

  editarUsuario(usuario: Usuario): void {
    this.editando = true;
    this.usuarioEnEdicion = usuario;
    this.idUsuario = usuario._id!;
    this.usuarioForm.setValue({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contraseña: usuario.contraseña,
      rol: usuario.rol
    });
  }

  eliminarUsuario(usuario: Usuario): void {
    if (!usuario._id) return;
    if (!confirm(`¿Eliminar a ${usuario.nombre}?`)) return;

    this.usuarioServices.eliminarUsuario(usuario._id).subscribe(() => {
      this.listarUsuarios();
      if (this.usuarioEnEdicion === usuario) this.cancelarEdicion();
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.usuarioEnEdicion = null;
    this.idUsuario = null;
    this.usuarioForm.reset();
  }

  // --------- Pedidos ---------

  get platos(): FormArray {
    return this.pedidoForm.get('platos') as FormArray;
  }

  agregarPlato(): void {
    const platoForm = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      observaciones: ['']
    });
    this.platos.push(platoForm);
    this.calcularTotal();
  }

  eliminarPlato(index: number): void {
    this.platos.removeAt(index);
    this.calcularTotal();
  }

  calcularTotal(): void {
    const total = this.platos.controls.reduce((sum, control) =>
      sum + (control.get('cantidad')?.value || 0) * 15000, 0);
    this.pedidoForm.patchValue({ total });
  }

  crearPedido(): void {
    if (this.pedidoForm.invalid) {
      this.marcarCamposComoTocados(this.pedidoForm);
      return;
    }

    if (this.editandoPedido && this.idPedido) {
      this.editarPedidoConfirmado();
    } else {
      const nuevoPedido: Pedido = {
        ...this.pedidoForm.value,
        estado: 'pendiente'
      };

      this.pedidoService.crearPedido(nuevoPedido).subscribe(() => {
        this.obtenerPedidosDesdeApi();
        this.pedidoForm.reset();
        this.platos.clear();
        this.agregarPlato();
      });
    }
  }

  editarPedido(pedido: Pedido): void {
    if (!pedido._id) return;
    this.idPedido = pedido._id;
    this.editandoPedido = true;

    const nuevosPlatos = this.fb.array(
      pedido.platos.map(p => this.fb.group({
        nombre: [p.nombre, Validators.required],
        cantidad: [p.cantidad, [Validators.required, Validators.min(1)]],
        observaciones: [p.observaciones || '']
      }))
    );

    this.pedidoForm.setControl('platos', nuevosPlatos);
    this.pedidoForm.patchValue({
      cliente: pedido.cliente,
      mesa: pedido.mesa,
      total: pedido.total
    });

    this.calcularTotal();
  }

  editarPedidoConfirmado(): void {
    if (!this.idPedido || this.pedidoForm.invalid) {
      this.marcarCamposComoTocados(this.pedidoForm);
      return;
    }

    const pedidoActualizado: Pedido = {
      ...this.pedidoForm.value,
      estado: 'pendiente'
    };

    this.pedidoService.editarPedido(this.idPedido, pedidoActualizado).subscribe(() => {
      this.obtenerPedidosDesdeApi();
      this.pedidoForm.reset();
      this.platos.clear();
      this.agregarPlato();
      this.idPedido = null;
      this.editandoPedido = false;
    });
  }

  eliminarPedido(pedido: Pedido): void {
    if (!pedido._id) return;
    if (!confirm(`¿Eliminar el pedido de ${pedido.cliente}?`)) return;

    this.pedidoService.eliminarPedido(pedido._id).subscribe(() => {
      this.obtenerPedidosDesdeApi();
    });
  }

  verDetallePedido(pedido: Pedido): void {
    const detalle = pedido.platos.map(p =>
      `• ${p.nombre} x${p.cantidad} ${p.observaciones ? `(${p.observaciones})` : ''}`
    ).join('\n');
    alert(`Cliente: ${pedido.cliente}\nMesa: ${pedido.mesa}\nEstado: ${pedido.estado}\nPlatos:\n${detalle}\nTotal: $${pedido.total}`);
  }

  cambiarEstadoPedido(pedido: Pedido): void {
    const flujo: { [key in Pedido['estado']]: Pedido['estado'] } = {
      'pendiente': 'en preparación',
      'en preparación': 'entregado',
      'entregado': 'pendiente',
      'cancelar': 'pendiente'
    };
    pedido.estado = flujo[pedido.estado];

    if (pedido._id) {
      this.pedidoService.editarPedido(pedido._id, pedido).subscribe(() => this.obtenerPedidosDesdeApi());
    }
  }

  marcarComoEntregado(pedido: Pedido): void {
    pedido.estado = 'entregado';
    if (pedido._id) {
      this.pedidoService.editarPedido(pedido._id, pedido).subscribe(() => this.obtenerPedidosDesdeApi());
    }
  }

  cancelarPedido(pedido: Pedido): void {
    if (!confirm(`¿Seguro que deseas cancelar el pedido de ${pedido.cliente}?`)) return;
    this.eliminarPedido(pedido);
  }

  estadoBadge(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'bg-warning text-dark';
      case 'en preparación': return 'bg-info text-dark';
      case 'entregado': return 'bg-success';
      case 'cancelar': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  // --------- Reservas ---------

  obtenerReservasDesdeApi(): void {
    this.reservaService.obtenerReservas().subscribe(data => this.reservas = data);
  }

  guardarReserva(): void {
    if (this.reservaForm.invalid) {
      this.marcarCamposComoTocados(this.reservaForm);
      return;
    }
    const nuevaReserva: Reserva = this.reservaForm.value;

    if (this.editandoReserva && this.idReserva) {
      this.reservaService.editarReserva(this.idReserva, nuevaReserva).subscribe(() => {
        this.obtenerReservasDesdeApi();
        this.reservaForm.reset({ estado: 'pendiente' });
        this.editandoReserva = false;
        this.idReserva = null;
      });
    } else {
      this.reservaService.crearReserva(nuevaReserva).subscribe(() => {
        this.obtenerReservasDesdeApi();
        this.reservaForm.reset({ estado: 'pendiente' });
      });
    }
  }

  editarReserva(reserva: Reserva): void {
    if (!reserva._id) return;
    this.idReserva = reserva._id;
    this.editandoReserva = true;
    this.reservaEnEdicion = reserva;

    const fechaFormateada = new Date(reserva.fecha).toISOString().split('T')[0];

    this.reservaForm.setValue({
      nombreCliente: reserva.nombreCliente,
      correo: reserva.correo,
      fecha: fechaFormateada,
      hora: reserva.hora,
      cantidadPersonas: reserva.cantidadPersonas,
      estado: reserva.estado || 'pendiente'
    });
  }

  eliminarReserva(reserva: Reserva): void {
    if (!reserva._id) return;
    if (!confirm(`¿Eliminar la reserva de ${reserva.nombreCliente}?`)) return;

    this.reservaService.eliminarReserva(reserva._id).subscribe(() => this.obtenerReservasDesdeApi());
  }

  // --------- Inventario ---------

  obtenerInventario(): void {
    this.inventarioService.obtenerInventario().subscribe({
      next: data => this.inventarios = data,
      error: err => console.error('Error al obtener inventario:', err)
    });
  }

  guardarInventario(): void {
    if (this.inventarioForm.invalid) {
      this.marcarCamposComoTocados(this.inventarioForm);
      return;
    }

    const nuevoProducto: Inventario = this.inventarioForm.value;

    if (this.editandoInventario && this.idInventario) {
      this.inventarioService.actualizarProducto(this.idInventario, nuevoProducto).subscribe({
        next: () => {
          this.obtenerInventario();
          this.inventarioForm.reset();
          this.editandoInventario = false;
          this.idInventario = null;
        },
        error: err => {
          console.error('Error al actualizar inventario:', err);
        }
      });
    } else {
      this.inventarioService.agregarProducto(nuevoProducto).subscribe({
        next: () => {
          this.obtenerInventario();
          this.inventarioForm.reset();
        },
        error: err => {
          console.error('Error al crear inventario:', err);
        }
      });
    }
  }

  editarInventario(inventario: Inventario): void {
    this.editandoInventario = true;
    this.inventarioEnEdicion = inventario;
    this.idInventario = inventario._id!;
    this.inventarioForm.setValue({
      nombre: inventario.nombre,
      descripcion: inventario.descripcion || '',
      cantidad: inventario.cantidad,
      unidad: inventario.unidad,
      stockMinimo: inventario.stockMinimo || 0
    });
  }

  eliminarInventario(inventario: Inventario): void {
    if (!inventario._id) return;
    if (!confirm(`¿Eliminar el producto ${inventario.nombre}?`)) return;

    this.inventarioService.eliminarProducto(inventario._id).subscribe(() => {
      this.obtenerInventario();
      if (this.editandoInventario && this.idInventario === inventario._id) {
        this.inventarioForm.reset();
        this.editandoInventario = false;
        this.idInventario = null;
      }
    });
  }


  marcarCamposComoTocados(control: AbstractControl): void {
    if (control instanceof FormGroup || control instanceof FormArray) {
      Object.values(control.controls).forEach(ctrl => this.marcarCamposComoTocados(ctrl));
    } else {
      control.markAsTouched();
    }
  }

  obtenerPedidosDesdeApi(): void {
    this.pedidoService.obtenerPedidos().subscribe(data => this.pedidos = data);
  }
}