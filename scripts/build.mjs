import {seed} from '../lib/catalog.js';
if(!seed.length)throw Error('Catalog is empty');
console.log(`Built Collei with ${seed.length} entries.`);
