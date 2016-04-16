'use strict';

module.exports = {
  baseUrl: document.location.hostname === 'localhost' ?
    'http://localhost:3000' :
    'https://gym-news.herokuapp.com',
};
