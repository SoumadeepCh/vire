/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/hamming-distance";
exports.ids = ["vendor-chunks/hamming-distance"];
exports.modules = {

/***/ "(rsc)/./node_modules/hamming-distance/index.js":
/*!************************************************!*\
  !*** ./node_modules/hamming-distance/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nvar assert = __webpack_require__(/*! assert */ \"assert\");\n\nmodule.exports = compare;\n\nfunction compare(a, b) {\n  a = hexToBinary(a)\n  b = hexToBinary(b)\n  assert.equal(a.length, b.length, 'Argument must have equal lengths.');\n  return hammingDistance(a, b);\n}\n\nvar lookup = {\n  '0': '0000',\n  '1': '0001',\n  '2': '0010',\n  '3': '0011',\n  '4': '0100',\n  '5': '0101',\n  '6': '0110',\n  '7': '0111',\n  '8': '1000',\n  '9': '1001',\n  'a': '1010',\n  'b': '1011',\n  'c': '1100',\n  'd': '1101',\n  'e': '1110',\n  'f': '1111',\n  'A': '1010',\n  'B': '1011',\n  'C': '1100',\n  'D': '1101',\n  'E': '1110',\n  'F': '1111'\n};\n\nfunction hexToBinary(s) {\n  if (Buffer.isBuffer(s)) s = s.toString('hex');\n  s = s.replace(/^0x/, '');\n  assert(/^[0-9a-fA-F]+$/.test(s));\n  var ret = '';\n  for (var i = 0; i < s.length; i++) ret += lookup[s[i]];\n  return ret;\n}\n\nfunction hammingDistance(a, b) {\n  a = hexToBinary(a);\n  b = hexToBinary(b);\n  var count = 0;\n  for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) count++;\n  return count;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvaGFtbWluZy1kaXN0YW5jZS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLHNCQUFROztBQUU3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsY0FBYztBQUNoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGNBQWM7QUFDaEM7QUFDQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxTT1VNQURFRVBcXERvY3VtZW50c1xcR2l0SHViXFx2aXJlXFxub2RlX21vZHVsZXNcXGhhbW1pbmctZGlzdGFuY2VcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBhcmU7XG5cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICBhID0gaGV4VG9CaW5hcnkoYSlcbiAgYiA9IGhleFRvQmluYXJ5KGIpXG4gIGFzc2VydC5lcXVhbChhLmxlbmd0aCwgYi5sZW5ndGgsICdBcmd1bWVudCBtdXN0IGhhdmUgZXF1YWwgbGVuZ3Rocy4nKTtcbiAgcmV0dXJuIGhhbW1pbmdEaXN0YW5jZShhLCBiKTtcbn1cblxudmFyIGxvb2t1cCA9IHtcbiAgJzAnOiAnMDAwMCcsXG4gICcxJzogJzAwMDEnLFxuICAnMic6ICcwMDEwJyxcbiAgJzMnOiAnMDAxMScsXG4gICc0JzogJzAxMDAnLFxuICAnNSc6ICcwMTAxJyxcbiAgJzYnOiAnMDExMCcsXG4gICc3JzogJzAxMTEnLFxuICAnOCc6ICcxMDAwJyxcbiAgJzknOiAnMTAwMScsXG4gICdhJzogJzEwMTAnLFxuICAnYic6ICcxMDExJyxcbiAgJ2MnOiAnMTEwMCcsXG4gICdkJzogJzExMDEnLFxuICAnZSc6ICcxMTEwJyxcbiAgJ2YnOiAnMTExMScsXG4gICdBJzogJzEwMTAnLFxuICAnQic6ICcxMDExJyxcbiAgJ0MnOiAnMTEwMCcsXG4gICdEJzogJzExMDEnLFxuICAnRSc6ICcxMTEwJyxcbiAgJ0YnOiAnMTExMSdcbn07XG5cbmZ1bmN0aW9uIGhleFRvQmluYXJ5KHMpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzKSkgcyA9IHMudG9TdHJpbmcoJ2hleCcpO1xuICBzID0gcy5yZXBsYWNlKC9eMHgvLCAnJyk7XG4gIGFzc2VydCgvXlswLTlhLWZBLUZdKyQvLnRlc3QocykpO1xuICB2YXIgcmV0ID0gJyc7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykgcmV0ICs9IGxvb2t1cFtzW2ldXTtcbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gaGFtbWluZ0Rpc3RhbmNlKGEsIGIpIHtcbiAgYSA9IGhleFRvQmluYXJ5KGEpO1xuICBiID0gaGV4VG9CaW5hcnkoYik7XG4gIHZhciBjb3VudCA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykgaWYgKGFbaV0gIT09IGJbaV0pIGNvdW50Kys7XG4gIHJldHVybiBjb3VudDtcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/hamming-distance/index.js\n");

/***/ })

};
;