export const h1 = Array(24).fill(true);
export const h2 = Array.from({ length: 24 }, (_, index) => index % 2 === 0);
export const h4 = Array.from({ length: 24 }, (_, index) => index % 4 === 0);
export const h8 = Array.from({ length: 24 }, (_, index) => index % 8 === 0);
export const h12 = Array.from({ length: 24 }, (_, index) => index % 12 === 0);
export const d1 = Array.from({ length: 24 }, (_, index) => index % 24 === 0);

export const h2am = Array.from({ length: 24 }, (_, index) => index < 12 && index % 2 === 0);
export const h2pm = Array.from({ length: 24 }, (_, index) => index >= 12 && index % 2 === 0);


export const h2a = Array.from({ length: 24 }, (_, index) => index === 0 || index === 2);
export const h2b = Array.from({ length: 24 }, (_, index) => index === 4 || index === 6);
export const h2c = Array.from({ length: 24 }, (_, index) => index === 8 || index === 10);
export const h2d = Array.from({ length: 24 }, (_, index) => index === 12 || index === 14);
export const h2e = Array.from({ length: 24 }, (_, index) => index === 16 || index === 18);
export const h2f = Array.from({ length: 24 }, (_, index) => index === 20 || index === 22);

