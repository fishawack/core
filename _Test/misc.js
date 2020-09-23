'use strict';

const fs = require('fs');
const expect = require('chai').expect;

describe('misc', () => {
    it('Dev project variable should be null', () => {
        expect(require('../_Tasks/helpers/dev.js')).to.be.null;
    });
});
