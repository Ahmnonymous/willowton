import React from "react";
import { Box, Container, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import footerImage from '../images/footer.png';

const EligibilityPage = () => {
  const fontSizes = {
    h4: '2.5rem',
    body1: '1.2rem',
    h6: '1.2rem',
    listItemText: '1.1rem',
    caption: '1rem',
  };

  const textStyle = {
    color: "black",
    fontFamily: "Sansation Light",
    fontSize: fontSizes.body1,
  };

  return (
    <div>
      <Container
        sx={{
          py: 4,
          mb: -1,
          maxWidth: 'none',
          '@media (min-width:1200px)': {
            maxWidth: '100%',
          },
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ ...textStyle, mb: 4, fontWeight: "bold", fontSize: fontSizes.h4 }} component="div">
          Eligibility Requirements
        </Typography>

        <Typography variant="body1" sx={textStyle} component="div">
          Applicants must meet the following minimum requirements to be considered for the bursary. Failure to meet all requirements will result in the application not being considered:
        </Typography>

        <Box component="ul" sx={{ pl: 2, m: 0, color: "black", fontFamily: "Sansation Light", listStyleType: "disc" }}>
          {[
            "You must be a South African citizen or a foreign national with a valid study permit.",
            "You must reside in the province for which you are applying.",
            "You must demonstrate financial need.",
            "You must have applied for NSFAS funding before applying for this bursary. (Apply for NSFAS funding here).",
            "You must be currently studying or planning to study at a recognized University, University of Technology, or TVET College in South Africa.",
            "You must fall under one of the following categories:"
          ].map((text, idx) => (
            <Box key={idx} component="li" sx={{ mb: 1, fontSize: fontSizes.body1 }}>
              {text}
            </Box>
          ))}
        </Box>

        <ListItem>
          <ListItemText
            primaryTypographyProps={{ ...textStyle, component: 'div' }}
            secondaryTypographyProps={{ component: 'div' }}
            secondary={
              <List sx={{ pl: 1, listStyleType: "circle", mt: -3 }}>
                {[
                  "A current Matric student.",
                  "A current tertiary student who was self-sponsored or sponsored by a family member last year.",
                  "A current tertiary student who was sponsored by Willowton/SANZAF last year."
                ].map((text, idx) => (
                  <ListItem key={idx} sx={{ display: "list-item", mb: -2 }}>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{ ...textStyle, component: 'div' }}
                    />
                  </ListItem>
                ))}
              </List>
            }
          />
        </ListItem>

        <Typography variant="h6" sx={{ ...textStyle, mt: 2, mb: 1, fontWeight: "bold", fontSize: fontSizes.h6 }} component="div">
          Scholarship Awards
        </Typography>
        <Divider />
        <Typography variant="body1" sx={textStyle} component="div">
          Applicants may be required to achieve a minimum of 65% in a subject/module to be considered for the bursary.
        </Typography>

        <Typography variant="h6" sx={{ ...textStyle, mt: 4, mb: 1, fontWeight: "bold", fontSize: fontSizes.h6 }} component="div">
          Eligibility for Zakah
        </Typography>
        <Divider />
        <Typography variant="body1" sx={textStyle} component="div">
          Zakah, as per Shariah (Islamic Law), is intended for eight categories of recipients:
        </Typography>

        <List sx={{ listStyleType: "decimal", pl: 3, m: 0, color: 'black' }}>
          {[
            "The Poor...",
            "The Needy...",
            "The Administrators of Zakah",
            "The Reverts",
            "Those in Debt...",
            "Zakah is an outright grant and does not require repayment..."
          ].map((text, idx) => (
            <Box key={idx} component="li" sx={{ mb: 1, fontSize: fontSizes.body1 }}>
              {text}
            </Box>
          ))}
        </List>

        <Typography variant="h6" sx={{ ...textStyle, mt: 2, mb: 1, fontWeight: "bold", fontSize: fontSizes.h6 }} component="div">
          Bursary Coverage
        </Typography>
        <Divider />
        <Typography variant="body1" sx={textStyle} component="div">
          The bursary will cover the following expenses:
        </Typography>
        <List sx={{ listStyleType: "disc", pl: 3, m: 0, color: 'black' }}>
          {["Registration fees", "Tuition fees", "Textbook costs"].map((item, idx) => (
            <Box key={idx} component="li" sx={{ mb: 1, fontSize: fontSizes.body1 }}>
              {item}
            </Box>
          ))}
        </List>

        <Typography variant="h6" sx={{ ...textStyle, mt: 2, mb: 1, fontWeight: "bold", fontSize: fontSizes.h6 }} component="div">
          How to Apply
        </Typography>
        <Divider />
        <Typography variant="body1" sx={textStyle} component="div">
          To apply for the bursary, follow these steps:
        </Typography>

        <List>
          <List sx={{ listStyleType: "decimal", pl: 2, m: 0, color: 'black' }}>
            {[
              "Submit your application online at www.wosanzafbursary.online.",
              "Upload clear copies of the required supporting documentation..."
            ].map((text, idx) => (
              <Box key={idx} component="li" sx={{ mb: 1, fontSize: fontSizes.body1 }}>
                {text}
              </Box>
            ))}
          </List>

          <ListItem>
            <ListItemText
              primaryTypographyProps={{ ...textStyle, component: 'div' }}
              secondaryTypographyProps={{ component: 'div' }}
              secondary={
                <Box sx={{ pl: 1 }}>
                  {[
                    {
                      title: "For Matric Students:",
                      items: [
                        "Certified copy of your ID or study permit...",
                        "Certified copy of trial results...",
                        "Motivational letter explaining...",
                        "Testimonial from your school...",
                        "Proof of income..."
                      ]
                    },
                    {
                      title: "For Tertiary Students (Not Sponsored by Willowton/SANZAF Previously):",
                      items: [
                        "Certified copy of your ID or study permit...",
                        "Certified copy of your Matric final results...",
                        "Full academic record from your tertiary institution...",
                        "Motivational letter explaining...",
                        "Testimonial from your University or religious leader...",
                        "Proof of income..."
                      ]
                    },
                    {
                      title: "For Tertiary Students Sponsored by Willowton/SANZAF:",
                      items: [
                        "Certified copy of your Matric final results...",
                        "Mid-year tertiary results...",
                        "Proof of income..."
                      ]
                    }
                  ].map((section, idx) => (
                    <Box key={idx} sx={{ mb: 2 }}>
                      <Typography sx={{ ...textStyle, fontWeight: "bold" }} component="div">
                        {section.title}
                      </Typography>
                      <List sx={{ listStyleType: "disc", pl: 3 }}>
                        {section.items.map((item, i) => (
                          <ListItem key={i} sx={{ display: "list-item", mb: -2 }}>
                            <ListItemText
                              primary={item}
                              primaryTypographyProps={{ ...textStyle, component: 'div' }}
                            />
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

        <Typography variant="h6" sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6 }} component="div">
          Closing Date for Applications
        </Typography>
        <Divider />
        <List sx={{ listStyleType: "disc", pl: 3, m: 0, color: 'black', fontSize: fontSizes.body1 }}>
          <Box component="li" sx={{ mb: 1 }}>
            Applications for 2023 must be submitted by 30th September 2022.
          </Box>
          <Box component="li" sx={{ mb: 3 }}>
            All supporting documentation must be submitted by the closing date. Incomplete applications will be disqualified.
          </Box>
        </List>

        <Typography variant="h6" sx={{ ...textStyle, fontWeight: "bold", fontSize: fontSizes.h6 }} component="div">
          Application and Selection Process
        </Typography>
        <List sx={{ listStyleType: "decimal", pl: 3, m: 0, color: 'black', mb: 2 }}>
          {[
            "The Bursary Committee will review and shortlist candidates.",
            "Shortlisted candidates will be contacted via email with interview details.",
            "Interviews will be conducted...",
            "Applicants will be notified...",
            "Successful applicants will receive a Confirmation of Pledge email/letter.",
            "All bursary payments will be made directly to the institution’s account.",
            "Students will not be entitled to withdraw...",
            "All information submitted is confidential..."
          ].map((text, idx) => (
            <Box key={idx} component="li" sx={{ mb: 1, color: 'black', fontSize: fontSizes.body1 }}>
              {text}
            </Box>
          ))}
        </List>
      </Container>

      <Box
        component="img"
        src={footerImage}
        alt="Graduates"
        sx={{ width: '100%', height: 'auto', mb: 1 }}
      />
      <Box sx={{ textAlign: 'center', py: 2, mt: 0, color: 'black' }}>
        <Typography variant="caption" component="div" sx={{ color: 'black', fontFamily: 'Sansation Light', fontSize: fontSizes.caption }}>
          Developed by Uchakide.co.za
        </Typography>
      </Box>
    </div>
  );
};

export default EligibilityPage;
