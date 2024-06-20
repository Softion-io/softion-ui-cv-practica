import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-studies',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './studies.component.html',
  styleUrl: './studies.component.scss',
})
export class StudiesComponent {
  collectionName: string = 'studies';
  dataForm = {
    name: '',
    career: '',
    period: '',
    status: '',
  };
  registerList: any[] = [];

  idDocument: string = '';
  modalMessage: string = '';
  modalMessages: any = null;
  modalForm: any = null;
  modalDelete: any = null;
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
    const modalForm = document.getElementById('modalForm');
    if (modalForm) {
      this.modalForm = new Modal(modalForm, {
        keyboard: false,
      });
    }
    const modalDelete = document.getElementById('modalDelete');
    if (modalDelete) {
      this.modalDelete = new Modal(modalDelete, {
        keyboard: false,
      });
    }
  }

  getData() {
    this.firebaseService
      .getColletions(this.collectionName)
      .then((response) => {
        this.registerList = response;
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }

  openModalNew() {
    this.idDocument = '';
    this.dataForm = {
      name: '',
      career: '',
      period: '',
      status: '',
    };
    this.modalForm.show();
  }

  openModalEdit(item: any) {
    this.idDocument = item.idDocument;
    this.dataForm = {
      name: item.name,
      career: item.career,
      period: item.period,
      status: item.status,
    };
    this.modalForm.show();
  }

  openModalDelete(item: any) {
    this.idDocument = item.idDocument;
    this.modalDelete.show();
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
        this.getData();
        this.modalForm.hide();
        this.modalMessage = 'Se guardó correctamente';
        this.modalMessages.show();
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
        this.getData();
        this.modalForm.hide();
        this.modalMessage = 'Se actualizó correctamente';
        this.modalMessages.show();
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }

  deleteRegister() {
    this.firebaseService
      .deleteColletion(this.collectionName, this.idDocument)
      .then((response) => {
        this.getData();
        this.modalDelete.hide();
        this.modalMessage = 'Se eliminó correctamente';
        this.modalMessages.show();
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }
}
