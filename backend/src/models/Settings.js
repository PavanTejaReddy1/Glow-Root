const mongoose = require('mongoose');

// Singleton settings document — only ever one record in the collection
const settingsSchema = new mongoose.Schema({
  storeName:          { type: String, default: 'GlowRoot' },
  storeEmail:         { type: String, default: '' },
  storePhone:         { type: String, default: '' },
  storeAddress:       { type: String, default: '' },
  freeShippingAbove:  { type: Number, default: 1999 },
  shippingCharge:     { type: Number, default: 99 },
  taxRate:            { type: Number, default: 18 },
  currency:           { type: String, default: 'INR' },
  instagramUrl:       { type: String, default: '' },
  facebookUrl:        { type: String, default: '' },
  twitterUrl:         { type: String, default: '' },
  pinterestUrl:       { type: String, default: '' },
  heroTagline:        { type: String, default: 'Rooted in Nature. Crafted for Radiance.' },
  heroSubtext:        { type: String, default: 'GlowRoot blends ancient Ayurvedic wisdom with modern formulation science — cold-infused botanicals, traceable to the root, for skin that glows from within.' },
  announcementText:   { type: String, default: 'Free shipping on orders above ₹{freeShippingAbove}' },
  announcementEnabled:{ type: Boolean, default: true },
  heroStat1Value:     { type: String, default: '18+' },
  heroStat1Label:     { type: String, default: 'Botanical Ingredients' },
  heroStat2Value:     { type: String, default: '500' },
  heroStat2Label:     { type: String, default: 'Max Batch Size' },
  heroStat3Value:     { type: String, default: '' },
  heroStat3Label:     { type: String, default: 'Customer Rating' },
  footerTagline:      { type: String, default: 'Small-batch Ayurvedic skincare, formulated from root to skin — where real glow begins.' },
  lowStockThreshold:  { type: Number, default: 10 },
}, {
  timestamps: true,
});

// Ensure only one document ever exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
