"use strict";


var Q = require('bluebird'),
  chai = require('chai'),
  tmp = require('tmp'),
  path = require('path'),
  shell = require('shelljs'),
  Web3 = require('web3');

var expect = chai.expect,
  should = chai.should();


var testUtils = require('./utils');

var source = require('../');



module.exports = {
  beforeEach: function(done) {
    this.inst = source();

    this.inst.start()
      .delay(2000)
      .asCallback(done);
  },
  afterEach: function(done) {
    Q.resolve()
      .then(() => {
        if (this.inst && this.inst.isRunning) {
          return this.inst.stop();
        }
      })
      .delay(2000)
      .asCallback(done);
  },
  'can stop geth': function(done) {
    testUtils.canAttach(this.inst.dataDir).should.be.true;
    
    this.inst.stop()
      .then(() => {
        testUtils.canAttach(this.inst.dataDir).should.be.false;
      })
      .asCallback(done);
  },
  'auto-deetes data folder': function(done) {
    this.inst.stop()
      .then(() => {
        shell.test('-e', path.join(this.inst.dataDir, 'genesis.json')).should.be.false;
      })
      .asCallback(done);
  },
};

