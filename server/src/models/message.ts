import { Schema, model, type InferSchemaType } from 'mongoose';

/**
 * A contact submission as stored. Alongside the message itself we keep the
 * delivery outcome, so a message whose email failed can still be found and
 * answered by hand rather than being lost.
 */
const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, index: true },
    message: { type: String, required: true, maxlength: 5000 },

    /** Whether the notification email went out for this submission. */
    delivered: { type: Boolean, default: false, index: true },
    deliveryError: { type: String, default: null },

    /** Request metadata, useful when triaging a burst of spam. */
    ipHash: { type: String, default: null },
    userAgent: { type: String, default: null, maxlength: 500 },
  },
  { timestamps: true, versionKey: false },
);

/** Newest-first listing is the only read pattern this collection has. */
messageSchema.index({ createdAt: -1 });

export type MessageDocument = InferSchemaType<typeof messageSchema>;

export const Message = model('Message', messageSchema);
