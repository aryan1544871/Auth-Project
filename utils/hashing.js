const {hash} = require('bcryptjs');
exports.hashPassword = (value, saltValue) => {
    return hash(value, saltValue);
};