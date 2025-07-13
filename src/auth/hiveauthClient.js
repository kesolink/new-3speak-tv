// src/lib/hiveauthClient.js
import HiveAuth from 'hiveauth-wrapper';

const hiveauth = new HiveAuth({
  appName: '3speak',
  authURL: 'https://api.hiveauth.com/',
  chain: 'Hive',
});

export default hiveauth;
