import { Router } from 'express';
import { asyncHandler, AppError } from '../utils/errorHandler';
// ...import additional functions like storeLead, scheduleMeeting, sendEmail as needed...

const router = Router();
const userSessions: Record<string, { step: string; userData: any }> = {};

router.post(
  '/buddybot',
  asyncHandler(async (req, res) => {
    const { userId, message } = req.body;

    if (!userId || !message) {
      throw new AppError(400, 'Missing required fields: userId and message');
    }

    if (!userSessions[userId]) {
      userSessions[userId] = { step: 'start', userData: {} };
    }

    let responseText = '';
    const session = userSessions[userId];

    switch (session.step) {
      case 'start':
        responseText =
          "Hey there! I'm BuddyBot, your AI marketing assistant. First off, what’s your name?";
        session.step = 'getName';
        break;

      case 'getName':
        session.userData.name = message;
        responseText = `Nice to meet you, ${message}! What's the best email to send updates to?`;
        session.step = 'getEmail';
        break;

      case 'getEmail':
        session.userData.email = message;
        responseText = `Got it! Now, what’s your biggest marketing challenge right now?`;
        session.step = 'getPainPoint';
        break;

      case 'getPainPoint':
        session.userData.painPoint = message;
        session.step = 'recommendPackage';

        if (message.includes('leads')) {
          session.userData.package = 'Lead Generation Pro';
        } else if (message.includes('ads')) {
          session.userData.package = 'Paid Ads Mastery';
        } else if (message.includes('website')) {
          session.userData.package = 'Web Revamp Express';
        } else {
          session.userData.package = 'Marketing Strategy Consultation';
        }

        responseText = `Alright, based on what you said, I'd recommend the **${session.userData.package}** package. Sound good?`;
        break;

      case 'recommendPackage':
        if (message.toLowerCase().includes('yes')) {
          session.step = 'scheduleMeeting';
          responseText = `Great choice! Let’s book a quick strategy call. Scheduling now...`;
          // ...await storeLead(session.userData);...
          // ...const meeting = await scheduleMeeting(session.userData.email, session.userData.name);...
          // ...await sendEmail(session.userData.email, "Your Marketing Consultation", `You're booked! Here are the details: ${meeting.htmlLink}`);...
          responseText += ` 🎉 You’re all set! A confirmation email is on its way. See you soon!`;
          delete userSessions[userId]; // Clear session
        } else {
          responseText = 'No worries! We can adjust the plan. What would you prefer instead?';
        }
        break;

      default:
        responseText = "Oops, something went wrong. Let's start over!";
        session.step = 'start';
        break;
    }

    res.json({ success: true, message: responseText });
  })
);

export default router;
