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
  const subjectPath = path.join(process.cwd(), 'public', 'templates', template, 'subject.html');
  const templatePath = path.join(process.cwd(), 'public', 'templates', template, 'formatted.html');
  const commsNumber = template.match(/\d$/)?.[0] || null;
  let subjectContent;
  let htmlContent;

  try {
    // Read and process subject.html
    subjectContent = await fs.readFile(subjectPath, 'utf-8');
    subjectContent = subjectContent
      .replaceAll('{{employerName}}', employerName)
      .replaceAll('{{enrollmentLink}}', enrollmentLink)
      .replaceAll('{{code}}', code)
      .replaceAll('{{deadline}}', deadline);
  } catch (error) {
    subjectContent = 'New Employee Benefit'; // Default subject if file not found
  }

  try {
    // Read and process formatted.html (email body)
    htmlContent = await fs.readFile(templatePath, 'utf-8');
    htmlContent = htmlContent
      .replaceAll('{{employerName}}', employerName)
      .replaceAll('{{enrollmentLink}}', enrollmentLink)
      .replaceAll('{{code}}', code)
      .replaceAll('{{deadline}}', deadline)
      .replaceAll('{{template}}', template);
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
    <title>${employerName} Email Preview</title>
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
        width: 800px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        border-radius: 12px;
      }
      .subject-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
    <h1>${employerName} Email Communication #${commsNumber}</h1>
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
<div style="display:flex; align-items:center; margin-top:10px;">
    <a href="../quickstart#week-${commsNumber}" style="
        margin-right:40px;
        font-size:16px;
        text-decoration:none;
        color:#22c55e;
        cursor:pointer;
    ">
        <i class="fa-solid fa-arrow-left"></i> Back to Quickstart
    </a>

    <button onclick="copyHTML()">
        <i class="fa-solid fa-copy"></i> Copy Formatted Email
    </button>
        <a href="../messaging-preview/${template}" style="
        margin-left:40px;
        font-size:16px;
        text-decoration:none;
        color:#22c55e;
        cursor:pointer;
    ">
        Next to Slack/Teams <i class="fa-solid fa-arrow-right"></i>
    </a>
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
      // Clone the email content to avoid modifying the original
      let clonedContent = emailContent.cloneNode(true);

      // Convert images to base64
      const imgElements = clonedContent.querySelectorAll("img");
      for (let img of imgElements) {
        if (img.src.startsWith("data:")) continue; // Skip if already base64
        const base64 = await imageToBase64(img.src);
        if (base64) {
          img.src = base64; // Replace with base64 data URI
        }
      }

      // Wrap content in div to enforce max-width: 800px
      const wrapperDiv = document.createElement("div");
      wrapperDiv.style.maxWidth = "800px";
      wrapperDiv.style.margin = "0 auto"; // Center content horizontally
      wrapperDiv.innerHTML = clonedContent.innerHTML;

      const htmlContent = wrapperDiv.outerHTML;

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([htmlContent], { type: "text/html" }),
          "text/plain": new Blob([wrapperDiv.innerText], { type: "text/plain" }),
        }),
      ]);

      alert("Email HTML copied! You can now paste it into Gmail, Outlook, or another email client.");
    } catch (err) {
      alert("Failed to copy:", err);
    }
  }

  // Helper function: Convert an image URL to base64
  async function imageToBase64(imgUrl) {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to convert image:", imgUrl, error);
      return null;
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