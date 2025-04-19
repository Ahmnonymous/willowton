-- Insert data into Student_Details_Portal
insert into Student_Details_Portal (
    Student_Name, Student_Surname, Student_Nationality, Student_ID_Passport_Number, Student_Type, 
    Student_Religion, Student_Finance_Type, Student_Whatsapp_Number, Student_Alternative_Number, 
    Student_Email_Address, Student_Highest_Education, Student_Home_Address, Student_Suburb, 
    Student_Area_Code, Student_Province, Student_DOB, Student_Race, Student_Marital_Status, 
    Student_Employment_Status, Student_Job_Title, Student_Industry, Student_Company_of_Employment, 
    Student_Current_Salary, Student_Number_of_Siblings, Student_Siblings_Bursary, Student_Willow_Relationship, 
    Student_Relationship_Type, Student_Employee_Name, Student_Employee_Designation, Student_Employee_Branch, 
    Student_Employee_Number, Student_Emergency_Contact_Name, Student_Emergency_Contact_Number, 
    Student_Emergency_Contact_Relationship, Student_Emergency_Contact_Address, Student_Date_Stamp
)
values 
('Ahmed', 'Raza', 'Pakistani', 'A123456789', 'Undergraduate', 'Islam', 'Self-Funded', '1234567890', '0987654321', 
 'ahmed.raza@email.com', 'High School', '123 Main St', 'Karachi', '12345', 'Sindh', '1995-05-10', 'Asian', 'Single', 
 'Employed', 'Software Developer', 'IT', 'Tech Innovations', '50000', 2, 'Yes', 'Close', 'Family', 'John Doe', 
 'Manager', 'Head Office', '1234', 'Nadia Raza', '0987654322', 'Mother', '456 Another St', '2025-03-20'),
 
 ('Luqman', 'Chinsamy', 'South African', 'L987654321', 'Postgraduate', 'Christianity', 'Government-funded', 
 '9876543210', '1122334455', 'luqman.chinsamy@email.com', 'Bachelors Degree', '456 Elm St', 'Durban', '67890', 
 'KwaZulu-Natal', '1992-08-15', 'Coloured', 'Married', 'Unemployed', 'N/A', 'Education', 'University of Durban', 
 '20000', 3, 'No', 'Distant', 'Friend', 'Jane Smith', 'Lecturer', 'University Branch', '5678', 'Sibusiso Chinsamy', 
 '1234567890', 'Father', '789 Final St', '2025-03-20');

-- Insert data into Student_Portal_Parents_Details
insert into Student_Portal_Parents_Details (
    Student_Details_Portal_id, Parent_Relationship, Parent_Name, Parent_Surname, Parent_Cell_Number, 
    Parent_Email_Address, Parent_Employment_Status, Parent_Industry, Parent_Highest_Education, Parent_Salary, 
    Parent_Grant, Parent_Other_Income, Parent_Date_Stamp
)
values
(1, 'Father', 'Ali', 'Raza', '1112233445', 'ali.raza@email.com', 'Employed', 'Manufacturing', 'High School', 
 '35000', 'No', 'Yes', '2025-03-20'),
(2, 'Mother', 'Thandi', 'Chinsamy', '3344556677', 'thandi.chinsamy@email.com', 'Self-employed', 'Retail', 
 'Bachelors Degree', '22000', 'No', 'Yes', '2025-03-20');

-- Insert data into Student_Portal_University_Details
-- Insert for ID 1
INSERT INTO Student_Portal_University_Details (Student_Details_Portal_id, Institution_Name, Name_of_Course, Intake_Year, Semester, NQF_Level, Current_Year, Student_Number, Previously_Funded, Previously_Funded_Amount, Tuition, Tuition_Amount, Accommodation, Accommodation_Fee, Textbooks, Textbooks_Fee, Travel, Travel_Fee, Total_University_Expense, Other_Bursary_Org_1, Other_Bursary_Org_1_Contact, Other_Bursary_Org_2, Other_Bursary_Org_2_Contact, Other_Bursary_Org_3, Other_Bursary_Org_3_Contact, Previous_Bursary_Org_1, Previous_Bursary_Org_1_Amount, Previous_Bursary_Org_1_Contact, Previous_Bursary_Org_2, Previous_Bursary_Org_2_Amount, Previous_Bursary_Org_2_Contact, Previous_Bursary_Org_3, Previous_Bursary_Org_3_Amount, Previous_Bursary_Org_3_Contact, Application_Process_Status, University_Details_Date_Stamp)
VALUES (1, 'University of Example 1', 'Master of Engineering', '2023', '2nd Semester', 'Level 9', '2nd Year', 'S12345678901', 'No', NULL, 'Yes', '15000', 'Yes', '7000', 'Yes', '500', 'Yes', '400', '22000', 'Bursary Org A1', '1239876543', 'Bursary Org B1', '4567891230', 'Bursary Org C1', '7894561230', 'Previous Bursary Org A1', '2000', '9876543210', 'Previous Bursary Org B1', '3000', '8765432109', 'Previous Bursary Org C1', '4000', '7654321098', 'Completed', '2023-05-20'),
       (2, 'University of Example 2', 'Bachelor of Arts', '2024', '1st Semester', 'Level 8', '1st Year', 'S9876543210', 'Yes', '3000', 'Yes', '12000', 'No', '0', 'Yes', '600', 'No', '0', '18600', 'Bursary Org A2', '5432167890', 'Bursary Org B2', '6789098765', 'Bursary Org C2', '3210987654', 'Previous Bursary Org A2', '1000', '1357924680', 'Previous Bursary Org B2', '1500', '2468013579', 'Previous Bursary Org C2', '2000', '3579246801', 'In Progress', '2024-08-15');

-- Insert data into Student_Portal_Assets_Liabilities
insert into Student_Portal_Assets_Liabilities (
    Student_Details_Portal_id, Gold_Silver, Cash_in_Bank, Investments, Liabilities, Assets_Liabilities_Date_Stamp
)
values
(1, 'Gold', '5000', '10000', '1000', '2025-03-20'),
(2, 'Silver', '2000', '5000', '2000', '2025-03-20');

-- Insert data into Student_Portal_Expense_Details
insert into Student_Portal_Expense_Details (
    Student_Details_Portal_id, Rent_Bond_Expense, Rates_Expense, Utilities_Expense, Groceries_Expense, 
    Transport_Petrol_Expense, Telephone_Expense, Medical_Aid_Expense, Insurance_Expense, Other_Expense, 
    Total_Expenses, Expense_Date_Stamp
)
values
(1, '2000', '500', '300', '1000', '500', '200', '150', '100', '50', '4550', '2025-03-20'),
(2, '2500', '700', '400', '1200', '600', '250', '180', '120', '60', '6060', '2025-03-20');

-- Insert data into Student_Portal_Attachments
insert into Student_Portal_Attachments (
    Student_Details_Portal_id, Attachments_Name, Attachments_Description, Attachment, Attachments_Date_Stamp
)
values
(1, 'Transcript', 'Ahmed Raza Transcript', null, '2025-03-20'),
(2, 'ID Proof', 'Luqman Chinsamy ID Proof', null, '2025-03-20');

-- Insert data into Student_Portal_About_Me
INSERT INTO Student_Portal_About_Me (Student_Details_Portal_id, About_Me_Q01, About_Me_Q02, About_Me_Q03, About_Me_Q04, About_Me_Q05, About_Me_Q06, About_Me_Q07, About_Me_Q08, About_Me_Q09, About_Me_Q10, About_Me_Q11, About_Me_Q12, About_Me_Q13, About_Me_Q14, About_Me_Q15, About_Me_Q16, About_Me_Q17, About_Me_Q18, About_Me_Q19, About_Me_Q20, About_Me_Q21, About_Me_Date_Stamp)
VALUES
(1, 'Answer to Q01', 'Answer to Q02', 'Answer to Q03', 'Answer to Q04', 'Answer to Q05', 'Answer to Q06', 'Answer to Q07', 'Answer to Q08', 'Answer to Q09', 'Answer to Q10', 'Answer to Q11', 'Answer to Q12', 'Answer to Q13', 'Answer to Q14', 'Answer to Q15', 'Answer to Q16', 'Answer to Q17', 'Answer to Q18', 'Answer to Q19', 'Answer to Q20', 'Answer to Q21', '2025-03-20'),
(2, 'Response to Q01', 'Response to Q02', 'Response to Q03', 'Response to Q04', 'Response to Q05', 'Response to Q06', 'Response to Q07', 'Response to Q08', 'Response to Q09', 'Response to Q10', 'Response to Q11', 'Response to Q12', 'Response to Q13', 'Response to Q14', 'Response to Q15', 'Response to Q16', 'Response to Q17', 'Response to Q18', 'Response to Q19', 'Response to Q20', 'Response to Q21', '2025-03-20');

-- Insert data into Student_Portal_Payments
insert into Student_Portal_Payments (
    Student_Details_Portal_id, Payments_Expense_Type, Payments_Vendor, Payments_Expense_Amount, 
    Payments_Date, Payments_ET_Number, Proof_of_Payment, Payment_Created_By, Payments_Date_Stamp
)
values
(1, 'Tuition Fee', 'University', '15000', '2025-03-15', 'ET12345', null, 'Ahmed Raza', '2025-03-20'),
(2, 'Accommodation', 'University Dorms', '6000', '2025-03-10', 'ET67890', null, 'Luqman Chinsamy', '2025-03-20');

-- Insert data into Student_Portal_Results
insert into Student_Portal_Results (
    Student_Details_Portal_id, Results_Module, Results_Percentage, Results_Attachment, Results_Date_Stamp
)
values
(1, 'Math 101', '85%', null, '2025-03-20'),
(2, 'Physics 202', '92%', null, '2025-03-20');

-- Insert data into Student_Portal_Voluntary_Service
insert into Student_Portal_Voluntary_Service (
    Student_Details_Portal_id, Organisation, Contact_Person, Contact_Person_Number, Hours_Contributed, 
    Proof_of_Service, Voluntary_Service_Date_Stamp
)
values
(1, 'Tech for Good', 'Sarah Smith', '1239874560', '50', null, '2025-03-20'),
(2, 'Clean Earth', 'Mark Adams', '6543219870', '30', null, '2025-03-20');

-- Insert data into Student_Portal_Interview
INSERT INTO Student_Portal_Interview (Student_Details_Portal_id, Interviewer_Name, Year_of_Interview, Interview_Q01, Interview_Q02, Interview_Q03, Interview_Q04, Interview_Q05, Interview_Q06, Interview_Q07, Interview_Q08, Interview_Q09, Interview_Q10, Interview_Q11, Interview_Q12, Interview_Q13, Interview_Q14, Interview_Q15, Interview_Q16, Interview_Q17, Interview_Q18, Interview_Q19, Interview_Q20, Interview_Q21, Interview_Q22, Interview_Q23, Interview_Q24, Interview_Created_By, Date_Stamp)
VALUES
(1, 'Interviewer A', '2025', 'Answer Q1', 'Answer Q2', 'Answer Q3', 'Answer Q4', 'Answer Q5', 'Answer Q6', 'Answer Q7', 'Answer Q8', 'Answer Q9', 'Answer Q10', 'Answer Q11', 'Answer Q12', 'Answer Q13', 'Answer Q14', 'Answer Q15', 'Answer Q16', 'Answer Q17', 'Answer Q18', 'Answer Q19', 'Answer Q20', 'Answer Q21', 'Answer Q22', 'Answer Q23', 'Answer Q24', 'Admin', '2025-03-20'),
(2, 'Interviewer B', '2025', 'Response Q1', 'Response Q2', 'Response Q3', 'Response Q4', 'Response Q5', 'Response Q6', 'Response Q7', 'Response Q8', 'Response Q9', 'Response Q10', 'Response Q11', 'Response Q12', 'Response Q13', 'Response Q14', 'Response Q15', 'Response Q16', 'Response Q17', 'Response Q18', 'Response Q19', 'Response Q20', 'Response Q21', 'Response Q22', 'Response Q23', 'Response Q24', 'Admin', '2025-03-20');


-- Student_Details_Portal
-- Student_Portal_Parents_Details
-- Student_Portal_University_Details
-- Student_Portal_Assets_Liabilities
-- Student_Portal_Expense_Details
-- Student_Portal_Attachments
-- Student_Portal_About_Me
-- Student_Portal_Payments
-- Student_Portal_Results
-- Student_Portal_Voluntary_Service
-- Student_Portal_Interview