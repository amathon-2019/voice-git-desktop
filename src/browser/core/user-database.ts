import Dexie from 'dexie';
import { Database } from './database';
import { User } from './models';

interface UserInfo extends User {
}

export class UserDatabase extends Database {
  readonly info!: Dexie.Table<UserInfo, string>;

  constructor() {
    super('User');

    this.conditionalVersion(1, {
      info: 'username, displayName, email, avatarImageUrl, profileUrl',
    });
  }

  async getUser(username: string) {
    return await this.info.get(username);
  }

  async update(user: User) {
    const info = await this.getUser(user.username);

    if (!info) {
      await this.info.add(user);
    } else {
      await this.info.update(user.username, user);
    }
  }
}

export const userDatabase = new UserDatabase();
