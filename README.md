# 📋 Household Rota Manager

A simple, elegant web application for managing household chores and responsibilities using Node.js, Express, and MongoDB.

## Features

✨ **Core Features:**
- ✅ Add new rota items with person's name and assigned duties
- ✅ Automatic date synchronization (uses local system time)
- ✅ Select from 14 predefined household chores
- ✅ Random chore generator - click to get a random task
- ✅ View all rota items in a clean, organized format
- ✅ Delete rota items with confirmation
- ✅ Persistent storage in MongoDB
- ✅ Responsive design that works on mobile and desktop

## Available Chores

- Vacuuming
- Mopping
- Dishes
- Laundry
- Dusting
- Bathroom Cleaning
- Kitchen Cleaning
- Trash Removal
- Window Washing
- Yard Work
- Sweeping
- Organizing
- Meal Prep
- Groceries

## Tech Stack

**Frontend:**
- HTML5
- CSS3 (with responsive grid layout and animations)
- Vanilla JavaScript (Fetch API)

**Backend:**
- Node.js
- Express.js
- MongoDB (Atlas)

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v20.10.0 or higher)
- [npm](https://www.npmjs.com/)
- MongoDB Atlas account or local MongoDB server

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd mongodb-workshop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory with your MongoDB connection string:
   ```
   MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority"
   ```
   
   Replace the placeholders with your MongoDB Atlas credentials and cluster details.
   
   **Important:** Never commit your `.env` file to version control. The `.env` file is listed in `.gitignore` and will not be tracked by git.

## Running the Application

**Start the server:**
```bash
npm start
```

The application will be available at your configured local server address.

## Project Structure

```
mongodb-workshop/
├── public/
│   ├── index.html        # Main HTML page
│   ├── style.css         # Styling and responsive design
│   └── script.js         # Frontend logic and API calls
├── server.js             # Express server and API routes
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (local only, not in git)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## API Endpoints

### GET `/api/rota`
Retrieve all rota items.

**Response:**
```json
[
  {
    "_id": "ObjectId",
    "name": "John",
    "duties": ["Dishes", "Laundry"],
    "date": "2026-02-19T10:00:00.000Z",
    "createdAt": "2026-02-19T09:00:00.000Z"
  }
]
```

### POST `/api/rota`
Create a new rota item.

**Request Body:**
```json
{
  "name": "John",
  "duties": ["Dishes", "Laundry"],
  "date": "2026-02-19"
}
```

**Response:**
```json
{
  "_id": "ObjectId",
  "name": "John",
  "duties": ["Dishes", "Laundry"],
  "date": "2026-02-19T00:00:00.000Z",
  "createdAt": "2026-02-19T09:00:00.000Z"
}
```

### GET `/api/random-chore`
Get a random household chore.

**Response:**
```json
{
  "chore": "Vacuuming"
}
```

### DELETE `/api/rota/:id`
Delete a rota item by ID.

**Response:**
```json
{
  "message": "Item deleted successfully"
}
```

## Usage Guide

1. Fill in the person's name in the input field
2. Select duties by checking the relevant chore boxes or use the 🎲 **Random Chore** button
3. Click **"Add to Rota"** to save the item
4. View your rota below—items are sorted by date
5. Click **"Delete"** on any item to remove it from the rota

## Security Notes

- **Never hardcode credentials** in source code
- **Always use environment variables** for sensitive data (API keys, database URIs, passwords)
- **Never commit `.env` files** containing real credentials
- The `.env` file should only exist locally and be protected by `.gitignore`

## Troubleshooting

**Connection Error: "Missing MONGODB_URI"**
- Ensure your `.env` file exists in the root directory
- Check that the `MONGODB_URI` variable is set correctly with valid MongoDB Atlas credentials

**MongoDB Connection Refused**
- Verify your MongoDB Atlas cluster is running
- Check your network access rules in MongoDB Atlas (IP whitelist)
- Confirm your username and password are correct

**Port Already in Use**
- Change the `PORT` variable in `server.js` if port 3000 is occupied

## License

ISC

## Contributing

Feel free to submit issues or pull requests for improvements.
