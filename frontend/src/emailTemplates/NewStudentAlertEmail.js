import React from 'react';
import { Box } from '@mui/material';
import backgroundImage from '../images/NewStudent.png';

const NewStudentAlertEmail = ({ studentName, studentSurname }) => {
  return (
    <html>
      <head>
        <style>
          {`
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; }
            h1 { color: #2d2d2d; font-size: 24px; }
            p { color: #666; font-size: 14px; line-height: 1.6; }
            .buttonn { display: inline-block; background-color: mediumpurple; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #999; }
            .logo { font-size: 18px; font-weight: bold; color: #2d2d2d; }
            .contact { font-size: 14px; color: #555; margin-top: 5px; }
            img.new { max-width: 100%; height: auto; border-radius: 8px; background: mediumpurple; }
          `}
        </style>
      </head>
      <body>
        <div className="email-container">
          <h1>New Student Alert</h1>
          <Box
            component="img"
            src={backgroundImage}
            className="new"
            alt="New Student"
            sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2 }}
          />
          <p>Dear SANZAF Team,</p>
          <p>We are pleased to inform you that a new student has been enrolled.</p>
          <p>You may view the student's details by logging into your dashboard using the link below:</p>
          <p>
            <strong>Student Name: {studentName} {studentSurname}</strong>
          </p>
          <a href="https://dashboard.example.com" className="buttonn">LOGIN HERE</a>
          <div className="footer">
            <div className="logo">UCHAKIDE</div>
            <div className="contact">Luqmaan@uchakide.co.za</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default NewStudentAlertEmail;
