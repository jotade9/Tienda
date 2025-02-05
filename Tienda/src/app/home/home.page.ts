import { Component } from '@angular/core';
import { Prenda } from '../prenda';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  prendaEditando: Prenda;
  idEditando: string | null = null;
  editando: boolean = false;
  arrayPrendas: any = [{
    id: "",
    data: {} as Prenda
  }];

  constructor( private router: Router ,private firestoreService: FirestoreService) {
    this.prendaEditando = {} as Prenda;
    this.obtenerListaPrendas();
  }

  guardar() {
    this.firestoreService.insertar("prendas", this.prendaEditando)
      .then(() => {
        console.log('Prenda añadida correctamente!');
        this.prendaEditando = {} as Prenda;
      }, (error) => {
        console.error(error);
      });
  }

  obtenerListaPrendas() {
    this.firestoreService.consultar("prendas").subscribe((resultadoConsultaPrendas) => {
      this.arrayPrendas = [];
      resultadoConsultaPrendas.forEach((datosPrenda: any) => {
        this.arrayPrendas.push({
          id: datosPrenda.payload.doc.id,
          data: datosPrenda.payload.doc.data()
        });
      });
    });
  }

  seleccionarPrenda(prenda: any) {
    this.prendaEditando = { ...prenda.data };
    this.idEditando = prenda.id;
    this.editando = true;
    this.router.navigate(['/detalle', this.idEditando]);
  }

  editar() {
    if (this.idEditando) {
      this.firestoreService.actualizar("prendas", this.idEditando, this.prendaEditando)
        .then(() => {
          console.log('Prenda editada correctamente!');
          this.prendaEditando = {} as Prenda;
          this.idEditando = null;
          this.editando = false;
        }, (error) => {
          console.error(error);
        });
    }
  }

  eliminar() {
    if (this.idEditando) {
      this.firestoreService.borrar("prendas", this.idEditando)
        .then(() => {
          console.log('Prenda eliminada correctamente!');
          this.prendaEditando = {} as Prenda;
          this.idEditando = null;
          this.editando = false;
        }, (error) => {
          console.error(error);
        });
    }
  }

  cancelarEdicion() {
    this.prendaEditando = {} as Prenda;
    this.idEditando = null;
    this.editando = false;
  }
  
}
