const mongoose = require('mongoose');

const maintenanceWindowSchema = new mongoose.Schema(
  {
    space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    reason: { type: String, default: '', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

maintenanceWindowSchema.index({ space: 1, startDateTime: 1, endDateTime: 1 });

module.exports = mongoose.model('MaintenanceWindow', maintenanceWindowSchema);
