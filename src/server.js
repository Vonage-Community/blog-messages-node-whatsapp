require("dotenv").config();
const express = require("express");
const { Vonage } = require("@vonage/server-sdk");
const { WhatsAppText } = require("@vonage/messages");
const { verifySignature } = require("@vonage/jwt");

const app = express();
const vonage = new Vonage(
  {
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
    applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKey: process.env.VONAGE_PRIVATE_KEY,
  },
  {
    apiHost: "https://messages-sandbox.nexmo.com",
  }
);

app.use(express.json());

const PORT = process.env.PORT || 8000;

// Function to verify JWT token
const verifyJWT = (req) => {
  const jwtToken = req.headers.authorization.split(" ")[1];
  if (!verifySignature(jwtToken, process.env.VONAGE_API_SIGNATURE_SECRET)) {
    console.error("Unauthorized request");
    throw new Error("Not a messages API request");
  }
  console.log("JWT verified");
};

// Function to send a message via Vonage
const sendMessage = async (to_number) => {
  const text = "Message received."; // The reply message

  try {
    const { messageUUID } = await vonage.messages.send(
      new WhatsAppText({
        from: process.env.VONAGE_WHATSAPP_NUMBER,
        to: to_number,
        text: text,
      })
    );
    console.log(`Message sent with messageUUID: ${messageUUID}`);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.body : error.message
    );
  }
};

// Handle incoming message (Webhook from Vonage)
app.post("/inbound", async (req, res) => {
  const { from: requesterNumber } = req.body;
  console.log(`Received message from ${requesterNumber}`);

  try {
    // Verify the JWT token for the request
    verifyJWT(req);

    // Send the "Message received" reply
    await sendMessage(requesterNumber);
    res.status(200).send(); // Acknowledge the received message
  } catch (error) {
    console.error("Error handling incoming message:", error);
    res.status(500).send("An error occurred while processing the message.");
  }
});

// Handle status updates (Webhook from Vonage)
app.post("/status", (req, res) => {
  console.log(req.body);
  try {
    // Verify the JWT token for the status update
    verifyJWT(req);

    console.log("Received status update");
    res.status(200).send(); // Acknowledge the status update
  } catch (error) {
    console.error("Error handling status update:", error);
    res
      .status(500)
      .send("An error occurred while processing the status update.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
