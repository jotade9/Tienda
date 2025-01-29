import { Component } from '@angular/core';
import { Prenda } from '../prenda';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  prendaEditando: Prenda;
  arrayPrendas: any = [{
    id: "",
    data: {} as Prenda
  }];

  constructor(private firestoreService: FirestoreService) {
    // Crear una prenda vacía al empezar
    this.prendaEditando = {} as Prenda;
    this.obtenerListaPrendas();
  }

  guardar() {
    this.firestoreService.insertar("prendas", this.prendaEditando)
      .then(() => {
        console.log('Prenda añadida correctamente!');
        // Limpiar el contenido de la prenda que se estaba editando
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
}
