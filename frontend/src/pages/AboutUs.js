import React from 'react';
import { Container, Typography, Box, Divider, Link } from '@mui/material';
import footerImage from '../images/footer.png';

const AboutUsPage = () => {
  // Define font sizes as variables
  const fontSizes = {
    h1: '2.5rem',
    h5: '1.2rem',
    h6: '1.2rem',
    body1: '1.2rem',
    listItemText: '1.1rem',
    caption: '1rem',
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh" // Ensures the parent takes at least the full screen height
    >
      <Container
        sx={{
          py: 4,
          mb: -1,
          maxWidth: 'none', // Removes the max-width constraint
          '@media (min-width:1200px)': {
            maxWidth: '100%', // Ensures the container spans the full width on larger screens
          },
        }}
      >
        <Typography variant="h1" sx={{ color: "white", textAlign: 'center', mb: 4, fontSize: fontSizes.h1, fontFamily: 'Sansation Light, sans-serif' }}>
          BIG GOALS BIG DREAMS WE GOT YOU
        </Typography>

        <Box sx={{ textAlign: 'justify', mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 1, color: "white", fontSize: fontSizes.h5, fontFamily: 'Sansation Light, sans-serif' }}>
            Willowton Oil, in partnership with the South African National Zakáh Fund (SANZAF), invites students to apply for the 2025 Bursary Programme. This annual bursary provides financial assistance to students who are unable to afford their tertiary education.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: "white", mb: 2, fontSize: fontSizes.h6, fontFamily: 'Sansation Light, sans-serif' }}>
            About The Willowton Group
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'justify', color: "white", fontSize: fontSizes.body1, fontFamily: 'Sansation Light, sans-serif' }}>
            Founded in 1970 by the late DM Moosa and his brothers Ahmad and Mohamed, along with their sons and the sons of their youngest brother Ibrahim, Willowton Oil and Cake Mills has grown from a family-owned business into a powerhouse in South Africa's Fast-Moving Consumer Goods (FMCG) sector. Today, over 50 years later, Willowton Group stands as South Africa’s largest sunflower seed crusher and a leader in the industry.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: "white", mb: 2, fontSize: fontSizes.h6, fontFamily: 'Sansation Light, sans-serif' }}>
            A Commitment to Excellence & Social Development
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'justify', color: 'white', fontSize: fontSizes.body1, fontFamily: 'Sansation Light, sans-serif' }}>
            At Willowton Group, we believe in creating high-quality consumer products that enhance daily life. Our vision is driven by innovation, care, and a strong commitment to social development. By continuously evolving, we ensure that our products remain at the forefront of the FMCG industry, meeting the needs of consumers across South Africa.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 2, fontSize: fontSizes.h6, fontFamily: 'Sansation Light, sans-serif' }}>
            Nationwide Presence & Trusted Brands
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ mt: 2, mb: 2, color: "white", textAlign: 'justify', fontSize: fontSizes.body1, fontFamily: 'Sansation Light, sans-serif' }}>
            With manufacturing facilities in Pietermaritzburg, Johannesburg, and Cape Town, Willowton Group produces a diverse range of household essentials, including:
          </Typography>

          <Box
            component="ul"
            sx={{
              pl: 2, m: 0, color: "white", fontFamily: "Sansation Light", listStyleType: "disc", mb: 2
            }}
          >
            {[
              "Edible oils 🏺",
              "Margarines & spreads 🧈",
              "Beauty & hygiene products 🛀",
              "Toilet & laundry soaps 🧼",
              "Candles & baking fats 🕯"
            ].map((text, idx) => (
              <Box
                key={idx}
                component="li"
                sx={{ mb: 1, fontSize: fontSizes.listItemText }}
              >
                {text}
              </Box>
            ))}
          </Box>

          <Typography variant="body1" sx={{ mt: 2, color: "white", textAlign: 'justify', fontSize: fontSizes.body1, fontFamily: 'Sansation Light, sans-serif' }}>
            Our trusted brands, including Sunfoil, Sunshine D, d’lite, and Allsome Rice, have become household staples, delivering quality and reliability to South African homes. As a company built on heritage, innovation, and social responsibility, Willowton Group remains dedicated to improving lives and shaping the future of FMCG in South Africa.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: "white", mb: 2, fontSize: fontSizes.h6, fontFamily: 'Sansation Light, sans-serif' }}>
            About SANZAF
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ mt: 2, color: "white", textAlign: 'justify', fontSize: fontSizes.body1, fontFamily: 'Sansation Light, sans-serif' }}>
            The South African National Zakáh Fund (SANZAF) is a faith-based, educational, and socio-welfare organization dedicated to collecting and distributing Zakáh and Sadaqát to support the Muslim community. For over 47 years, SANZAF has been a pillar of hope and empowerment, helping disadvantaged families and fostering upliftment and self-sufficiency.
          </Typography>
        </Box>
      </Container>

      {/* Footer Section */}
      <Box sx={{ marginTop: 'auto' }}>
        <Box
          component="img"
          src={footerImage}
          alt="footer"
          sx={{ width: '100%', height: 'auto', mb: 1 }}
        />
        <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
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
              sx={{ color: 'white' }} // optional: match text color
            >
              uchakide.co.za
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUsPage;
