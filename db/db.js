const mongoose = require('mongoose');
const connectionAddress = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASS}@cluster0.69zau.mongodb.net/${process.env.DB_NAME}?authSource=admin&replicaSet=atlas-k11grf-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;

mongoose.connect(connectionAddress, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = mongoose.Schema({
    user_id: String,
    access_token: String
})

const User = mongoose.model('user', userSchema);

module.exports = User