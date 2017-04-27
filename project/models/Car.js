const mongoose = require('mongoose');

let CarSchema = mongoose.Schema({
    make: {type: String, required: true},
    model: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    body: {type: String},
    fuel: {type: String},
    price: {type: String},
    mileage: {type: String},
    registration: {type: String},
    information: {type: String}
});

const Car = mongoose.model('Car', CarSchema);

module.exports = Car;
