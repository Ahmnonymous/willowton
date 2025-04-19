import React from "react";
import { Box, Container, Typography, List} from "@mui/material";
import footerImage from '../images/footer.png';

const POPIA = () => {
  const textStyle = { color: "white", fontFamily: "Sansation Light", fontSize: '0.9rem' };

  return (
    <div>
    <Container maxWidth="md" sx={{ py: 4,mb:-1 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: '3.3rem' }}>
        POPIA
      </Typography>

      <Typography variant="body1" paragraph sx={{ ...textStyle }}>
      We respect your privacy and are committed to processing your personal information in line with the provisions outlined below.
      </Typography>


      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold" }}>
        Collecting Personal Information
        <Typography sx={{ ...textStyle}}>
        We collect and process personal information provided directly by you, whether voluntarily or required. In some cases, we may receive personal information indirectly from other sources.
        <br></br>Information we collect includes:
        </Typography>
      </Typography>
      <Box
        component="ul"
        sx={{
          pl: 2, m: 0, color: "white", fontFamily: "Sansation Light", listStyleType: "disc"
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
          <Box
            key={idx}
            component="li"
            sx={{ mb: 0, fontSize: '0.9rem' }}
          >
            {text}
          </Box>
        ))}
      </Box>
      <Typography sx={{ ...textStyle, marginTop: '3px', marginBottom: '3px'}}>
        We collect this information to:
      </Typography>
      <Box
        component="ul"
        sx={{
          pl: 2, m: 0, color: "white", fontFamily: "Sansation Light", listStyleType: "disc"
        }}
      >
        {[
          "Respond to queries or comments",
          "Inform you about new services",
          "Process, validate, and verify service requests",
          "Improve your website experience"
        ].map((text, idx) => (
          <Box
            key={idx}
            component="li"
            sx={{ mb: 0, fontSize: '0.9rem' }}
          >
            {text}
          </Box>
        ))}
      </Box>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", marginTop: '5px'}}>
        Minors
      </Typography>
      <Typography variant="body1" paragraph sx={textStyle}>
      We do not intentionally collect personal information from minors. If you are a parent or guardian and believe your minor child has provided us with personal information, please contact us to request deletion.
      </Typography>

{/* 
      Processing personal information
We may share your information under the following circumstances:
"To comply with legal requirements",
"To protect our rights or property",
"With third parties who assist in providing services, ensuring confidentiality"
In line with the Protection of Personal Information Act (POPIA), we process personal data when:
"It’s necessary to fulfill a contract",
"It complies with legal obligations",
"It protects your legitimate interests",
"It’s required for public law duties",
"It supports legitimate business interests "
*/}
        <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold" }}>
          Processing personal information
        <Typography sx={{ ...textStyle}}>
        We may share your information under the following circumstances:
        </Typography>
      </Typography>
      <Box
        component="ul"
        sx={{
          pl: 2, m: 0, color: "white", fontFamily: "Sansation Light", listStyleType: "disc"
        }}
      >
        {[
          "To comply with legal requirements",
          "To protect our rights or property",
          "With third parties who assist in providing services, ensuring confidentiality"
        ].map((text, idx) => (
          <Box
            key={idx}
            component="li"
            sx={{ mb: 0, fontSize: '0.9rem' }}
          >
            {text}
          </Box>
        ))}
      </Box>
      <Typography sx={{ ...textStyle, marginTop: '3px', marginBottom: '3px'}}>
      In line with the Protection of Personal Information Act (POPIA), we process personal data when:
      </Typography>
      <Box
        component="ul"
        sx={{
          pl: 2, m: 0, color: "white", fontFamily: "Sansation Light", listStyleType: "disc"
        }}
      >
        {[
          "It’s necessary to fulfill a contract",
          "It complies with legal obligations",
          "It protects your legitimate interests",
          "It’s required for public law duties",
          "It supports legitimate business interests "
        ].map((text, idx) => (
          <Box
            key={idx}
            component="li"
            sx={{ mb: 0, fontSize: '0.9rem' }}
          >
            {text}
          </Box>
        ))}
      </Box>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", marginTop: '10px'}}>
        Cookies
      </Typography>
      <Typography variant="body1" paragraph sx={textStyle}>
      Cookies are small text files used to recognize users and enhance website functionality. You can disable cookies via your browser settings, but certain features may not be available without them.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", marginTop: '5px'}}>
        Security Measures
      </Typography>
      <Typography variant="body1" paragraph sx={textStyle}>
      We treat your personal information as confidential and implement appropriate measures to protect it against unauthorized access, loss, or damage. We will notify you promptly of any unauthorized use or disclosure of your information.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", marginTop: '5px'}}>
        Retention of personal information
      </Typography>
      <Typography variant="body1" paragraph sx={textStyle}>
      We will not retain your personal information longer than necessary, unless required by law or with your consent.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", marginTop: '5px'}}>
        Selling personal information
      </Typography>
      <Typography variant="body1" paragraph sx={textStyle}>
      We do not sell your personal information. We only share it with service providers in line with this privacy policy.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold" }}>
        Your Rights
      </Typography>
      <Typography variant="body1" paragraph mb={1} sx={textStyle}>
        You have the rights to:
      </Typography>

      <List sx={{ listStyleType: "circle", pl: 3, m: 0, color: 'white' }}>
        {[
          "Access your personal data by submitting a written request",
          "Request correction or supplementation of your personal data",
          "Request the return or deletion of your personal data",
          "File a complaint with us"
        ].map((text, idx) => (
          <Box key={idx} component="li" sx={{ mb: 0, fontSize: '0.9rem' }}>
            {text}
          </Box>
        ))}
      </List>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", marginTop: '5px'}}>
        Transborder of flow information
      </Typography>
      <Typography variant="body1" paragraph sx={textStyle}>
      We may transfer your information across South African borders for retention purposes or if our service providers operate internationally. We will ensure these providers have comparable privacy policies.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", marginTop: '5px'}}>
        Changes to this policy
      </Typography>
      <Typography variant="body1" paragraph sx={textStyle}>
      We may update this privacy notice to reflect changes in our practices or legal requirements.
      <br></br><br></br>
      If you are dissatisfied with our response, you have the right to lodge a complaint with:
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold", marginTop: '5px'}}>
      The information regulator
      </Typography>
      <Typography variant="body1" paragraph sx={textStyle}>
      JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001<br></br>
      Complaints: complaints.IR@justice.gov.za<br></br>
      General Queries: inforeg@justice.gov.za
      </Typography>

    </Container>
      <Box
          component="img"
          src={footerImage} // Replace with actual image path or URL
          alt="Graduates"
          sx={{ width: '100%', height: 'auto', mb: 1 }}
        />
      <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black'}}>
        <Typography variant="caption" sx={{ color: 'white', fontFamily: 'Sansation Light, sans-serif', fontSize: '1rem'  }}>
          Developed by Uchakide.co.za
        </Typography>
      </Box>

    </div>
  );
};

export default POPIA;
