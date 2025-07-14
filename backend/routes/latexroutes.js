const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post("/compile-latex", async (req, res) => {
  try {
    const latexContent = req.body.text;
    const response = await axios.post(
      'https://latexonline.cc/compile',
      {
        text: latexContent,
        compiler: 'pdflatex',
        output: 'pdf',
      },
      {
        responseType: 'arraybuffer', // Handle binary PDF data
      }
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="StudentReport.pdf"`,
    });
    res.send(response.data);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

module.exports = router;