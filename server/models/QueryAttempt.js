const mongoose = require('mongoose');

const queryAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    query: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        default: false
    },
    resultRowCount: {
        type: Number,
        default: 0
    },
    errorMessage: {
        type: String,
        default: null
    },
    executedAt: {
        type: Date,
        default: Date.now
    }
});

queryAttemptSchema.index({ userId: 1, assignmentId: 1 });

module.exports = mongoose.model('QueryAttempt', queryAttemptSchema);
