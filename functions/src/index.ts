import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import twilio from "twilio";
import * as sendgrid from "@sendgrid/mail";

admin.initializeApp();
const db = admin.firestore();

// Load Twilio + SendGrid credentials
const TWILIO_SID = functions.config().twilio.sid;
const TWILIO_AUTH = functions.config().twilio.auth;
const TWILIO_PHONE = functions.config().twilio.phone;
const SENDGRID_KEY = functions.config().twilio.sendgrid_key;

const client = twilio(TWILIO_SID, TWILIO_AUTH);
sendgrid.setApiKey(SENDGRID_KEY);

// Scheduled function runs every 5 minutes
export const checkPriceAlerts = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const alertsSnap = await db.collection("alerts").get();
    const alerts = alertsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    for (const alert of alerts) {
      try {
        const { symbol, condition, target, notifyBy, ownerEmail, ownerPhone, ownerWhatsapp } = alert;

        const res = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        );
        const price = parseFloat(res.data.price);
        let triggered = false;

        if (condition === "above" && price > target) triggered = true;
        if (condition === "below" && price < target) triggered = true;

        if (triggered) {
          const message = `${symbol} hit your target price of $${target}. Current: $${price}`;

          if (notifyBy.includes("EMAIL") && ownerEmail) {
            await sendgrid.send({
              to: ownerEmail,
              from: "alerts@stocksense.app",
              subject: `Price Alert: ${symbol}`,
              text: message,
            });
          }

          if (notifyBy.includes("SMS") && ownerPhone) {
            await client.messages.create({
              body: message,
              from: TWILIO_PHONE,
              to: ownerPhone,
            });
          }

          if (notifyBy.includes("WHATSAPP") && ownerWhatsapp) {
            await client.messages.create({
              body: message,
              from: `whatsapp:${TWILIO_PHONE}`,
              to: `whatsapp:${ownerWhatsapp}`,
            });
          }

          await db.collection("alerts").doc(alert.id).update({ triggeredAt: Date.now() });
        }
      } catch (error) {
        console.error("Error checking alert:", error);
      }
    }

    return null;
  });
