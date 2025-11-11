// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const axios = require('axios'); 
// const fs = require('fs'); 
// const path = require('path'); 

// const User = require('../models/User');
// const Chat = require('../models/Chat');
// const Trip = require('../models/Trip');
// const Booking = require('../models/Booking');

// const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
// // N8N Webhook is now explicitly placeholder, as we use a local endpoint for booking
// const N8N_WEBHOOK_URL = "N8N_WEBHOOK_URL_PLACEHOLDER"; 

// // ===================================
// // DUMMY DATA LOADING & FUNCTIONS
// // ===================================

// const restaurantDataPath = path.join(__dirname, '../data/restaurants.json');
// const hotelDataPath = path.join(__dirname, '../data/hotels.json');
// let RESTAURANTS = [];
// let HOTELS = [];

// try {
//     RESTAURANTS = JSON.parse(fs.readFileSync(restaurantDataPath, 'utf8'));
//     HOTELS = JSON.parse(fs.readFileSync(hotelDataPath, 'utf8'));
// } catch (e) {
//     console.error("Could not load dummy data files. Ensure Backend/data/ exists.", e);
// }


// // FUNCTION: Find available restaurants based on capacity
// const findAvailableRestaurants = (location, guests) => {
//     const locationLower = location.toLowerCase();
    
//     // Check if enough table capacity is available
//     const matched = RESTAURANTS.filter(r => 
//         r.location.toLowerCase().includes(locationLower) && r.capacity >= guests
//     );

//     // Sort by price and take the top 3 results
//     return matched.sort((a, b) => a.price - b.price).slice(0, 3); 
// };

// // FUNCTION: Find available hotels based on rooms
// const findAvailableHotels = (location, guests) => {
//     const locationLower = location.toLowerCase();
    
//     // Check for availability: minimum 1 room per 2 guests
//     const requiredRooms = Math.ceil(guests / 2);
//     const matched = HOTELS.filter(h => 
//         h.location.toLowerCase().includes(locationLower) && h.rooms_available >= requiredRooms
//     );
    
//     return matched.sort((a, b) => a.price_per_night - b.price_per_night).slice(0, 3);
// };


// // DUMMY: Simulates sending a confirmation (logs to console)
// const sendConfirmationSMS = async (userPhone, bookingDetails) => {
//     console.log(`\n--- DUMMY CONFIRMATION SENT ---`);
//     console.log(`TO: ${userPhone}`);
//     console.log(`TYPE: ${bookingDetails.bookingType}`);
//     console.log(`REF: ${bookingDetails.confirmationCode}`);
//     console.log(`-------------------------------\n`);
//     return { success: true };
// };


// // ✅ New centralized function to execute booking/payment/save (self-contained)
// router.post("/execute-booking", async (req, res) => {
//     try {
//         const { userId, bookingType, details, cost, userEmail, userPhone } = req.body;
        
//         // 1. DUMMY PAYMENT CHECK (Simulated success)
//         console.log(`[AGENT] Simulating payment for ${bookingType}. Status: SUCCESS.`);

//         // 2. MOCK 3RD PARTY BOOKING (Generate confirmation)
//         const confirmationCode = `${bookingType.toUpperCase().slice(0, 3)}-${Math.floor(Math.random() * 900000) + 100000}`;
        
//         // 3. SAVE BOOKING HISTORY TO MONGODB
//         const newBooking = new Booking({ 
//             userId, 
//             bookingType, 
//             details, 
//             isPaid: true, 
//             confirmationCode 
//         });
//         await newBooking.save();

//         // 4. SEND CONFIRMATION (DUMMY SMS/EMAIL)
//         await sendConfirmationSMS(userPhone, { bookingType, details, confirmationCode });

//         res.status(200).json({
//             message: `${bookingType} booked successfully! Confirmation sent to your phone.`,
//             confirmationCode
//         });

//     } catch (error) {
//         console.error("Critical Booking Failure:", error);
//         res.status(500).json({ message: "Failed to process booking due to a server error." });
//     }
// });


// // ✅ New unified proposal endpoint
// router.post("/propose-options", (req, res) => {
//     const { type, location, guests } = req.body;
//     let proposals = [];
    
//     if (type === 'restaurant') {
//         proposals = findAvailableRestaurants(location, guests);
        
//         if (proposals.length > 0) {
//             return res.status(200).json({ 
//                 found: true, 
//                 type: 'restaurant',
//                 options: proposals.map(r => ({
//                     id: r.id,
//                     name: r.name,
//                     description: r.description,
//                     price: `₹${r.price} per person`,
//                     details: r 
//                 })) 
//             });
//         }
//     } else if (type === 'hotel') {
//         proposals = findAvailableHotels(location, guests);

//         if (proposals.length > 0) {
//             return res.status(200).json({ 
//                 found: true, 
//                 type: 'hotel',
//                 options: proposals.map(h => ({
//                     id: h.id,
//                     name: h.name,
//                     description: h.description,
//                     price: `₹${h.price_per_night} per night`,
//                     details: h 
//                 }))
//             });
//         }
//     }
    
//     return res.status(200).json({ 
//         found: false, 
//         message: `Sorry, no available ${type}s found in ${location} for ${guests} guests.` 
//     });
// });

// // ===================================
// // 1. AUTHENTICATION (REGISTER & LOGIN)
// // ===================================

// // ✅ User Registration
// router.post("/register", async (req, res) => {
//     try {
//         const { email, password, destinations, ...rest } = req.body;
        
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "This email is already registered. Please login or use a different email." });
//         }
        
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const destinationArray = destinations.split(',').map(item => item.trim()).filter(item => item);
        
//         const newUser = new User({
//             email, password: hashedPassword, destinations: destinationArray, ...rest,
//         });
        
//         await newUser.save();
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ User Login
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
        
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid credentials. Please check your email and password." });
//         }
        
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials. Please check your email and password." });
//         }
        
//         const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        
//         const userProfile = {
//             _id: user._id, name: user.name, email: user.email, phone: user.phone, dob: user.dob, gender: user.gender, destinations: user.destinations, interests: user.interests
//         };
        
//         res.status(200).json({ message: "Login successful", token, user: userProfile });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ===================================
// // 2. CHAT HISTORY (SAVE & LOAD)
// // ===================================

// // ✅ Save Chat History
// router.post("/chats/save", async (req, res) => {
//     try {
//         const { userId, chats } = req.body;
//         await Chat.findOneAndUpdate({ userId }, { chats }, { upsert: true, new: true });
//         res.status(200).json({ message: "Chat history saved successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ Load Chat History
// router.get("/chats/load/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const chatData = await Chat.findOne({ userId });
//         res.status(200).json({ chats: chatData?.chats || [] });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ===================================
// // 3. AGENTIC & TRIP MANAGEMENT
// // ===================================

// // ✅ NOTE: /trigger-booking route is effectively replaced by /execute-booking

// // ✅ New route to save a user's trip plan (Used by the chatbot or other pages)
// router.post("/trips/save", async (req, res) => {
//     try {
//         const payload = req.body;
//         const { userId, destination, startDate, endDate } = payload;
        
//         const newTrip = new Trip({ userId, destination, startDate, endDate });
//         await newTrip.save();
        
//         res.status(201).json({ message: "Trip saved successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ Route for n8n to GET upcoming trips with user info (for Festival Reminders)
// router.get("/get-upcoming-trips", async (req, res) => {
//     try {
//         const today = new Date();
//         const twoWeeksFromNow = new Date();
//         twoWeeksFromNow.setDate(today.getDate() + 14);

//         const trips = await Trip.find({
//             startDate: { $gte: today, $lte: twoWeeksFromNow }
//         }).populate('userId');

//         const data = trips.map(trip => ({
//             userId: trip.userId._id, 
//             userEmail: trip.userId.email,
//             userPhone: trip.userId.phone,
//             destination: trip.destination,
//             startDate: trip.startDate,
//             endDate: trip.endDate,
//         }));

//         res.status(200).json(data);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ Route to save a user's successful booking confirmation (called by n8n after success)
// router.post("/bookings/save", async (req, res) => {
//     try {
//         const { userId, bookingType, details, confirmationCode } = req.body;
//         const newBooking = new Booking({ userId, bookingType, details, confirmationCode });
//         await newBooking.save();
//         res.status(201).json({ message: "Booking saved successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ===================================
// // 4. MOCK BOOKING API ENDPOINTS (FOR N8N)
// // ===================================
// router.get("/mock/festival-search", (req, res) => {
//     const { q } = req.query; 
//     const mockEvents = [
//         { title: "Bali Spirit Festival", date: { when: "During your trip" }, link: "#" },
//         { title: "Ubud Food Festival", date: { when: "Day 3 of Trip" }, link: "#" },
//     ];
    
//     if (q.toLowerCase().includes("bali")) {
//         return res.status(200).json({ events_results: mockEvents });
//     } else if (q.toLowerCase().includes("goa")) {
//         return res.status(200).json({ events_results: [{ title: "Goa Carnival", date: { when: "February 2026" }, link: "#" }] });
//     }
//     return res.status(200).json({ events_results: [] });
// });

// router.post("/mock/hotel-booking", (req, res) => {
//     res.status(200).json({
//         success: true,
//         bookingId: `H-MOCK-${Math.floor(Math.random() * 9000) + 1000}`,
//         message: "Mock hotel booking successful.",
//     });
// });

// router.post("/mock/restaurant-booking", (req, res) => {
//     res.status(200).json({
//         success: true,
//         bookingId: `R-MOCK-${Math.floor(Math.random() * 9000) + 1000}`,
//         message: "Mock restaurant booking successful.",
//     });
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const axios = require('axios'); 
// const fs = require('fs'); 
// const path = require('path'); 

// const User = require('../models/User');
// const Chat = require('../models/Chat');
// const Trip = require('../models/Trip');
// const Booking = require('../models/Booking');

// const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
// // N8N dependency is now completely removed from execution logic
// const N8N_WEBHOOK_URL = "N8N_WEBHOOK_URL_PLACEHOLDER"; 

// // ===================================
// // DUMMY DATA LOADING & FUNCTIONS
// // ===================================

// const restaurantDataPath = path.join(__dirname, '../data/restaurants.json');
// const hotelDataPath = path.join(__dirname, '../data/hotels.json');
// let RESTAURANTS = [];
// let HOTELS = [];

// try {
//     // Ensure you have created the Backend/data folder and placed these two files inside.
//     RESTAURANTS = JSON.parse(fs.readFileSync(restaurantDataPath, 'utf8'));
//     HOTELS = JSON.parse(fs.readFileSync(hotelDataPath, 'utf8'));
// } catch (e) {
//     console.error("Could not load dummy data files. Ensure Backend/data/ exists.", e);
// }


// // FUNCTION: Find available restaurants based on capacity
// const findAvailableRestaurants = (location, guests) => {
//     const locationLower = location.toLowerCase();
    
//     // Check if enough table capacity is available
//     const matched = RESTAURANTS.filter(r => 
//         r.location.toLowerCase().includes(locationLower) && r.capacity >= guests
//     );

//     // Sort by price and take the top 3 results
//     return matched.sort((a, b) => a.price - b.price).slice(0, 3); 
// };

// // FUNCTION: Find available hotels based on rooms
// const findAvailableHotels = (location, guests) => {
//     const locationLower = location.toLowerCase();
    
//     // Check for availability: minimum 1 room per 2 guests
//     const requiredRooms = Math.ceil(guests / 2);
//     const matched = HOTELS.filter(h => 
//         h.location.toLowerCase().includes(locationLower) && h.rooms_available >= requiredRooms
//     );
    
//     return matched.sort((a, b) => h.price_per_night - b.price_per_night).slice(0, 3);
// };


// // DUMMY: Simulates sending a confirmation (logs to console)
// const sendConfirmationSMS = async (userPhone, bookingDetails) => {
//     console.log(`\n--- DUMMY BOOKING CONFIRMED ---`);
//     console.log(`TO: ${userPhone}`);
//     console.log(`TYPE: ${bookingDetails.bookingType}`);
//     console.log(`REF: ${bookingDetails.confirmationCode}`);
//     console.log(`-------------------------------\n`);
//     return { success: true };
// };


// // ✅ New centralized function to execute booking/payment/save (self-contained)
// router.post("/execute-booking", async (req, res) => {
//     try {
//         const { userId, bookingType, details, userPhone } = req.body;
        
//         // 1. DUMMY PAYMENT CHECK (Simulated success)
//         console.log(`[AGENT] Simulating payment for ${bookingType}. Status: SUCCESS.`);

//         // 2. MOCK 3RD PARTY BOOKING (Generate confirmation)
//         const confirmationCode = `${bookingType.toUpperCase().slice(0, 3)}-${Math.floor(Math.random() * 900000) + 100000}`;
        
//         // 3. SAVE BOOKING HISTORY TO MONGODB
//         const newBooking = new Booking({ 
//             userId, 
//             bookingType, 
//             details, 
//             isPaid: true, 
//             confirmationCode 
//         });
//         await newBooking.save();

//         // 4. SEND CONFIRMATION (DUMMY SMS/EMAIL)
//         await sendConfirmationSMS(userPhone, { bookingType, details, confirmationCode });

//         res.status(200).json({
//             message: `${bookingType} booked successfully! Confirmation sent to your phone.`,
//             confirmationCode
//         });

//     } catch (error) {
//         console.error("Critical Booking Failure:", error);
//         res.status(500).json({ message: "Failed to process booking due to a server error." });
//     }
// });


// // ✅ New unified proposal endpoint
// router.post("/propose-options", (req, res) => {
//     const { type, location, guests } = req.body;
//     let proposals = [];
    
//     if (type === 'restaurant') {
//         proposals = findAvailableRestaurants(location, guests);
        
//         if (proposals.length > 0) {
//             return res.status(200).json({ 
//                 found: true, 
//                 type: 'restaurant',
//                 options: proposals.map(r => ({
//                     id: r.id,
//                     name: r.name,
//                     description: r.description,
//                     price: `₹${r.price} per person`,
//                     details: r 
//                 })) 
//             });
//         }
//     } else if (type === 'hotel') {
//         proposals = findAvailableHotels(location, guests);

//         if (proposals.length > 0) {
//             return res.status(200).json({ 
//                 found: true, 
//                 type: 'hotel',
//                 options: proposals.map(h => ({
//                     id: h.id,
//                     name: h.name,
//                     description: h.description,
//                     price: `₹${h.price_per_night} per night`,
//                     details: h 
//                 }))
//             });
//         }
//     }
    
//     return res.status(200).json({ 
//         found: false, 
//         message: `Sorry, no available ${type}s found in ${location} for ${guests} guests.` 
//     });
// });

// // ===================================
// // 1. AUTHENTICATION (REGISTER & LOGIN)
// // ... (existing routes)
// // ===================================

// // ✅ User Registration
// router.post("/register", async (req, res) => {
//     try {
//         const { email, password, destinations, ...rest } = req.body;
        
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "This email is already registered. Please login or use a different email." });
//         }
        
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const destinationArray = destinations.split(',').map(item => item.trim()).filter(item => item);
        
//         const newUser = new User({
//             email, password: hashedPassword, destinations: destinationArray, ...rest,
//         });
        
//         await newUser.save();
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ User Login
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
        
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid credentials. Please check your email and password." });
//         }
        
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials. Please check your email and password." });
//         }
        
//         const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        
//         const userProfile = {
//             _id: user._id, name: user.name, email: user.email, phone: user.phone, dob: user.dob, gender: user.gender, destinations: user.destinations, interests: user.interests
//         };
        
//         res.status(200).json({ message: "Login successful", token, user: userProfile });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ===================================
// // 2. CHAT HISTORY (SAVE & LOAD)
// // ===================================

// // ✅ Save Chat History
// router.post("/chats/save", async (req, res) => {
//     try {
//         const { userId, chats } = req.body;
//         await Chat.findOneAndUpdate({ userId }, { chats }, { upsert: true, new: true });
//         res.status(200).json({ message: "Chat history saved successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ Load Chat History
// router.get("/chats/load/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const chatData = await Chat.findOne({ userId });
//         res.status(200).json({ chats: chatData?.chats || [] });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ===================================
// // 3. AGENTIC & TRIP MANAGEMENT
// // ===================================

// // ✅ New route to save a user's trip plan (Used by the chatbot or other pages)
// router.post("/trips/save", async (req, res) => {
//     try {
//         const { userId, destination, startDate, endDate } = req.body;
//         const newTrip = new Trip({ userId, destination, startDate, endDate });
//         await newTrip.save();
//         res.status(201).json({ message: "Trip saved successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ Route for n8n to GET upcoming trips with user info (for Festival Reminders)
// router.get("/get-upcoming-trips", async (req, res) => {
//     try {
//         const today = new Date();
//         const twoWeeksFromNow = new Date();
//         twoWeeksFromNow.setDate(today.getDate() + 14);

//         const trips = await Trip.find({
//             startDate: { $gte: today, $lte: twoWeeksFromNow }
//         }).populate('userId');

//         const data = trips.map(trip => ({
//             userId: trip.userId._id, 
//             userEmail: trip.userId.email,
//             userPhone: trip.userId.phone,
//             destination: trip.destination,
//             startDate: trip.startDate,
//             endDate: trip.endDate,
//         }));

//         res.status(200).json(data);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ Route to save a user's successful booking confirmation (called by n8n after success)
// router.post("/bookings/save", async (req, res) => {
//     try {
//         const { userId, bookingType, details, confirmationCode } = req.body;
//         const newBooking = new Booking({ userId, bookingType, details, confirmationCode });
//         await newBooking.save();
//         res.status(201).json({ message: "Booking saved successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });


// // ===================================
// // 4. MOCK API ENDPOINTS 
// // ===================================

// router.get("/mock/festival-search", (req, res) => {
//     const { q } = req.query; 
//     const mockEvents = [
//         { title: "Bali Spirit Festival", date: { when: "During your trip" }, link: "#" },
//         { title: "Ubud Food Festival", date: { when: "Day 3 of Trip" }, link: "#" },
//     ];
    
//     if (q.toLowerCase().includes("bali")) {
//         return res.status(200).json({ events_results: mockEvents });
//     } else if (q.toLowerCase().includes("goa")) {
//         return res.status(200).json({ events_results: [{ title: "Goa Carnival", date: { when: "February 2026" }, link: "#" }] });
//     }
//     return res.status(200).json({ events_results: [] });
// });

// router.post("/mock/hotel-booking", (req, res) => {
//     res.status(200).json({
//         success: true,
//         bookingId: `H-MOCK-${Math.floor(Math.random() * 9000) + 1000}`,
//         message: "Mock hotel booking successful.",
//     });
// });

// router.post("/mock/restaurant-booking", (req, res) => {
//     res.status(200).json({
//         success: true,
//         bookingId: `R-MOCK-${Math.floor(Math.random() * 9000) + 1000}`,
//         message: "Mock restaurant booking successful.",
//     });
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); 
const fs = require('fs'); 
const path = require('path'); 
const twilio = require('twilio'); // ✅ Import Twilio SDK

const User = require('../models/User');
const Chat = require('../models/Chat');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

// Load Twilio credentials from process.env
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
const N8N_WEBHOOK_URL = "N8N_WEBHOOK_URL_PLACEHOLDER"; 

// Initialize the Twilio client only if credentials are present
const twilioClient = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) 
    ? new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    : null;

// ===================================
// DUMMY DATA LOADING & FUNCTIONS
// ===================================

const restaurantDataPath = path.join(__dirname, '../data/restaurants.json');
const hotelDataPath = path.join(__dirname, '../data/hotels.json');
let RESTAURANTS = [];
let HOTELS = [];

try {
    RESTAURANTS = JSON.parse(fs.readFileSync(restaurantDataPath, 'utf8'));
    HOTELS = JSON.parse(fs.readFileSync(hotelDataPath, 'utf8'));
} catch (e) {
    console.error("Could not load dummy data files. Ensure Backend/data/ exists.", e);
}


// FUNCTION: Find available restaurants based on capacity (omitted for brevity)
const findAvailableRestaurants = (location, guests) => {
    const locationLower = location.toLowerCase();
    
    // Check if enough table capacity is available
    const matched = RESTAURANTS.filter(r => 
        r.location.toLowerCase().includes(locationLower) && r.capacity >= guests
    );

    // Sort by price and take the top 3 results
    return matched.sort((a, b) => a.price - b.price).slice(0, 3); 
};

// FUNCTION: Find available hotels based on rooms (omitted for brevity)
const findAvailableHotels = (location, guests) => {
    const locationLower = location.toLowerCase();
    
    // Check for availability: minimum 1 room per 2 guests
    const requiredRooms = Math.ceil(guests / 2);
    const matched = HOTELS.filter(h => 
        h.location.toLowerCase().includes(locationLower) && h.rooms_available >= requiredRooms
    );
    
    // Sort by price and take the top 3 results
    return matched.sort((a, b) => h.price_per_night - b.price_per_night).slice(0, 3);
};


// ✅ TWILIO FUNCTION: Sends actual SMS confirmation
const sendConfirmationSMS = async (userPhone, bookingDetails) => {
    const messageBody = `✅ Booking Confirmed for ${bookingDetails.bookingType}! Ref: ${bookingDetails.confirmationCode}. Enjoy your trip!`;

    // 1. Always log to console (for local testing)
    console.log(`\n--- TWILIO ATTEMPT LOG ---`);
    console.log(`TO: ${userPhone}`);
    console.log(`TYPE: ${bookingDetails.bookingType}`);
    console.log(`REF: ${bookingDetails.confirmationCode}`);
    
    // 2. ACTUAL TWILIO API CALL
    if (twilioClient && TWILIO_PHONE_NUMBER) {
        try {
            await twilioClient.messages.create({
                body: messageBody,
                to: userPhone, 
                from: TWILIO_PHONE_NUMBER 
            });
            console.log(`[Twilio Success] SMS request sent successfully.`);
        } catch (e) {
            console.error(`[Twilio ERROR] SMS failed. Check Twilio number/format (+CountryCode). Error: ${e.message}`);
        }
    } else {
        console.warn(`[Twilio WARN] Twilio client not configured. SMS skipped.`);
    }
    console.log(`-------------------------------\n`);
    return { success: true };
};


// ✅ New centralized function to execute booking/payment/save (self-contained)
router.post("/execute-booking", async (req, res) => {
    try {
        const { userId, bookingType, details, userPhone } = req.body;
        
        // 1. DUMMY PAYMENT CHECK (Simulated success)
        console.log(`[AGENT] Simulating payment for ${bookingType}. Status: SUCCESS.`);

        // 2. MOCK 3RD PARTY BOOKING (Generate confirmation)
        const confirmationCode = `${bookingType.toUpperCase().slice(0, 3)}-${Math.floor(Math.random() * 900000) + 100000}`;
        
        // 3. SAVE BOOKING HISTORY TO MONGODB
        const newBooking = new Booking({ 
            userId, 
            bookingType, 
            details, 
            isPaid: true, 
            confirmationCode 
        });
        await newBooking.save();

        // 4. SEND CONFIRMATION (REAL SMS VIA TWILIO)
        await sendConfirmationSMS(userPhone, { bookingType, details, confirmationCode });

        res.status(200).json({
            message: `${bookingType} booked successfully! Confirmation sent to your phone.`,
            confirmationCode
        });

    } catch (error) {
        console.error("Critical Booking Failure:", error);
        res.status(500).json({ message: "Failed to process booking due to a server error." });
    }
});


// ✅ New unified proposal endpoint
router.post("/propose-options", (req, res) => {
    const { type, location, guests } = req.body;
    let proposals = [];
    
    if (type === 'restaurant') {
        proposals = findAvailableRestaurants(location, guests);
        
        if (proposals.length > 0) {
            return res.status(200).json({ 
                found: true, 
                type: 'restaurant',
                options: proposals.map(r => ({
                    id: r.id,
                    name: r.name,
                    description: r.description,
                    price: `₹${r.price} per person`,
                    details: r 
                })) 
            });
        }
    } else if (type === 'hotel') {
        proposals = findAvailableHotels(location, guests);

        if (proposals.length > 0) {
            return res.status(200).json({ 
                found: true, 
                type: 'hotel',
                options: proposals.map(h => ({
                    id: h.id,
                    name: h.name,
                    description: h.description,
                    price: `₹${h.price_per_night} per night`,
                    details: h 
                }))
            });
        }
    }
    
    return res.status(200).json({ 
        found: false, 
        message: `Sorry, no available ${type}s found in ${location} for ${guests} guests.` 
    });
});
// ===================================
// 1. AUTHENTICATION (REGISTER & LOGIN)
// ... (existing routes)
// ===================================

// ✅ User Registration
router.post("/register", async (req, res) => {
    try {
        const { email, password, destinations, ...rest } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered. Please login or use a different email." });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const destinationArray = destinations.split(',').map(item => item.trim()).filter(item => item);
        
        const newUser = new User({
            email, password: hashedPassword, destinations: destinationArray, ...rest,
        });
        
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials. Please check your email and password." });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials. Please check your email and password." });
        }
        
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        
        const userProfile = {
            _id: user._id, name: user.name, email: user.email, phone: user.phone, dob: user.dob, gender: user.gender, destinations: user.destinations, interests: user.interests
        };
        
        res.status(200).json({ message: "Login successful", token, user: userProfile });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ===================================
// 2. CHAT HISTORY (SAVE & LOAD)
// ===================================

// ✅ Save Chat History
router.post("/chats/save", async (req, res) => {
    try {
        const { userId, chats } = req.body;
        await Chat.findOneAndUpdate({ userId }, { chats }, { upsert: true, new: true });
        res.status(200).json({ message: "Chat history saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Load Chat History
router.get("/chats/load/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const chatData = await Chat.findOne({ userId });
        res.status(200).json({ chats: chatData?.chats || [] });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ===================================
// 3. AGENTIC & TRIP MANAGEMENT
// ===================================

// ✅ New route to save a user's trip plan (Used by the chatbot or other pages)
router.post("/trips/save", async (req, res) => {
    try {
        const { userId, destination, startDate, endDate } = req.body;
        const newTrip = new Trip({ userId, destination, startDate, endDate });
        await newTrip.save();
        res.status(201).json({ message: "Trip saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Route for n8n to GET upcoming trips with user info (for Festival Reminders)
router.get("/get-upcoming-trips", async (req, res) => {
    try {
        const today = new Date();
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(today.getDate() + 14);

        const trips = await Trip.find({
            startDate: { $gte: today, $lte: twoWeeksFromNow }
        }).populate('userId');

        const data = trips.map(trip => ({
            userId: trip.userId._id, 
            userEmail: trip.userId.email,
            userPhone: trip.userId.phone,
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
        }));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Route to save a user's successful booking confirmation (called by n8n after success)
router.post("/bookings/save", async (req, res) => {
    try {
        const { userId, bookingType, details, confirmationCode } = req.body;
        const newBooking = new Booking({ userId, bookingType, details, confirmationCode });
        await newBooking.save();
        res.status(201).json({ message: "Booking saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// ===================================
// 4. MOCK API ENDPOINTS 
// ===================================

router.get("/mock/festival-search", (req, res) => {
    const { q } = req.query; 
    const mockEvents = [
        { title: "Bali Spirit Festival", date: { when: "During your trip" }, link: "#" },
        { title: "Ubud Food Festival", date: { when: "Day 3 of Trip" }, link: "#" },
    ];
    
    if (q.toLowerCase().includes("bali")) {
        return res.status(200).json({ events_results: mockEvents });
    } else if (q.toLowerCase().includes("goa")) {
        return res.status(200).json({ events_results: [{ title: "Goa Carnival", date: { when: "February 2026" }, link: "#" }] });
    }
    return res.status(200).json({ events_results: [] });
});

router.post("/mock/hotel-booking", (req, res) => {
    res.status(200).json({
        success: true,
        bookingId: `H-MOCK-${Math.floor(Math.random() * 9000) + 1000}`,
        message: "Mock hotel booking successful.",
    });
});

router.post("/mock/restaurant-booking", (req, res) => {
    res.status(200).json({
        success: true,
        bookingId: `R-MOCK-${Math.floor(Math.random() * 9000) + 1000}`,
        message: "Mock restaurant booking successful.",
    });
});

module.exports = router;
