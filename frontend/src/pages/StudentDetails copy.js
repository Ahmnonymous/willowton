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
  TableCell,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DrawerForm from "./Drawer/StudentDetailDrawer";
import AboutusDrawer from "./Drawer/AboutUsDrawer";
import ParentsDrawer from "./Drawer/ParentsDrawer";
import UniversityDetailsDrawer from "./Drawer/UniversityDetailsDrawer";
import AttachmentsDrawer from "./Drawer/AttachmentsDrawer";
import ExpenseDetailsDrawer from "./Drawer/ExpenseDetailsDrawer";
import AssetsLiabilitiesDrawer from "./Drawer/AssetsLiabilitiesDrawer";
import AcademicResultsDrawer from "./Drawer/AcademicResultsDrawer";
import VoluntaryServiceDrawer from "./Drawer/VoluntaryServiceDrawer";
import PaymentDrawer from "./Drawer/PaymentDrawer";
import InterviewDrawer from "./Drawer/InterviewDrawer";
import TaskDetailsDrawer from "./Drawer/TaskDetailsDrawer";
import { ThemeContext } from "../config/ThemeContext";
import DownloadIcon from "@mui/icons-material/Download";
import { pdf } from "@react-pdf/renderer";
import StudentPDFDocument from "./StudentPDFDocument";

const StudentDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
  const [tasksDrawerOpen, setTasksDrawerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [studentData, setStudentData] = useState(null);
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
  const [tasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isDarkMode } = useContext(ThemeContext);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user?.user_type === "admin";
  const isStudent = user?.user_type === "student";

  const pageStyle = {
    backgroundColor: isDarkMode ? "#1e293b" : "#e1f5fe",
    color: isDarkMode ? "#ffffff" : "#000000",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-GB", options).replace(",", "");
    return formattedDate.replace(/\//g, "/");
  };

  const fetchStudentDetails = useCallback(async () => {
    try {
      const userId = user.user_id;
      let response;
      if (isAdmin) {
        response = await fetch("https://willowtonbursary.co.za/api/student-details");
      } else if (isStudent && userId) {
        response = await fetch(`https://willowtonbursary.co.za/api/student-detail/${userId}`);
      } else {
        console.error("User type is neither admin nor student or user ID is missing");
        return {};
      }

      const data = await response.json();
      if (data) {
        const updatedStudent = Array.isArray(data) ? data[0] : data;
        Object.keys(updatedStudent).forEach((key) => {
          if (key.toLowerCase().includes("date_stamp")) {
            updatedStudent[key] = formatDate(updatedStudent[key]);
          }
        });
        setStudentDetails(Array.isArray(data) ? data : [updatedStudent]);
        setSelectedStudent(updatedStudent);
        setSelectedStudentid(updatedStudent.id);
      }
      return data;
    } catch (error) {
      console.error("Error fetching student details:", error);
      return {};
    }
  }, [isAdmin, isStudent, user.user_id]);

  const fetchStudentData = async (studentId) => {
    if (!studentId) {
      setStudentData(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`https://willowtonbursary.co.za/api/student-data/${studentId}`);
      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setStudentData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStudentDetails();
        if (mounted && data.length > 0) {
          setSelectedStudent(data[0]);
          setSelectedStudentid(data[0].id);
          await fetchStudentData(data[0].id);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    initializeData();
    return () => {
      mounted = false;
    };
  }, [fetchStudentDetails]);

  useEffect(() => {
    let mounted = true;
    if (selectedStudent) {
      setIsLoading(true);
      const fetchAllData = async () => {
        try {
          const responses = await Promise.all(
            [
              "about-me",
              "parents-details",
              "university-details",
              "attachments",
              "expenses-summary",
              "assets-liabilities",
              "academic-results",
              "voluntary-services",
              "payments",
              "interviews",
              "tasks",
            ].map((key) =>
              fetch(`https://willowtonbursary.co.za/api/${key}/${selectedStudent.id}`)
                .then((res) => res.json())
                .catch(() => [])
            )
          );

          const formatResponseData = (data) => {
            if (!Array.isArray(data)) return [];
            return data.map((item) => {
              const updatedItem = { ...item };
              Object.keys(updatedItem).forEach((key) => {
                if (key.toLowerCase().endsWith("date_stamp") && updatedItem[key]) {
                  updatedItem[key] = formatDate(updatedItem[key]);
                }
              });
              return updatedItem;
            });
          };

          if (mounted) {
            setAboutMe(formatResponseData(responses[0]));
            setParentsDetails(formatResponseData(responses[1]));
            setUniversityDetails(formatResponseData(responses[2]));
            setAttachments(formatResponseData(responses[3]));
            setExpensesSummary(formatResponseData(responses[4]));
            setAssetsLiabilities(formatResponseData(responses[5]));
            setAcademicResults(formatResponseData(responses[6]));
            setVoluntaryServices(formatResponseData(responses[7]));
            setPayments(formatResponseData(responses[8]));
            setInterviews(formatResponseData(responses[9]));
            setTasks(formatResponseData(responses[10]));
            await fetchStudentData(selectedStudent.id); // Fetch student data after other data
          }
        } catch (error) {
          console.error("Error fetching section data:", error);
        } finally {
          if (mounted) setIsLoading(false);
        }
      };
      fetchAllData();
    }
    return () => {
      mounted = false;
    };
  }, [selectedStudent]);

  const handleDeleteStudent = async (studentId) => {
    if (isStudent) {
      setSelectedStudent(null);
      setSelectedStudentid(null);
      setStudentData(null);
    } else if (isAdmin) {
      const remainingStudents = studentDetails.filter((student) => student.id !== studentId);
      if (remainingStudents.length > 0) {
        const nextStudent = remainingStudents[0];
        setSelectedStudent(nextStudent);
        setSelectedStudentid(nextStudent.id);
        await fetchStudentData(nextStudent.id);
      } else {
        setSelectedStudent(null);
        setSelectedStudentid(null);
        setStudentData(null);
      }
      await fetchStudentDetails();
    }
  };

  const isStudentWithNoData = isStudent && !selectedStudent;
  const isUserWithData = (isAdmin || isStudent) && selectedStudent;
  const isSelectedStudent = selectedStudent;

  const fetchAboutMe = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/about-me/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setAboutMe(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error refetching About Me:", error);
    }
  };

  const fetchParentsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/parents-details/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setParentsDetails(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching parent details:", error);
    }
  };

  const fetchUniversityDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/university-details/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setUniversityDetails(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching university details:", error);
    }
  };

  const fetchAttachmentsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/attachments/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setAttachments(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  const fetchExpenseDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/expense-details/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setExpensesSummary(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  const fetchAssetsLiabilities = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/assets-liabilities/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setAssetsLiabilities(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching assets & liabilities:", error);
    }
  };

  const fetchAcademicResults = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/academic-results/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setAcademicResults(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching academic results:", error);
    }
  };

  const fetchVoluntaryServices = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/voluntary-service/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setVoluntaryServices(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching voluntary services:", error);
    }
  };

  const fetchPaymentsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/payments/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setPayments(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching payments details:", error);
    }
  };

  const fetchInterviewsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/interviews/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setInterviews(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  const fetchTasks = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/tasks/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.toLowerCase().endsWith("date_stamp")) {
                updatedItem[key] = formatDate(updatedItem[key]);
              }
            });
            return updatedItem;
          })
        : [];
      setTasks(formattedData);
      await fetchStudentData(studentId); // Refresh student data
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const renderDrawer = () => (
    <DrawerForm
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      studentId={selectedStudentid}
      onSave={async (savedStudent) => {
        if (savedStudent && typeof savedStudent === "object" && savedStudent.id) {
          const formattedStudent = {
            ...savedStudent,
            ...Object.keys(savedStudent).reduce((acc, key) => {
              if (key.toLowerCase().includes("date") && savedStudent[key]) {
                acc[key] = formatDate(savedStudent[key]);
              } else {
                acc[key] = savedStudent[key];
              }
              return acc;
            }, {}),
          };
          setStudentDetails((prev) => {
            const existingIndex = prev.findIndex((s) => s.id === savedStudent.id);
            if (existingIndex >= 0) {
              const updatedDetails = [...prev];
              updatedDetails[existingIndex] = formattedStudent;
              return updatedDetails;
            } else {
              return [...prev, formattedStudent];
            }
          });
          setSelectedStudent(formattedStudent);
          setSelectedStudentid(formattedStudent.id);
          await fetchStudentData(formattedStudent.id); // Refresh student data
        } else {
          console.error("Invalid savedStudent data:", savedStudent);
        }
        setDrawerOpen(false);
        await fetchStudentDetails();
      }}
      onDelete={handleDeleteStudent}
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
    { label: "Tasks", key: "tasks" },
  ];

  if (isAdmin) {
    tabSections.splice(9, 0, { label: "Payments", key: "payments" }, { label: "Interviews", key: "interviews" });
  }

  const capitalizeWords = (str) => {
    if (str.toLowerCase() === "student id passport number") {
      return "ID/Passport Number";
    }
    if (str.toLowerCase() === "student willow relationship") {
      return "Willowton Group Relationship";
    }
    const formattedStr = str.replace(/^student /i, "").replace(/_/g, "");
    return formattedStr.replace(/\b\w/g, (char) => char.toUpperCase());
  };

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
      "interviews": interviews,
      "tasks": tasks,
    };
    return mapping[key] || [];
  };

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
    const isTasks = sectionKey === "tasks";

    if ((isPayments || isInterview) && !isAdmin) return null;

    return (
      <Box sx={{ padding: 0, border: "1px solid #ccc", marginBottom: 2, backgroundColor: isDarkMode ? "#1e293b" : "white", color: pageStyle.color }}>
        <Box sx={{ padding: 1, display: "flex", alignItems: "center", marginBottom: 0.5, borderBottom: 1, borderBottomColor: "#ccc", height: 40, backgroundColor: isDarkMode ? "#1e293b" : "#e1f5fe" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: 1 }}>
            {capitalizeWords(sectionKey === "expenses-summary" ? "financial-details" : sectionKey)}
          </Typography>
          {isSelectedStudent &&
            (isAboutMe ||
              isParents ||
              isUniversityDetails ||
              isAttachments ||
              isExpenses ||
              isAssetsLiabilities ||
              isAcademicResults ||
              isVoluntaryServices ||
              isPayments ||
              isInterview ||
              isTasks) && (
              <Button
                sx={{ marginLeft: "auto", color: isDarkMode ? "white" : "black" }}
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
                    setEditingUniversityId(null);
                    setUniversityDetailsDrawerOpen(true);
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
                  if (isTasks) {
                    setEditingTaskId(null);
                    setTasksDrawerOpen(true);
                  }
                }}
              >
                <AddIcon fontSize="small" />
              </Button>
            )}
        </Box>
        {data.length > 0 && (
          <Table sx={{ maxHeight: 400, overflowY: "auto", display: "block" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: "50px" }} />
                {Object.keys(data[0])
                  .filter((field) => field !== "id" && field !== "student_details_portal_id")
                  .map((field, idx) => (
                    <TableCell
                      key={idx}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 300,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        color: isDarkMode ? "white" : "black",
                      }}
                    >
                      {capitalizeWords(field.replace(/_/g, " "))}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ width: "50px" }}>
                    {(isAboutMe ||
                      isParents ||
                      isUniversityDetails ||
                      isAttachments ||
                      isExpenses ||
                      isAssetsLiabilities ||
                      isAcademicResults ||
                      isVoluntaryServices ||
                      isPayments ||
                      isInterview ||
                      isTasks) && (
                      <EditIcon
                        sx={{ cursor: "pointer", fontSize: "large", color: isDarkMode ? "white" : "black" }}
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
                            setEditingUniversityId(row.id);
                            setUniversityDetailsDrawerOpen(true);
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
                          if (isTasks) {
                            setEditingTaskId(row.id);
                            setTasksDrawerOpen(true);
                          }
                        }}
                      />
                    )}
                  </TableCell>
                  {Object.entries(row).map(([key, val], j) =>
                    key !== "id" && key !== "student_details_portal_id" && (
                      <TableCell key={j} sx={{ color: isDarkMode ? "white" : "black" }}>
                        {typeof val === "object" && val !== null
                          ? key.toLowerCase().includes("attachment") ||
                            key.toLowerCase().includes("proof_of_service") ||
                            key.toLowerCase().includes("proof_of_payment")
                            ? "📎 File attached"
                            : JSON.stringify(val)
                          : val}
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
      ? tabSections
          .filter((s) => s.key !== "show_all")
          .map((sec, i) => (
            (isAdmin || (sec.key !== "payments" && sec.key !== "interviews")) && (
              <TabContent key={i} sectionKey={sec.key} data={dataForSection(sec.key)} />
            )
          ))
      : <TabContent sectionKey={section.key} data={dataForSection(section.key)} />;
  };

  const handleDownloadPDF = async () => {
    if (!selectedStudent || !studentData) {
      console.error("No selected student or student data available for PDF generation");
      return;
    }
    try {
      const blob = await pdf(<StudentPDFDocument studentData={studentData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const firstName = selectedStudent.student_name || "Unknown";
      const lastName = selectedStudent.student_surname || "User";
      a.download = `${firstName} ${lastName} - Student Details PDF.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          padding: "12px",
          backgroundColor: isDarkMode ? "#1e293b" : "#e1f5fe",
          borderRadius: "8px",
          marginBottom: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #ccc",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: isDarkMode ? "white" : "black" }}
        >
          Student Details
        </Typography>
        {isStudentWithNoData && (
          <Button
            variant="contained"
            onClick={() => {
              setSelectedStudentid(null);
              setDrawerOpen(true);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: isDarkMode ? "white" : "black",
              color: isDarkMode ? "black" : "white",
              padding: "2px 6px",
              textTransform: "none",
            }}
          >
            <AddIcon sx={{ marginRight: 1, fontSize: "small" }} />
            Start Application
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {isAdmin && (
          <Grid item xs={12} sm={3} md={2}>
            <Paper
              sx={{
                border: "1px solid #ccc",
                backgroundColor: isDarkMode ? "#1e293b" : "white",
                color: pageStyle.color,
              }}
            >
              <Box
                sx={{
                  backgroundColor: isDarkMode ? "#1e293b" : "#e1f5fe",
                  padding: "6px",
                  borderBottom: isDarkMode ? "1px solid white" : "1px solid #ccc",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: isDarkMode ? "white" : "#1e293b",
                    marginLeft: 1,
                  }}
                >
                  Search
                </Typography>
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
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: isDarkMode ? "#1e293b" : "white",
                      "& fieldset": {
                        borderColor: isDarkMode ? "white" : "#1e293b",
                      },
                      "&:hover fieldset": {
                        borderColor: isDarkMode ? "white" : "#1e293b",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isDarkMode ? "white" : "#1e293b",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: isDarkMode ? "white" : "#1e293b",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: isDarkMode ? "#B0B0B0" : "#666",
                    },
                  }}
                  placeholder="Search"
                  InputLabelProps={{ style: { color: isDarkMode ? "#ffffff" : "#000000" } }}
                />
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {studentDetails
                    .filter(
                      (s) =>
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
                          backgroundColor:
                            selectedStudent?.id === student.id
                              ? isDarkMode
                                ? "white"
                                : "#1e293b"
                              : "transparent",
                          color:
                            selectedStudent?.id === student.id
                              ? isDarkMode
                                ? "#1e293b"
                                : "white"
                              : "inherit",
                          "&:hover": {
                            backgroundColor: isDarkMode ? "white" : "#1e293b",
                            color: isDarkMode ? "#1e293b" : "white",
                          },
                        }}
                        onClick={async () => {
                          setSelectedStudent(student);
                          setSelectedStudentid(student.id);
                          await fetchStudentData(student.id);
                        }}
                      >
                        <CardContent sx={{ padding: "10px" }}>
                          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                            {student.student_name}
                          </Typography>
                          <Typography variant="body2">{student.student_surname}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </Box>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} sm={9} md={isStudent ? 12 : 10}>
          <Paper
            sx={{
              border: "1px solid #ccc",
              backgroundColor: isDarkMode ? "#1e293b" : "white",
              color: pageStyle.color,
            }}
          >
            <Box
              sx={{
                backgroundColor: isDarkMode ? "#1e293b" : "#e1f5fe",
                borderBottom: isDarkMode ? "1px solid white" : "1px solid #ccc",
                padding: "6px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: isDarkMode ? "white" : "#1e293b", marginLeft: 1 }}
              >
                Student Details Portal
              </Typography>
              {isUserWithData && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0, margin: 0, padding: 0 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDrawerOpen(false);
                      setTimeout(() => setDrawerOpen(true), 50);
                      setSelectedStudentid(selectedStudent?.id);
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: isDarkMode ? "white" : "black",
                      color: isDarkMode ? "black" : "white",
                      padding: "2px 6px",
                      margin: 0,
                      textTransform: "none",
                    }}
                  >
                    <EditIcon sx={{ marginRight: 1, fontSize: "small" }} />
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDownloadPDF}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: isDarkMode ? "white" : "black",
                      color: isDarkMode ? "black" : "white",
                      padding: "2px 6px",
                      margin: 0,
                      textTransform: "none",
                      marginLeft: 1,
                    }}
                  >
                    <DownloadIcon sx={{ marginRight: 1, fontSize: "small" }} />
                    Download PDF
                  </Button>
                </Box>
              )}
            </Box>

            {isLoading ? (
              <Box sx={{ padding: 2 }}>
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  Loading...
                </Typography>
              </Box>
            ) : selectedStudent ? (
              <Box sx={{ padding: 1.5 }}>
                <Grid container spacing={1}>
                  {Object.entries(selectedStudent).map(([key, value], i) => (
                    key !== "id" &&
                    key !== "user_id" &&
                    key !== "employment_status_attachment" && (
                      <React.Fragment key={i}>
                        <Grid item xs={6} sx={{ borderBottom: "1px solid #ccc", pb: "6px" }}>
                          <Typography variant="body1">
                            <strong>{capitalizeWords(key.replace(/_/g, " "))}</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ borderBottom: "1px solid #ccc", pb: "6px" }}>
                          <Typography variant="body1">{value}</Typography>
                        </Grid>
                      </React.Fragment>
                    )
                  ))}
                </Grid>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ m: 2, fontWeight: "bold" }}>
                No Record Selected
              </Typography>
            )}

            <Box sx={{ p: 1, overflowX: "auto" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="tabs"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: "600",
                    textTransform: "capitalize",
                    mr: -2,
                    color: isDarkMode ? "white" : "black",
                  },
                }}
              >
                {tabSections.map((section, i) => (
                  <Tab key={i} label={section.label} />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ p: 2 }}>{renderTabContent(tabValue)}</Box>
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
            fetchPaymentsDetails(selectedStudentid);
          }
          setPaymentDrawerOpen(false);
          setEditingPaymentId(null);
        }}
      />

      <InterviewDrawer
        open={interviewDrawerOpen}
        onClose={() => setInterviewDrawerOpen(false)}
        studentId={selectedStudentid}
        recordId={editingInterviewId}
        onSave={() => {
          if (selectedStudentid) {
            fetchInterviewsDetails(selectedStudentid);
          }
          setInterviewDrawerOpen(false);
          setEditingInterviewId(null);
        }}
      />

      <TaskDetailsDrawer
        open={tasksDrawerOpen}
        onClose={() => {
          setTasksDrawerOpen(false);
          setEditingTaskId(null);
        }}
        studentId={selectedStudentid}
        taskId={editingTaskId}
        onSave={() => {
          if (selectedStudentid) {
            fetchTasks(selectedStudentid);
          }
          setTasksDrawerOpen(false);
          setEditingTaskId(null);
        }}
      />
    </div>
  );
};

export default StudentDetails;