'use strict';

(function () {
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var MIN_COMMENTS = 1;
  var MAX_COMMENTS = 6;
  var QUANTITY_PHOTOS = 25;
  var MAX_AVATAR = 6;
  var MIN_AVATAR = 1;
  var MESSAGES = [
    'Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var NAMES = ['Ник Морган', 'Дэвид Макфарланд', 'Адитья Бхаргава', 'Яков Перельман', 'Дуглас Крокфорд', 'Илья Кантор', 'Скотт Чакон', 'Бен Штрауб'];

  // создаёт массив комментариев
  var createComments = function (max) {
    var comments = [];
    for (var i = 0; i < max; i++) {
      comments[i] = {
        avatar: 'img/avatar-' + window.utils.getRandomNumber(MIN_AVATAR, MAX_AVATAR) + '.svg',
        message: window.utils.getRandomElement(MESSAGES),
        name: window.utils.getRandomElement(NAMES)
      };
    }
    return comments;
  };

  // создаёт массив из 25 объектов с описанием фото
  var createPhotoDescription = function (number) {
    var photoDescriptions = [];
    for (var i = 0; i < number; i++) {
      photoDescriptions[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        description: 'Описание фотографии',
        likes: window.utils.getRandomNumber(MIN_LIKES, MAX_LIKES),
        comments: createComments(window.utils.getRandomNumber(MIN_COMMENTS, MAX_COMMENTS))
      };
    }
    return photoDescriptions;
  };

  var photos = createPhotoDescription(QUANTITY_PHOTOS);

  window.data = {
    photos: photos
  };
})();
