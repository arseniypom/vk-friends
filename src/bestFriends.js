import BestFriendsTemplate from "./templates/best-friends.hbs";

export default class BestFriends {
  constructor() {
    this.storage = window.localStorage;
  }

  async get() {
    return await JSON.parse(this.storage.getItem('best-friends-list')) || {count: 0, items: []};
  }

  async set(bestFriends) {
    await this.storage.setItem('best-friends-list', JSON.stringify(bestFriends));
  }


  async display(bestFriends) {
    bestFriends ||= await this.get();
    const bestFriendsList = document.querySelector('[data-role=best-friends-list]');
    bestFriendsList.innerHTML = BestFriendsTemplate(bestFriends);
  }

  async add([friend]) {
    const bestFriends = await this.get();
    const newBestFriends = {
      count: ++bestFriends.count,
      items: [
        friend,
        ...bestFriends.items
      ]
    }
    await this.set(newBestFriends);
    this.display();
  }

  async remove(friendId) {
    const bestFriends = await this.get();
    const removedFriend = bestFriends.items.filter((friend) => friend.id.toString() === friendId);
    const newFriendsItems = bestFriends.items.filter((friend) => friend.id.toString() !== friendId);

    const newBestFriends = {
      count: --bestFriends.count,
      items: newFriendsItems
    }

    await this.set(newBestFriends);
    this.display();
    return removedFriend;
  }

  #bestFriendCheck(word, chunk) {
    return word.toLowerCase().includes(chunk.toLowerCase())
  }

  async filter(chunk) {
    const bestFriends = await this.get();
    const matchFriends = {};
    matchFriends.items = bestFriends.items.filter(friend => {
      return this.#bestFriendCheck(`${friend.first_name} ${friend.last_name}`, chunk);
    });
    this.display(matchFriends);
  }
}