// src/App.js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import StudentAcademicResultsEmail from './emailTemplates/StudentAcademicResultsEmail';
import StudentExpenseUpdateEmail from './emailTemplates/StudentExpenseUpdateEmail';
import StudentDetailsUpdateEmail from './emailTemplates/StudentDetailsUpdateEmail';
import StudentVoluntaryServicesEmail from './emailTemplates/StudentVoluntaryServicesEmail';
import NewStudentAlertEmail from './emailTemplates/NewStudentAlertEmail';

const App = () => {
  // Generate HTML content for each email
  const emailHtmlAcademicResults = ReactDOMServer.renderToString(
    <StudentAcademicResultsEmail studentName="John" studentSurname="Doe" />
  );
  
  const emailHtmlExpenseUpdate = ReactDOMServer.renderToString(
    <StudentExpenseUpdateEmail studentName="Jane" studentSurname="Doe" />
  );

  const emailHtmlDetailsUpdate = ReactDOMServer.renderToString(
    <StudentDetailsUpdateEmail studentName="Mark" studentSurname="Smith" />
  );
  
  const emailHtmlVoluntaryServices = ReactDOMServer.renderToString(
    <StudentVoluntaryServicesEmail studentName="Alice" studentSurname="Johnson" />
  );

  const emailHtmlNewStudentAlert = ReactDOMServer.renderToString(
    <NewStudentAlertEmail studentName="Robert" studentSurname="Brown" />
  );

  return (
    <div>
      <h1>Email Template Test</h1>
      <div>
        <h2>Student Academic Results Email</h2>
        <div
          style={{ padding: '20px', border: '1px solid #ccc' }}
          dangerouslySetInnerHTML={{ __html: emailHtmlAcademicResults }} // Render raw HTML
        />
      </div>
      
      <div>
        <h2>Student Expense Update Email</h2>
        <div
          style={{ padding: '20px', border: '1px solid #ccc' }}
          dangerouslySetInnerHTML={{ __html: emailHtmlExpenseUpdate }}
        />
      </div>
      
      <div>
        <h2>Student Details Update Email</h2>
        <div
          style={{ padding: '20px', border: '1px solid #ccc' }}
          dangerouslySetInnerHTML={{ __html: emailHtmlDetailsUpdate }}
        />
      </div>

      <div>
        <h2>Student Voluntary Services Email</h2>
        <div
          style={{ padding: '20px', border: '1px solid #ccc' }}
          dangerouslySetInnerHTML={{ __html: emailHtmlVoluntaryServices }}
        />
      </div>

      <div>
        <h2>New Student Alert Email</h2>
        <div
          style={{ padding: '20px', border: '1px solid #ccc' }}
          dangerouslySetInnerHTML={{ __html: emailHtmlNewStudentAlert }}
        />
      </div>
    </div>
  );
};

export default App;
