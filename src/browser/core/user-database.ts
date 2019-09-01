import Dexie from 'dexie';
import { User } from '../../core/user';
import { Database } from './database';

interface UserInfo extends User {
  id: number;
  userId: number;
}

export class UserDatabase extends Database {
  readonly info!: Dexie.Table<UserInfo, number>;

  constructor() {
    super('User');

    this.conditionalVersion(1, {
      info: 'id, userId, username, displayName, email, avatarImageUrl, profileUrl',
    });
  }

  async getUser() {
    return await this.info.get(1);
  }

  async update(userId: number, user: User) {
    const info = await this.getUser();

    if (!info) {
      await this.info.add({ id: 1, userId, ...user });
    } else {
      await this.info.update(1, { userId, ...user });
    }
  }
}

export const userDatabase = new UserDatabase();
