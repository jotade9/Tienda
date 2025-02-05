import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }

  public insertar(coleccion:string, datos:any){
    return this.angularFirestore.collection(coleccion).add(datos);
  }

  public consultar(coleccion:any){
    return this.angularFirestore.collection(coleccion).snapshotChanges();

  }
   // Actualizar una prenda en Firestore
   actualizar(coleccion: string, id: string, objeto: any) {
    return this.angularFirestore.collection(coleccion).doc(id).update(objeto);
  }

  // Eliminar una prenda en Firestore
  borrar(coleccion: string, id: string) {
    return this.angularFirestore.collection(coleccion).doc(id).delete();
  }
}
