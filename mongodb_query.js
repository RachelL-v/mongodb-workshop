const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI environment variable");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB\n');

    // 1. List all databases
    console.log('=== 1. ALL DATABASES ===');
    const adminDb = client.db('admin');
    const databasesList = await adminDb.admin().listDatabases();
    databasesList.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    console.log();

    // 2. List collections in sample_mflix
    console.log('=== 2. COLLECTIONS IN "sample_mflix" ===');
    const mflixDb = client.db('sample_mflix');
    const collections = await mflixDb.listCollections().toArray();
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    console.log();

    // 3. Show 5 documents from sample_mflix.movies
    console.log('=== 3. SAMPLE DOCUMENTS FROM "sample_mflix.movies" ===');
    const moviesCollection = mflixDb.collection('movies');
    const sampleDocs = await moviesCollection.find({}).limit(5).toArray();
    
    console.log(`Found ${sampleDocs.length} documents:\n`);
    sampleDocs.forEach((doc, index) => {
      console.log(`Document ${index + 1}:`);
      console.log(JSON.stringify(doc, null, 2));
      console.log();
    });

    // Describe the collection
    console.log('=== COLLECTION DESCRIPTION ===');
    console.log('The sample_mflix.movies collection contains movie metadata including:');
    console.log('- Title, genre, plot, and cast information');
    console.log('- Release dates and runtimes');
    console.log('- IMDb ratings and viewer votes');
    console.log('- Languages and countries');
    console.log('- Movie posters and production information');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

main();
