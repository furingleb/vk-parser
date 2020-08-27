const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/StatMe', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = mongoose.Schema({
    user_id: String,
    access_token: String
})

const User = mongoose.model('user', userSchema);

module.exports = User