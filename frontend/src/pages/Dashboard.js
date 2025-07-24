import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { People, Payment, VolunteerActivism, Work } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useContext } from 'react';
import { ThemeContext } from '../config/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [nationalityData, setNationalityData] = useState([]);
  const [loadingNationality, setLoadingNationality] = useState(true);
  const [educationData, setEducationData] = useState([]);
  const [loadingEducation, setLoadingEducation] = useState(true);
  const [currentEducationData, setCurrentEducationData] = useState([]);
  const [loadingCurrentEducation, setLoadingCurrentEducation] = useState(true);
  const [raceData, setRaceData] = useState([]);
  const [loadingRace, setLoadingRace] = useState(true);
  const [maritalData, setMaritalData] = useState([]);
  const [loadingMarital, setLoadingMarital] = useState(true);
  const [employmentData, setEmploymentData] = useState([]);
  const [loadingEmployment, setLoadingEmployment] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userName = storedUser
    ? `${storedUser.first_name} ${storedUser.last_name}`
    : 'Guest';

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const chartColors = [
    '#4E79A7',
    '#A0CBE8',
    '#F28E2B',
    '#FFBE7D',
    '#59A14F',
    '#8CD17D',
    '#B6992D',
    '#F1CE63',
    '#499894',
    '#86BCB6',
  ];

  const getOuterRadius = () => {
    if (isSmallScreen) return 55;
    if (isMediumScreen) return 65;
    return 75;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard`);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    const fetchNationalityData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/student-nationality-distribution`
        );
        const updatedData = response.data
          .filter(
            (item) =>
              item.student_nationality &&
              item.student_nationality.toLowerCase() !== 'unknown'
          )
          .map((item) => ({
            ...item,
            count: Number(item.count) || 0,
            student_nationality: item.student_nationality,
          }));
        setNationalityData(updatedData);
      } catch (error) {
        console.error('Error fetching nationality data:', error);
      } finally {
        setLoadingNationality(false);
      }
    };

    const fetchEducationData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/student-highest-education-distribution`
        );
        const updatedData = response.data
          .filter(
            (item) =>
              item.student_highest_education &&
              item.student_highest_education.toLowerCase() !== 'unknown'
          )
          .map((item) => ({
            ...item,
            count: Number(item.count) || 0,
            student_highest_education: item.student_highest_education,
          }));
        setEducationData(updatedData);
      } catch (error) {
        console.error('Error fetching education data:', error);
      } finally {
        setLoadingEducation(false);
      }
    };

    const fetchCurrentEducationData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/student-current-education-distribution`
        );
        const updatedData = response.data
          .filter(
            (item) =>
              item.student_type &&
              item.student_type.toLowerCase() !== 'unknown'
          )
          .map((item) => ({
            ...item,
            count: Number(item.count) || 0,
            student_type: item.student_type,
          }));
        setCurrentEducationData(updatedData);
      } catch (error) {
        console.error('Error fetching current education data:', error);
      } finally {
        setLoadingCurrentEducation(false);
      }
    };

    const fetchRaceData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/student-race-distribution`
        );
        const updatedData = response.data
          .filter(
            (item) =>
              item.student_race &&
              item.student_race.toLowerCase() !== 'unknown'
          )
          .map((item) => ({
            ...item,
            count: Number(item.count) || 0,
            student_race: item.student_race,
          }));
        setRaceData(updatedData);
      } catch (error) {
        console.error('Error fetching race data:', error);
      } finally {
        setLoadingRace(false);
      }
    };

    const fetchMaritalData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/student-marital-status-distribution`
        );
        const updatedData = response.data
          .filter(
            (item) =>
              item.student_marital_status &&
              item.student_marital_status.toLowerCase() !== 'unknown'
          )
          .map((item) => ({
            ...item,
            count: Number(item.count) || 0,
            student_marital_status: item.student_marital_status,
          }));
        setMaritalData(updatedData);
      } catch (error) {
        console.error('Error fetching marital data:', error);
      } finally {
        setLoadingMarital(false);
      }
    };

    const fetchEmploymentData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/student-employment-status-distribution`
        );
        const updatedData = response.data
          .filter(
            (item) =>
              item.student_employment_status &&
              item.student_employment_status.toLowerCase() !== 'unknown'
          )
          .map((item) => ({
            ...item,
            count: Number(item.count) || 0,
            student_employment_status: item.student_employment_status,
          }));
        setEmploymentData(updatedData);
      } catch (error) {
        console.error('Error fetching employment data:', error);
      } finally {
        setLoadingEmployment(false);
      }
    };

    fetchDashboardData();
    fetchNationalityData();
    fetchEducationData();
    fetchCurrentEducationData();
    fetchRaceData();
    fetchMaritalData();
    fetchEmploymentData();
  }, []);

  // Custom legend formatter to set label color based on theme
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center', marginTop: 10 }}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ display: 'inline-block', margin: '0 10px' }}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: entry.color,
                marginRight: 5,
              }}
            />
            <span style={{ color: isDarkMode ? '#FFFFFF' : '#000000', fontSize: '12px' }}>
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Loading spinner component
  const renderLoadingSpinner = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 260,
      }}
    >
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', padding: '1px' }}>
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ccc',
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: isDarkMode ? 'white' : 'black', marginTop: 1 }}
        >
          Welcome, {userName}! 👋
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Student Count Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              {loadingDashboard ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      variant="h6"
                      sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                    >
                      Student Count
                    </Typography>
                    <People sx={{ fontSize: 40, color: '#4B8BBE' }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000' }}
                  >
                    {dashboardData?.studentCount || 0}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Student Payments Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              {loadingDashboard ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      variant="h6"
                      sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                    >
                      Student Payments
                    </Typography>
                    <Payment sx={{ fontSize: 40, color: '#F79C42' }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000' }}
                  >
                    {dashboardData?.totalPayments || 0}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Student Voluntary Services Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              {loadingDashboard ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      variant="h6"
                      sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                    >
                      Voluntary Services
                    </Typography>
                    <VolunteerActivism sx={{ fontSize: 40, color: '#61C0BF' }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000' }}
                  >
                    {dashboardData?.voluntaryServicesCount || 0}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Student Interviews Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              {loadingDashboard ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      variant="h6"
                      sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                    >
                      Student Interviews
                    </Typography>
                    <Work sx={{ fontSize: 40, color: '#F04E23' }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000' }}
                  >
                    {dashboardData?.interviewsCount || 0}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Nationality Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
              >
                Nationalities
              </Typography>
              {loadingNationality ? (
                renderLoadingSpinner()
              ) : (
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nationalityData}
                        dataKey="count"
                        nameKey="student_nationality"
                        cx="50%"
                        cy="50%"
                        outerRadius={getOuterRadius()}
                      >
                        {nationalityData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        content={renderLegend}
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        payload={nationalityData.map((entry, index) => ({
                          value: entry.student_nationality,
                          type: 'circle',
                          color: chartColors[index % chartColors.length],
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Current Education Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
              >
                Current Education
              </Typography>
              {loadingCurrentEducation ? (
                renderLoadingSpinner()
              ) : (
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentEducationData}
                        dataKey="count"
                        nameKey="student_type"
                        cx="50%"
                        cy="50%"
                        outerRadius={getOuterRadius()}
                      >
                        {currentEducationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        content={renderLegend}
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        payload={currentEducationData.map((entry, index) => ({
                          value: entry.student_type,
                          type: 'circle',
                          color: chartColors[index % chartColors.length],
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Highest Education Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
              >
                Highest Education
              </Typography>
              {loadingEducation ? (
                renderLoadingSpinner()
              ) : (
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={educationData}
                        dataKey="count"
                        nameKey="student_highest_education"
                        cx="50%"
                        cy="50%"
                        outerRadius={getOuterRadius()}
                      >
                        {educationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        content={renderLegend}
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        payload={educationData.map((entry, index) => ({
                          value: entry.student_highest_education,
                          type: 'circle',
                          color: chartColors[index % chartColors.length],
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Race Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
              >
                Race
              </Typography>
              {loadingRace ? (
                renderLoadingSpinner()
              ) : (
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={raceData}
                        dataKey="count"
                        nameKey="student_race"
                        cx="50%"
                        cy="50%"
                        outerRadius={getOuterRadius()}
                      >
                        {raceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        content={renderLegend}
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        payload={raceData.map((entry, index) => ({
                          value: entry.student_race,
                          type: 'circle',
                          color: chartColors[index % chartColors.length],
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Marital Status Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
              >
                Marital Status
              </Typography>
              {loadingMarital ? (
                renderLoadingSpinner()
              ) : (
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={maritalData}
                        dataKey="count"
                        nameKey="student_marital_status"
                        cx="50%"
                        cy="50%"
                        outerRadius={getOuterRadius()}
                      >
                        {maritalData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        content={renderLegend}
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        payload={maritalData.map((entry, index) => ({
                          value: entry.student_marital_status,
                          type: 'circle',
                          color: chartColors[index % chartColors.length],
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Employment Status Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: isDarkMode ? '#1E293B' : '#E1F5FE',
              border: '1px solid #ccc',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
              >
                Employment Status
              </Typography>
              {loadingEmployment ? (
                renderLoadingSpinner()
              ) : (
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={employmentData}
                        dataKey="count"
                        nameKey="student_employment_status"
                        cx="50%"
                        cy="50%"
                        outerRadius={getOuterRadius()}
                      >
                        {employmentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        content={renderLegend}
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        payload={employmentData.map((entry, index) => ({
                          value: entry.student_employment_status,
                          type: 'circle',
                          color: chartColors[index % chartColors.length],
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const cardStyles = {
  borderRadius: 2,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  padding: 2,
  color: '#212121',
};

export default Dashboard;