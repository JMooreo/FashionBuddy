import { Injectable } from '@angular/core';
import { Contest } from '../../models/contest-model';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  contests: any = [
    {
      id: 'contest1',
      createDateTime: '2019-01-01T12:00:00:000Z',
      closeDateTime: '2019-01-01T13:00:00:000Z',
      description: 'going out',
      style: 'casual',
      usersVoted: ['userId1', 'userId2'],
      options: [
        {
          id: '1',
          imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_1',
          votes: 2
        },
        {
          id: '2',
          imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_2',
          votes: 6
        }
      ]
    },
    {
      id: 'contest2',
      createDateTime: '2019-01-01T12:00:00:000Z',
      closeDateTime: '2019-01-01T13:00:00:000Z',
      description: 'going out',
      style: 'casual',
      usersVoted: ['userId1', 'userId2'],
      options: [
        {
          id: '1',
          imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_3',
          votes: 3
        },
        {
          id: '2',
          imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_4',
          votes: 5
        }
      ]
    }
  ];

  constructor() { }

  getAllContests() {
    return this.contests;
    // this.firestore.collection('Contests').snapshotChanges();
  }

}
