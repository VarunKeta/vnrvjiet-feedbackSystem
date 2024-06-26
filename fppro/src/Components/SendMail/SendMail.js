// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function SendMail() {
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('file', file);

        try {
            await axios.post('http://localhost:5000/send-email', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email.');
        }
    };

    return (
        <div className="App">
            <h1>Email Sender</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div>
                    <label>File:</label>
                    <input type="file" onChange={handleFileChange} required />
                </div>
                <button type="submit">Send Email</button>
            </form>
        </div>
    );
}

export default SendMail;
