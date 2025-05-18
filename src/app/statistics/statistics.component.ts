import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, startAfter, getDocs, doc, getDoc } from '@angular/fire/firestore';import { collectionData } from 'rxfire/firestore';
import {DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  levels = [
    { id: 1, name: '1. pálya' },
    { id: 2, name: '2. pálya' },
    { id: 3, name: '3. pálya' },
    { id: 4, name: '4. pálya' },
    { id: 5, name: '5. pálya' },
  ];
  selectedLevelId = this.levels[0].id;
  leaderboard: any[] = [];
  type: 'top10' | 'recent' | 'mine' | 'bestByUser' = 'top10';
  pageSize = 10;
  currentUserId = ''; // Töltsd ki AuthService-ből!
  
  constructor(private firestore: Firestore, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.uid ?? '';
      this.loadLeaderboard();
    });
  }

  setType(type: 'top10' | 'recent' | 'mine' | 'bestByUser') {
    this.type = type;
    this.loadLeaderboard();
  }

  onLevelChange(value: string) {
    this.selectedLevelId = Number(value);
    this.loadLeaderboard();
  }

  async loadLeaderboard() {
  const scoresRef = collection(this.firestore, 'scores');
  let q: any = null;

  if (this.type === 'top10') {
    q = query(
      scoresRef,
      where('levelId', '==', this.selectedLevelId),
      orderBy('time', 'asc'),
      limit(this.pageSize)
    );
  } else if (this.type === 'recent') {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    q = query(
      scoresRef,
      where('levelId', '==', this.selectedLevelId),
      where('date', '>=', lastWeek),
      orderBy('date', 'desc'),
      limit(this.pageSize)
    );
  } else if (this.type === 'mine') {
    q = query(
      scoresRef,
      where('levelId', '==', this.selectedLevelId),
      where('userId', '==', this.currentUserId),
      orderBy('time', 'asc'),
      limit(this.pageSize)
    );
  } else if (this.type === 'bestByUser') {
    q = query(
      scoresRef,
      where('levelId', '==', this.selectedLevelId),
      orderBy('time', 'asc')
    );
  }

  if (!q) {
    this.leaderboard = [];
    return;
  }

  const snapshot = await getDocs(q);
  let scores = snapshot.docs.map(doc => doc.data());

  // 4. Legjobb mindenkitől: csak a legjobb időt tartjuk meg minden usertől
  if (this.type === 'bestByUser') {
      scores = Object.values(
        scores.reduce((acc: { [key: string]: any }, curr: any) => {
          if (!acc[curr['userId']] || acc[curr['userId']].time > curr.time) {
            acc[curr['userId']] = curr;
          }
          return acc;
        }, {})
      ).slice(0, this.pageSize);
    }

  // Felhasználónevek lekérése
  this.leaderboard = await Promise.all(scores.map(async (score: any) => {
  let userName = 'Ismeretlen';
  if (score['userId']) {
    const userDoc = await getDoc(doc(this.firestore, 'users', score['userId']));
    if (userDoc.exists()) {
      userName = userDoc.data()['username'] || 'Ismeretlen';
    }
  }
  return { ...score, userName };
}));
}
}