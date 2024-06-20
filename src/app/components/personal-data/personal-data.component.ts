import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.scss',
})
export class PersonalDataComponent {
  collectionName: string = '';
  dataForm = {
    name: '',
    lastName: '',
    birthday: '',
    email: '',
    nationality: '',
    job: '',
    availabilityToTravel: '',
  };

  idDocument: string = '';
  modalMessage: string = '';
  modalMessages: any = null;
  isAdmin: boolean = false;

  constructor(private firebaseService: FirebaseService) {
    this.isAdmin = !!sessionStorage.getItem('isAdmin');
    this.getPersonalData();
  }

  ngOnInit() {
    const modalError = document.getElementById('modalMessages');
    if (modalError) {
      this.modalMessages = new Modal(modalError, {
        keyboard: false,
      });
    }
  }

  getPersonalData() {
    this.firebaseService
      .getColletions(this.collectionName)
      .then((response) => {
        if (response.length) {
          this.dataForm.name = response[0].name;
          this.dataForm.lastName = response[0].lastName;
          this.dataForm.birthday = response[0].birthday;
          this.dataForm.email = response[0].email;
          this.dataForm.nationality = response[0].nationality;
          this.dataForm.job = response[0].job;
          this.dataForm.availabilityToTravel = response[0].availabilityToTravel;
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
        this.getPersonalData();
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
        this.getPersonalData();
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }
}
