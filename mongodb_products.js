const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI environment variable");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB\n');

    const db = client.db('sample_store');
    const productsCollection = db.collection('products');

    // 1. Create collection (MongoDB creates it automatically on first insert)
    console.log('=== 1. CREATING/ENSURING "products" COLLECTION ===');
    console.log('Collection will be created on first insert\n');

    // 2. Insert sample documents
    console.log('=== 2. INSERTING SAMPLE PRODUCTS ===');
    const sampleProducts = [
      {
        name: 'Laptop',
        price: 999.99,
        category: 'Electronics',
        quantity: 5,
        inStock: true
      },
      {
        name: 'Wireless Mouse',
        price: 29.99,
        category: 'Electronics',
        quantity: 50,
        inStock: true
      },
      {
        name: 'USB-C Cable',
        price: 12.99,
        category: 'Accessories',
        quantity: 100,
        inStock: true
      },
      {
        name: 'Monitor Stand',
        price: 45.50,
        category: 'Furniture',
        quantity: 0,
        inStock: false
      },
      {
        name: 'Mechanical Keyboard',
        price: 149.99,
        category: 'Electronics',
        quantity: 12,
        inStock: true
      }
    ];

    const insertResult = await productsCollection.insertMany(sampleProducts);
    console.log(`✓ Inserted ${insertResult.insertedCount} documents`);
    console.log(`Inserted IDs: ${Object.values(insertResult.insertedIds).join(', ')}\n`);

    // 3. List the inserted documents
    console.log('=== 3. LISTING ALL INSERTED DOCUMENTS ===\n');
    const allProducts = await productsCollection.find({}).toArray();
    
    allProducts.forEach((product, index) => {
      console.log(`Product ${index + 1}:`);
      console.log(`  ID: ${product._id}`);
      console.log(`  Name: ${product.name}`);
      console.log(`  Price: $${product.price}`);
      console.log(`  Category: ${product.category}`);
      console.log(`  Quantity: ${product.quantity}`);
      console.log(`  In Stock: ${product.inStock}`);
      console.log();
    });

    console.log(`Total products in collection: ${allProducts.length}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

main();
