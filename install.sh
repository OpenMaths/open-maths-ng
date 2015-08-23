#!/usr/bin/env bash

sudo npm install gulp npm-check-updates tsd typescript -g

sudo ncu -ua
sudo npm install

bower install

tsd install
tsd update --save --overwrite
tsd rebundle

gulp concatVendor compile-tsc compile-tsc-tests