import { NextResponse } from 'next/server';
import { employerData } from '@/data/employerData';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request, { params }) {
  const { code, template } = params;

  // Find employer data
  const employer = employerData.find((entry) => entry.access_code === code);
  const employerName = employer?.public_employer_name ?? 'Your Company';
  const enrollmentLink = `https://previ.com/access/${code}?utm_source=employer&utm_medium=email&utm_campaign=${template}&utm_content=${encodeURIComponent(employerName)}`;

  // Calculate the last day of the next month
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0); // Last day of next month
  const deadline = nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Paths for subject and formatted email templates
  const templatePath = path.join(process.cwd(), 'public', 'templates', template, 'message.html');

  let htmlContent;


  try {
    // Read and process formatted.html (email body)
    htmlContent = await fs.readFile(templatePath, 'utf-8');
    htmlContent = htmlContent
      .replaceAll('{{employerName}}', employerName)
      .replaceAll('{{enrollmentLink}}', enrollmentLink)
      .replaceAll('{{code}}', code)
      .replaceAll('{{deadline}}', deadline);
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
    <h1>Slack / Teams Message</h1>
    <!-- Email Body Container -->
    <div class="container" id="email-content">
      ${htmlContent}
    </div>
    <br>
<div style="display:flex; align-items:center; margin-top:10px;">
    <a href="../quickstart" style="
        margin-right:40px;
        font-size:16px;
        text-decoration:none;
        color:#22c55e;
        cursor:pointer;
    ">
        ← Back to Quickstart
    </a>
    <button onclick="copyHTML()">
        <i class="fa-solid fa-copy"></i> Copy Message
    </button>
</div>
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

          alert("Message copied! You can now paste it into Slack, Teams, or another messaging platform.");
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