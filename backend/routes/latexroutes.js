const express = require('express');
const latex = require('latex');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/compile-latex', async (req, res) => {
  const { latexContent } = req.body;

  if (!latexContent) {
    return res.status(400).json({ error: 'No LaTeX content provided' });
  }

  const texFilePath = path.join(__dirname, 'output.tex');
  const pdfFilePath = path.join(__dirname, 'output.pdf');

  try {
    fs.writeFileSync(texFilePath, latexContent);

    const stream = fs.createReadStream(texFilePath)
      .pipe(latex())
      .pipe(fs.createWriteStream(pdfFilePath));

    stream.on('finish', () => {
      res.download(pdfFilePath, 'StudentReport.pdf', (err) => {
        if (err) {
          console.error('Error sending PDF:', err);
          res.status(500).json({ error: 'Failed to send PDF' });
        }
        fs.unlinkSync(texFilePath);
        fs.unlinkSync(pdfFilePath);
      });
    });

    stream.on('error', (err) => {
      console.error('LaTeX compilation error:', err);
      res.status(500).json({ error: 'Failed to compile LaTeX' });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
