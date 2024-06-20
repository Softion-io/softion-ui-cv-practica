import { Injectable } from '@angular/core';
import { getApp } from '@angular/fire/app';
import {
  Auth,
  getAuth,
  getIdToken,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private auth: Auth // !important no eliminar permite el funcionamiento
  ) { }

  async login(userModel: { email: string; password: string }): Promise<any> {
    return await signInWithEmailAndPassword(
      getAuth(),
      userModel.email,
      userModel.password
    );
  }

  async logout(): Promise<any> {
    return await signOut(getAuth());
  }

  async newCollection(collectionName: string, data: any) {
    return await addDoc(collection(getFirestore(), collectionName), data);
  }

  async updateColletion(
    collectionName: string,
    idDocumento: string,
    data: any
  ) {
    const userDocRef = doc(getFirestore(), collectionName, idDocumento);
    return await updateDoc(userDocRef, data);
  }

  async deleteColletion(collectionName: string, idDocumento: string) {
    const userDocRef = doc(getFirestore(), collectionName, idDocumento);
    return await deleteDoc(userDocRef);
  }

  getColletions(collectionName: string) {
    return new Promise<any[]>(async (resolve, reject) => {
      const querySnapshot = await getDocs(
        collection(getFirestore(), collectionName)
      );
      let listResponse: any[] = [];
      querySnapshot.forEach((document: any) => {
        const data: any = document.data();
        listResponse.push({
          ...data,
          idDocument: document.id,
        });
      });
      resolve(listResponse);
    });
  }

  uploadFileBase64(path: string, file: any) {
    return new Promise<any>((resolve, reject) => {
      const firebaseApp = getApp();
      const storage = getStorage(firebaseApp);
      const storageRef = ref(storage, `${path}/${file.name}`);
      const metadata: any = {
        contentType: file.contentType,
      };
      const image = file.image.split(',')[1];
      uploadString(storageRef, image, 'base64', metadata).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      });
    });
  }
}
