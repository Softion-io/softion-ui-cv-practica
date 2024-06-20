import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  collectionName: string = 'home';
  dataForm = {
    title: '',
    description: '',
  };

  idDocument: string = '';
  modalMessage: string = '';
  modalMessages: any = null;
  isAdmin: boolean = false;

  constructor(private firebaseService: FirebaseService) {
    this.isAdmin = !!sessionStorage.getItem('isAdmin');
    this.getData();
  }

  ngOnInit() {
    const modalError = document.getElementById('modalMessages');
    if (modalError) {
      this.modalMessages = new Modal(modalError, {
        keyboard: false,
      });
    }
  }

  getData() {
    this.firebaseService
      .getColletions(this.collectionName)
      .then((response) => {
        if (response.length) {
          this.dataForm.title = response[0].title;
          this.dataForm.description = response[0].description;
          this.idDocument = response[0].idDocument;
        }
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }

  saveRegister() {
    if (this.idDocument) {
      this.updateRegister();
    } else {
      this.newRegister();
    }
  }

  newRegister() {
    this.firebaseService
      .newCollection(this.collectionName, this.dataForm)
      .then((response) => {
        this.modalMessage = 'Se guardó correctamente';
        this.modalMessages.show();
        this.getData();
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }

  updateRegister() {
    this.firebaseService
      .updateColletion(this.collectionName, this.idDocument, this.dataForm)
      .then((response) => {
        this.modalMessage = 'Se actualizó correctamente';
        this.modalMessages.show();
        this.getData();
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }

}
