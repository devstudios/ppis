
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cart: { type: Object, required: true },
    clientName: { type: String, required: true },
    clientMSISDN: { type: String, required: true },
    orderRef: { type: String, required: true },
    amount: { type: Number, required: true }
});

module.exports = mongoose.model('Payment', schema);