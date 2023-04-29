const fetch = require('node-fetch');

async function api(x) {
  respon = await fetch('https://www.npmjs.com/package/node-fetch');
  res = await respon.text();
  return res
}


module.exports = { api }