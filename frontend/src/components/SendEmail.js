// frontend/src/components/SendEmail.js
import React, { useState } from 'react';

const SendEmail = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = async () => {
    try {
      const response = await fetch('https://willowtonbursary.co.za/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: subject,
          text: message,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send email.');
    }
  };

  return (
    <div>
      <h2>Send Email</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Recipient's email"
      />
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
};

export default SendEmail;
