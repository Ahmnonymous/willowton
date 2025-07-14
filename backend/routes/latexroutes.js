const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");

// Promisify exec for async/await
const execPromise = util.promisify(exec);

const router = express.Router();

router.post("/compile-latex", async (req, res) => {
  const { latexContent } = req.body;

  if (!latexContent) {
    return res.status(400).json({ error: "No LaTeX content provided" });
  }

  const texFilePath = path.join(__dirname, "output.tex");
  const pdfFilePath = path.join(__dirname, "output.pdf");
  const logFilePath = path.join(__dirname, "output.log");

  try {
    // Write LaTeX content to a .tex file
    fs.writeFileSync(texFilePath, latexContent);

    // Compile LaTeX using pdflatex
    try {
      const { stdout, stderr } = await execPromise(
        `pdflatex -interaction=nonstopmode -output-directory=${__dirname} ${texFilePath}`
      );

      // Check if PDF was generated
      if (!fs.existsSync(pdfFilePath)) {
        const logContent = fs.existsSync(logFilePath) ? fs.readFileSync(logFilePath, "utf8") : "No log file generated";
        return res.status(500).json({
          error: "Failed to compile LaTeX: PDF not generated",
          details: stderr || logContent,
        });
      }

      // Send the compiled PDF
      res.download(pdfFilePath, "StudentReport.pdf", (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
          return res.status(500).json({ error: "Failed to send PDF", details: err.message });
        }

        // Clean up files
        try {
          const filesToDelete = [
            texFilePath,
            pdfFilePath,
            logFilePath,
            path.join(__dirname, "output.aux"),
          ];
          filesToDelete.forEach((file) => {
            if (fs.existsSync(file)) fs.unlinkSync(file);
          });
        } catch (cleanupErr) {
          console.warn("Cleanup error:", cleanupErr);
        }
      });
    } catch (execError) {
      console.error("LaTeX compilation error:", execError);
      const logContent = fs.existsSync(logFilePath) ? fs.readFileSync(logFilePath, "utf8") : "No log file generated";
      return res.status(500).json({
        error: "Failed to compile LaTeX",
        details: execError.message + "\n" + (execError.stderr || logContent),
      });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;