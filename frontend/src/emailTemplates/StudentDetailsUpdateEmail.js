import React from 'react';
import { Box } from '@mui/material';
import backgroundImage from '../images/StudentDetails.png';

const StudentDetailsUpdateEmail = ({ studentName, studentSurname }) => {
  return (
    <html>
      <head>
        <style>
          {`
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; }
            h1 { color: #2d2d2d; font-size: 24px; }
            p { color: #666; font-size: 14px; line-height: 1.6; }
            .buttond { display: inline-block; background-color: #F8FFA8; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #999; }
            .logo { font-size: 18px; font-weight: bold; color: #2d2d2d; }
            .contact { font-size: 14px; color: #555; margin-top: 5px; }
            img.det { max-width: 100%; height: auto; border-radius: 8px; background-color: #F8FFA8; }
          `}
        </style>
      </head>
      <body>
        <div className="email-container">
          <h1>Student Details Update</h1>
          {/* <img className='det' src="https://s3-alpha-sig.figma.com/img/3ab6/e949/89c4242c9cb5c8d746f5b3a065e581eb?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jcSQ6jEL5XZ4jM5dVC7KDIaiwUMDjlkyw3ZXUAK~2iu2B7DXXjd26qDiINV0vMYKd0-LXEqwvkVPrzJrVVwa4AKo80O2XUlqItawS6b2s-ESRvT2IRohZMcRS1CSP0OxDW5g2Ksa1uJOhXu4EPFmnSAVeot-DubGvdG3Ed68gIPy3UwY5YrCK1zR1wVL2qPBzKPV~BphB4~O001Z7XuhQreEPtcULmz1jJgvq9Imz4DfZQzoKdEWV9lgZUCFmafyZFMYRPdFbJH2mGE9wkRmwW8SAKSB2amXoee80EeR7oPYwkI0hH9~jAkmYQ~DeupKJnk3eF2TX3fsSOFivVbywQ__" alt="Student Update" /> */}
          <Box
            component="img"
            src={backgroundImage}
            className="det"
            alt="Student Details"
            sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2 }}
          />          
          <p>Dear SANZAF Team,</p>
          <p>
            👉 <strong>{studentName} {studentSurname}</strong> has updated some of their income and expense details.
            Please have a look below by logging into your dashboard.
          </p>
          <a href="https://dashboard.example.com" className="buttond">LOGIN HERE</a>
          <div className="footer">
            <div className="logo">UCHAKIDE</div>
            <div className="contact">Luqmaan@uchakide.co.za</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default StudentDetailsUpdateEmail;
