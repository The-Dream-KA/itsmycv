# Email Setup Instructions

## How to Enable Email Functionality

The contact form is now configured to send emails to **abueltayef.khader@gmail.com** automatically when users submit the form.

### Setup Steps:

1. **Get a Free Web3Forms Access Key:**
   - Go to [https://web3forms.com](https://web3forms.com)
   - Enter your email: **abueltayef.khader@gmail.com**
   - Click "Create Access Key"
   - Check your email and verify it
   - Copy the access key you receive

2. **Add the Access Key to `.env.local`:**
   - Open the file: `.env.local`
   - Find the line: `WEB3FORMS_ACCESS_KEY=YOUR_ACCESS_KEY_HERE`
   - Replace `YOUR_ACCESS_KEY_HERE` with your actual access key
   - Save the file

3. **Restart Your Development Server:**
   ```cmd
   npm run dev
   ```

4. **Test the Contact Form:**
   - Go to: http://localhost:3000/en/support
   - Fill in the contact form
   - Click "Send Message"
   - You should receive an email at **abueltayef.khader@gmail.com**

### What Was Implemented:

✅ API endpoint at `/api/send-email` that handles form submissions
✅ Automatic email sending to your Gmail address
✅ Form validation (name, email, subject, message)
✅ Loading state while sending
✅ Success confirmation message
✅ Error handling with user-friendly messages
✅ Form reset after successful submission

### Email Format:

Each email you receive will contain:
- **Subject:** [ItsMyCV] [User's subject]
- **From:** User's name and email
- **Category:** The selected category
- **Message:** The full message content
- **Timestamp:** When the message was sent

### Why Web3Forms?

- ✅ **Free** - No cost for up to 250 submissions per month
- ✅ **No Backend Required** - Works with serverless functions
- ✅ **Spam Protection** - Built-in spam filtering
- ✅ **No Configuration** - Just add your access key
- ✅ **Reliable** - Enterprise-grade infrastructure

### Alternative Options (If Needed):

If you prefer to use a different email service, you can replace the API implementation with:

1. **Resend** - Modern email API (install: `npm install resend`)
2. **SendGrid** - Popular email service
3. **Nodemailer** - Direct SMTP (requires mail server)
4. **EmailJS** - Client-side email sending

### Troubleshooting:

**If emails are not arriving:**
1. Check that you've added the correct access key to `.env.local`
2. Verify your email at Web3Forms
3. Check your spam folder
4. Restart the development server after adding the key
5. Open browser console (F12) to check for errors

**If you see errors in the browser:**
- Make sure the `.env.local` file is saved
- Restart the dev server completely (stop and start)
- Check that the access key doesn't have extra spaces

---

**Need Help?**
If you encounter any issues, check the browser console (F12) for detailed error messages.
