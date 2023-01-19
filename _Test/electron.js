"use strict";

const expect = require("chai").expect;
const execSync = require("child_process").execSync;
const path = require("path");
const glob = require("glob");
const { opts } = require("./_helpers/globals.js");

describe("electron", () => {
  before(() => {
    execSync("grunt clean:electron package:electron --branch=package --mocha=package", opts);
  });

  it("Should build a macOS electron package", () => {
    expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Electron/**/*.app'))).to.be.an('array').to.not.be.empty;
  });

  it("Should build a Windows electron package", () => {
    expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Electron/**/*.exe'))).to.be.an('array').to.not.be.empty;
  });
});
