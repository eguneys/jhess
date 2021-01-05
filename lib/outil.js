"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objCopy = objCopy;
exports.partition = partition;
exports.objMap = objMap;
exports.objForeach = objForeach;
exports.objFilter = objFilter;
exports.groupToMap = groupToMap;

function objCopy(obj) {
  var o2 = {};

  for (var key in obj) {
    o2[key] = obj[key];
  }

  return o2;
}

function partition(list, f) {
  var a = [],
      b = [];
  list.forEach(function (_) {
    return f(_) ? a.push(_) : b.push(_);
  });
  return [a, b];
}

function objMap(obj, f) {
  var res = {};
  Object.keys(obj).forEach(function (key) {
    var u = f(key, obj[key]);
    var _ = Object.keys(u)[0];
    res[_] = u[_];
  });
  return res;
}

function objForeach(obj, f) {
  Object.keys(obj).forEach(function (key) {
    return f(key, obj[key]);
  });
}

function objFilter(obj, f) {
  var res = {};

  for (var key in obj) {
    if (f(key, obj[key])) {
      res[key] = obj[key];
    }
  }

  return res;
}

function groupToMap(list, f) {
  var res = {};
  list.forEach(function (item) {
    var u = f(item);
    var _ = Object.keys(u)[0];

    if (!res[_]) {
      res[_] = [];
    }

    res[_].push(u[_]);
  });
  return res;
}