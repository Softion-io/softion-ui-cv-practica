import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isSumbiting: boolean = false;
  modaError: any = null;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    const modalError = document.getElementById('modalError');
    if (modalError) {
      this.modaError = new Modal(modalError, {
        keyboard: false,
      });
    }
  }

  onChangeInpEmail(e: any) {
    this.email = e.target.value;
  }

  onChangeInpPass(e: any) {
    this.password = e.target.value;
  }

  submit() {
    this.isSumbiting = true;
    this.firebaseService
      .login({
        email: this.email,
        password: this.password,
      })
      .then((response) => {
        this.isSumbiting = false;
        sessionStorage.setItem('isAdmin', 'isAdmin');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.isSumbiting = false;
        this.errorMessage = 'Error intente más tarde';
        if (error.code === 'auth/invalid-credential') {
          this.errorMessage = 'Email / contraseña incorrectos.';
        }
        this.modaError.show();
      });
  }
}
