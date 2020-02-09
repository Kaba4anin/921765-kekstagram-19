'use strict';

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MAX_COMMENTS = 6;
var QUANTITY_PHOTOS = 25;
var MAX_AVATAR = 6;
var MIN_AVATAR = 1;
var MESSAGES = [
  'Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var NAMES = ['Ник Морган', 'Дэвид Макфарланд', 'Адитья Бхаргава', 'Яков Перельман', 'Дуглас Крокфорд', 'Илья Кантор', 'Скотт Чакон', 'Бен Штрауб'];

var picturesListElement = document.querySelector('.pictures');
var pictureTemplateElement = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

// создаёт массив комментариев
var createComments = function (max) {
  var comments = [];
  for (var i = 0; i < max; i++) {
    comments[i] = {
      avatar: 'img/avatar-' + getRandomNumber(MIN_AVATAR, MAX_AVATAR) + '.svg',
      message: getRandomElement(MESSAGES),
      name: getRandomElement(NAMES)
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
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: createComments(MAX_COMMENTS)
    };
  }
  return photoDescriptions;
};

var renderDescription = function (descriptions) {
  var element = pictureTemplateElement.cloneNode(true);

  element.querySelector('.picture__img').src = descriptions.url;
  element.querySelector('.picture__img').alt = descriptions.description;
  element.querySelector('.picture__likes').textContent = descriptions.likes;
  element.querySelector('.picture__comments').textContent = 6;

  return element;
};

var addElements = function (picturesData) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < picturesData.length; i++) {
    fragment.appendChild(renderDescription(picturesData[i]));
  }
  picturesListElement.appendChild(fragment);
};

addElements(createPhotoDescription(QUANTITY_PHOTOS));
