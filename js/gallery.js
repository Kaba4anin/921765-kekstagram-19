'use strict';

(function () {
  var picturesListElement = document.querySelector('.pictures');
  var pictureTemplateElement = document.querySelector('#picture')
  .content
  .querySelector('.picture');
  var commentTemplateElement = document.querySelector('.social__comment');

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

  addElements(window.data.photos);

  var createNewCommentElement = function (dataComments) {
    var commentElement = commentTemplateElement.cloneNode(true);

    commentElement.querySelector('.social__picture').src = dataComments.avatar;
    commentElement.querySelector('.social__picture').alt = dataComments.name;
    commentElement.querySelector('.social__text').textContent = dataComments.message;

    return commentElement;
  };

  window.gallery = {
    createNewCommentElement: createNewCommentElement
  };
})();
