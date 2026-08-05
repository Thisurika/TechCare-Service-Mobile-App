const mongoose = require('mongoose');
require('dotenv').config();

const Service = require('../models/Service');
const FAQ = require('../models/FAQ');

const connectDB = require('../config/db');

const services = [
  // Smartphone Services
  {
    name: 'Screen Replacement',
    category: 'smartphone',
    description: 'Cracked or broken screen? We replace screens for all major smartphone brands with OEM-quality parts.',
    estimatedPrice: { min: 2500, max: 8000 },
    estimatedDuration: '1-2 hours',
    icon: 'phone-android',
  },
  {
    name: 'Battery Replacement',
    category: 'smartphone',
    description: 'Is your phone dying too quickly? Get a fresh battery replacement to restore full-day battery life.',
    estimatedPrice: { min: 1500, max: 4000 },
    estimatedDuration: '30-60 minutes',
    icon: 'battery-full',
  },
  {
    name: 'Water Damage Repair',
    category: 'smartphone',
    description: 'Dropped your phone in water? Our technicians can salvage water-damaged devices using advanced drying techniques.',
    estimatedPrice: { min: 3000, max: 7000 },
    estimatedDuration: '1-3 days',
    icon: 'water-drop',
  },
  {
    name: 'Charging Port Repair',
    category: 'smartphone',
    description: 'Phone not charging? We fix or replace faulty charging ports for all smartphone models.',
    estimatedPrice: { min: 1000, max: 3000 },
    estimatedDuration: '1-2 hours',
    icon: 'ev-station',
  },

  // Laptop Services
  {
    name: 'Laptop Screen Replacement',
    category: 'laptop',
    description: 'Broken or flickering laptop screen? We provide LCD/LED screen replacements for all laptop brands.',
    estimatedPrice: { min: 5000, max: 15000 },
    estimatedDuration: '1-2 days',
    icon: 'laptop',
  },
  {
    name: 'Laptop Not Charging',
    category: 'laptop',
    description: 'Laptop not charging or turning on? We diagnose and fix power issues including adapter, battery, and motherboard problems.',
    estimatedPrice: { min: 2000, max: 8000 },
    estimatedDuration: '1-3 days',
    icon: 'power',
  },
  {
    name: 'Hard Drive / SSD Upgrade',
    category: 'laptop',
    description: 'Upgrade your storage to a faster SSD or replace a failing hard drive. Includes data migration.',
    estimatedPrice: { min: 3000, max: 10000 },
    estimatedDuration: '2-4 hours',
    icon: 'storage',
  },
  {
    name: 'Keyboard Replacement',
    category: 'laptop',
    description: 'Keys not working or stuck? We replace laptop keyboards with brand-compatible parts.',
    estimatedPrice: { min: 2000, max: 6000 },
    estimatedDuration: '1-2 hours',
    icon: 'keyboard',
  },

  // Television Services
  {
    name: 'TV Screen Repair',
    category: 'television',
    description: 'Cracked or malfunctioning TV display? We repair or replace LED, OLED, and QLED panels.',
    estimatedPrice: { min: 8000, max: 25000 },
    estimatedDuration: '2-5 days',
    icon: 'tv',
  },
  {
    name: 'No Display / Power Issue',
    category: 'television',
    description: 'TV won\'t turn on or has no display? We diagnose and fix power board and mainboard issues.',
    estimatedPrice: { min: 3000, max: 10000 },
    estimatedDuration: '1-3 days',
    icon: 'power-settings-new',
  },
  {
    name: 'Sound Problem',
    category: 'television',
    description: 'No audio or distorted sound? We repair or replace internal speakers and audio boards.',
    estimatedPrice: { min: 2000, max: 6000 },
    estimatedDuration: '1-2 days',
    icon: 'volume-off',
  },

  // Air Conditioner Services
  {
    name: 'AC General Servicing',
    category: 'air-conditioner',
    description: 'Complete AC service including filter cleaning, gas check, condenser cleaning, and performance testing.',
    estimatedPrice: { min: 1500, max: 3500 },
    estimatedDuration: '1-2 hours',
    icon: 'ac-unit',
  },
  {
    name: 'AC Gas Refill',
    category: 'air-conditioner',
    description: 'AC not cooling? We refill refrigerant gas and check for leaks in the cooling system.',
    estimatedPrice: { min: 2500, max: 5000 },
    estimatedDuration: '1-2 hours',
    icon: 'air',
  },
  {
    name: 'AC Installation / Uninstallation',
    category: 'air-conditioner',
    description: 'Professional installation or removal of split and window AC units with proper fitting.',
    estimatedPrice: { min: 2000, max: 5000 },
    estimatedDuration: '2-4 hours',
    icon: 'build',
  },
  {
    name: 'Compressor Repair',
    category: 'air-conditioner',
    description: 'AC compressor not working? Our certified technicians diagnose and repair compressor issues.',
    estimatedPrice: { min: 5000, max: 12000 },
    estimatedDuration: '1-2 days',
    icon: 'settings',
  },

  // Refrigerator Services
  {
    name: 'Cooling Problem',
    category: 'refrigerator',
    description: 'Fridge not cooling properly? We diagnose thermostat, compressor, and coolant issues.',
    estimatedPrice: { min: 2000, max: 7000 },
    estimatedDuration: '1-2 days',
    icon: 'kitchen',
  },
  {
    name: 'Gas Refilling',
    category: 'refrigerator',
    description: 'Refrigerant gas leakage repair and refilling for optimal cooling performance.',
    estimatedPrice: { min: 2500, max: 5000 },
    estimatedDuration: '2-4 hours',
    icon: 'air',
  },
  {
    name: 'Door Seal Replacement',
    category: 'refrigerator',
    description: 'Worn-out door gasket causing temperature issues? We replace seals for all fridge models.',
    estimatedPrice: { min: 1000, max: 3000 },
    estimatedDuration: '1-2 hours',
    icon: 'door-front',
  },

  // Washing Machine Services
  {
    name: 'Drum Not Spinning',
    category: 'washing-machine',
    description: 'Washing machine drum not rotating? We fix motor, belt, and bearing issues.',
    estimatedPrice: { min: 2500, max: 7000 },
    estimatedDuration: '1-2 days',
    icon: 'local-laundry-service',
  },
  {
    name: 'Water Leaking',
    category: 'washing-machine',
    description: 'Water leaking from your machine? We identify and fix inlet valve, hose, and seal problems.',
    estimatedPrice: { min: 1500, max: 4000 },
    estimatedDuration: '2-4 hours',
    icon: 'water-drop',
  },
  {
    name: 'General Servicing',
    category: 'washing-machine',
    description: 'Complete washing machine servicing including drum cleaning, filter check, and performance testing.',
    estimatedPrice: { min: 1500, max: 3000 },
    estimatedDuration: '1-2 hours',
    icon: 'settings',
  },
];

const faqs = [
  {
    question: 'How do I book a repair service?',
    answer: 'Simply browse our services, select the repair you need, describe the issue, choose pickup or drop-off, and schedule a convenient time. You\'ll receive a booking confirmation immediately.',
    category: 'booking',
    order: 1,
  },
  {
    question: 'What areas do you serve for home pickup?',
    answer: 'We currently offer home pickup service within a 25km radius of our service centers. Enter your address during booking to check availability.',
    category: 'booking',
    order: 2,
  },
  {
    question: 'How long does a typical repair take?',
    answer: 'Repair times vary by device and issue. Simple repairs like screen replacements take 1-2 hours, while complex issues may take 2-5 days. You\'ll see estimated times when booking.',
    category: 'repair',
    order: 1,
  },
  {
    question: 'Do you provide warranty on repairs?',
    answer: 'Yes! All repairs come with a 30-day warranty on parts and labor. If the same issue recurs within the warranty period, we\'ll fix it free of charge.',
    category: 'repair',
    order: 2,
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, credit/debit cards, UPI, and mobile wallets. Payment is collected after the repair is completed to your satisfaction.',
    category: 'payment',
    order: 1,
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking before the repair process begins. Go to My Bookings and tap Cancel. No charges apply for cancellations made before device pickup.',
    category: 'booking',
    order: 3,
  },
  {
    question: 'Are your technicians certified?',
    answer: 'All our technicians are certified professionals with experience in repairing electronic devices and appliances. They undergo regular training on the latest repair techniques.',
    category: 'general',
    order: 1,
  },
  {
    question: 'What if my device cannot be repaired?',
    answer: 'If we determine that your device cannot be repaired, we\'ll inform you immediately and return your device with no repair charges. You\'ll only pay the diagnostic fee if applicable.',
    category: 'repair',
    order: 3,
  },
  {
    question: 'How can I track my repair status?',
    answer: 'You can track your repair in real-time through the My Bookings section. You\'ll also receive push notifications at each stage: Received, Under Repair, Ready, and Completed.',
    category: 'general',
    order: 2,
  },
  {
    question: 'Do you use original parts?',
    answer: 'We use OEM-quality parts for all repairs. For premium devices, genuine manufacturer parts are available at additional cost. Our technician will discuss options with you.',
    category: 'repair',
    order: 4,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Service.deleteMany({});
    await FAQ.deleteMany({});

    console.log('🗑️  Cleared existing services and FAQs');

    // Insert services
    const createdServices = await Service.insertMany(services);
    console.log(`✅ Seeded ${createdServices.length} services`);

    // Insert FAQs
    const createdFAQs = await FAQ.insertMany(faqs);
    console.log(`✅ Seeded ${createdFAQs.length} FAQs`);

    console.log('\n🌱 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
