/* jshint node: true, unused: false */
/* global __dirname: false, describe: false, before: false, it: false, browser: false,
          element: false, expect: false, by: false, protractor: false */
'use strict';

function Variable(node) {
  this.node = node;
}

Variable.prototype.classes = function () {
  return this.node.getAttribute('class');
};



// Variable.prototype.editingGroup = function() {
//   return this.node.element(by.css('.editing.input-group'));
// };
// Variable.prototype.editingGroupClass = function() {
//   return this.editingGroup().getAttribute('class');
// };



Variable.prototype.setNullBtn = function() {
  return this.node.element(by.css('.set-null'));
};
Variable.prototype.setNonNullBtn = function() {
  return this.node.element(by.css('.null-value'));
};



Variable.prototype.type = function() {
  return this.node.element(by.css('td.col-type'));
};
Variable.prototype.typeSelectElement = function(w00t) {
  return this.type().element(by.css('select'));
};
Variable.prototype.typeSelected = function() {
  return this.typeSelectElement().getAttribute('value');
};
Variable.prototype.typeSelect = function(w00t) {
  this.typeSelectElement().click();
  return this.typeSelectElement().element(by.cssContainingText('option', w00t));
};
Variable.prototype.typeCss = function() {
  return this.typeSelectElement().getAttribute('class');
};



Variable.prototype.name = function() {
  return this.node.element(by.css('td.col-name'));
};
Variable.prototype.nameInput = function() {
  return this.name().element(by.css('input'));
};
Variable.prototype.nameValue = function() {
  return this.nameInput().getAttribute('value');
};
Variable.prototype.nameText = function() {
  return this.name().getText();
};
Variable.prototype.nameCss = function() {
  return this.name().getAttribute('class');
};



Variable.prototype.value = function() {
  return this.node.element(by.css('td.col-value'));
};
Variable.prototype.valueInput = function() {
  return this.value().element(by.css('input'));
};
Variable.prototype.valueModalLink = function() {
  return this.value().element(by.css('a[ng-click="editVariableValue(v)"]'));
};
Variable.prototype.valueValue = function() {
  return this.valueInput().getAttribute('value');
};
Variable.prototype.valueType = function() {
  return this.valueInput().getAttribute('type');
};
Variable.prototype.valueText = function() {
  return this.value().getText();
};
Variable.prototype.valueCss = function() {
  return this.value().getAttribute('class');
};



function Modal(node) {
  this.node = node;
}

Modal.prototype.header = function () {
  return this.node.element(by.css('.modal-header'));
};
Modal.prototype.body = function () {
  return this.node.element(by.css('.modal-body'));
};
Modal.prototype.textareaSerialized = function () {
  return this.body().element(by.css('textarea[ng-model="variable.value"]'));
};
Modal.prototype.objectTypeInput = function () {
  return this.body().element(by.css('[ng-model="variable.valueInfo.objectTypeName"]'));
};
Modal.prototype.serializationTypeInput = function () {
  return this.body().element(by.css('[ng-model="variable.valueInfo.serializationDataFormat"]'));
};
Modal.prototype.footer = function () {
  return this.node.element(by.css('.modal-footer'));
};
Modal.prototype.button = function (text) {
  return this.footer().element(by.cssContainingText('button', text));
};



function Page() { }

Page.prototype.variable = function(identifier, index) {
  var varSelector = identifier + ' [cam-widget-variables-table] tbody tr';
  return new Variable(element.all(by.css(varSelector)).get(index));
};

Page.prototype.modal = function() {
  return new Modal(element(by.css('body > .modal')));
};

Page.prototype.applyButton = function() {
  return element(by.css('form > button'));
};


module.exports = new Page();
