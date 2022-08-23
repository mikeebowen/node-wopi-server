import 'dotenv/config';
import WopiServer from './app/WopiServer';

const wopiServer = new WopiServer();

wopiServer.start();
