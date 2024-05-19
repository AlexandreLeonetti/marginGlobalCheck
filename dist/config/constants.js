"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.h2f = exports.h2e = exports.h2d = exports.h2c = exports.h2b = exports.h2a = exports.h2pm = exports.h2am = exports.d1 = exports.h12 = exports.h8 = exports.h4 = exports.h2 = exports.h1 = void 0;
exports.h1 = Array(24).fill(true);
exports.h2 = Array.from({ length: 24 }, (_, index) => index % 2 === 0);
exports.h4 = Array.from({ length: 24 }, (_, index) => index % 4 === 0);
exports.h8 = Array.from({ length: 24 }, (_, index) => index % 8 === 0);
exports.h12 = Array.from({ length: 24 }, (_, index) => index % 12 === 0);
exports.d1 = Array.from({ length: 24 }, (_, index) => index % 24 === 0);
exports.h2am = Array.from({ length: 24 }, (_, index) => index < 12 && index % 2 === 0);
exports.h2pm = Array.from({ length: 24 }, (_, index) => index >= 12 && index % 2 === 0);
exports.h2a = Array.from({ length: 24 }, (_, index) => index === 0 || index === 2);
exports.h2b = Array.from({ length: 24 }, (_, index) => index === 4 || index === 6);
exports.h2c = Array.from({ length: 24 }, (_, index) => index === 8 || index === 10);
exports.h2d = Array.from({ length: 24 }, (_, index) => index === 12 || index === 14);
exports.h2e = Array.from({ length: 24 }, (_, index) => index === 16 || index === 18);
exports.h2f = Array.from({ length: 24 }, (_, index) => index === 20 || index === 22);
