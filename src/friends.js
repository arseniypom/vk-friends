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

  async get() {
    return await JSON.parse(this.storage.getItem('friends-list')) || await this.callApi('friends.get', {fields: 'photo_100'});
  }

  set(friends) {
    this.storage.setItem('friends-list', JSON.stringify(friends));
  }

  async display(friends) {
    friends ||= await this.get();
    const friendsList = document.querySelector('[data-role=friends-list]');
    friendsList.innerHTML = FriendsTemplate(friends);
  }

  async add([friend]) {
    const friends = await this.get();
    const newFriends = {
      count: ++friends.count,
      items: [
        friend,
        ...friends.items
      ]
    }
    this.set(newFriends);
    this.display();
  }

  async remove(friendId) {
    const friendsList = await this.get();
    const removedFriend = friendsList.items.filter((friend) => friend.id.toString() === friendId);
    const newFriendsItems = friendsList.items.filter((friend) => friend.id.toString() !== friendId);
    this.set({
      count: --friendsList.count,
      items: newFriendsItems
    });
    this.display();
    return removedFriend;
  }

  #friendCheck(word, chunk) {
    return word.toLowerCase().includes(chunk.toLowerCase())
  }

  async filter(chunk) {
    const friends = await this.get();
    const matchFriends = {};
    matchFriends.items = friends.items.filter(friend => {
      return this.#friendCheck(`${friend.first_name} ${friend.last_name}`, chunk);
    });
    this.display(matchFriends);
  }
}