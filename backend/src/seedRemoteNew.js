const fs = require('fs');
const readline = require('readline');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const rawUrl = process.env.MONGODB_URL;
if (!rawUrl) {
  console.error("MONGODB_URL is missing in .env file!");
  process.exit(1);
}

// URL-encode any '@' in password to satisfy strict URI parser
// Matches 'mongodb+srv://user:pass@host...' where pass might contain '@'
// The password is the part between the first ':' (after mongodb+srv://) and the last '@' before host
let connectionUrl = rawUrl;
const urlParts = rawUrl.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.*)@(.*)$/);
if (urlParts) {
  const scheme = urlParts[1];
  const username = urlParts[2];
  const password = urlParts[3];
  const rest = urlParts[4];
  const encodedPassword = encodeURIComponent(password);
  connectionUrl = `${scheme}${username}:${encodedPassword}@${rest}`;
}

const productSchema = mongoose.Schema({
  _id: String,
  name: String,
  category: String,
  cost: Number,
  rating: Number,
  image: String
}, {
  timestamps: false
});

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: { type: String },
  walletMoney: Number,
  address: String
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema, 'products');
const User = mongoose.model('User', userSchema, 'users');

async function seed() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(connectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected successfully!");

    // Clear existing products and users
    console.log("Clearing existing products and users...");
    await Product.deleteMany({});
    await User.deleteMany({});

    // Import products
    console.log("Seeding new products...");
    const productsFile = path.join(__dirname, '../data/new_products.json');
    const newProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    
    await Product.insertMany(newProducts);
    console.log(`Inserted ${newProducts.length} new products!`);

    // Import default users
    console.log("Seeding default users...");
    const usersFile = path.join(__dirname, '../data/export_qkart_users.json');
    const userStream = readline.createInterface({
      input: fs.createReadStream(usersFile),
      crlfDelay: Infinity
    });

    const users = [];
    for await (const line of userStream) {
      if (!line.trim()) continue;
      const data = JSON.parse(line);
      users.push({
        _id: new mongoose.Types.ObjectId(data._id.$oid),
        name: data.name,
        email: data.email,
        password: data.password,
        walletMoney: data.walletMoney,
        address: data.address,
        createdAt: data.createdAt ? new Date(data.createdAt.$date) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt.$date) : new Date()
      });
    }
    await User.insertMany(users);
    console.log(`Inserted ${users.length} users!`);

    console.log("Database seeded successfully with the new products and users!");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
