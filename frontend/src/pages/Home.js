import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { MdPushPin } from 'react-icons/md';
import backgroundImage from '../images/Home.png';
import footerImage from '../images/footer.png';

const HomePage = () => {
  // Define font sizes as variables
  const fontSizes = {
    h1: '2.5rem',
    h6: '1.2rem',
    listItemText: '1.1rem',
    caption: '1rem',
  };

  return (
    <div>
      <Container sx={{ py: 4, mb: -1 }}>
        <Typography variant="h1" sx={{ textAlign: 'center', mb: 1, fontSize: fontSizes.h1, color: 'black', fontFamily: 'Sansation Light, sans-serif' }}>
          "No country can really develop unless its citizens are educated"
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, color: '#564b4b', fontFamily: 'Sansation Light, sans-serif' }}>
          "Nelson Mandela"
        </Typography>

        <Box
          component="img"
          src={backgroundImage}
          alt="Graduates"
          sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2 }}
        />

        <Typography variant="h6" sx={{ mb: 3, color: 'black', textAlign: 'center', fontFamily: 'Sansation Light, sans-serif', fontSize: fontSizes.h6 }}>
          South Africa faces one of the highest unemployment rates in the world, with youth unemployment reaching alarming levels. Many young people struggle to find work — not because they lack ambition, but because they lack access to education and opportunities.
        </Typography>

        <Typography variant="h6" sx={{ mb: 6, color: 'black', textAlign: 'center', marginTop: '10px', fontFamily: 'Sansation Light, sans-serif', fontSize: fontSizes.h6 }}>
          At Willowton & SANZAF Bursary Fund, we believe that education is the most powerful tool to break the cycle of poverty and unemployment. By investing in young minds, we are building a future where every student has the chance to succeed, contribute to the economy, and uplift their community.
        </Typography>

        <Typography variant="h5" sx={{ mb: 0, fontWeight: 'bold', color: 'black', fontFamily: 'Sansation Light, sans-serif', fontSize: fontSizes.h6 }}>
          Why Education Matters
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <MdPushPin color="#FF0000" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ color: 'black', fontSize: fontSizes.listItemText, fontFamily: 'Sansation Light, sans-serif' }}>
                  Over 60% of young South Africans are unemployed — Many lack the qualifications to enter the workforce.
                </Typography>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MdPushPin color="#FF0000" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ color: 'black', fontSize: fontSizes.listItemText, fontFamily: 'Sansation Light, sans-serif' }}>
                  A tertiary qualification can significantly increase job opportunities — Graduates are far more likely to find stable employment.
                </Typography>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MdPushPin color="#FF0000" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ color: 'black', fontSize: fontSizes.listItemText, fontFamily: 'Sansation Light, sans-serif' }}>
                  Financial barriers shouldn’t stop bright minds — That’s where we come in!
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Container>

      <Box
        component="img"
        src={footerImage}
        alt="footer"
        sx={{ width: '100%', height: 'auto', mb: 1 }}
      />
      <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black' }}>
        <Typography variant="caption" sx={{ color: '#000', fontFamily: 'Sansation Light, sans-serif', fontSize: fontSizes.caption }}>
          Developed by Uchakide.co.za
        </Typography>
      </Box>
    </div>
  );
};

export default HomePage;
