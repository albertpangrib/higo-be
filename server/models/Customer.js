const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    cust_id: {
        type: Number,
        unique: true,
        required: true,
        trim: true,
        index: true
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    age: {
        type: Number,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    annual_income: {
        type: Number,
        required: true,
        minlength: 7,
        trim: true,
    },
    spending_score: {
        type: Number,
        required: true,
        minlength: 16,
        trim: true,
        index: true
    },
    profession: {
        type: String,
        required: true,
        minlength: 16,
        trim: true,
        index: true
    },
    work_experience: {
        type: Number,
        required: true,
        minlength: 16,
        trim: true,
        index: true
    },
    family_size: {
        type: Number,
        required: true,
        minlength: 16,
        trim: true,
        index: true
    }
}, {
    timestamps: true,
    versionKey: 'version'
})

customerSchema.methods.toJSON = function () {
    const customer = this
    const customerObject = customer.toObject()

    delete customerObject.password
    delete customerObject.tokens

    return customerObject
}

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer