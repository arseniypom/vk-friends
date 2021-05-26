import './styles/index.css';
import FriendsTemplate from "./templates/friends.hbs";

VK.init({
  apiId: 7863986
});

function auth() {
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

function callApi(method, params) {
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

auth()
  .then(() => {
    return callApi('users.get', {name_case: 'gen'})
  })
  .then(([me]) => {
    const pageHeader = document.querySelector('#headerInfo');
    pageHeader.textContent = `Друзья  ${me.first_name} ${me.last_name}`;

    return callApi('friends.get', {fields: 'city, country, photo_100'})
  })
  .then(friends => {
    const results = document.querySelector('#results');
    results.innerHTML = FriendsTemplate(friends);
});