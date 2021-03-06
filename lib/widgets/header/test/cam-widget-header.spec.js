/* jshint node: true, unused: false */
/* global __dirname: false, describe: false, before: false, it: false, browser: false,
          element: false, expect: false, by: false, protractor: false */
'use strict';
var path = require('path');
var projectRoot = path.resolve(__dirname, '../../../../');
var pkg = require(path.join(projectRoot, 'package.json'));
var pageUrl = 'http://localhost:' + pkg.gruntConfig.connectPort +
              '/lib/widgets/header/test/cam-widget-header.spec.html';

var page = require('./cam-widget-header.page.js');

describe('Header', function() {
  var header;
  describe('With content', function() {
    before(function () {
      browser.get(pageUrl + '#with-content');
      header = page.header('#with-content');
    });

    it('uses the ng-transclude feature', function () {
      expect(header.transcludedText()).to.eventually.eql('Awesome');
    });
  });


  describe('Anonymous', function() {
    before(function () {
      browser.get(pageUrl + '#anonymous');
      header = page.header('#anonymous');
    });

    it('does not show the account dropdown', function () {
      expect(header.account().isPresent()).to.eventually.eql(false);
    });

    it('does not show the link to the current app', function () {
      expect(header.adminLink().isPresent()).to.eventually.eql(false);
    });

    it('shows the links to other apps', function () {
      expect(header.cockpitLink().isPresent()).to.eventually.eql(true);
      expect(header.tasklistLink().isPresent()).to.eventually.eql(true);
    });
  });


  describe('Authenticated', function() {
    before(function () {
      browser.get(pageUrl + '#authenticated');
      header = page.header('#authenticated');
    });

    it('shows the account dropdown', function () {
      expect(header.account().isPresent()).to.eventually.eql(true);
    });

    it('shows the user name', function () {
      expect(header.accountText()).to.eventually.eql('Max Mustermann');
    });

    it('shows the link to admin app', function () {
      expect(header.adminLink().isPresent()).to.eventually.eql(true);
    });

    it('does not show the link to cockpit app because user has not access to it', function () {
      expect(header.cockpitLink().isPresent()).to.eventually.eql(false);
    });

    it('does not show the link to tasklist app because it is the current app', function () {
      expect(header.tasklistLink().isPresent()).to.eventually.eql(false);
    });

    it('does not show a hamburger menu button', function () {
      expect(header.hamburgerButton().isDisplayed()).to.eventually.eql(false);
    });

    it('does not show a small screen warning', function () {
      expect(header.smallScreenWarning().isDisplayed()).to.eventually.eql(false);
    });


    describe('on small devices', function () {
      var originalSize;

      before(function () {
        browser.manage().window().getSize().then(function (size) {
          originalSize = size;
          browser.manage().window().setSize(760, 480);
        });
      });

      after(function () {
        browser.manage().window().setSize(originalSize.width, originalSize.height);
      });

      it('does not show the account dropdown', function () {
        expect(header.account().isDisplayed()).to.eventually.eql(false);
      });

      it('does not show the transcluded content', function () {
        expect(header.transcludedElement().isDisplayed()).to.eventually.eql(false);
      });

      it('does not show the user name', function () {
        expect(header.accountText().isDisplayed()).to.eventually.eql(false);
      });

      it('shows a hamburger menu button', function () {
        expect(header.hamburgerButton().isDisplayed()).to.eventually.eql(true);
      });

      it('shows a small screen warning', function () {
        expect(header.smallScreenWarning().isDisplayed()).to.eventually.eql(true);
      });


      describe('when expanded', function () {
        before(function () {
          header.hamburgerButton().click();
        });

        it('shows the transcluded content', function () {
          expect(header.transcludedElement().isDisplayed()).to.eventually.eql(true);
          expect(header.transcludedText()).to.eventually.eql('Transcluded');
        });

        it('shows the account dropdown', function () {
          expect(header.account().isDisplayed()).to.eventually.eql(true);
        });

        it('shows the user name', function () {
          expect(header.accountText().isDisplayed()).to.eventually.eql(true);
          expect(header.accountText()).to.eventually.eql('Max Mustermann');
        });

        describe('when collapsed back', function () {
          before(function () {
            header.hamburgerButton().click();
          });

          it('does not show the transcluded content', function () {
            expect(header.transcludedElement().isDisplayed()).to.eventually.eql(false);
          });

          it('does not show the account dropdown', function () {
            expect(header.account().isDisplayed()).to.eventually.eql(false);
          });

          it('does not show the user name', function () {
            expect(header.accountText().isDisplayed()).to.eventually.eql(false);
          });

          it('shows a hamburger menu button', function () {
            expect(header.hamburgerButton().isDisplayed()).to.eventually.eql(true);
          });
        });
      });
    });
  });
});
