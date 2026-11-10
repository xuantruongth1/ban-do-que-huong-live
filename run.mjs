import{fileURLToPath}from'node:url';import{initialize}from'./initialize.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));initialize(root);await import('./server.mjs');
