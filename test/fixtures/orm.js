import {Mock as couchbase} from 'couchbase';
import lawson from '../../lib/index';

const cluster = new couchbase.Cluster();

export const bucket = cluster.openBucket();
export const model = lawson(bucket).defineModel;
