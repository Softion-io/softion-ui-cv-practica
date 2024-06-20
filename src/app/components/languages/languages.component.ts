import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.scss',
})
export class LanguagesComponent {
  collectionName: string = 'languages';
  dataForm = {
    name: '',
    nivel: '',
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
      nivel: '',
    };
    this.modalForm.show();
  }

  openModalEdit(item: any) {
    this.idDocument = item.idDocument;
    this.dataForm = {
      name: item.name,
      nivel: item.nivel,
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

  newRegister() { }

  updateRegister() { }

  deleteRegister() { }
}
