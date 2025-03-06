import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Prenda } from '../prenda';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

@Component({
  standalone: false,
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
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
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
  imagenSelec: string = "";

  async seleccionarImagen() {
    // Comprobar si la aplicaicion tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1, // Permitir sólo 1 imagen
            outputType: 1 // 1 = Base64
          }).then(
            (results) => { // En la variable results se tienen las imagenes sellecionadas
            if(results.length > 0) { // Si el usuario ha elegido alguina imagen
              // EN LA VARIABLE imagen Selec QUEDA ALMACENADA LA IMAGEN SELECCIONADA
              this.imagenSelec = "data:image/jpeg;base64,"+results[0];
              console.log("Imagen que se ha sleccionado (en Base64): " + this.imagenSelec);

            }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      }
    );
  }
  async subirImagen(){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    // Mensaje de finalizacion de subida de la imagen
    const toast = await this.toastController.create({
      message: ' Image was updated succeefully',
      duration: 3000
    });

    // Carpeta del Storage donde se almacenará la imagen
    let nombreCarpeta = "imagenes";

    // Mostrar el mensaje de espera
    loading.present();

    // Asignar el nombre de la imagen en función de la hora actual para
    // evitar duplicidades de nombres
    let nombreImagen = `${new Date().getTime()}`;
    // Llamar al metóda que sube la iamgen al Storage
    this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec)
    .then(snapshot => {
      snapshot.ref.getDownloadURL()
      .then(downloadURL => {
        // EN LA VARIABLE downloadURL SE OBTIENE LA DIRECCION URL DE LA IAMGEN
        console.log("downloadURL:" + downloadURL);
        // this.document.data.imagenURL = downloadURL;
        // Mostrar el mensaje de finalizacion de la subida
        toast.present();
        // Ocultar mensaje de espera
        loading.dismiss();
      })
    })
  }
  
  async eliminarArchivo(fileURL:string){
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });
    this.firestoreService.eliminarArchivoPorUrl(fileURL)
    .then(() => {
      toast.present();
    }, (err) => {
      console.log(err);
    });
  }
}
