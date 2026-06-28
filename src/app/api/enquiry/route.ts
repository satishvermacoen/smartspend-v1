import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/features/shared/model/enquiry';
import ReferralCode from '@/features/shared/model/referral-code';
import ReferralConversion from '@/features/shared/model/referral-conversion';
import User, { IUser } from '@/features/shared/model/user';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Input validation schema using Zod
const enquiryInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(100),
  mobile: z.string().trim().min(7, 'Mobile number must be at least 7 digits.').max(15),
  email: z.string().trim().email('Please provide a valid email address.').max(255).optional().or(z.literal('')),
  subscription: z.string().trim().max(100).optional().or(z.literal('')),
  message: z.string().trim().max(500).optional().or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request data
    const parseResult = enquiryInputSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((err: { message: string }) => err.message).join(' ');
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    const { name, mobile, email, subscription, message } = parseResult.data;

    // Connect to database
    await connectDB();

    const cleanPhone = mobile.trim();
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    const queryConditions: Array<{ phone: string } | { email: string }> = [{ phone: cleanPhone }];
    if (cleanEmail) {
      queryConditions.push({ email: cleanEmail });
    }

    const existingUser = await User.findOne({
      $or: queryConditions
    });


    // Check for referral cookie to attribute this lead/enquiry
    let appliedCode = '';
    let referredByObj = undefined;
    let referrerName = undefined;

    try {
      const cookieStore = await cookies();
      const cookieRef = cookieStore.get('referral_code')?.value;
      if (cookieRef) {
        appliedCode = cookieRef.trim().toUpperCase();
        const validCodeDoc = await ReferralCode.findOne({
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
      console.warn('Could not read referral cookie during enquiry submission:', cookieErr);
    }

    let newCredentials = null;

    if (!existingUser) {
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || 'Client';
      const lastName = nameParts.slice(1).join(' ') || '.';

      const rawNumberDigits = cleanPhone.replace(/\D/g, '') || '123456';
      const defaultPassword = `Welcome@${rawNumberDigits}`;

      const userPayload: Partial<IUser> = {
        firstName,
        lastName,
        phone: cleanPhone,
        password: defaultPassword,
        role: 'customer',
        status: 'active',
        emailVerified: true,
        source: referrerName || 'website_enquiry',
        referredBy: referredByObj
      };
      let finalEmail = cleanEmail;
      if (!finalEmail) {
        const sanitizedPhoneNum = cleanPhone.replace(/\D/g, '') || Math.floor(Math.random() * 10000000).toString();
        finalEmail = `${sanitizedPhoneNum}@spentsmart.local`;
      }
      userPayload.email = finalEmail;

      const user = new User(userPayload);

      await user.save();

      newCredentials = {
        username: cleanPhone,
        email: finalEmail,
        password: defaultPassword
      };
    }


    // Create and save enquiry
    const enquiry = new Enquiry({
      name,
      mobile,
      email: email || undefined,
      subscription: subscription || undefined,
      message: message || undefined,
      status: 'pending',
      referralCode: appliedCode || undefined,
      referredBy: referredByObj
    });

    await enquiry.save();

    // If referred, log conversion stage "enquired"
    if (appliedCode && referredByObj) {
      try {
        const ipHeader = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const clientIp = ipHeader.split(',')[0].trim();

        // Check for existing conversion log, else create new
        let conversion = await ReferralConversion.findOne({
          referral_code: appliedCode,
          prospect_email: email || undefined
        });

        if (!conversion) {
          conversion = await ReferralConversion.findOne({
            referral_code: appliedCode,
            conversion_stage: 'clicked',
            prospect_id: { $exists: false }
          }).sort({ createdAt: -1 });
        }

        if (conversion) {
          if (email) conversion.prospect_email = email;
          conversion.conversion_stage = 'enquired';
          conversion.timeline.visited_at = new Date();
          await conversion.save();
        } else {
          await ReferralConversion.create({
            referral_code: appliedCode,
            referrer_id: referredByObj.referrerId,
            prospect_email: email || undefined,
            conversion_stage: 'enquired',
            timeline: {
              clicked_at: new Date(),
              visited_at: new Date()
            },
            metadata: {
              ip_address: clientIp,
              user_agent: req.headers.get('user-agent') || 'unknown'
            }
          });
        }
      } catch (convErr) {
        console.error('Error logging referral conversion during enquiry:', convErr);
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Enquiry submitted successfully.', 
        enquiryId: enquiry._id,
        loginCredentials: newCredentials
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
