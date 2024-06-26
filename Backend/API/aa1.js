const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const sendEmail = async (email, orderId, paymentId) => {
    try {
        // Generate QR code
        const qrCode = await QRCode.toDataURL(JSON.stringify({ 'payment_id': paymentId, 'email': email }));

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'b15productpricetracker@gmail.com',
                pass: 'your-email-password', // Replace with your email password
            },
        });

        // Mail options
        const mailOptions = {
            from: {
                name: 'B15 Product Pricetracker',
                address: 'b15productpricetracker@gmail.com',
            },
            to: email,
            subject: 'Order Confirmation',
            html: `
                <h1>Order Confirmation</h1>
                <img src="${qrCode}" alt="QR Code" />
                <p>Order ID: ${orderId}</p>
                <p>Payment ID: ${paymentId}</p>
                <p>Thank you for your order!</p>
                <p>Best regards,</p>
                <p>B15 Product Pricetracker Team</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Example usage
sendEmail('customer@example.com', 'ORDER123456', 'PAYMENT987654');
