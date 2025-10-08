const bcrypt = require('bcryptjs');

module.exports.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

module.exports.comparePassword = async function(password, hash) {
  return await bcrypt.compare(password, hash);
};
