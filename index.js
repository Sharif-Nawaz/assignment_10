const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
// হোস্টিং ফ্রেন্ডলি করার জন্য ডাইনামিক পোর্ট সেট করা হলো
const port = process.env.PORT || 3000;

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// MongoDB Connection URI
// =======================
// সুরক্ষার জন্য .env ফাইল থেকে DB_URI রিড করার ব্যাকআপ রাখা হলো
const uri = process.env.DB_URI || "mongodb+srv://Missionscic:R9fxqtEKX7zyRGWE@cluster0.myrxxpi.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

// =======================
// Mongo Client Setup
// =======================
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// =======================
// Main Function
// =======================
async function run() {
  try {
    // ডাটাবেজ কানেকশন শুরু
    await client.connect();
    console.log("✅ MongoDB Connected Successfully");

    // =======================
    // Database Collections
    // =======================
    const database = client.db("pet_service");
    const petServices = database.collection("services");
    const orderCollections = database.collection("orders");

    // ==================================================
    // CREATE SERVICE (POST)
    // ==================================================
    app.post("/services", async (req, res) => {
      try {
        const data = req.body;
        data.createDate = new Date();
        const result = await petServices.insertOne(data);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).send({ error: "Failed to create service" });
      }
    });

    // ==================================================
    // GET ALL SERVICES + CATEGORY FILTER
    // ==================================================
    app.get("/services", async (req, res) => {
      try {
        const { category } = req.query;
        const query = {};
        if (category) {
          query.category = category;
        }
        const result = await petServices.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).send({ error: "Failed to fetch services" });
      }
    });

    // ==================================================
    // GET SINGLE SERVICE (With Valid ID Check)
    // ==================================================
    app.get("/services/:id", async (req, res) => {
      try {
        const id = req.params.id;
        
        // ইনভ্যালিড আইডি দিয়ে সার্ভার ক্র্যাশ করা আটকানোর জন্য চেক
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid Object ID format" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await petServices.findOne(query);
        
        if (!result) {
          return res.status(404).send({ error: "Service not found" });
        }
        res.send(result);
      } catch (error) {
        console.error("Error fetching single service:", error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    // ==================================================
    // GET USER SERVICES BY EMAIL
    // ==================================================
    app.get("/my-services", async (req, res) => {
      try {
        const { email } = req.query;
        if (!email) {
          return res.status(400).send({ error: "Email query parameter is required" });
        }
        const query = { email };
        const result = await petServices.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching user services:", error);
        res.status(500).send({ error: "Failed to fetch user services" });
      }
    });

    // ==================================================
    // UPDATE SERVICE (With Valid ID Check)
    // ==================================================
    app.put("/services/:id", async (req, res) => {
      try {
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid Object ID format" });
        }

        const updatedData = req.body;
        const query = { _id: new ObjectId(id) };

        const updateDoc = {
          $set: {
            name: updatedData.name,
            category: updatedData.category,
            price: updatedData.price,
            location: updatedData.location,
            pickupDate: updatedData.pickupDate,
            imageUrl: updatedData.imageUrl,
            description: updatedData.description,
            email: updatedData.email,
            updatedAt: new Date(),
          },
        };

        const result = await petServices.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).send({ error: "Failed to update service" });
      }
    });

    // ==================================================
    // DELETE SERVICE (With Valid ID Check)
    // ==================================================
    app.delete("/services/:id", async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid Object ID format" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await petServices.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).send({ error: "Failed to delete service" });
      }
    });

    // ==================================================
    // CREATE ORDER
    // ==================================================
    app.post("/orders", async (req, res) => {
      try {
        const data = req.body;
        console.log("Incoming Order Data:", data);
        const result = await orderCollections.insertOne(data);
        res.status(201).send(result); // ফ্রন্টঅ্যান্ডেরinsertedId কন্ডিশন সাকসেস করতে রেসপন্স ব্যাক করা হলো
      } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send({ error: "Failed to create order" });
      }
    });

    // ==================================================
    // GET ALL ORDERS
    // ==================================================
    app.get("/orders", async (req, res) => {
      try {
        const result = await orderCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send({ error: "Failed to fetch orders" });
      }
    });

    // MongoDB Ping
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB ping successful");

  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
}

// রান ফাংশন এক্সিকিউট করা হচ্ছে
run().catch(console.dir);

// =======================
// Root Route
// =======================
app.get("/", (req, res) => {
  res.send("Hello, Developer 🚀 Server is running perfectly.");
});

// =======================
// Start Server
// =======================
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});