const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const claimItemSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  userId: {
    type: Number,
    required: [true, "User ID is required"],
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: [true, "Item ID is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  contactNo: {
    type: String,
    required: [true, "Contact Number is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: String,
  status: {
    type: String,
    default: "Pending",
  },
});

const itemSchema = new Schema({
  id: Number,
  category: String,
  itemName: String,
  description: String,
  date: Date,
});

claimItemSchema.plugin(AutoIncrement, { inc_field: "id" });

const ClaimItem = mongoose.model("ClaimItem", claimItemSchema);
const Item = mongoose.model("Item", itemSchema);

module.exports = {
  ClaimItem,
  Item,
};
