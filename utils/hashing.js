const {hash, compare} = require('bcryptjs');
exports.hashPassword = (value, saltValue) => {
    return hash(value, saltValue);
};
exports.comparePassword = (plainPassword, hashedPassword) => {
    return compare(plainPassword, hashedPassword);
};