// Reqs
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Audit Log Schema definition
const logSchema = new mongoose.Schema({
    logID: { 
        type: Number, 
        unique: true 
    },
    timeStamp: { 
        type: Date, 
        default: Date.now, 
        required: true, 
        index: true 
    },
    user: { 
        type: String, 
        required: true, 
        default: "System" 
    },
    action: { 
        type: String, 
        required: true, 
        enum: ["GET", "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "LOGIN_FAILED", "DB_AUDIT"],
        uppercase: true 
    },
    endpoint: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        required: true 
    },
    // Lightweight summary string for UI display
    description: { 
        type: String, 
        maxlength: 255 
    },
    // Flexible key-value object to store only changed field deltas without huge text chunks
    details: { 
        type: mongoose.Schema.Types.Mixed, 
        default: {} 
    }},
    {
        // Automatically adds createdAt and updatedAt timestamps if needed
        timestamps: false 
    }
);

// Auto-increment plugin for logID
logSchema.plugin(AutoIncrement, { inc_field: "logID" });

// Export
const Log = mongoose.model("logs", logSchema);
module.exports = Log;