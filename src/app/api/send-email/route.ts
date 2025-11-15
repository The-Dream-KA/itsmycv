import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, category, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Prepare email content
        const emailContent = {
            from: email,
            name: name,
            subject: `[ItsMyCV] ${subject}`,
            category: category,
            message: message,
            timestamp: new Date().toISOString()
        };

        // Here we'll use Resend API or Gmail SMTP
        // For now, let's use a direct approach with fetch to a service

        // Check if access key is configured
        const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
        if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
            console.error('Web3Forms access key not configured');
            return NextResponse.json(
                { error: 'Email service not configured. Please contact administrator.' },
                { status: 500 }
            );
        }

        // Using Web3Forms (free service, no server needed)
        const formData = new FormData();
        formData.append('access_key', accessKey);
        formData.append('subject', `[ItsMyCV] ${subject}`);
        formData.append('from_name', name);
        formData.append('email', email);
        formData.append('message', `
Category: ${category}

Message:
${message}

---
From: ${name} (${email})
Sent: ${new Date().toLocaleString()}
        `);
        formData.append('redirect', 'false');

        console.log('Sending email to Web3Forms...');

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const responseText = await response.text();
        console.log('Web3Forms response status:', response.status);
        console.log('Web3Forms response:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch {
            console.error('Failed to parse Web3Forms response:', responseText.substring(0, 200));
            return NextResponse.json(
                { error: 'Email service returned an invalid response. Please try again later.' },
                { status: 500 }
            );
        }

        if (result.success) {
            console.log('Email sent successfully!');
            return NextResponse.json(
                {
                    success: true,
                    message: 'Email sent successfully!'
                },
                { status: 200 }
            );
        } else {
            console.error('Web3Forms error:', result);
            return NextResponse.json(
                { error: result.message || 'Failed to send email' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
