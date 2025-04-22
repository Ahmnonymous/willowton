import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, CircularProgress, Box , useTheme, useMediaQuery } from '@mui/material';
import { People, Payment, VolunteerActivism, Work } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'; // Using Recharts for Pie Chart
import { useContext } from 'react';
import { ThemeContext } from '../config/ThemeContext';

const Dashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nationalityData, setNationalityData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [currentEducationData, setCurrentEducationData] = useState([]);
  const [raceData, setRaceData] = useState([]);
  const [maritalData, setMaritalData] = useState([]);
  const [employmentData, setEmploymentData] = useState([]);
  // const [userName, setUserName] = useState("");

  // Fetch the logged-in user's first name from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = `${user?.first_name} ${user?.last_name}`;
  
  // setUserName(createdBy);
  const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect small screen sizes (mobile)
  // const isMediumScreen = useMediaQuery(theme.breakpoints.up('sm').and(theme.breakpoints.down('md'))); // Detect medium screen sizes (tablet)
  
  // Detect screen sizes
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect small screen sizes (mobile)
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Detect medium screen sizes (tablet)
  
  // Dynamically set the radius based on screen size
  const getOuterRadius = () => {
    if (isSmallScreen) return 55; // Small screen: smaller radius
    if (isMediumScreen) return 65; // Medium screen: medium radius
    return 75; // Large screen: larger radius
  };

  useEffect(() => {
    if (user) {
      // setUserName(createdBy);  // Set the user's first name

      const userId = user.id;  // Get user ID from localStorage

      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch dashboard data based on user type
          const response = user.user_type === 'admin'
            ? await axios.get('https://willowtonbursary.co.za/api/dashboard')  // For admin, fetch all student data
            : await axios.get(`https://willowtonbursary.co.za/api/student-detail/${userId}`);  // For student, fetch personal data

          setDashboardData(response.data);

          // Fetch other data (common for both admin and student)
          const fetchNationalityData = await axios.get('https://willowtonbursary.co.za/api/student-nationality-distribution');
          const fetchEducationData = await axios.get('https://willowtonbursary.co.za/api/student-highest-education-distribution');
          const fetchCurrentEducationData = await axios.get('https://willowtonbursary.co.za/api/student-current-education-distribution');
          const fetchRaceData = await axios.get('https://willowtonbursary.co.za/api/student-race-distribution');
          const fetchMaritalData = await axios.get('https://willowtonbursary.co.za/api/student-marital-status-distribution');
          const fetchEmploymentData = await axios.get('https://willowtonbursary.co.za/api/student-employment-status-distribution');

          setNationalityData(fetchNationalityData.data);
          setEducationData(fetchEducationData.data);
          setCurrentEducationData(fetchCurrentEducationData.data);
          setRaceData(fetchRaceData.data);
          setMaritalData(fetchMaritalData.data);
          setEmploymentData(fetchEmploymentData.data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);

  // Handle loading state
  if (loading) {
    return <CircularProgress />;
  }

  // Define chart colors
  const COLORS = [
    '#4B8BBE', '#F79C42', '#61C0BF', '#F04E23', '#7B68EE', '#90EE90', '#FF6347', '#FFD700',
    '#20B2AA', '#F08080', '#8A2BE2', '#32CD32', '#FF8C00', '#D2691E', '#98FB98', '#DC143C',
    '#8B0000', '#FF4500', '#00FA9A', '#D3D3D3'
  ];


  return (
    <Box sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', padding: '1px' }}>
      {/* Header Section */}
      <Box sx={{ backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ccc' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>Dashboard</Typography>
        <Typography variant="body1" sx={{ color: isDarkMode ? 'white' : 'black', marginTop: 1 }}>
          Welcome, {userName || "User"}! 👋
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Student Count Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Student Count</Typography>
                <People sx={{ fontSize: 40, color: "#4B8BBE" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                {dashboardData.studentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Student Payments Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Student Payments</Typography>
                <Payment sx={{ fontSize: 40, color: "#F79C42" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                {dashboardData.totalPayments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Student Voluntary Services Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Voluntary Services</Typography>
                <VolunteerActivism sx={{ fontSize: 40, color: "#61C0BF" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                {dashboardData.voluntaryServicesCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Student Interviews Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Student Interviews</Typography>
                <Work sx={{ fontSize: 40, color: "#F04E23" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                {dashboardData.interviewsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Nationality, Current Education, Highest Education - 3 charts in one row */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Nationalities</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={nationalityData} dataKey="count" nameKey="student_nationality" cx="50%" cy="50%" outerRadius={getOuterRadius()} fill="#82ca9d">
                    {nationalityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    iconType="square"
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ paddingLeft: "20px" }}
                    payload={nationalityData.map((entry, index) => ({
                      value: entry.student_nationality,
                      type: "square",
                      color: COLORS[index % COLORS.length],
                    }))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Education, Highest Education */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Current Education</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={currentEducationData} dataKey="count" nameKey="student_type" cx="50%" cy="50%" outerRadius={getOuterRadius()} fill="#82ca9d">
                    {currentEducationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    iconType="square"
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ paddingLeft: "20px" }}
                    payload={currentEducationData.map((entry, index) => ({
                      value: entry.student_type,
                      type: "square",
                      color: COLORS[index % COLORS.length],
                    }))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Highest Education</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={educationData} dataKey="count" nameKey="student_highest_education" cx="50%" cy="50%" outerRadius={getOuterRadius()} fill="#82ca9d">
                    {educationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    iconType="square"
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ paddingLeft: "20px" }}
                    payload={educationData.map((entry, index) => ({
                      value: entry.student_highest_education,
                      type: "square",
                      color: COLORS[index % COLORS.length],
                    }))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Race, Marital Status, Employment Status - 3 charts in one row */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Race</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={raceData} dataKey="count" nameKey="student_race" cx="50%" cy="50%" outerRadius={getOuterRadius()} fill="#82ca9d">
                    {raceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    iconType="square"
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ paddingLeft: "20px" }}
                    payload={raceData.map((entry, index) => ({
                      value: entry.student_race,
                      type: "square",
                      color: COLORS[index % COLORS.length],
                    }))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Marital Status */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Marital Status</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={maritalData} dataKey="count" nameKey="student_marital_status" cx="50%" cy="50%" outerRadius={getOuterRadius()} fill="#82ca9d">
                    {maritalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    iconType="square"
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ paddingLeft: "20px" }}
                    payload={maritalData.map((entry, index) => ({
                      value: entry.student_marital_status,
                      type: "square",
                      color: COLORS[index % COLORS.length],
                    }))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Employment Status */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardStyles, backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE', border: '1px solid #ccc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Employment Status</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={employmentData} dataKey="count" nameKey="student_employment_status" cx="50%" cy="50%" outerRadius={getOuterRadius()} fill="#82ca9d">
                    {employmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    iconType="square"
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ paddingLeft: "20px" }}
                    payload={employmentData.map((entry, index) => ({
                      value: entry.student_employment_status,
                      type: "square",
                      color: COLORS[index % COLORS.length],
                    }))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Styling for the cards
const cardStyles = {
  borderRadius: 2,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  padding: 2,
  color: '#212121',
};

export default Dashboard;
