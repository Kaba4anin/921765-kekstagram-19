'use strict';

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MAX_COMMENTS = 6;
var QUANTITY_PHOTOS = 25;
var MAX_AVATAR = 6;
var MIN_AVATAR = 1;
var ESC_KEY = 'Escape';
var ENTER_KEY = 'Enter';
var MESSAGES = [
  'Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var NAMES = ['Ник Морган', 'Дэвид Макфарланд', 'Адитья Бхаргава', 'Яков Перельман', 'Дуглас Крокфорд', 'Илья Кантор', 'Скотт Чакон', 'Бен Штрауб'];
var FILTERS_MAP = {
  'chrome': getChromeFilter,
  'sepia': getSepiaFilter,
  'marvin': getMarvinFilter,
  'phobos': getPhobosFilter,
  'heat': getHeatFilter,
};

var picturesListElement = document.querySelector('.pictures');
var pictureTemplateElement = document.querySelector('#picture')
  .content
  .querySelector('.picture');
var commentTemplateElement = document.querySelector('.social__comment');

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

var photos = createPhotoDescription(QUANTITY_PHOTOS);

var renderDescription = function (descriptions) {
  var element = pictureTemplateElement.cloneNode(true);

  element.querySelector('.picture__img').src = descriptions.url;
  element.querySelector('.picture__img').alt = descriptions.description;
  element.querySelector('.picture__likes').textContent = descriptions.likes;
  element.querySelector('.picture__comments').textContent = descriptions.comments.length;

  return element;
};

var addElements = function (picturesData) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < picturesData.length; i++) {
    fragment.appendChild(renderDescription(picturesData[i]));
  }
  picturesListElement.appendChild(fragment);
};

addElements(photos);

var createNewCommentElement = function (dataComments) {
  var commentElement = commentTemplateElement.cloneNode(true);

  commentElement.querySelector('.social__picture').src = dataComments.avatar;
  commentElement.querySelector('.social__picture').alt = dataComments.name;
  commentElement.querySelector('.social__text').textContent = dataComments.message;

  return commentElement;
};

var addCommentsElements = function (dataComments, element) {
  element.innerHTML = '';
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < dataComments.length; i++) {
    fragment.appendChild(createNewCommentElement(dataComments[i]));
  }
  element.appendChild(fragment);
};

var usersPictures = document.querySelectorAll('.picture');
var bigPictureElement = document.querySelector('.big-picture');

var fillBigPictureWithData = function (data) {
  var newBigPictureElement = bigPictureElement.cloneNode(true);

  newBigPictureElement.querySelector('.big-picture__img img').src = data.url;
  newBigPictureElement.querySelector('.likes-count').textContent = data.likes;
  newBigPictureElement.querySelector('.comments-count').textContent = data.comments.length;
  newBigPictureElement.querySelector('.social__caption').textContent = data.description;

  var commentsListElement = newBigPictureElement.querySelector('.social__comments');
  addCommentsElements(data.comments, commentsListElement);

  bigPictureElement.replaceWith(newBigPictureElement);
  newBigPictureElement.classList.remove('hidden');
  bigPictureElement = newBigPictureElement;

  document.querySelector('body').classList.add('modal-open');
  newBigPictureElement.querySelector('.social__comment-count').classList.add('hidden');
  newBigPictureElement.querySelector('.comments-loader').classList.add('hidden');

  var closeBigPictureElement = newBigPictureElement.querySelector('.big-picture__cancel');
  closeBigPictureElement.addEventListener('click', closeBigPictureClickHandler);
  document.addEventListener('keydown', bigPictureEscHandler);
};

var closeBigPicture = function () {
  bigPictureElement.classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  document.removeEventListener('keydown', bigPictureEscHandler);
};

var closeBigPictureClickHandler = function () {
  closeBigPicture();
};

var bigPictureEscHandler = function (evt) {
  if (evt.key === ESC_KEY) {
    closeBigPicture();
  }
};

var addPictureClickHandler = function (userPic, photo) {
  userPic.addEventListener('click', function () {
    fillBigPictureWithData(photo);
  });
};

var addClickHandlers = function (pictures, data) {
  for (var j = 0; j < pictures.length; j++) {
    addPictureClickHandler(pictures[j], data[j]);
  }
};

addClickHandlers(usersPictures, photos);

// загрузка изображения и показ формы редактирования:

var editStartElement = document.querySelector('.img-upload__input');
var editFormElement = document.querySelector('.img-upload__overlay');
var editFormCloseElement = editFormElement.querySelector('.img-upload__cancel');

var editFormEscPressHandler = function (evt) {
  var active = document.activeElement;
  if (hashtagInputElement !== active && commentInputElement !== active && evt.key === ESC_KEY) {
    closeEditForm();
  }
};

var openEditForm = function () {
  editFormElement.classList.remove('hidden');
  document.addEventListener('keydown', editFormEscPressHandler);
  document.querySelector('body').classList.add('modal-open');
  editFormElement.addEventListener('change', editedPhotoElementChangeHandler);
  effectToggleElement.addEventListener('mouseup', toggleMouseUpHandler);
  effectBarElement.classList.add('hidden');
  scaleSmallerElement.addEventListener('click', scaleSmallerClickHandler);
  scaleBiggerElement.addEventListener('click', scaleBiggerClickHandler);
  hashtagInputElement.addEventListener('input', hashtagInputHandler);
};

var closeEditForm = function () {
  editFormElement.classList.add('hidden');
  document.removeEventListener('keydown', editFormEscPressHandler);
  editStartElement.value = '';
  editedPhotoElement.style.filter = '';
  editedPhotoElement.style.transform = '';
  scaleValueElement.value = 100 + '%';
  editedPhotoElement.classList.remove('effects__preview--' + currentFilter);
  document.querySelector('body').classList.remove('modal-open');
  editFormElement.removeEventListener('change', editedPhotoElementChangeHandler);
  effectToggleElement.removeEventListener('mouseup', toggleMouseUpHandler);
  scaleSmallerElement.removeEventListener('click', scaleSmallerClickHandler);
  scaleBiggerElement.removeEventListener('click', scaleBiggerClickHandler);
  hashtagInputElement.removeEventListener('input', hashtagInputHandler);
};

editStartElement.addEventListener('change', function (evt) {
  evt.preventDefault();
  openEditForm();
});

editStartElement.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    openEditForm();
  }
});

editFormCloseElement.addEventListener('click', function () {
  closeEditForm();
});

editFormCloseElement.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    closeEditForm();
  }
});

// Фильтры

var POSITION_OF_TOGGLE = 20;
var MAX_VALUE_CHROME = 1;
var MAX_VALUE_SEPIA = 1;
var MAX_VALUE_PHOBOS = 3;
var MIN_VALUE_HEAT = 1;
var MAX_VALUE_HEAT = 3;

var editedPhotoElement = editFormElement.querySelector('.img-upload__preview img');
var effectBarElement = editFormElement.querySelector('.img-upload__effect-level');
var effectToggleElement = editFormElement.querySelector('.effect-level__pin');
var effectDepthElement = editFormElement.querySelector('.effect-level__depth');
var effectLevelValue = editFormElement.querySelector('.effect-level__value');

var currentFilter;

var editedPhotoElementChangeHandler = function (evt) {
  if (evt.target.matches('input[type="radio"]')) {
    editedPhotoElement.style.filter = '';
    editedPhotoElement.classList.remove('effects__preview--' + currentFilter);
    currentFilter = evt.target.value;
    if (evt.target.matches('input[value="none"]')) {
      effectBarElement.classList.add('hidden');
    } else {
      effectBarElement.classList.remove('hidden');
      editedPhotoElement.classList.add('effects__preview--' + currentFilter);
      effectToggleElement.style.left = 100 + '%';
      effectDepthElement.style.width = 100 + '%';
      effectLevelValue.value = 100 + '%';
    }
  }
};

var getChromeFilter = function (value) {
  var chromeLevel = value * MAX_VALUE_CHROME / 100;
  return 'grayscale(' + chromeLevel + ')';
};

var getSepiaFilter = function (value) {
  var sepiaLevel = value * MAX_VALUE_SEPIA / 100;
  return 'sepia(' + sepiaLevel + ')';
};

var getMarvinFilter = function (value) {
  return 'invert(' + value + '%)';
};

var getPhobosFilter = function (value) {
  var phobosLevel = value * MAX_VALUE_PHOBOS / 100;
  return 'blur(' + phobosLevel + 'px)';
};

var getHeatFilter = function (value) {
  var heatLevel = MIN_VALUE_HEAT + (value * (MAX_VALUE_HEAT - MIN_VALUE_HEAT) / 100);
  return 'brightness(' + heatLevel + ')';
};

var toggleMouseUpHandler = function () {
  effectToggleElement.style.left = POSITION_OF_TOGGLE + '%';
  effectDepthElement.style.width = POSITION_OF_TOGGLE + '%';
  editedPhotoElement.style.filter = FILTERS_MAP[currentFilter](POSITION_OF_TOGGLE);
  effectLevelValue.value = POSITION_OF_TOGGLE;
};

// масштабирование

var SCALE_STEP = 25;
var SCALE_VALUE_MIN = 25;
var SCALE_VALUE_MAX = 100;

var scaleSmallerElement = editFormElement.querySelector('.scale__control--smaller');
var scaleBiggerElement = editFormElement.querySelector('.scale__control--bigger');
var scaleValueElement = editFormElement.querySelector('.scale__control--value');


var getScaleValue = function () {
  return parseInt(scaleValueElement.value, 10);
};

var getScaleValueInRange = function (value) {
  return Math.min(SCALE_VALUE_MAX, Math.max(SCALE_VALUE_MIN, value));
};

var scaleSmallerClickHandler = function () {
  var currentScaleValue = getScaleValue();
  var newScaleValue = getScaleValueInRange(currentScaleValue - SCALE_STEP);
  scaleValueElement.value = newScaleValue + '%';
  editedPhotoElement.style.transform = 'scale(' + (newScaleValue / 100) + ')';
};

var scaleBiggerClickHandler = function () {
  var currentScaleValue = getScaleValue();
  var newScaleValue = getScaleValueInRange(currentScaleValue + SCALE_STEP);
  scaleValueElement.value = newScaleValue + '%';
  editedPhotoElement.style.transform = 'scale(' + (newScaleValue / 100) + ')';
};

// валидация

var MIN_HASHTAG_LENGTH = 2;
var MAX_HASHTAG_LENGTH = 20;
var MAX_HASHTAG_NUMBER = 5;

var hashtagInputElement = editFormElement.querySelector('.text__hashtags');
var commentInputElement = editFormElement.querySelector('.text__description');

var isUniqueArray = function (array) {
  var unique = {};

  for (var i = 0; i < array.length; i++) {
    var current = array[i];
    if (unique[current]) {
      return false;
    }
    unique[current] = true;
  }
  return true;
};

var isContainSymbols = function (word) {
  return word.match(/^#[a-zA-Z0-9а-яА-Я]+$/);
};

var getInvalidityMessage = function (array) {
  var message = '';

  if (array.length > MAX_HASHTAG_NUMBER) {
    message = 'Должно быть не более ' + MAX_HASHTAG_NUMBER + ' хэш-тегов';
    return message;
  }
  if (!isUniqueArray(array)) {
    message = 'Хэш-теги не должны повторяться (хэш-теги нечувствительны к регистру)';
    return message;
  }

  for (var i = 0; i < array.length; i++) {
    if (array[i].length === 1 && array[i] === '#') {
      message = 'Хэш-тег не может состоять только из решётки';
      return message;
    } else if (!isContainSymbols(array[i])) {
      message = 'Хэш-тег ' + array[i] + ' должен начинаться с символа решетки и состоять только из букв и цифр';
      return message;
    } else if (array[i].length < MIN_HASHTAG_LENGTH) {
      message = 'Хэш-тег ' + array[i] + ' должен состоять минимум из ' + MIN_HASHTAG_LENGTH + ' символов';
      return message;
    } else if (array[i].length > MAX_HASHTAG_LENGTH) {
      message = 'Хэш-тег должен состоять максимум из ' + MAX_HASHTAG_LENGTH + ' символов';
      return message;
    }
  }
  return message;
};

var hashtagInputHandler = function (evt) {
  var hashtags = hashtagInputElement.value.toLowerCase().split(' ');
  evt.target.setCustomValidity(getInvalidityMessage(hashtags));
};
