// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const apiRoutes = require("./routes/api");

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("MongoDB connected successfully"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// app.use("/api", apiRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const apiRoutes = require("./routes/api");
const User = require('./models/User');     // ✅ Import User model
const Chat = require('./models/Chat');     // ✅ Import Chat model
const Trip = require('./models/Trip');     // ✅ Import Trip model
const Booking = require('./models/Booking'); // ✅ Import Booking model

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", apiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));