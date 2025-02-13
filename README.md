# How to Send a WhatsApp Message with Node.js (Tutorial)

This project demonstrates how to use the Vonage API Messages API to send and receive WhatsApp messages.

This project was created as part of a blog post on the [Vonage API Developer blog](https://developer.vonage.com/en/blog).

## Prerequisites

Before you can run this project, make sure you have the following:

- Node.js (v14 or later)
- Vonage API Key & Secret - Set up a Vonage account and get the API credentials to send WhatsApp messages via their messaging API.

## Installation

1. Clone this repository and Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project directory and add your credentials:

   ```dotenv
   VONAGE_API_KEY=
   VONAGE_API_SECRET=
   VONAGE_APPLICATION_ID=
   VONAGE_PRIVATE_KEY=
   VONAGE_WHATSAPP_NUMBER=
   VONAGE_API_SIGNATURE_SECRET=
   ```

4. Start the server:

   ```bash
   node server.js
   ```

   The server will start and listen on `PORT=8000` by default. You can specify a different port by setting the `PORT` environment variable.



