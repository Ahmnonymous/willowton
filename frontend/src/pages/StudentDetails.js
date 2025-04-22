import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DrawerForm from './Drawer/StudentDetailDrawer';
import AboutusDrawer from './Drawer/AboutUsDrawer';
import ParentsDrawer from './Drawer/ParentsDrawer';
import UniversityDetailsDrawer from './Drawer/UniversityDetailsDrawer';
import AttachmentsDrawer from './Drawer/AttachmentsDrawer';
import ExpenseDetailsDrawer from './Drawer/ExpenseDetailsDrawer';
import AssetsLiabilitiesDrawer from './Drawer/AssetsLiabilitiesDrawer';
import AcademicResultsDrawer from './Drawer/AcademicResultsDrawer';
import VoluntaryServiceDrawer from './Drawer/VoluntaryServiceDrawer';
import PaymentDrawer from './Drawer/PaymentDrawer';  
import InterviewDrawer from './Drawer/InterviewDrawer';
import { ThemeContext } from '../config/ThemeContext'; // Import ThemeContext

const StudentDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkMode } = useContext(ThemeContext); // Access theme context
  const [studentDetails, setStudentDetails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentid, setSelectedStudentid] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutMeDrawerOpen, setAboutMeDrawerOpen] = useState(false);
  const [editingAboutMeId, setEditingAboutMeId] = useState(null);
  const [parentsDrawerOpen, setParentsDrawerOpen] = useState(false);
  const [editingParentId, setEditingParentId] = useState(null);
  const [universityDetailsDrawerOpen, setUniversityDetailsDrawerOpen] = useState(false);
  const [editingUniversityId, setEditingUniversityId] = useState(null);
  const [attachmentsDrawerOpen, setAttachmentsDrawerOpen] = useState(false);
  const [editingAttachmentId, setEditingAttachmentId] = useState(null);
  const [expenseDetailsDrawerOpen, setExpensesSummaryDrawerOpen] = useState(false);
  const [editingExpenseDetailsId, setEditingExpenseDetailsId] = useState(null);
  const [assetsLiabilitiesDrawerOpen, setAssetsLiabilitiesDrawerOpen] = useState(false);
  const [editingAssetLiabilityId, setEditingAssetLiabilityId] = useState(null);
  const [academicResultsDrawerOpen, setAcademicResultsDrawerOpen] = useState(false);
  const [editingAcademicResultId, setEditingAcademicResultId] = useState(null);
  const [voluntaryServiceDrawerOpen, setVoluntaryServiceDrawerOpen] = useState(false);
  const [editingVoluntaryServiceId, setEditingVoluntaryServiceId] = useState(null);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [interviewDrawerOpen, setInterviewDrawerOpen] = useState(false);
  const [editingInterviewId, setEditingInterviewId] = useState(null);

  // Add this to the top of your StudentDetails component
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.user_type === 'admin';
  const isStudent = user?.user_type === 'student';

  // Define background and text colors based on theme
  const pageStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe',
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  const fetchStudentDetails = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));  // Get the user object from local storage
      const userId = user.user_id;  // Get the user ID from the logged-in user
  
      // If user is an admin, fetch all student details
      let response;
      if (user.user_type === 'admin') {
        response = await fetch("https://willowtonbursary.co.za/api/student-details");
      } 
      // If user is a student, fetch their specific student details
      else if (user.user_type === 'student' && userId) {
        response = await fetch(`https://willowtonbursary.co.za/api/student-detail/${userId}`);
      } else {
        console.error("User type is neither admin nor student or user ID is missing");
        return [];
      }
  
      const data = await response.json();
      if(data){
      setStudentDetails(data);  // Set the student details state
      setSelectedStudent(data);
      setSelectedStudentid(data.id);
      }
      console.log(data);
      return data;
  
    } catch (error) {
      console.error("Error fetching student details:", error);
      return [];
    }
  }, []);  

  const isStudentWithNoData = isStudent && !selectedStudent;
  const isUserWithData = (isAdmin || isStudent) && selectedStudent;

  const fetchAboutMe = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/about-me/${studentId}`);
      const data = await response.json();
      setAboutMe(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error refetching About Me:", error);
    }
  };

  const fetchParentsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/parents-details/${studentId}`);
      const data = await response.json();
      setParentsDetails(data);
    } catch (error) {
      console.error("Error fetching parent details:", error);
    }
  };

  const fetchUniversityDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/university-details/${studentId}`);
      const data = await response.json();
      setUniversityDetails(data);
    } catch (error) {
      console.error("Error fetching university details:", error);
    }
  };

  const fetchAttachmentsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/attachments/${studentId}`);
      const data = await response.json();
      setAttachments(data);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  const fetchExpenseDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/expense-details/${studentId}`);
      const data = await response.json();
      setExpensesSummary(data);
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  const fetchAssetsLiabilities = async (studentId) => {
    try {
      const res = await fetch(`https://willowtonbursary.co.za/api/assets-liabilities/${studentId}`);
      const data = await res.json();
      setAssetsLiabilities(data);
    } catch (err) {
      console.error("Error fetching assets & liabilities:", err);
    }
  };

  const fetchAcademicResults = async (studentId) => {
    try {
      const res = await fetch(`https://willowtonbursary.co.za/api/academic-results/${studentId}`);
      const data = await res.json();
      setAcademicResults(data);
    } catch (err) {
      console.error("Error fetching academic results:", err);
    }
  };

  const fetchVoluntaryServices = async (studentId) => {
    try {
      const res = await fetch(`https://willowtonbursary.co.za/api/voluntary-service/${studentId}`);
      const data = await res.json();
      setVoluntaryServices(data);
    } catch (err) {
      console.error("Error fetching voluntary services:", err);
    }
  };

  const fetchPaymentsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/payments/${studentId}`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments details:", error);
    }
  };

  const fetchInterviewsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/interviews/${studentId}`);
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  useEffect(() => {
    fetchStudentDetails().then((data) => {
      if (data.length > 0) {
        setSelectedStudent(data[0]);
        setSelectedStudentid(data[0].id);
      }
    });
  }, [fetchStudentDetails]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // const renderDrawer = () => (
  //   <DrawerForm
  //     open={drawerOpen}
  //     onClose={() => setDrawerOpen(false)}
  //     studentId={selectedStudentid}
  //     onSave={(savedStudent) => {
  //       fetchStudentDetails().then((updatedList) => {
  //         if (savedStudent?.id) {
  //           setSelectedStudentid(savedStudent.id);
  //           setSelectedStudent(savedStudent);
  //         } else {
  //           if (updatedList.length > 0) {
  //             setSelectedStudent(updatedList[0]);
  //             setSelectedStudentid(updatedList[0].id);
  //           } else {
  //             setSelectedStudent(null);
  //             setSelectedStudentid(null);
  //           }
  //         }
  //       });
  //       setDrawerOpen(false);
  //     }}
  //   />
  // );

  const renderDrawer = () => (
    <DrawerForm
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      studentId={selectedStudentid}
      onSave={(savedStudent) => {
        console.log("Saving student data...");
  
        // Fetch updated student details after saving
        fetchStudentDetails().then((updatedList) => {
          console.log("Fetched updated student details after save:", updatedList);
  
          if (savedStudent?.id) {
            console.log("Saved student has ID:", savedStudent.id);
  
            // If savedStudent has an ID, update selectedStudent with the saved data
            setSelectedStudentid(savedStudent.id);
            setSelectedStudent(savedStudent);
  
            console.log("Updated selected student:", savedStudent);
          } else {
            // If no savedStudent, check the updated list and set the first student (if any)
            if (updatedList.length > 0) {
              console.log("No savedStudent, but updated list available. Setting first student:", updatedList[0]);
              setSelectedStudent(updatedList[0]);
              setSelectedStudentid(updatedList[0].id);
            } else {
              // If the list is empty, reset the selectedStudent and selectedStudentid
              console.log("No students found in the updated list. Resetting selected student.");
              setSelectedStudent(null);
              setSelectedStudentid(null);
            }
          }
        });
  
        // Close the drawer after saving
        console.log("Closing drawer after save.");
        setDrawerOpen(false);
      }}
    />
  );
  

  const tabSections = [
    { label: "Show all", key: "show_all" },
    { label: "About Me", key: "about-me" },
    { label: "Parents Details", key: "parents-details" },
    { label: "University Details", key: "university-details" },
    { label: "Attachments", key: "attachments" },
    { label: "Financial Details", key: "expenses-summary" },
    { label: "Assets & Liabilities", key: "assets-liabilities" },
    { label: "Academic Results", key: "academic-results" },
    { label: "Voluntary Services", key: "voluntary-services" },
    { label: "Payments", key: "payments" },
    { label: "Interviews", key: "interviews" }
  ];

  const capitalizeWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase()).replace(/-/g, ' ');

  const dataForSection = (key) => {
    const mapping = {
      "about-me": aboutMe,
      "parents-details": parentsDetails,
      "university-details": universityDetails,
      "attachments": attachments,
      "expenses-summary": expensesSummary,
      "assets-liabilities": assetsLiabilities,
      "academic-results": academicResults,
      "voluntary-services": voluntaryServices,
      "payments": payments,
      "interviews": interviews
    };
    return mapping[key] || [];
  };

  const [aboutMe, setAboutMe] = useState(null);
  const [parentsDetails, setParentsDetails] = useState(null);
  const [universityDetails, setUniversityDetails] = useState(null);
  const [attachments, setAttachments] = useState(null);
  const [expensesSummary, setExpensesSummary] = useState(null);
  const [assetsLiabilities, setAssetsLiabilities] = useState(null);
  const [academicResults, setAcademicResults] = useState(null);
  const [voluntaryServices, setVoluntaryServices] = useState(null);
  const [payments, setPayments] = useState(null);
  const [interviews, setInterviews] = useState(null);

  useEffect(() => {
    if (selectedStudent) {
      const fetchAllData = async () => {
        try {
          const responses = await Promise.all(
            ["about-me", "parents-details", "university-details", "attachments", "expenses-summary", "assets-liabilities", "academic-results", "voluntary-services", "payments", "interviews"]
              .map((key) => fetch(`https://willowtonbursary.co.za/api/${key}/${selectedStudent.id}`).then(res => res.json()))
          );

          setAboutMe(responses[0]);
          setParentsDetails(responses[1]);
          setUniversityDetails(responses[2]);
          setAttachments(responses[3]);
          setExpensesSummary(responses[4]);
          setAssetsLiabilities(responses[5]);
          setAcademicResults(responses[6]);
          setVoluntaryServices(responses[7]);
          setPayments(responses[8]);
          setInterviews(responses[9]);
        } catch (error) {
          console.error("Error fetching section data:", error);
        }
      };

      fetchAllData();
    }
  }, [selectedStudent]);

  const renderRegion = (sectionKey, data) => {
    if (!data) return null;

    const isAboutMe = sectionKey === "about-me";
    const isParents = sectionKey === "parents-details";
    const isUniversityDetails = sectionKey === "university-details";  
    const isAttachments = sectionKey === "attachments";
    const isExpenses = sectionKey === "expenses-summary";
    const isAssetsLiabilities = sectionKey === "assets-liabilities";
    const isAcademicResults = sectionKey === "academic-results";
    const isVoluntaryServices = sectionKey === "voluntary-services";
    const isPayments = sectionKey === "payments";
    const isInterview = sectionKey === "interviews";

    return (
      <Box sx={{ padding: 0, border: '1px solid #ccc', marginBottom: 2, backgroundColor: isDarkMode ? '#1e293b' : 'white', color: pageStyle.color }}>
        <Box sx={{ padding: 1,display: 'flex', alignItems: 'center', marginBottom: 0.5, borderBottom: 1, borderBottomColor: '#ccc', height: 40,backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: 1 }}>
            {capitalizeWords(sectionKey === "expenses-summary" ? "financial-details" : sectionKey)}
          </Typography>

          {(isAboutMe || isParents || isUniversityDetails || isAttachments || isExpenses 
          || isAssetsLiabilities || isAcademicResults || isVoluntaryServices || isPayments || isInterview) && (
            <Button
              sx={{ marginLeft: 'auto', color: isDarkMode ? 'white': 'black' }}
              onClick={() => {
                if (isAboutMe) {
                  setEditingAboutMeId(null);
                  setAboutMeDrawerOpen(true);
                }
                if (isParents) {
                  setEditingParentId(null);
                  setParentsDrawerOpen(true);
                }
                if (isUniversityDetails) {
                  setEditingUniversityId(null);  // Reset the ID for university details
                  setUniversityDetailsDrawerOpen(true);  // Open the university details drawer
                }
                if (isAttachments) {
                  setEditingAttachmentId(null);
                  setAttachmentsDrawerOpen(true);
                }     
                if (isExpenses) {
                  setEditingExpenseDetailsId(null);
                  setExpensesSummaryDrawerOpen(true);
                }     
                if (isAssetsLiabilities) {
                  setEditingAssetLiabilityId(null);
                  setAssetsLiabilitiesDrawerOpen(true);
                }    
                if (isAcademicResults) {
                  setEditingAcademicResultId(null);
                  setAcademicResultsDrawerOpen(true);
                }        
                if (isVoluntaryServices) {
                  setEditingVoluntaryServiceId(null);
                  setVoluntaryServiceDrawerOpen(true);
                }        
                if (isPayments) {
                  setEditingPaymentId(null);
                  setPaymentDrawerOpen(true);
                }    
                if (isInterview) {
                  setEditingInterviewId(null);
                  setInterviewDrawerOpen(true);
                }         
              }}
            >
              <AddIcon fontSize="small" />
            </Button>
          )}
        </Box>

        {data.length > 0 && (
          <Table sx={{ maxHeight: 400, overflowY: 'auto', display: 'block' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '50px' }} />
                {Object.keys(data[0])
                  .filter(field => field !== "id" && field !== "student_details_portal_id")
                  .map((field, idx) => (
                    <TableCell key={idx} 
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 300,
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                      color: isDarkMode ? 'white': 'black'
                    }}>
                      {capitalizeWords(field.replace(/_/g, " "))}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ width: '50px' }}>
                    {(isAboutMe || isParents || isUniversityDetails || isAttachments || isExpenses 
                    || isAssetsLiabilities || isAcademicResults || isVoluntaryServices || isPayments || isInterview) && (
                      <EditIcon
                        sx={{ cursor: 'pointer', fontSize: 'large',color: isDarkMode ? 'white': 'black' }}
                        onClick={() => {
                          if (isAboutMe) {
                            setEditingAboutMeId(row.id);
                            setAboutMeDrawerOpen(true);
                          }
                          if (isParents) {
                            setEditingParentId(row.id);
                            setParentsDrawerOpen(true);
                          }
                          if (isUniversityDetails) {
                            setEditingUniversityId(row.id);  // Set the university ID for editing
                            setUniversityDetailsDrawerOpen(true);  // Open the university details drawer
                          }
                          if (isAttachments) {
                            setEditingAttachmentId(row.id);
                            setAttachmentsDrawerOpen(true);
                          }    
                          if (isExpenses) {
                            setEditingExpenseDetailsId(row.id);
                            setExpensesSummaryDrawerOpen(true);
                          }  
                          if (isAssetsLiabilities) {
                            setEditingAssetLiabilityId(row.id);
                            setAssetsLiabilitiesDrawerOpen(true);
                          }          
                          if (isAcademicResults) {
                            setEditingAcademicResultId(row.id);
                            setAcademicResultsDrawerOpen(true);
                          }    
                          if (isVoluntaryServices) {
                            setEditingVoluntaryServiceId(row.id);
                            setVoluntaryServiceDrawerOpen(true);
                          }   
                          if (isPayments) {
                            setEditingPaymentId(row.id);
                            setPaymentDrawerOpen(true);
                          }           
                          if (isInterview) {
                            setEditingInterviewId(row.id);
                            setInterviewDrawerOpen(true);
                          }                                                 
                        }}
                      />
                    )}
                  </TableCell>
                  {Object.entries(row).map(([key, val], j) =>
                    key !== "id" && key !== "student_details_portal_id" && (
                      <TableCell key={j} sx={{ color: isDarkMode ? 'white': 'black' }}>
                        {typeof val === 'object' && val !== null
                          ? (key.toLowerCase().includes("attachment") || key.toLowerCase().includes("proof_of_service")
                          || key.toLowerCase().includes("proof_of_payment")
                          ? "📎 File attached"
                          : JSON.stringify(val))
                          : val
                        }
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    );
  };

  const TabContent = ({ sectionKey, data }) => renderRegion(sectionKey, data);

  const renderTabContent = (tabValue) => {
    const section = tabSections[tabValue];
    return section.key === "show_all"
      ? tabSections.filter(s => s.key !== "show_all").map((sec, i) => (
        <TabContent key={i} sectionKey={sec.key} data={dataForSection(sec.key)} />
      ))
      : <TabContent sectionKey={section.key} data={dataForSection(section.key)} />;
  };

  return (
    <div> 
      {/* style={{ backgroundColor: pageStyle.backgroundColor, color: pageStyle.color }}> */}
      <Box sx={{ padding: "12px", backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe' , borderRadius: "8px", marginBottom: "12px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ccc' }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? 'white' : 'black' }}>Student Details</Typography>

        {isStudentWithNoData && (
          <Button
            variant="contained"
            onClick={() => {
              setSelectedStudentid(null);
              setDrawerOpen(true);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isDarkMode ? 'white' : 'black',
              color: isDarkMode ? 'black' : 'white',
              padding: '2px 6px',
              textTransform: 'none',
            }}
          >
            <AddIcon sx={{ marginRight: 1, fontSize: 'small' }} />
            Create
          </Button>
        )}
      </Box>


      <Grid container spacing={3}>
  {/* Sidebar */}
  {isAdmin && (
    <Grid item xs={12} sm={3} md={2}>
      <Paper sx={{ border: '1px solid #ccc', backgroundColor: isDarkMode ? '#1e293b' : 'white' , color: pageStyle.color }}>
        <Box sx={{ backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe', padding: "6px", borderBottom: isDarkMode ? '1px solid white' : '1px solid #ccc' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold",color: isDarkMode ? 'white': '#1e293b', marginLeft: 1 }}>Search</Typography>
        </Box>
        <Box sx={{ padding: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mb: 1,
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                '& fieldset': {
                  borderColor: isDarkMode ? 'white' : '#1e293b',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'white' : '#1e293b',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? 'white' : '#1e293b',
                },
              },
              '& .MuiInputBase-input': {
                color: isDarkMode ? 'white' : '#1e293b',
              },
              '& .MuiInputBase-input::placeholder': {
                color: isDarkMode ? '#B0B0B0' : '#666',
              }
            }}
            placeholder="Search"
            InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
          />
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {studentDetails
              .filter((s) =>
                s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.student_surname.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((student, idx) => (
                <Card
                  key={idx}
                  sx={{
                    mb: 0.5,
                    boxShadow: 0,
                    height: 55,
                    cursor: "pointer",
                    backgroundColor: selectedStudent?.id === student.id ? (isDarkMode ? 'white' : '#1e293b') : 'transparent',
                    color: selectedStudent?.id === student.id ? (isDarkMode ? '#1e293b' : 'white') : "inherit",
                    "&:hover": {
                      backgroundColor: isDarkMode ? 'white' : '#1e293b',
                      color: isDarkMode ? '#1e293b' : 'white',
                    }
                  }}
                  onClick={() => {
                    setSelectedStudent(student);
                    setSelectedStudentid(student.id);
                  }}
                >
                  <CardContent sx={{ padding: "10px" }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>{student.student_name}</Typography>
                    <Typography variant="body2">{student.student_surname}</Typography>
                  </CardContent>
                </Card>
              ))}
          </div>
        </Box>
      </Paper>
    </Grid>
  )}

  {/* Right Panel */}
  <Grid item xs={12} sm={9} md={isStudent ? 12 : 10}>
    <Paper sx={{ border: '1px solid #ccc', backgroundColor: isDarkMode ? '#1e293b' : 'white', color: pageStyle.color }}>
      <Box sx={{ backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe', borderBottom: isDarkMode ? '1px solid white' : '1px solid #ccc', padding: "6px", display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? 'white' : '#1e293b', marginLeft: 1 }}>Student Details Portal</Typography>
      
      {isUserWithData && (  
        <Button
          variant="contained"
          onClick={() => {
            setDrawerOpen(false);
            setTimeout(() => setDrawerOpen(true), 50);
            setSelectedStudentid(selectedStudent?.id);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: isDarkMode ? 'white' : 'black',
            color: isDarkMode ? 'black' : 'white',
            padding: '2px 6px',
            textTransform: 'none',
          }}
        >
          <EditIcon sx={{ marginRight: 1, fontSize: 'small' }} />
          Edit 
        </Button>
      )}
      </Box>

      {selectedStudent ? (
        <Box sx={{ padding: 1.5 }}>
          <Grid container spacing={1}>
            {Object.entries(selectedStudent).map(([key, value], i) => (
              key !== "id" && key !== "user_id" && (
                <React.Fragment key={i}>
                  <Grid item xs={6} sx={{ borderBottom: '1px solid #ccc', pb: '6px' }}>
                    <Typography variant="body1"><strong>{capitalizeWords(key.replace(/_/g, " "))}</strong></Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ borderBottom: '1px solid #ccc', pb: '6px' }}>
                    <Typography variant="body1">{value}</Typography>
                  </Grid>
                </React.Fragment>
              )
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ m: 2, fontWeight: 'bold' }}>No Record Selected</Typography>
      )}

            <Box sx={{ p: 1, overflowX: 'auto' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="tabs"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    mr: -2,
                    color: isDarkMode ? 'white' : 'black'
                  }
                }}
              >
                {tabSections.map((section, i) => (
                  <Tab key={i} label={section.label} />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ p: 2 }}>
              {renderTabContent(tabValue)}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {renderDrawer()}

      <AboutusDrawer
        open={aboutMeDrawerOpen}
        onClose={() => {
          setAboutMeDrawerOpen(false);
          setEditingAboutMeId(null);
        }}
        studentId={selectedStudentid}
        aboutMeId={editingAboutMeId}
        onSave={() => {
          if (selectedStudentid) {
            fetchAboutMe(selectedStudentid);
          }
          setAboutMeDrawerOpen(false);
          setEditingAboutMeId(null);
        }}
      />

      <ParentsDrawer
        open={parentsDrawerOpen}
        onClose={() => {
          setParentsDrawerOpen(false);
          setEditingParentId(null);
        }}
        studentId={selectedStudentid}
        parentId={editingParentId}
        onSave={() => {
          if (selectedStudentid) {
            fetchParentsDetails(selectedStudentid);
          }
          setParentsDrawerOpen(false);
          setEditingParentId(null);
        }}
      />

      <UniversityDetailsDrawer
        open={universityDetailsDrawerOpen}
        onClose={() => {
          setUniversityDetailsDrawerOpen(false);
          setEditingUniversityId(null);
        }}
        studentId={selectedStudentid}
        universityDetailsId={editingUniversityId}
        onSave={() => {
          if (selectedStudentid) {
            fetchUniversityDetails(selectedStudentid);
          }
          setUniversityDetailsDrawerOpen(false);
          setEditingUniversityId(null);
        }}
      />

      <AttachmentsDrawer
        open={attachmentsDrawerOpen}
        onClose={() => {
          setAttachmentsDrawerOpen(false);
          setEditingAttachmentId(null);
        }}
        studentId={selectedStudentid}
        attachmentId={editingAttachmentId}
        onSave={() => {
          if (selectedStudentid) {
            fetchAttachmentsDetails(selectedStudentid);
          }
          setAttachmentsDrawerOpen(false);
          setEditingAttachmentId(null);
        }}
      />

      <ExpenseDetailsDrawer
        open={expenseDetailsDrawerOpen}
        onClose={() => {
          setExpensesSummaryDrawerOpen(false);
          setEditingExpenseDetailsId(null);
        }}
        studentId={selectedStudentid}
        expenseDetailsId={editingExpenseDetailsId}
        onSave={() => {
          if (selectedStudentid) {
            fetchExpenseDetails(selectedStudentid);
          }
          setExpensesSummaryDrawerOpen(false);
          setEditingExpenseDetailsId(null);
        }}
      />

      <AssetsLiabilitiesDrawer
        open={assetsLiabilitiesDrawerOpen}
        onClose={() => {
          setAssetsLiabilitiesDrawerOpen(false);
          setEditingAssetLiabilityId(null);
        }}
        studentId={selectedStudentid}
        assetLiabilityId={editingAssetLiabilityId}
        onSave={() => {
          if (selectedStudentid) fetchAssetsLiabilities(selectedStudentid);
          setAssetsLiabilitiesDrawerOpen(false);
          setEditingAssetLiabilityId(null);
        }}
      />

      <AcademicResultsDrawer
        open={academicResultsDrawerOpen}
        onClose={() => {
          setAcademicResultsDrawerOpen(false);
          setEditingAcademicResultId(null);
        }}
        studentId={selectedStudentid}
        resultId={editingAcademicResultId}
        onSave={() => {
          if (selectedStudentid) fetchAcademicResults(selectedStudentid);
          setAcademicResultsDrawerOpen(false);
          setEditingAcademicResultId(null);
        }}
      />

      <VoluntaryServiceDrawer
        open={voluntaryServiceDrawerOpen}
        onClose={() => {
          setVoluntaryServiceDrawerOpen(false);
          setEditingVoluntaryServiceId(null);
        }}
        studentId={selectedStudentid}
        recordId={editingVoluntaryServiceId}
        onSave={() => {
          if (selectedStudentid) fetchVoluntaryServices(selectedStudentid);
          setVoluntaryServiceDrawerOpen(false);
          setEditingVoluntaryServiceId(null);
        }}
      />

      <PaymentDrawer
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        studentId={selectedStudentid}
        recordId={editingPaymentId}
        onSave={() => {
          if (selectedStudentid) {
            fetchPaymentsDetails(selectedStudentid);  // Refetch payments data after saving
          }
          setPaymentDrawerOpen(false);  // Close the drawer
          setEditingPaymentId(null);  // Reset the editing ID
        }}
      />

      <InterviewDrawer
        open={interviewDrawerOpen}
        onClose={() => setInterviewDrawerOpen(false)}
        studentId={selectedStudentid}
        recordId={editingInterviewId}
        onSave={() => {
          if (selectedStudentid) {
            fetchInterviewsDetails(selectedStudentid);  // Refetch interview data after saving
          }
          setInterviewDrawerOpen(false);  // Close the drawer
          setEditingInterviewId(null);  // Reset the editing ID
        }}
      />
    </div>
  );
};

export default StudentDetails;
