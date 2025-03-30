const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    mobileName: {
        type: String,
        required: [true, 'Mobile name is required']
    },
    username: {
        type: String,
        required: [true, 'Customer name is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Validate 10-digit phone number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    complaintDetails: {
        type: String,
        required: [true, 'Complaint details are required'],
        minlength: [10, 'Complaint details should be at least 10 characters']
    },
    mobileColor: {
        type: String,
        required: [true, 'Mobile color is required']
    },
    serviceDate: {
        type: Date,
        required: [true, 'Service date is required'],
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    updates: [{
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed', 'Cancelled']
        },
        notes: String,
        updatedBy: String
    }],
    serviceImage: {
        type: String // Image URL for service record
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This will maintain createdAt and updatedAt automatically
});

// Indexes for better query performance
serviceSchema.index({ phoneNumber: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ serviceDate: -1 }); // Descending order for most recent first

module.exports = mongoose.model('Service', serviceSchema);