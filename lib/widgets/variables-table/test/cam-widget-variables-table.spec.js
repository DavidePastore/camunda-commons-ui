/* jshint node: true, unused: false */
/* global __dirname: false, xdescribe: false, describe: false, before: false, it: false, browser: false,
          element: false, expect: false, by: false, protractor: false, xit: false,
          describe: false, after: false */
'use strict';
var path = require('path');
var projectRoot = path.resolve(__dirname, '../../../../');
var pkg = require(path.join(projectRoot, 'package.json'));
var pageUrl = 'http://localhost:' + pkg.gruntConfig.connectPort +
              '/lib/widgets/variables-table/test/cam-widget-variables-table.spec.html';

var page = require('./cam-widget-variables-table.page.js');

describe('Variables Table', function() {
  var variable;
  describe('editing', function() {
    before(function () {
      browser.get(pageUrl + '#example-1');
    });

    describe('when empty', function () {
      before(function () {
        variable = page.variable('#example-1', 0);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelectElement().isDisplayed()).to.eventually.eql(true);
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('');
      });

      it('has a value input', function () {
        expect(variable.valueValue()).to.eventually.eql('');
      });

      it('is not valid', function () {
        expect(variable.classes())
          .to.eventually.match(/invalid/);
      });
    });


    describe('validation', function () {
      before(function () {
        // the integer variable
        variable = page.variable('#example-1', 4);
      });


      it('adds the invalid CSS class when value is not of the correct type', function () {
        variable.valueInput().clear();
        variable.valueInput().sendKeys('leet');

        expect(variable.classes())
          .to.eventually.match(/invalid/);
      });

      it('removes the invalid CSS class when value is of the correct type', function () {
        variable.valueInput().clear();
        variable.valueInput().sendKeys('1337');

        expect(variable.classes())
          .not.to.eventually.match(/invalid/);
      });



      it('adds the invalid CSS class when no name is given', function () {
        variable.nameInput().clear();

        expect(variable.nameValue()).to.eventually.eql('');

        expect(variable.classes())
          .to.eventually.match(/invalid/);
      });

      it('removes the invalid CSS class when a name is given', function () {
        variable.nameInput().clear();
        variable.nameInput().sendKeys('integerVar');

        expect(variable.nameValue()).to.eventually.eql('integerVar');

        expect(variable.classes())
          .not.to.eventually.match(/invalid/);
      });
    });


    describe('"null" support', function () {
      before(function () {
        // the empty variable
        variable = page.variable('#example-1', 0);

        variable.typeSelect('String');
        variable.nameInput().sendKeys('aName');
        variable.valueInput().sendKeys('a value');
      });

      it('allows to set a variable value to "null"', function () {
        expect(variable.setNullBtn().isPresent())
          .to.eventually.eql(true);

        expect(variable.setNonNullBtn().isPresent())
          .to.eventually.eql(false);
      });

      it('allows to revert a variable value to its previous value', function () {
        variable.setNullBtn().click();

        expect(variable.setNullBtn().isPresent())
          .to.eventually.eql(false);

        expect(variable.setNonNullBtn().isPresent())
          .to.eventually.eql(true);

        variable.setNonNullBtn().click();
        expect(variable.valueValue()).to.eventually.eql('a value');
      });
    });


    describe('Boolean variable', function () {
      var variable2;
      before(function () {
        variable = page.variable('#example-1', 1);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('Boolean');
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('booleanVar');
      });

      describe('value input', function () {
        it('is a checkbox input', function () {
          expect(variable.valueValue()).to.eventually.eql('on');
          expect(variable.valueType()).to.eventually.eql('checkbox');
        });
      });
    });


    xdescribe('Bytes variable', function () {
      before(function () {
        variable = page.variable('#example-1', 2);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('Bytes');
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('bytesVar');
      });

      it('is always valid', function () {
        expect(variable.classes()).not.to.eventually.match(/invalid/);
      });


      xdescribe('value input', function () {
        it('is disabled', function () {
          expect(variable.value().getAttribute('disabled'))
            .to.eventually.eql('disabled');
        });

        it('shows the object type', function () {
          expect(variable.valueValue()).to.eventually.eql('');
        });
      });
    });


    describe('Date variable', function () {
      before(function () {
        variable = page.variable('#example-1', 2);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('Date');
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('dateVar');
      });

      it('has a value input', function () {
        expect(variable.valueValue()).to.eventually.eql('2015-03-23T13:14:06.340Z');
      });


      describe('default value', function () {
        before(function () {
          variable.typeSelect('String');
          variable.valueInput().clear();
          variable.setNullBtn().click();
          variable.setNonNullBtn().click();
          variable.typeSelect('Date');
        });

        after(function () {
          variable.valueInput().clear().sendKeys('2015-03-23T13:14:06.340Z');
        });

        it('is a valid camunda date', function () {
          expect(variable.classes())
            .not.to.eventually.match(/invalid/);
        });
      });


      xdescribe('value input', function () {
        it('has a datepicker button', function () {
          expect(variable.value().element(by.css('.btn')).isPresent()).to.eventually.eql(true);
        });
      });
    });


    describe('Double variable', function () {
      before(function () {
        variable = page.variable('#example-1', 3);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('Double');
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('doubleVar');
      });

      it('has a value input', function () {
        expect(variable.valueValue()).to.eventually.eql('12.34');
      });
    });


    describe('Integer variable', function () {
      before(function () {
        variable = page.variable('#example-1', 4);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('Integer');
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('integerVar');
      });

      it('has a value input', function () {
        expect(variable.valueValue()).to.eventually.eql('1337');
      });
    });


    describe('Long variable', function () {
      before(function () {
        variable = page.variable('#example-1', 5);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('Long');
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('longVar');
      });

      it('has a value input', function () {
        expect(variable.valueValue()).to.eventually.eql('-100000000');
      });
    });


    describe('Null variable', function () {
      before(function () {
        variable = page.variable('#example-1', 6);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('Null');
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('nullVar');
      });

      it('has no value input', function () {
        expect(variable.valueText()).to.eventually.eql('<null>');
      });
    });


    describe('Object variable', function () {
      before(function () {
        variable = page.variable('#example-1', 7);
      });


      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('Object');
      });


      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('objectVar');
      });


      it('is always valid', function () {
        expect(variable.classes())
            .not.to.eventually.match(/invalid/);
      });


      describe('popup to edit', function () {
        it('can be opened by a link', function () {
          expect(variable.valueModalLink().isDisplayed()).to.eventually.eql(true);
        });


        it('opens when its link is clicked', function () {
          // when
          variable.valueModalLink().click();

          // then
          expect(page.modal().node.isDisplayed()).to.eventually.eql(true);
        });


        it('has a textarea with serialized value of variable', function () {
          var textarea = page.modal().textareaSerialized();

          expect(textarea.isDisplayed()).to.eventually.eql(true);
          expect(textarea.getAttribute('disabled')).to.eventually.eql(null);
        });


        it('has a button to close itself', function () {
          expect(page.modal().button('Close').isDisplayed()).to.eventually.eql(true);
        });


        it('has a button to change the serialized value', function () {
          var changeBtn = page.modal().button('Change');

          expect(changeBtn.isDisplayed()).to.eventually.eql(true);
          expect(changeBtn.getAttribute('disabled')).to.eventually.eql('true');
        });


        it('has an input for the object java class', function () {
          expect(page.modal().objectTypeInput().isDisplayed()).to.eventually.eql(true);
        });


        it('has an input for the serialization data format', function () {
          expect(page.modal().serializationTypeInput().isDisplayed()).to.eventually.eql(true);
        });


        it('can only be saved when something has been changed', function () {
          var changeBtn = page.modal().button('Change');
          var textarea = page.modal().textareaSerialized();

          textarea.getAttribute('value').then(function (original) {
            textarea.sendKeys('modified').then(function () {
              expect(changeBtn.getAttribute('disabled')).to.eventually.eql(null);

              textarea.clear().sendKeys(original).then(function () {
                expect(changeBtn.getAttribute('disabled')).to.eventually.eql('true');
              });
            });
          });
        });


        it('closes when the button is clicked', function () {
          // when
          page.modal().button('Close').click();

          // then
          expect(page.modal().node.isPresent()).to.eventually.eql(false);

          expect(variable.valueModalLink().getText()).to.eventually.eql('org.camunda.bpm.pa.service.CockpitVariable');
        });


        it('can pass the changed variable back', function () {
          variable.valueModalLink().click().then(function () {
            var changeBtn = page.modal().button('Change');

            page.modal().objectTypeInput().clear().sendKeys('papi.papo').then(function () {
              expect(changeBtn.getAttribute('disabled')).to.eventually.eql(null);

              changeBtn.click().then(function () {
                expect(variable.valueModalLink().getText()).to.eventually.eql('papi.papo');
              });
            });
          });
        });
      });
    });


    describe('Short variable', function () {
      before(function () {
        variable = page.variable('#example-1', 8);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('Short');
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('shortVar');
      });

      it('has a value input', function () {
        expect(variable.valueValue()).to.eventually.eql('-32768');
      });
    });


    describe('String variable', function () {
      before(function () {
        variable = page.variable('#example-1', 9);
      });

      it('has a dropdown', function () {
        expect(variable.typeSelected()).to.eventually.eql('String');
      });

      it('has a name input', function () {
        expect(variable.nameValue()).to.eventually.eql('stringVar');
      });

      it('has a value input', function () {
        expect(variable.valueValue()).to.eventually.eql('Some string value');
      });

      it('is valid when empty', function () {
        // when
        variable.value().clear();

        // then
        expect(variable.classes())
            .not.to.eventually.match(/invalid/);
      });
    });
  });


  describe('display', function () {
    before(function () {
      browser.get(pageUrl + '#example-2');
    });


    describe('Boolean', function () {
      var control;
      before(function () {
        variable = page.variable('#example-2', 1);
        control = page.variable('#example-1', 1);
      });

      it('prints "false" or "true"', function () {
        expect(variable.valueText()).to.eventually.eql('true');

        control.value().click().then(function () {
          expect(variable.valueText()).to.eventually.eql('false');
        });
      });
    });


    describe('Bytes', function () {
      before(function () {
        variable = page.variable('#example-2', 2);
      });

      it('prints nothing');
    });


    xdescribe('Null', function () {
      before(function () {
        variable = page.variable('#example-2', 7);
      });

      it('prints nothing');
    });


    xdescribe('Object', function () {
      before(function () {
        variable = page.variable('#example-2', 7);
      });

      it('prints the object Java class', function () {
        expect(variable.valueModalLink().getText())
          .to.eventually.eql('org.camunda.bpm.pa.service.CockpitVariable');
      });



      describe('popup to inspect', function () {
        it('can be opened by a link', function () {
          expect(variable.valueModalLink().isDisplayed()).to.eventually.eql(true);
        });


        it('opens when its link is clicked', function () {
          // when
          variable.valueModalLink().click();

          // then
          expect(page.modal().node.isDisplayed()).to.eventually.eql(true);
        });


        it('has a undeditable textarea with serialized value of variable', function () {
          var textarea = page.modal().textareaSerialized();
          expect(textarea.isDisplayed()).to.eventually.eql(true);
          expect(textarea.getAttribute('disabled')).to.eventually.eql('true');
        });


        it('has a button to close itself', function () {
          expect(page.modal().button('Close').isDisplayed()).to.eventually.eql(true);
        });


        it('does not have a button to change the serialized value', function () {
          expect(page.modal().button('Change').isPresent()).to.eventually.eql(false);
        });


        it('closes when the button is clicked', function () {
          // when
          page.modal().button('Close').click();

          // then
          expect(page.modal().node.isPresent()).to.eventually.eql(false);
        });
      });
    });
  });


  describe('cam-headers attribute', function () {
    var example = element(by.css('#example-2'));

    it('can be used to display the wanted columns');

    it('shows the type, name and value by default');

    it('takes an object (expression) of column names');
  });


  describe('cam-editable attribute', function () {
    var example = element(by.css('#example-3'));

    it('takes an array (expression) of column names who should be editable');
  });
});
