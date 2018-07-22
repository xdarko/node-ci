const keys = require('../../config/keys');
const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');

const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
  const sessionData = { passport: { user: user._id.toString() } };
  const session = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  const signature = keygrip.sign('session=' + session);

  return { session, signature };
};