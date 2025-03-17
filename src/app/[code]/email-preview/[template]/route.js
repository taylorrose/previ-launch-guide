import { NextResponse } from 'next/server';
import { employerData } from '@/data/employerData';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request, { params }) {
  const { code, template } = params;

  // Find employer data
  const employer = employerData.find((entry) => entry.access_code === code);
  const employerName = employer?.public_employer_name ?? 'Your Company';
  const enrollmentLink = `https://previ.com/access/${code}`;

  // Paths for subject and formatted email templates
  const subjectPath = path.join(
    process.cwd(),
    'public',
    'templates',
    'emails',
    template,
    'subject.html'
  );

  const templatePath = path.join(
    process.cwd(),
    'public',
    'templates',
    'emails',
    template,
    'formatted.html'
  );

  let subjectContent;
  let htmlContent;

  try {
    // Read and process subject.html
    subjectContent = await fs.readFile(subjectPath, 'utf-8');
    subjectContent = subjectContent
      .replaceAll('{{employerName}}', employerName)
      .replaceAll('{{enrollmentLink}}', enrollmentLink)
      .replaceAll('{{code}}', code);
  } catch (error) {
    subjectContent = 'New Employee Benefit'; // Default subject if file not found
  }

  try {
    // Read and process formatted.html (email body)
    htmlContent = await fs.readFile(templatePath, 'utf-8');
    htmlContent = htmlContent
      .replaceAll('{{employerName}}', employerName)
      .replaceAll('{{enrollmentLink}}', enrollmentLink)
      .replaceAll('{{code}}', code);
  } catch (error) {
    return NextResponse.json({ error: 'Email template not found.' }, { status: 404 });
  }

  // Generate HTML response
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Preview</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f8f9fa;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .container {
        border: 1px solid #ddd;
        padding: 20px;
        background-color: #fff;
        max-width: 800px;
        width: 100%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        border-radius: 12px;
      }
      .subject-container {
        display: flex;
        align-items: center;
        justify-content: space-between; /* Ensures button is on the right */
        background-color: white;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 12px;
        max-width: 800px;
        width: 100%;
        margin-bottom: 10px;
      }
      button {
        cursor: pointer;
        padding: 8px 12px;
        border: none;
        background-color: #808080;
        color: white;
        border-radius: 6px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      button:hover {
        background-color: #333;
      }
    </style>
  </head>
  <body>

    <!-- Subject Line Container -->
    <div class="subject-container">
      <span class="subject-text"><strong>Subject:</strong> <span id="subject-content">${subjectContent}</span></span>
      <button onclick="copySubject()">
        <i class="fa-solid fa-copy"></i> Copy Subject Line
      </button>
    </div>

    <!-- Email Body Container -->
    <div class="container" id="email-content">
      ${htmlContent}
    </div>
    <br>
    <button onclick="copyHTML()">
      <i class="fa-solid fa-copy"></i> Copy HTML Formatting
    </button>

    <script>
      async function copySubject() {
        const subjectText = document.getElementById("subject-content").innerText;
        try {
          await navigator.clipboard.writeText(subjectText);
          alert("Subject copied!");
        } catch (err) {
          alert("Failed to copy subject:", err);
        }
      }

      async function copyHTML() {
        const emailContent = document.getElementById("email-content");
        if (!emailContent) return;

        try {
          const htmlContent = emailContent.innerHTML;

          await navigator.clipboard.write([
            new ClipboardItem({
              "text/html": new Blob([htmlContent], { type: "text/html" }),
              "text/plain": new Blob([emailContent.innerText], { type: "text/plain" }),
            }),
          ]);

          alert("Email HTML copied! You can now paste it into Gmail, Outlook, or another email client.");
        } catch (err) {
          alert("Failed to copy:", err);
        }
      }
    </script>

  </body>
  </html>
`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}