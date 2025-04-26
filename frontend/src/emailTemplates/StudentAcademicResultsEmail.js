import React from 'react';
import { Box } from '@mui/material';
import backgroundImage from '../images/StudentAcademic.png';

const StudentAcademicResultsEmail = ({ studentName, studentSurname }) => {
  return (
    <html>
      <head>
        <style>
          {`
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; }
            h1 { color: #2d2d2d; font-size: 24px; }
            p { color: #666; font-size: 14px; line-height: 1.6; }
            .buttona { display: inline-block; background-color: #C5F8FF; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #999; }
            .logo { font-size: 18px; font-weight: bold; color: #2d2d2d; }
            .contact { font-size: 14px; color: #555; margin-top: 5px; }
            img.acad { max-width: 100%; height: auto; border-radius: 8px; background: #C5F8FF; }
          `}
        </style>
      </head>
      <body>
        <div className="email-container">
          <h1>Student Academic Results</h1>
          <Box
            component="img"
            src={backgroundImage}
            className="acad"
            alt="Student Academics"
            sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2 }}
          />          
          <p>Dear SANZAF Team,</p>
          <p>
            👉 <strong>{studentName} {studentSurname}</strong> seems like contributions are bearing some fruits. 
            Please have a look below by logging into your dashboard.
          </p>
          <a href="https://dashboard.example.com" className="buttona">LOGIN HERE</a>
          <div className="footer">
            <div className="logo">UCHAKIDE</div>
            <div className="contact">Luqmaan@uchakide.co.za</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default StudentAcademicResultsEmail;
