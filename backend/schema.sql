-- create tables
CREATE TABLE Student_portal_users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_address VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(10) NOT NULL
);

create table Student_Details_Portal (
    id serial primary key,
    Student_Name varchar(4000),
    Student_Surname varchar(4000),
    Student_Nationality varchar(4000),
    Student_ID_Passport_Number varchar(4000),
    Student_Type varchar(4000),
    Student_Religion varchar(4000),
    Student_Finance_Type varchar(4000),
    Student_Whatsapp_Number varchar(4000),
    Student_Alternative_Number varchar(4000),
    Student_Email_Address varchar(4000),  
    Student_Highest_Education varchar(4000),
    Student_Home_Address varchar(4000),
    Student_Suburb varchar(4000),
    Student_Area_Code varchar(4000),
    Student_Province varchar(4000),
    Student_DOB date DEFAULT CURRENT_TIMESTAMP,
    Student_Race varchar(4000),
    Student_Marital_Status varchar(4000),
    Student_Employment_Status varchar(4000),
    Student_Job_Title varchar(4000),
    Student_Industry varchar(4000),
    Student_Company_of_Employment varchar(4000),
    Student_Current_Salary varchar(4000),
    Student_Number_of_Siblings integer,
    Student_Siblings_Bursary varchar(4000),
    Student_Willow_Relationship varchar(4000),
    Student_Relationship_Type varchar(4000),
    Student_Employee_Name varchar(4000),
    Student_Employee_Designation varchar(4000),
    Student_Employee_Branch varchar(4000),
    Student_Employee_Number varchar(4000),
    Student_Emergency_Contact_Name varchar(4000),
    Student_Emergency_Contact_Number varchar(4000),
    Student_Emergency_Contact_Relationship varchar(4000),
    Student_Emergency_Contact_Address varchar(4000),
    Student_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES Student_portal_users(user_id) ON DELETE SET NULL
);

create table Student_Portal_Parents_Details (
    id serial primary key,
    Student_Details_Portal_id integer references Student_Details_Portal,
    Parent_Relationship varchar(4000),
    Parent_Name varchar(4000),
    Parent_Surname varchar(4000),
    Parent_Cell_Number varchar(4000),
    Parent_Email_Address varchar(4000),
    Parent_Employment_Status varchar(4000),
    Parent_Industry varchar(4000),
    Parent_Highest_Education varchar(4000),
    Parent_Salary varchar(4000),
    Parent_Grant varchar(4000),
    Parent_Other_Income varchar(4000),
    Parent_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

create table Student_Portal_University_Details (
    id serial primary key,
    Student_Details_Portal_id integer references Student_Details_Portal,
    Institution_Name varchar(4000),
    Name_of_Course varchar(4000),
    Intake_Year varchar(4000),
    Semester varchar(4000),
    NQF_Level varchar(4000),
    Current_Year varchar(4000),
    Student_Number varchar(4000),
    Previously_Funded varchar(4000),
    Previously_Funded_Amount varchar(4000),
    Tuition varchar(4000),
    Tuition_Amount varchar(4000),
    Accommodation varchar(4000),
    Accommodation_Fee varchar(4000),
    Textbooks varchar(4000),
    Textbooks_Fee varchar(4000),
    Travel varchar(4000),
    Travel_Fee varchar(4000),
    Total_University_Expense varchar(4000),
    Other_Bursary_Org_1 varchar(4000),
    Other_Bursary_Org_1_Contact varchar(4000),
    Other_Bursary_Org_2 varchar(4000),
    Other_Bursary_Org_2_Contact varchar(4000),
    Other_Bursary_Org_3 varchar(4000),
    Other_Bursary_Org_3_Contact varchar(4000),
    Previous_Bursary_Org_1 varchar(4000),
    Previous_Bursary_Org_1_Amount varchar(4000),
    Previous_Bursary_Org_1_Contact varchar(4000),
    Previous_Bursary_Org_2 varchar(4000),
    Previous_Bursary_Org_2_Amount varchar(4000),
    Previous_Bursary_Org_2_Contact varchar(4000),
    Previous_Bursary_Org_3 varchar(4000),
    Previous_Bursary_Org_3_Amount varchar(4000),
    Previous_Bursary_Org_3_Contact varchar(4000),
    Application_Process_Status varchar(4000),
    University_Details_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

create table Student_Portal_Assets_Liabilities (
    id serial primary key,
    Student_Details_Portal_id integer references Student_Details_Portal,
    Gold_Silver varchar(4000),
    Cash_in_Bank varchar(4000),
    Investments varchar(4000),
    Liabilities varchar(4000),
    Assets_Liabilities_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Student_Portal_Expense_Details (
    id SERIAL PRIMARY KEY,
    Student_Details_Portal_id INTEGER REFERENCES Student_Details_Portal,
    Father_Monthly_Salary VARCHAR(4000),
    Mother_Monthly_Salary VARCHAR(4000),
    Spouse_Monthly_Salary VARCHAR(4000),
    Applicant_Monthly_Salary VARCHAR(4000),
    Rent_Income VARCHAR(4000),
    Grants VARCHAR(4000),
    Other_Income VARCHAR(4000),
    Total_Income VARCHAR(4000),
    Rent_Bond_Expense VARCHAR(4000),
    Rates_Expense VARCHAR(4000),
    Utilities_Expense VARCHAR(4000),
    Groceries_Expense VARCHAR(4000),
    Transport_Petrol_Expense VARCHAR(4000),
    Telephone_Expense VARCHAR(4000),
    Medical_Aid_Expense VARCHAR(4000),
    Insurance_Expense VARCHAR(4000),
    Other_Expense VARCHAR(4000),
    Total_Expenses VARCHAR(4000),
    Expense_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

create table Student_Portal_Attachments (
    id serial primary key,
    Student_Details_Portal_id integer references Student_Details_Portal,
    Attachments_Name varchar(4000),
    Attachments_Description varchar(4000),
    Attachment bytea,
    Attachments_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

create table Student_Portal_About_Me (
    id serial primary key,
    Student_Details_Portal_id integer references Student_Details_Portal,
    About_Me_Q01 varchar(4000),
    About_Me_Q02 varchar(4000),
    About_Me_Q03 varchar(4000),
    About_Me_Q04 varchar(4000),
    About_Me_Q05 varchar(4000),
    About_Me_Q06 varchar(4000),
    About_Me_Q07 varchar(4000),
    About_Me_Q08 varchar(4000),
    About_Me_Q09 varchar(4000),
    About_Me_Q10 varchar(4000),
    About_Me_Q11 varchar(4000),
    About_Me_Q12 varchar(4000),
    About_Me_Q13 varchar(4000),
    About_Me_Q14 varchar(4000),
    About_Me_Q15 varchar(4000),
    About_Me_Q16 varchar(4000),
    About_Me_Q17 varchar(4000),
    About_Me_Q18 varchar(4000),
    About_Me_Q19 varchar(4000),
    About_Me_Q20 varchar(4000),
    About_Me_Q21 varchar(4000),
    About_Me_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

create table Student_Portal_Payments (
    id serial primary key,
    Student_Details_Portal_id integer references Student_Details_Portal,
    Payments_Expense_Type varchar(4000),
    Payments_Vendor varchar(4000),
    Payments_Expense_Amount varchar(4000),
    Payments_Date varchar(4000),
    Payments_ET_Number varchar(4000),
    Payments_Attachment_Name varchar(4000),
    Proof_of_Payment bytea,
    Payment_Created_By varchar(4000),
    Payments_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

create table Student_Portal_Results (
    id serial primary key,
    Student_Details_Portal_id integer references Student_Details_Portal,
    Results_Module varchar(4000),
    Results_Percentage varchar(4000),
    Results_Attachment bytea,
    Results_Attachment_Name VARCHAR(4000),
    Results_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

create table Student_Portal_Voluntary_Service (
    id serial primary key,
    Student_Details_Portal_id integer references Student_Details_Portal,
    Organisation varchar(4000),
    Contact_Person varchar(4000),
    Contact_Person_Number varchar(4000),
    Hours_Contributed varchar(4000),
    Service_Attachment_Name varchar(4000),
    Proof_of_Service bytea,
    Voluntary_Service_Date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

create table Student_Portal_Interview (
    id serial primary key,
    Student_Details_Portal_id integer references Student_Details_Portal,
    Interviewer_Name varchar(4000),
    Year_of_Interview varchar(4000),
    Interview_Q01 varchar(4000),
    Interview_Q02 varchar(4000),
    Interview_Q03 varchar(4000),
    Interview_Q04 varchar(4000),
    Interview_Q05 varchar(4000),
    Interview_Q06 varchar(4000),
    Interview_Q07 varchar(4000),
    Interview_Q08 varchar(4000),
    Interview_Q09 varchar(4000),
    Interview_Q10 varchar(4000),
    Interview_Q11 varchar(4000),
    Interview_Q12 varchar(4000),
    Interview_Q13 varchar(4000),
    Interview_Q14 varchar(4000),
    Interview_Q15 varchar(4000),
    Interview_Q16 varchar(4000),
    Interview_Q17 varchar(4000),
    Interview_Q18 varchar(4000),
    Interview_Q19 varchar(4000),
    Interview_Q20 varchar(4000),
    Interview_Q21 varchar(4000),
    Interview_Q22 varchar(4000),
    Interview_Q23 varchar(4000),
    Interview_Q24 varchar(4000),
    Interview_Created_By varchar(4000),
    date_Stamp timestamp DEFAULT CURRENT_TIMESTAMP
);

-- table index
create index Student_Portal_Parents_Details_i1 on Student_Portal_Parents_Details (Student_Details_Portal_id);

-- table index
create index Student_Portal_University_Details_i1 on Student_Portal_University_Details (Student_Details_Portal_id);

-- table index
create index Student_Portal_Expense_Details_i1 on Student_Portal_Expense_Details (Student_Details_Portal_id);

-- table index
create index Student_Portal_Assets_Liabilities_i1 on Student_Portal_Assets_Liabilities (Student_Details_Portal_id);

-- table index
create index Student_Portal_Attachments_i1 on Student_Portal_Attachments (Student_Details_Portal_id);

-- table index
create index Student_Portal_About_Me_i1 on Student_Portal_About_Me (Student_Details_Portal_id);

-- table index
create index Student_Portal_Payments_i1 on Student_Portal_Payments (Student_Details_Portal_id);

-- table index
create index Student_Portal_Results_i1 on Student_Portal_Results (Student_Details_Portal_id);

-- table index
create index Student_Portal_Voluntary_Service_i1 on Student_Portal_Voluntary_Service (Student_Details_Portal_id);

-- table index
create index Student_Portal_Interview_i1 on Student_Portal_Interview (Student_Details_Portal_id);

-- table index
create index Student_portal_users_i1 on Student_portal_users(user_id);
