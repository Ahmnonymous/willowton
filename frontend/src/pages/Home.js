import React from 'react';
import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link
} from '@mui/material';
import { MdPushPin } from 'react-icons/md';

// Ensure these paths are correct and files exist
import backgroundImage from '../images/Home.png';
import footerImage from '../images/footer.png';

const HomePage = () => {
  const fontSizes = {
    h1: '2.5rem',
    h6: '1.2rem',
    listItemText: '1.1rem',
    caption: '1rem',
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container
        sx={{
          py: 4,
          mb: -1,
          width: '100%',
          maxWidth: { xs: '100%', md: '1200px' },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
            mb: 1,
            fontSize: fontSizes.h1,
            color: 'black',
            fontFamily: 'Sansation Light, Arial, sans-serif',
          }}
        >
          "No country can really develop unless its citizens are educated"
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mb: 2,
            color: '#564b4b',
            fontFamily: 'Sansation Light, Arial, sans-serif',
          }}
        >
          "Nelson Mandela"
        </Typography>

        <Box
          component="img"
          src={backgroundImage}
          alt="Graduates"
          loading="lazy"
          sx={{
            display: 'block',
            mx: 'auto',
            width: '90%',
            maxWidth: '800px',
            height: 'auto',
            mb: 2,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: 'black',
            textAlign: 'center',
            fontFamily: 'Sansation Light, Arial, sans-serif',
            fontSize: fontSizes.h6,
          }}
        >
          South Africa faces one of the highest unemployment rates in the world, with youth unemployment reaching alarming levels. Many young people struggle to find work — not because they lack ambition, but because they lack access to education and opportunities.
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 6,
            color: 'black',
            textAlign: 'center',
            marginTop: '10px',
            fontFamily: 'Sansation Light, Arial, sans-serif',
            fontSize: fontSizes.h6,
          }}
        >
          At Willowton & SANZAF Bursary Fund, we believe that education is the most powerful tool to break the cycle of poverty and unemployment. By investing in young minds, we are building a future where every student has the chance to succeed, contribute to the economy, and uplift their community.
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 0,
            fontWeight: 'bold',
            color: 'black',
            fontFamily: 'Sansation Light, Arial, sans-serif',
            fontSize: fontSizes.h6,
          }}
        >
          Why Education Matters
        </Typography>
        <List>
          {[
            "Over 60% of young South Africans are unemployed — Many lack the qualifications to enter the workforce.",
            "A tertiary qualification can significantly increase job opportunities — Graduates are far more likely to find stable employment.",
            "Financial barriers shouldn’t stop bright minds — That’s where we come in!",
          ].map((text, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <MdPushPin color="#FF0000" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      color: 'black',
                      fontSize: fontSizes.listItemText,
                      fontFamily: 'Sansation Light, Arial, sans-serif',
                    }}
                  >
                    {text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Container>

      <Box sx={{ marginTop: 'auto' }}>
        <Box
          component="img"
          src={footerImage}
          alt="footer"
          loading="lazy"
          sx={{ width: '100%', height: 'auto', mb: 1 }}
        />
        <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#000',
              fontFamily: 'Sansation Light, Arial, sans-serif',
              fontSize: fontSizes.caption,
            }}
          >
            Developed by{' '}
            <Link
              href="https://uchakide.co.za"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: '#000' }} // optional: match text color
            >
              uchakide.co.za
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;