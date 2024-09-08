import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: false
});

export default elasticClient;