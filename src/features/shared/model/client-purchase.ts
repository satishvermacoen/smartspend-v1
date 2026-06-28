import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClientPurchase extends Document {
  client_id: mongoose.Types.ObjectId;
  service_name: string;
  amount: number;
  purchase_date: Date;
  referrer_id?: mongoose.Types.ObjectId;
  commission_amount?: number;
  commission_calculated: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ClientPurchaseSchema = new Schema<IClientPurchase>({
  client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  service_name: { type: String, required: true },
  amount: { type: Number, required: true },
  purchase_date: { type: Date, default: Date.now },
  referrer_id: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  commission_amount: { type: Number, default: 0 },
  commission_calculated: { type: Boolean, default: false }
}, {
  timestamps: true
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.ClientPurchase;
}

const ClientPurchase = mongoose.models.ClientPurchase as Model<IClientPurchase> || 
  mongoose.model<IClientPurchase>('ClientPurchase', ClientPurchaseSchema);

export default ClientPurchase;
