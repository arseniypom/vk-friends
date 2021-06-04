import Friends from './friends';
import BestFriends from './bestFriends';

export default class FriendsApp {
  constructor() {
    this.appId = process.env.API_ID;
    this.ui = {
      friends: new Friends,
      bestFriends: new BestFriends
    };

    this.onInit();
  }

  onInit() {
    VK.init({
      apiId: this.appId
    });

    this.getFriends();
  }

  auth() {
    return new Promise((resolve, reject) => {
      VK.Auth.login(data => {
        if (data.session) {
          resolve()
        } else {
          reject(new Error('Не удалось авторизоваться'))
        }
      }, 2);
    });
  }

  getFriends() {
    this.auth()
      .then(() => {
        return this.ui.friends.callApi('users.get', {name_case: 'gen'});
      })
      .then(([me]) => this.ui.friends.get(me))
      .then(friends => this.ui.friends.display(friends));
  }
}