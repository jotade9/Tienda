import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Prenda } from '../prenda';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = "";
  prendaEditando: Prenda = {} as Prenda;
  idEditando: string | null = null;
  editando: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido === 'nuevo') {
      this.idEditando = null;
      this.editando = false;
      this.prendaEditando = {} as Prenda; // Clear the form for a new prenda
    } else if (idRecibido != null) {
      this.idEditando = idRecibido;
      this.editando = true;
      this.activatedRoute.queryParams.subscribe(params => {
        this.prendaEditando.nombre = params['nombre'];
        this.prendaEditando.stock = params['stock'];
        this.prendaEditando.precio = params['precio'];
        this.prendaEditando.imagen = params['imagen'];
      });
    } else {
      this.idEditando = null;
      this.editando = false;
    }
  }

  guardar() {
    this.firestoreService.insertar("prendas", this.prendaEditando)
      .then(() => {
        console.log('Prenda añadida correctamente!');
        this.prendaEditando = {} as Prenda;
        this.router.navigate(['/home']);
      }, (error) => {
        console.error(error);
      });
  }

  editar() {
    if (this.idEditando) {
      this.firestoreService.actualizar("prendas", this.idEditando, this.prendaEditando)
        .then(() => {
          console.log('Prenda editada correctamente!');
          this.prendaEditando = {} as Prenda;
          this.idEditando = null;
          this.editando = false;
          this.router.navigate(['/home']);
        }, (error) => {
          console.error(error);
        });
    }
  }

  async eliminar() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (this.idEditando) {
              this.firestoreService.borrar("prendas", this.idEditando)
                .then(() => {
                  console.log('Prenda eliminada correctamente!');
                  this.prendaEditando = {} as Prenda;
                  this.idEditando = null;
                  this.editando = false;
                  this.router.navigate(['/home']);
                }, (error) => {
                  console.error(error);
                });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  volverAtras() {
    this.router.navigate(['/home']);
  }
}
