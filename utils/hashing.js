const {createHmac} = require('crypto');
const {hash, compare} = require('bcryptjs');
exports.hashPassword = (value, saltValue) => {
    return hash(value, saltValue);
};
exports.comparePassword = (plainPassword, hashedPassword) => {
    return compare(plainPassword, hashedPassword);
};

exports.hmacProcess = (value, secret) => {
    return createHmac('sha256', secret).update(value).digest('hex');
};