import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// This is required for Stripe to send raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    const { firestore } = initializeFirebase();

    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const subscription = event.data.object as Stripe.Subscription;
        const uid = subscription.metadata?.uid;
        const plan = subscription.metadata?.plan; // 'trader' or 'analyst'
        const status = subscription.status;

        if (!uid) {
            console.warn('Webhook received for subscription with no UID in metadata.');
            return NextResponse.json({ received: true });
        }
        
        let role = 'free'; // Default to 'free'
        
        if (status === 'active') {
          role = plan || 'free';
        }
        
        // For other statuses ('canceled', 'past_due', 'incomplete_expired', etc.), the role will be 'free'.
        
        const roleRef = doc(firestore, 'roles', uid);
        await setDoc(
          roleRef,
          { role, updatedAt: new Date() },
          { merge: true }
        );
        
        console.log(`✅ Role for user ${uid} updated to "${role}" based on subscription status "${status}".`);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('❌ Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 });
  }
}
