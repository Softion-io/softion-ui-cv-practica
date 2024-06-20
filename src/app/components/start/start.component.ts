import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {
  collectionNameFiles: string = 'files';
  collectionNamePersonal: string = 'personalData';
  selectedMenu: number = 0;
  menuList: any[] = [
    {
      label: 'Inicio',
      path: '/home',
      active: true,
    },
    {
      label: 'Datos personales',
      path: '/personal-data',
      active: false,
    },
  ];

  name: string = '';
  position: string = '';

  modalMessage: string = '';
  modalMessages: any = null;

  idPhoto: string = '';
  urlPhoto: string = '';
  idCv: string = '';
  urlCv: string = '';

  isAdmin: boolean = false;

  showButtonLogin: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private firebaseService: FirebaseService
  ) {
    this.isAdmin = !!sessionStorage.getItem('isAdmin');
    const path = this.location.path();
    this.selectedMenu = this.menuList.findIndex((item) => item.path === path);
    this.getFiles();
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

  getFiles() {
    this.firebaseService
      .getColletions(this.collectionNameFiles)
      .then((response) => {
        console.log('_* files: ', response);
        if (response.length) {
          const findedPhoto = response.find((item) => item.type === 'photo');
          if (findedPhoto) {
            this.idPhoto = findedPhoto.idDocument;
            this.urlPhoto = findedPhoto.url;
          } else {
            this.idPhoto = '';
            this.urlPhoto = '';
          }
          const findedCv = response.find((item) => item.type === 'cv');
          if (findedCv) {
            this.idCv = findedCv.idDocument;
            this.urlCv = findedCv.url;
          } else {
            this.idCv = '';
            this.urlCv = '';
          }
        }
      });
  }

  getPersonalData() {
    this.firebaseService
      .getColletions(this.collectionNamePersonal)
      .then((response) => {
        if (response.length) {
          this.name = `${response[0].name} ${response[0].lastName}`;
          this.position = response[0].job;
        }
      });
  }

  redirectTo(index: number): void {
    this.selectedMenu = index;
    this.router.navigate([this.menuList[index].path]);
  }

  onUploadPhoto() {
    const inputFilePhoto: any = document.getElementById('inputFilePhoto');
    inputFilePhoto.click();
  }

  onUploadCV() {
    const inputFileCV: any = document.getElementById('inputFileCV');
    inputFileCV.click();
  }

  async changeUploadPhoto() {
    const inputFilePhoto: any = document.getElementById('inputFilePhoto');
    if (inputFilePhoto?.files?.length) {
      const file = inputFilePhoto.files[0];
      const imageB64 = await this.fileToB64(file);
      const fileWithB64 = {
        name: file.name,
        contentType: file.type,
        image: imageB64,
      };
      this.firebaseService
        .uploadFileBase64('files', fileWithB64)
        .then((response) => {
          if (this.idPhoto) {
            this.updateRegister(this.idPhoto, response, 'photo');
          } else {
            this.newRegister(response, 'photo');
          }
        })
        .catch((error) => {
          this.modalMessage = 'Error, intente más tarde!';
          this.modalMessages.show();
        });
    }
  }

  async changeUploadCV() {
    const inputFileCV: any = document.getElementById('inputFileCV');
    if (inputFileCV?.files?.length) {
      const file = inputFileCV.files[0];
      const imageB64 = await this.fileToB64(file);
      const fileWithB64 = {
        name: file.name,
        contentType: file.type,
        image: imageB64,
      };
      this.firebaseService
        .uploadFileBase64('files', fileWithB64)
        .then((response) => {
          if (this.idCv) {
            this.updateRegister(this.idCv, response, 'cv');
          } else {
            this.newRegister(response, 'cv');
          }
        })
        .catch((error) => {
          this.modalMessage = 'Error, intente más tarde!';
          this.modalMessages.show();
        });
    }
  }

  newRegister(url: string, type: 'photo' | 'cv') {
    this.firebaseService
      .newCollection(this.collectionNameFiles, { type, url })
      .then((response) => {
        this.modalMessage = 'Se guardó correctamente';
        this.modalMessages.show();
        this.getFiles();
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }

  updateRegister(idDocument: string, url: string, type: 'photo' | 'cv') {
    this.firebaseService
      .updateColletion(this.collectionNameFiles, idDocument, { type, url })
      .then((response) => {
        this.modalMessage = 'Se actualizó correctamente';
        this.modalMessages.show();
        this.getFiles();
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }

  deleteRegister() {
    this.firebaseService
      .deleteColletion(this.collectionNameFiles, this.idCv)
      .then((response) => {
        this.getFiles();
        this.modalMessage = 'Se eliminó correctamente';
        this.modalMessages.show();
      })
      .catch((error) => {
        this.modalMessage = 'Error, intente más tarde!';
        this.modalMessages.show();
      });
  }

  donwloadCV() {
    const link = window.document.createElement('a');
    link.target = '_blank';
    link.href = this.urlCv;
    link.download = `CV_${this.name.toUpperCase().split(' ').join('_')}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  fileToB64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  dblClickShowLogin() {
    this.showButtonLogin = true;
    setTimeout(() => {
      this.showButtonLogin = false;
    }, 3000);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    sessionStorage.clear();
    location.reload();
  }
}
