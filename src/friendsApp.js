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

    this.auth()
      .then(() => {
        return this.ui.friends.callApi('users.get', {name_case: 'gen'});
      })
      .then(([me]) => {
        const pageHeader = document.querySelector('#header');
        pageHeader.textContent = `Друзья  ${me.first_name} ${me.last_name}`;
        return this.ui.friends.get();
      })
      .then(friends => this.ui.friends.display(friends))
    
    this.ui.bestFriends.display();

    this.addEventListeners();
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

  addEventListeners() {
    const contentDiv = document.querySelector('#content');

    contentDiv.addEventListener('click', async (e) => {
      if (e.target.dataset.role === 'add-to-best-friends') {
        try {
          const res = await this.ui.friends.remove(e.target.dataset.userid);
          this.ui.bestFriends.add(res);
        } catch (error) {
          console.log(error);
        }
      } else if (e.target.dataset.role === 'remove-from-best-friends') {
        try {
          const res = await this.ui.bestFriends.remove(e.target.dataset.userid);
          this.ui.bestFriends.add(res);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
}