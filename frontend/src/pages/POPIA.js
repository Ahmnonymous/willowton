import React from "react";
import { Box, Container, Typography, List, Divider, Link } from "@mui/material";
import footerImage from '../images/footer.png';

const POPIA = () => {
  // Define font sizes as variables
  const fontSizes = {
    h4: '2.5rem',
    body1: '1.2rem',
    h6: '1.2rem',
    listItemText: '1.1rem',
    caption: '1rem',
  };

  const textStyle = { color: "white", fontFamily: "Sansation Light", fontSize: fontSizes.body1 };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh" // Ensures the parent takes at least the full screen height
    >
      <Container
        sx={{
          py: 4,
          mb: 2,
          maxWidth: 'none', // Removes the max-width constraint
          '@media (min-width:1200px)': {
            maxWidth: '100%', // Ensures the container spans the full width on larger screens
          },
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h4, mb: 4 }}>
          POPIA
        </Typography>

        <Typography variant="body1" paragraph sx={textStyle}>
          We respect your privacy and are committed to processing your personal information in line with the provisions outlined below.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Collecting Personal Information
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography sx={textStyle} mt={1} mb={1}>
          We collect and process personal information provided directly by you, whether voluntarily or required. In some cases, we may receive personal information indirectly from other sources.
          <br />Information we collect includes:
        </Typography>
        <Box
          component="ul"
          sx={{
            pl: 4, m: 0, color: "white", fontFamily: "Sansation Light", listStyleType: "disc"
          }}
        >
          {[
            "Names",
            "Billing addresses",
            "Banking details",
            "Email addresses",
            "Contact numbers",
            "Web browser version",
            "IP address",
            "Cookie information"
          ].map((text, idx) => (
            <Box key={idx} component="li" sx={{ mb: 1, fontSize: fontSizes.listItemText }}>
              {text}
            </Box>
          ))}
        </Box>

        <Typography sx={{ ...textStyle, marginTop: '10px', marginBottom: '10px', mb: 1 }}>
          We collect this information to:
        </Typography>
        <Box
          component="ul"
          sx={{
            pl: 4, m: 0, color: "white", fontFamily: "Sansation Light", listStyleType: "disc"
          }}
        >
          {[
            "Respond to queries or comments",
            "Inform you about new services",
            "Process, validate, and verify service requests",
            "Improve your website experience"
          ].map((text, idx) => (
            <Box key={idx} component="li" sx={{ mb: 1, fontSize: fontSizes.listItemText }}>
              {text}
            </Box>
          ))}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Minors
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography variant="body1" mt={1} paragraph sx={textStyle}>
          We do not intentionally collect personal information from minors. If you are a parent or guardian and believe your minor child has provided us with personal information, please contact us to request deletion.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Processing Personal Information
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography mt={1} sx={textStyle}>
          We may share your information under the following circumstances:
        </Typography>
        <Box
          component="ul"
          sx={{
            pl: 4, m: 0, color: "white", fontFamily: "Sansation Light", listStyleType: "disc", mt: 1
          }}
        >
          {[
            "To comply with legal requirements",
            "To protect our rights or property",
            "With third parties who assist in providing services, ensuring confidentiality"
          ].map((text, idx) => (
            <Box key={idx} component="li" sx={{ mb: 1, fontSize: fontSizes.listItemText }}>
              {text}
            </Box>
          ))}
        </Box>
        <Typography sx={{ ...textStyle, marginTop: '10px', marginBottom: '10px' }}>
          In line with the Protection of Personal Information Act (POPIA), we process personal data when:
        </Typography>
        <Box
          component="ul"
          sx={{
            pl: 4, m: 0, color: "white", fontFamily: "Sansation Light", listStyleType: "disc", mt: 1
          }}
        >
          {[
            "It’s necessary to fulfill a contract",
            "It complies with legal obligations",
            "It protects your legitimate interests",
            "It’s required for public law duties",
            "It supports legitimate business interests"
          ].map((text, idx) => (
            <Box key={idx} component="li" sx={{ mb: 1, fontSize: fontSizes.listItemText }}>
              {text}
            </Box>
          ))}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Cookies
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography mt={1} variant="body1" paragraph sx={textStyle}>
          Cookies are small text files used to recognize users and enhance website functionality. You can disable cookies via your browser settings, but certain features may not be available without them.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Security Measures
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography mt={1} variant="body1" paragraph sx={textStyle}>
          We treat your personal information as confidential and implement appropriate measures to protect it against unauthorized access, loss, or damage. We will notify you promptly of any unauthorized use or disclosure of your information.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Retention of Personal Information
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography mt={1} variant="body1" paragraph sx={textStyle}>
          We will not retain your personal information longer than necessary, unless required by law or with your consent.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Selling Personal Information
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography mt={1} variant="body1" paragraph sx={textStyle}>
          We do not sell your personal information. We only share it with service providers in line with this privacy policy.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Your Rights
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography mt={1} variant="body1" paragraph mb={0} sx={textStyle}>
          You have the rights to:
        </Typography>

        <List sx={{ listStyleType: "disc", pl: 4, m: 0, color: 'white' }}>
          {[
            "Access your personal data by submitting a written request",
            "Request correction or supplementation of your personal data",
            "Request the return or deletion of your personal data",
            "File a complaint with us"
          ].map((text, idx) => (
            <Box key={idx} component="li" sx={{ mb: 1, fontSize: fontSizes.listItemText }}>
              {text}
            </Box>
          ))}
        </List>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Transborder of Flow Information
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography mt={1} variant="body1" paragraph sx={textStyle}>
          We may transfer your information across South African borders for retention purposes or if our service providers operate internationally. We will ensure these providers have comparable privacy policies.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6, marginTop: '30px' }}>
          Changes to This Policy
        </Typography>
        <Divider sx={{ borderColor: 'white' }} />
        <Typography mt={1} variant="body1" paragraph sx={textStyle}>
          We may update this privacy notice to reflect changes in our practices or legal requirements. If you are dissatisfied with our response, you have the right to lodge a complaint with:
        </Typography>

        <Typography variant="h6" fontStyle='italic' gutterBottom sx={{ ...textStyle, fontSize: fontSizes.h6, marginTop: '20px' }}>
          The Information Regulator
        </Typography>
        <Typography variant="body1" paragraph sx={textStyle}>
          JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001
          <br />Complaints: complaints.IR@justice.gov.za
          <br />General Queries: inforeg@justice.gov.za
        </Typography>

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

export default POPIA;
