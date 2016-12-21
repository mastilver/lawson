import noSqwal from 'nosqwal-memory';
import lawson from '../../lib/index';

const noSqwalInstance = noSqwal();

export const collection = lawson(noSqwalInstance).defineCollection;
