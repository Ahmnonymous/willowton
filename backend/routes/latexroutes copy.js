const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const router = express.Router();

router.post("/compile-latex", async (req, res) => {
  const { latexContent } = req.body;

  if (!latexContent) {
    return res.status(400).json({ error: "No LaTeX content provided" });
  }

  const texFilePath = path.join(__dirname, "output.tex");
  const pdfFilePath = path.join(__dirname, "output.pdf");

  try {
    fs.writeFileSync(texFilePath, latexContent);

    // Compile LaTeX using pdflatex
    exec(`pdflatex -interaction=nonstopmode -output-directory=${__dirname} ${texFilePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error("LaTeX compilation error:", stderr);
        return res.status(500).json({ error: "Failed to compile LaTeX" });
      }

      res.download(pdfFilePath, "StudentReport.pdf", (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
          return res.status(500).json({ error: "Failed to send PDF" });
        }

        // Clean up
        try {
          fs.unlinkSync(texFilePath);
          fs.unlinkSync(pdfFilePath);
          fs.unlinkSync(path.join(__dirname, "output.log"));
          fs.unlinkSync(path.join(__dirname, "output.aux"));
        } catch (cleanupErr) {
          console.warn("Cleanup error:", cleanupErr);
        }
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
