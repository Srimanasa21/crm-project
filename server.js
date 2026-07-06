const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Customer = require("./customer");
const Lead = require("./lead");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const MONGO_URI = process.env.MONGO_URI;

mongoose.set("bufferCommands", false);
mongoose.set("strictQuery", false);

app.use(cors());
app.use(express.json());

const startServer = () => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
};

if (!MONGO_URI) {
  console.error("Missing MONGO_URI. Create a .env file in backend/ with your Atlas connection string.");
  startServer();
} else {
  console.log("Connecting to MongoDB...");
  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
    .then(() => {
      console.log("MongoDB Connected");
      startServer();
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
      startServer();
    });
}

  

app.get("/", (req, res) => {
res.send("CRM Backend Running");
});
app.get("/customers", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not connected yet." });
  }

  const customers = await Customer.find();
  return res.json(customers);
});

app.post("/customers", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database is not connected yet." });
    }

    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();

    return res.json({
      message: "Customer Added Successfully",
      customer: savedCustomer,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database is not connected yet." });
    }

    await Customer.findByIdAndDelete(req.params.id);

    return res.json({
      message: "Customer Deleted Successfully",
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/leads", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not connected yet." });
  }

  const leads = await Lead.find();
  return res.json(leads);
});

app.post("/leads", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database is not connected yet." });
    }

    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();

    return res.json({
      message: "Lead Added Successfully",
      lead: savedLead,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/leads/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database is not connected yet." });
    }

    await Lead.findByIdAndDelete(req.params.id);

    return res.json({
      message: "Lead Deleted Successfully",
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/leads/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database is not connected yet." });
    }

    await Lead.findByIdAndUpdate(req.params.id, req.body);

    return res.json({
      message: "Lead Updated Successfully",
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/leads/:id/convert", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database is not connected yet." });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    const newCustomer = new Customer({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
    });

    const savedCustomer = await newCustomer.save();
    await Lead.findByIdAndUpdate(req.params.id, { status: "Converted" });

    return res.json({
      message: "Lead converted to customer successfully.",
      customer: savedCustomer,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/customers/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database is not connected yet." });
    }

    await Customer.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    return res.json({
      message: "Customer Updated Successfully",
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});
