import { NextResponse } from 'next/server';
import { employerData } from '@/data/employerData';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request, { params }) {
  const { code } = params;

  const employer = employerData.find((entry) => entry.access_code === code);
  const employerName = employer?.public_employer_name ?? "Your Company";
  const enrollmentLink = `https://previ.com/access/${code}`;
  const upperCode = code.toUpperCase(); // ✅ Uppercase version of the code


  // Load your HTML email template
  const templatePath = path.join(process.cwd(), 'public', 'templates', 'one-sheet2.html');
  let html = await fs.readFile(templatePath, 'utf-8');

  // Dynamically replace placeholders
  html = html
    .replaceAll('{{employerName}}', employerName)
    .replaceAll('{{enrollmentLink}}', enrollmentLink)
    .replaceAll('{{code}}', code)  // <-- ✅ Now correctly populating the code placeholder
    .replaceAll('{{upperCode}}', upperCode);  // <-- ✅ Now correctly populating the code placeholder
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
