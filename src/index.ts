import express, { Request, Response } from "express";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.listen(PORT, () => {
  // Start the server and listen on the specified port
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});

// Create an API
// GET, POST,PUT,PATCH,DELETE
// http:localhost:8000/customers
app.get("/customers", async (req: Request, res: Response) => {
  const customers = [
    {
      name: "Mike Gonzalez",
      email: "mike.doe@example.com",
      phone: "+1234567890",
    },
    {
      name: "Kai Smith",
      email: "joel.smith@example.com",
      phone: "+0987654321",
    },
  ];

  return res.status(200).json(customers);
});
