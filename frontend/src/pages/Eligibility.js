import React from "react";
import { Box, Container, Typography, List, ListItem, ListItemText } from "@mui/material";
import footerImage from '../images/footer.png';

const EligibilityPage = () => {
  const textStyle = { color: "black", fontFamily: "Sansation Light", fontSize: '0.9rem' };

  return (
    <div>
    <Container maxWidth="md" sx={{ py: 4, mb: -1 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ ...textStyle, fontWeight: "bold", fontSize: '3.3rem' }}>
        Eligibility Requirements
      </Typography>

      <Typography variant="body1" paragraph sx={{ ...textStyle }}>
        Applicants must meet the following minimum requirements to be considered for the bursary. Failure to meet all requirements will result in the application not being considered:
      </Typography>

      <Box
        component="ul"
        sx={{
          pl: 2, m: 0, color: "black", fontFamily: "Sansation Light", listStyleType: "disc"
        }}
      >
        {[
          "You must be a South African citizen or a foreign national with a valid study permit.",
          "You must reside in the province for which you are applying.",
          "You must demonstrate financial need.",
          "You must have applied for NSFAS funding before applying for this bursary. (Apply for NSFAS funding here).",
          "You must be currently studying or planning to study at a recognized University, University of Technology, or TVET College in South Africa.",
          "You must fall under one of the following categories:"
        ].map((text, idx) => (
          <Box
            key={idx}
            component="li"
            sx={{ mb: 0, fontSize: '0.9rem' }}
          >
            {text}
          </Box>
        ))}

        <ListItem>
          <ListItemText
            // primary="You must fall under one of the following categories:"
            primaryTypographyProps={textStyle}
            secondary={
              <List sx={{ pl: 1, listStyleType: "circle", marginTop: -3 }}>
                {[
                  "A current Matric student.",
                  "A current tertiary student who was self-sponsored or sponsored by a family member last year.",
                  "A current tertiary student who was sponsored by Willowton/SANZAF last year."
                ].map((text, idx) => (
                  <ListItem key={idx} sx={{ display: "list-item", mb: -3 }}>
                    <ListItemText primary={text} primaryTypographyProps={textStyle} />
                  </ListItem>
                ))}
              </List>
            }
          />
        </ListItem>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold" }}>
        Scholarship Awards
      </Typography>
      <Typography variant="body1" paragraph sx={textStyle}>
        Applicants may be required to achieve a minimum of 65% in a subject/module to be considered for the bursary.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold" }}>
        Eligibility for Zakah
      </Typography>
      <Typography variant="body1" paragraph mb={1} sx={textStyle}>
        Zakah, as per Shariah (Islamic Law), is intended for eight categories of recipients:
      </Typography>

      <List sx={{ listStyleType: "numbered", pl: 3, m: 0, color: 'black' }}>
        {[
          "The Poor: Those who are unemployed due to a lack of work opportunities or inability to secure work due to a lack of skills. This does not include individuals unwilling to take on other forms of employment, even if unrelated to their profession.",
          "The Needy: Those who are employed but whose income is insufficient to meet basic living expenses. Zakah allows for basic necessities to be exempt, but encourages moderation and living within one’s means.",
          "The Administrators of Zakah",
          "The Reverts",
          "Those in Debt: Individuals who find themselves in debt due to circumstances beyond their control and cannot settle their debt from existing assets.",
          "Zakah is an outright grant and does not require repayment. However, voluntary contributions or ‘repayment’ may be made if desired, and this will be judged by Allah."
        ].map((text, idx) => (
          <Box key={idx} component="li" sx={{ mb: 0, fontSize: '0.9rem' }}>
            {text}
          </Box>
        ))}
      </List>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold" }}>
        Bursary Coverage
      </Typography>
      <Typography variant="body1" paragraph mb={1} sx={textStyle}>
        The bursary will cover the following expenses:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 3, m: 0, color: 'black' }}>
        {["Registration fees", "Tuition fees", "Textbook costs"].map((item, idx) => (
          <Box key={idx} component="li" sx={{ mb: 0, fontSize: '0.9rem' }}>
            {item}
          </Box>
        ))}
      </List>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold" }}>
        How to Apply
      </Typography>
      <Typography variant="body1" paragraph mb={0} sx={textStyle}>
        To apply for the bursary, follow these steps:
      </Typography>

      <List>
      <List sx={{ listStyleType: "numbered", pl: 2, m: 0, color: 'black' }}>
        {[
          "Submit your application online at www.wosanzafbursary.online.",
          "Upload clear copies of the required supporting documentation (failure to submit any of these documents may result in disqualification):"
        ].map((text, idx) => (
          <Box key={idx} component="li" sx={{ mb: 0, fontSize: '0.9rem' }}>
            {text}
          </Box>
        ))}
      </List>
        
        <ListItem sx={{ mb: 0 }}>
          <ListItemText
            primaryTypographyProps={textStyle}
            secondary={
              <Box sx={{ pl: 1 }}>
                {[
                  {
                    title: "For Matric Students:",
                    items: [
                      "Certified copy of your ID or study permit (for foreign nationals)",
                      "Certified copy of trial results",
                      "Motivational letter explaining why you deserve the bursary",
                      "Testimonial from your school",
                      "Proof of income (parents’/guardians’/spouse’s latest payslips, affidavit if unemployed, death certificate if deceased)"
                    ]
                  },
                  {
                    title: "For Tertiary Students (Not Sponsored by Willowton/SANZAF Previously):",
                    items: [
                      "Certified copy of your ID or study permit (for foreign nationals)",
                      "Certified copy of your Matric final results/certificate",
                      "Full academic record from your tertiary institution (on letterhead)",
                      "Motivational letter explaining why you deserve the bursary",
                      "Testimonial from your University, Imaam, or religious leader",
                      "Proof of income (latest payslips, affidavit if unemployed, proof of grant/pension, or death certificate)"
                    ]
                  },
                  {
                    title: "For Tertiary Students Sponsored by Willowton/SANZAF:",
                    items: [
                      "Certified copy of your Matric final results/certificate",
                      "Mid-year tertiary results (on letterhead from the institution)",
                      "Proof of income (parents'/guardians'/spouse’s latest payslips, affidavit if unemployed, death certificate)"
                    ]
                  }
                ].map((section, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography sx={{ ...textStyle, fontWeight: "bold" }} mb={-2} >{section.title}</Typography>
                    <List sx={{ listStyleType: "disc", pl: 3 }} >
                      {section.items.map((item, i) => (
                        <ListItem key={i} sx={{ display: "list-item", mb: -3 }}>
                          <ListItemText primary={item} primaryTypographyProps={textStyle}  mb={2} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </Box>
            }
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold" }}>
        Closing Date for Applications
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 3, m: 0, color: 'black', fontSize: '0.9rem' }}>
        <Box component="li" sx={{ mb: 0, color: 'black' }}>
          Applications for 2023 must be submitted by 30th September 2022.
        </Box>
        <Box component="li" sx={{ mb: 0, color: 'black', fontSize: '0.9rem' }}>
          All supporting documentation must be submitted by the closing date. Incomplete applications will be disqualified.
        </Box>
      </List>

      <Typography variant="h6" gutterBottom sx={{ ...textStyle, fontWeight: "bold" }}>
        Application and Selection Process
      </Typography>
      <List sx={{ listStyleType: "numbered", pl: 3, m: 0, color: 'black' }}>
        {[
          "The Bursary Committee will review and shortlist candidates.",
          "Shortlisted candidates will be contacted via email with interview details.",
          "Interviews will be conducted, and applicants must ensure they are available on the scheduled dates.",
          "Applicants will be notified of their application status via their regional office.",
          "Successful applicants will receive a Confirmation of Pledge email/letter.",
          "All bursary payments will be made directly to the institution’s account.",
          "Students will not be entitled to withdraw any funds paid by Willowton/SANZAF, even if a balance remains in their favour.",
          "All information submitted in the application is confidential. Certain details may be shared with SANZAF members when necessary."
        ].map((text, idx) => (
          <Box key={idx} component="li" sx={{ mb: 0, color:'black', fontSize: '0.9rem' }}>
            {text}
          </Box>
        ))}
      </List>
    </Container>
      <Box
          component="img"
          src={footerImage} // Replace with actual image path or URL
          alt="Graduates"
          sx={{ width: '100%', height: 'auto', mb: 1 }}
        />
      <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black'}}>
        <Typography variant="caption" sx={{ color: 'black', fontFamily: 'Sansation Light, sans-serif', fontSize: '1rem'  }}>
          Developed by Uchakide.co.za
        </Typography>
      </Box>

    </div>
  );
};

export default EligibilityPage;
