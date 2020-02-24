'use strict';

(function () {
  var usersPictures = document.querySelectorAll('.picture');
  var bigPictureElement = document.querySelector('.big-picture');

  var addCommentsElements = function (dataComments, element) {
    element.innerHTML = '';
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < dataComments.length; i++) {
      fragment.appendChild(window.gallery.createNewCommentElement(dataComments[i]));
    }
    element.appendChild(fragment);
  };

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
    if (evt.key === window.utils.ESC_KEY) {
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

  addClickHandlers(usersPictures, window.data.photos);
})();
