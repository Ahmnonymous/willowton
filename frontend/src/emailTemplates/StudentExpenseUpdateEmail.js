import React from 'react';
import { Box } from '@mui/material';
import backgroundImage from '../images/StudentExpense.png';

const StudentExpenseUpdateEmail = ({ studentName, studentSurname }) => {
  return (
    <html>
      <head>
        <style>
          {`
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; }
            h1 { color: #2d2d2d; font-size: 24px; }
            p { color: #666; font-size: 14px; line-height: 1.6; }
            .button { display: inline-block; background-color: #FFC28A; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #999; }
            .logo { font-size: 18px; font-weight: bold; color: #2d2d2d; }
            .contact { font-size: 14px; color: #555; margin-top: 5px; }
            img.exp { max-width: 100%; height: auto; border-radius: 8px; background-color: #FFC28A; }
          `}
        </style>
      </head>
      <body>
        <div className="email-container">
          <h1>Student Expense Update</h1>
          {/* <img className="exp" src="https://s3-alpha-sig.figma.com/img/dd6b/5ccd/a6eba30223addf4cdcb4ca53ea1c40b7?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jUAyNNPGRaISeXeg5sMGkNh8RnfLZ70sjvRRDswEbNQ5m2e1K06R3IyHhw~L7EOHNMxk2oU0R6n2bkuPU8JvpSsu5m4K5EGbiBx3XXT78gZiXcq2zLOf3D2WkfVIYrsu09OPZuSgjrh1PPQM4sjVLOU51GaNLZnTgNJc-wx0XlO9WRbfiwr2w3Ar8XJ8Qzozamm3OAHKbP7OJUmgIHLA0D4acEjrtyZWngcwo1gQcZdYnGXCrstY1acGNw5HE6Jy5E8umCm4uihKqA6oGXJazh8TGSIy3A4x~ctpLLj3C7rgD1eAYjMfabH5glyMaSiquag~o33QX70HNDuVgUxLSA__" alt="Student Expense Update" /> */}
          <Box
            component="img"
            src={backgroundImage}
            className="exp"
            alt="Student Expense"
            sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2 }}
          />          
          <p>Dear SANZAF Team,</p>
          <p>
            👉 <strong>{studentName} {studentSurname}</strong> has updated some of their income and expense details.
            Please have a look below by logging into your dashboard.
          </p>
          <a href="https://dashboard.example.com" className="button">LOGIN HERE</a>
          <div className="footer">
            <div className="logo">UCHAKIDE</div>
            <div className="contact">Luqmaan@uchakide.co.za</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default StudentExpenseUpdateEmail;
