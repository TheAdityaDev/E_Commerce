const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); 
const mongoose = require("mongoose");
const dataInitializeService = require("../service/dataInitialize.service");
require("dotenv").config();

// If the network DNS blocks SRV lookups (common on VPN/office networks),
// pointing Node's resolver at public DNS can unblock `mongodb+srv://` URIs.
// This only helps if outbound DNS (53) to these servers is allowed.
try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (_) {
  // ignore if not supported in this environment
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 10000, // 10s
    });
    dataInitializeService.initializeAdminUser();
  } catch (error) {
    process.exit(1);
  }
};

module.exports = connectDB;
