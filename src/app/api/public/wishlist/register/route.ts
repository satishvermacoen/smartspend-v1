import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/features/shared/model/user';
import Enquiry from '@/features/shared/model/enquiry';
import ReferralCode from '@/features/shared/model/referral-code';
import ReferralConversion from '@/features/shared/model/referral-conversion';
import { cookies } from 'next/headers';
import { createNotification } from '@/lib/notification';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, picked = [], other = '' } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number/WhatsApp are required fields.' },
        { status: 400 }
      );
    }

    if (picked.length === 0 && !other.trim()) {
      return NextResponse.json(
        { error: 'Pick at least one subscription or tell us what you use.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    await connectDB();

    // Check if user already exists in system by phone or email
    const queryConditions: Array<{ phone: string } | { email: string }> = [{ phone: cleanPhone }];
    if (cleanEmail) {
      queryConditions.push({ email: cleanEmail });
    }

    let user = await User.findOne({
      $or: queryConditions
    });

    let isNewUser = false;
    let defaultEmail = cleanEmail;
    let defaultPassword = '';

    // Read cookie for referrer attribution
    let appliedCode = '';
    let referredByObj = undefined;
    let validCodeDoc = null;
    let referrerName = undefined;

    try {
      const cookieStore = await cookies();
      const cookieRef = cookieStore.get('referral_code')?.value;
      if (cookieRef) {
        appliedCode = cookieRef.trim().toUpperCase();
        validCodeDoc = await ReferralCode.findOne({
          code: appliedCode,
          is_active: true,
          $or: [
            { expires_at: { $exists: false } },
            { expires_at: { $gt: new Date() } }
          ]
        });

        if (validCodeDoc) {
          const referrerUser = await User.findById(validCodeDoc.referrer_id);
          if (referrerUser) {
            referredByObj = {
              referrerId: referrerUser._id,
              referrerEmail: referrerUser.email
            };
            referrerName = [referrerUser.firstName, referrerUser.lastName].filter(Boolean).join(' ').trim();
          }
        }
      }
    } catch (cookieErr) {
      console.warn('Could not read referral cookie during wishlist registration:', cookieErr);
    }

    if (!user) {
      isNewUser = true;

      // Determine name breakdown
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || 'Client';
      const lastName = nameParts.slice(1).join(' ') || '.';

      // Generate unique placeholder email if omitted
      if (!defaultEmail) {
        const sanitizedPhoneNum = cleanPhone.replace(/\D/g, '') || Math.floor(Math.random() * 10000000).toString();
        defaultEmail = `${sanitizedPhoneNum}@spentsmart.local`;

        // Double-check placeholder email uniqueness
        const checkEmailConflict = await User.findOne({ email: defaultEmail });
        if (checkEmailConflict) {
          defaultEmail = `${sanitizedPhoneNum}_${Math.floor(Math.random() * 100)}@spentsmart.local`;
        }
      }

      // Define a default login password
      const rawNumberDigits = cleanPhone.replace(/\D/g, '') || '123456';
      defaultPassword = `Welcome@${rawNumberDigits}`;

      // Create user model
      user = new User({
        firstName,
        lastName,
        email: defaultEmail,
        phone: cleanPhone,
        password: defaultPassword,
        role: 'customer',
        status: 'active', // active immediately for direct login access
        emailVerified: true, // Bypass verification since phone/WhatsApp validation handles it
        referredBy: referredByObj,
        source: referrerName || 'website_enquiry'
      });

      // Generate active referral code for this new user client
      let userReferralCode = '';
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        userReferralCode = user.generateReferralCode();
        const existingDoc = await User.findOne({ referralCode: userReferralCode });
        if (!existingDoc) {
          isUnique = true;
        }
        attempts++;
      }

      if (isUnique) {
        user.referralCode = userReferralCode;
      }

      await user.save();
    } else {
      defaultEmail = user.email;
    }

    // Save Enquiry/Wishlist Entry
    const subscriptionList = picked.join(', ');
    const enquiry = new Enquiry({
      name: name.trim(),
      mobile: cleanPhone,
      email: defaultEmail || undefined,
      subscription: subscriptionList || 'Custom Subscriptions',
      message: other.trim() || undefined,
      status: 'pending',
      client_id: user._id,
      referralCode: appliedCode || undefined,
      referredBy: referredByObj
    });

    await enquiry.save();

    // Create conversion funnel logs
    if (isNewUser && validCodeDoc && referredByObj) {
      try {
        const ipHeader = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const clientIp = ipHeader.split(',')[0].trim();

        await ReferralConversion.create({
          referral_code: validCodeDoc.code,
          referrer_id: validCodeDoc.referrer_id,
          prospect_id: user._id,
          prospect_email: user.email,
          conversion_stage: 'signed_up',
          timeline: {
            clicked_at: new Date(),
            signed_up_at: new Date()
          },
          metadata: {
            ip_address: clientIp,
            user_agent: req.headers.get('user-agent') || 'unknown'
          }
        });
      } catch (err) {
        console.error('Error logging wishlist signup conversion:', err);
      }
    }

    // Trigger in-app notifications
    try {
      if (isNewUser) {
        await createNotification({
          recipientId: user._id,
          title: 'Welcome to SpendSmart! 🎉',
          message: `Your account was created successfully. We've received your subscription wishlist!`,
          type: 'system',
          actionUrl: '/client/dashboard'
        });
      } else {
        await createNotification({
          recipientId: user._id,
          title: 'Wishlist Received! 📋',
          message: `We've updated your wishlist with ${picked.length} subscriptions.`,
          type: 'system',
          actionUrl: '/client/dashboard'
        });
      }

      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await createNotification({
          recipientId: admin._id,
          title: 'New Wishlist Lead Submitted',
          message: `${user.fullName} submitted a subscription wishlist.`,
          type: 'system',
          actionUrl: '/admin/enquiries'
        });
      }
    } catch (err) {
      console.error('Error triggering lead signup notifications:', err);
    }

    return NextResponse.json({
      success: true,
      message: isNewUser 
        ? 'Account created and wishlist saved successfully!' 
        : 'Wishlist saved to your profile successfully!',
      isNewUser,
      loginCredentials: isNewUser ? {
        username: cleanPhone,
        email: defaultEmail,
        password: defaultPassword
      } : null
    }, { status: 201 });

  } catch (error) {
    console.error('Wishlist registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during wishlist submission.' },
      { status: 500 }
    );
  }
}
