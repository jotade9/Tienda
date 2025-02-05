import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = "";
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    // Se almacena en una variable el id que se ha recibido desde la pagina anterior
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if(idRecibido != null){
      this.id = idRecibido;

    }else{
      this.id = "";
    }
  }

}
