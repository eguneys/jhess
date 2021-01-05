"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCode = parseCode;
exports.parseParagraph = parseParagraph;
exports.parseParagraphFull = parseParagraphFull;
exports.parseMdFull = parseMdFull;
exports.parseMd = parseMd;
exports.Text = exports.Code = exports.Ply = exports.Heading = exports.Paragraph = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Paragraph = 1,
    Heading = 2,
    Ply = 3;
exports.Ply = Ply;
exports.Heading = Heading;
exports.Paragraph = Paragraph;
var Code = 1,
    Text = 2;
exports.Text = Text;
exports.Code = Code;

function parseCode(code) {
  var mainLine = /^([a-zA-Z][^\s]*) (.*)/;
  var variationRegex = /^([a-zA-Z][^\s]*) ([a-zA-Z][^\s|^\/]*) (.*)/;
  var match;
  code = code.substring(1, code.length - 1);

  if (match = code.match(variationRegex)) {
    var _match = match,
        _match2 = _slicedToArray(_match, 4),
        _ = _match2[0],
        variation = _match2[1],
        base = _match2[2],
        line = _match2[3];

    return {
      variation: variation,
      base: base,
      line: line
    };
  }

  if (match = code.match(mainLine)) {
    var _match3 = match,
        _match4 = _slicedToArray(_match3, 3),
        _2 = _match4[0],
        _variation = _match4[1],
        _line = _match4[2];

    return {
      variation: _variation,
      line: _line
    };
  }

  return {
    line: code
  };
}

function parseParagraph(para) {
  var codeBeginRegex = /^</,
      codeEndRegex = />$/;
  var cur = Text,
      acc = [];
  var res = [];
  para.split(' ').forEach(function (_) {
    var match;

    if (cur === Text) {
      if (match = _.match(codeBeginRegex)) {
        res.push({
          type: Text,
          content: acc.join(' ') + ' '
        });
        cur = Code;
        acc = [_];

        if (match = _.match(codeEndRegex)) {
          res.push({
            type: Code,
            content: acc.join(' ')
          });
          cur = Text;
          acc = [];
        }
      } else {
        acc.push(_);
      }
    } else if (cur === Code) {
      if (match = _.match(codeEndRegex)) {
        acc.push(_);
        res.push({
          type: Code,
          content: acc.join(' ')
        });
        cur = Text;
        acc = [];
      } else {
        acc.push(_);
      }
    }
  });

  if (acc.length > 0) {
    res.push({
      type: cur,
      content: acc.join(' ')
    });
  }

  return res;
}

function parseParagraphFull(para) {
  return parseParagraph(para).map(function (_) {
    if (_.type === Code) {
      _.content = parseCode(_.content);
    }

    return _;
  });
}

function parseMdFull(md) {
  return parseMd(md).map(function (_) {
    if (_.type === Paragraph) {
      _.content = parseParagraphFull(_.content);
    }

    return _;
  });
}

function parseMd(md) {
  var headingRegex = /^#([^\n]*)/;
  var plyRegex = /^=([^\n]*)/;
  var paragraph = [];
  var res = [];
  var lines = md.split('\n');
  var pos = 0;
  lines.forEach(function (line) {
    if (line === "") {
      if (paragraph.length) {
        var content = paragraph.join('\n');
        res.push({
          type: Paragraph,
          pos: pos,
          content: content
        });
        paragraph = [];
        pos += content.length + 1;
      }

      pos += 1;
      return;
    }

    var match;

    if (match = line.match(plyRegex)) {
      var _content = paragraph.join('\n');

      if (paragraph.length) {
        res.push({
          type: Paragraph,
          pos: pos,
          content: _content
        });
        paragraph = [];
        pos += _content.length + 1;
      }

      _content = match[1];
      res.push({
        type: Ply,
        pos: pos,
        content: _content
      });
      pos += _content.length + 2;
    } else if (match = line.match(headingRegex)) {
      var _content2 = paragraph.join('\n');

      if (paragraph.length) {
        res.push({
          type: Paragraph,
          pos: pos,
          content: _content2
        });
        paragraph = [];
        pos += _content2.length + 1;
      }

      _content2 = match[1];
      res.push({
        type: Heading,
        pos: pos,
        content: _content2
      });
      pos += _content2.length + 2;
    } else {
      paragraph.push(line);
    }
  });

  if (paragraph.length) {
    var content = paragraph.join('\n');
    res.push({
      type: Paragraph,
      pos: pos,
      content: content
    });
    paragraph = [];
    pos += content.length;
  }

  return res;
}