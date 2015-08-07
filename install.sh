#!/usr/bin/env bash
sudo npm install gulp tsd typescript -g

sudo npm install
bower install

tsd install

gulp concatVendor compile-tsc compile-tsc-tests