import React from 'react';
import { Box } from '@mui/material';
import backgroundImage from '../images/StudentVoluntary.png';

const StudentVoluntaryServicesEmail = ({ studentName, studentSurname }) => {
  return (
    <html>
      <head>
        <style>
          {`
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #000; padding: 20px; border-radius: 8px; text-align: center; }
            h1 { color: #2d2d2d; font-size: 24px; }
            p { color: #666; font-size: 14px; line-height: 1.6; }
            .buttonv { display: inline-block; background-color: #FFFB9A; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #999; }
            .logo { font-size: 18px; font-weight: bold; color: #2d2d2d; }
            .contact { font-size: 14px; color: #555; margin-top: 5px; }
            img.volun { max-width: 100%; height: auto; border-radius: 8px; background: #FFFB9A }
          `}
        </style>
      </head>
      <body>
        <div className="email-container">
          <h1>Student Voluntary Services</h1>
          {/* <img className='volun' src="https://s3-alpha-sig.figma.com/img/7cb0/1aa5/4a2e3670a63bf2269403187686d7dcc7?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=EatlZ-jWuQmhX6NDL-UIch~fVzb9Ytxy2H-c-Ka5tqXKFaOKcIqWEz4U7rFTGqXlPWApt87bcZiTRQ1jpTClIxcLnhDEFkCQuHXm9FtYIFFV-LvCaVBICPKTyjX-iyfuclkTR72zlBp-wTK7SEC-7-p7vdYsM8g6q9BprRYWNRQsQm6xovHicFatqIdFNzLbwXTHOX1yZYTpp-inF3paM4KrBAMa9Y4wEc9SzrPvxXJ8La7r5upljTa39IebotVmGF1zSvrbqWPlr0Br5UJOFi51yDxQVQOJ35gesR7Jq1g~hI77Tr6k0F69XOC0t~aq9I3tqvTzsELd1uAgQEejUg__" alt="Student Voluntary Services" /> */}
          <Box
            component="img"
            src={backgroundImage}
            className="volun"
            alt="Student Voluntart Services"
            sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2 }}
          />          
          <p>Dear SANZAF Team,</p>
          <p>
            👉 <strong>{studentName} {studentSurname}</strong> is following in our footsteps. 
            Wanna see how they are making an impact? Please log in to your dashboard.
          </p>
          <a href="https://dashboard.example.com" className="buttonv">LOGIN HERE</a>
          <div className="footer">
            <div className="logo">UCHAKIDE</div>
            <div className="contact">Luqmaan@uchakide.co.za</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default StudentVoluntaryServicesEmail;
