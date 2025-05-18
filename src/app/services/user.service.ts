import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Auth, deleteUser } from '@angular/fire/auth';
import { setDoc } from '@angular/fire/firestore';

export interface UserProfile {
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async createUser(userId: string, data: UserProfile) {
    await setDoc(doc(this.firestore, 'users', userId), {
      ...data,
      createdAt: new Date()
    });
  }

  async createProgress(userId: string) {
    await setDoc(doc(this.firestore, 'progresses', userId), {
      userId,
      completedLevels: []
    });
  }


  async getProfile(userId: string): Promise<UserProfile | null> {
    const userDocRef = doc(this.firestore, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    return userSnap.exists() ? (userSnap.data() as UserProfile) : null;
  }

  async updateProfile(userId: string, data: Partial<UserProfile>) {
    const userDocRef = doc(this.firestore, 'users', userId);
    return updateDoc(userDocRef, data);
  }

  async deleteProfile(userId: string) {
  if (!userId) throw new Error('Hiányzó userId a profil törléshez!');


  // 1. Törlés Firestore-ból
  await deleteDoc(doc(this.firestore, 'users', userId));
  
  // Csak akkor töröld, ha létezik a progresses dokumentum!
  const progressDocRef = doc(this.firestore, 'progresses', userId);
  const progressSnap = await getDoc(progressDocRef);
  if (progressSnap.exists()) {
    await deleteDoc(progressDocRef);
  }

  // 2. Scores törlés (maradhat)
  const scoresRef = collection(this.firestore, 'scores');
  const q = query(scoresRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map(async docSnap => {
  try {
    await deleteDoc(docSnap.ref);
  } catch (err) {
    console.error('Score törlés hiba:', docSnap.id, err);
  }
});

  
  await Promise.all(deletePromises);

  // 3. Auth törlés (maradhat)
  if (this.auth.currentUser && this.auth.currentUser.uid === userId) {
    await deleteUser(this.auth.currentUser);
  }
}
}