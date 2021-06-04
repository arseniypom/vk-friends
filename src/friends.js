import FriendsTemplate from "./templates/friends.hbs";

export default class Friends {
  constructor() {
    this.storage = window.localStorage;
  }

  callApi(method, params) {
    params.v = '5.76';
  
    return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.response);
        }
      });
    })
  }

  async get(me) {
    const pageHeader = document.querySelector('#header');
    pageHeader.textContent = `Друзья  ${me.first_name} ${me.last_name}`;

    const friends = await this.callApi('friends.get', {fields: 'city, country, photo_100'});
    this.set(friends);
    return friends;
  }

  set(friends) {
    this.storage.setItem('friends-list', JSON.stringify(friends));
  }

  display(friends) {
    const friendsList = document.querySelector('[data-role=friends-list]');
    friendsList.innerHTML = FriendsTemplate(friends);
  }

  add() {

  }

  remove() {

  }

  filter() {
    
  }
}