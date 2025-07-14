const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// Promisify exec for async/await
const execPromise = util.promisify(exec);

const router = express.Router();

// Enable CORS for specific origins (adjust to your frontend's domain)
router.use(cors({
  origin: ["https://willowtonbursary.co.za", "http://localhost:3000"], // Add your frontend domains
  methods: ["POST"],
  allowedHeaders: ["Content-Type"],
}));

router.post("/compile-latex", async (req, res) => {
  const { latexContent } = req.body;

  // Validate input
  if (!latexContent || typeof latexContent !== "string") {
    return res.status(400).json({ error: "Invalid or missing LaTeX content" });
  }

  // Generate unique filenames to avoid conflicts
  const uniqueId = uuidv4();
  const tempDir = path.join(__dirname, "temp", uniqueId);
  const texFilePath = path.join(tempDir, "output.tex");
  const pdfFilePath = path.join(tempDir, "output.pdf");
  const logFilePath = path.join(tempDir, "output.log");
  const auxFilePath = path.join(tempDir, "output.aux");

  try {
    // Create temporary directory
    await fs.mkdir(tempDir, { recursive: true });

    // Write LaTeX content to a .tex file
    await fs.writeFile(texFilePath, latexContent);

    // Compile LaTeX using pdflatex
    const { stdout, stderr } = await execPromise(
      `pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texFilePath}`,
      { timeout: 30000 } // Set a 30-second timeout for compilation
    );

    // Check if PDF was generated
    if (!(await fs.access(pdfFilePath).then(() => true).catch(() => false))) {
      const logContent = (await fs.access(logFilePath).then(() => fs.readFile(logFilePath, "utf8")).catch(() => "No log file generated")) || stderr;
      return res.status(500).json({
        error: "Failed to compile LaTeX: PDF not generated",
        details: logContent,
      });
    }

    // Read and send the compiled PDF
    const pdfBuffer = await fs.readFile(pdfFilePath);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="StudentReport_${uniqueId}.pdf"`,
    });
    res.send(pdfBuffer);

  } catch (execError) {
    console.error("LaTeX compilation error:", execError);
    const logContent = await fs.access(logFilePath).then(() => fs.readFile(logFilePath, "utf8")).catch(() => "No log file generated");
    return res.status(500).json({
      error: "Failed to compile LaTeX",
      details: execError.message + "\n" + (execError.stderr || logContent),
    });
  } finally {
    // Clean up files asynchronously
    try {
      const filesToDelete = [texFilePath, pdfFilePath, logFilePath, auxFilePath];
      await Promise.all(
        filesToDelete.map((file) =>
          fs.unlink(file).catch((err) => console.warn(`Failed to delete ${file}:`, err))
        )
      );
      await fs.rm(tempDir, { recursive: true, force: true }).catch((err) =>
        console.warn(`Failed to delete temp directory ${tempDir}:`, err)
      );
    } catch (cleanupErr) {
      console.warn("Cleanup error:", cleanupErr);
    }
  }
});

module.exports = router;