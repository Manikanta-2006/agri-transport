const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    crop: {
        type: String,
        required: true
    },
    quantity: {
        type: String, // e.g., "500 kg"
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: String,
        enum: ['Pending', 'Sold', 'In Transit', 'Delivered'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    },
    deliveryAddress: {
        type: String
    }
});

module.exports = mongoose.model('listing', ListingSchema);
