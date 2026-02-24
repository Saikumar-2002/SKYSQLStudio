const mongoose = require('mongoose');

const tableColumnSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }
}, { _id: false });

const tableSchema = new mongoose.Schema({
    tableName: { type: String, required: true },
    columns: [tableColumnSchema]
}, { _id: false });

const sampleDataRowSchema = new mongoose.Schema({
    tableName: { type: String, required: true },
    rows: { type: [[mongoose.Schema.Types.Mixed]], default: [] }
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    sampleSchema: [tableSchema],
    sampleData: [sampleDataRowSchema],
    expectedQuery: {
        type: String,
        default: ''
    },
    pgSchemaName: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
