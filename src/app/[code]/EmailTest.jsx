"use client";

import { useParams } from "next/navigation";
import { employerData } from "@/data/employerData";
import { EnvelopeIcon } from "@/components/icons/EnvelopeIcon"; // Import your custom icon
import { CopyIcon } from "@/components/icons/CopyIcon"; // Import your existing Copy icon

export function EmailTest() {
  const { code } = useParams();
  const match = employerData.find((entry) => entry.access_code === code);
  const employerName = match?.public_employer_name ?? "Unknown";

  // Construct the dynamic enrollment link
  const enrollmentLink = `https://previ.com/access/${code}`;

  // Function to copy email content to clipboard
  const copyToClipboard = () => {
    const emailBody = document.getElementById("email-content");
    if (!emailBody) return;

    const range = document.createRange();
    range.selectNodeContents(emailBody);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();

    alert("Email copied! You can now edit and send it.");
  };

  return (
    <div className="mt-10 shadow-lg rounded-lg">
      {/* Email Header */}
      <div
        className="px-4 py-2 flex items-center text-white"
        style={{
          backgroundColor: "#4A76A8",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <EnvelopeIcon className="w-6 h-6 mr-2 stroke-white" />
        <span className="font-semibold">New Message</span>
      </div>

      {/* To and Subject Fields */}
      <div className="px-4 py-2 bg-white text-sm text-gray-700">
        {/* To Line */}
        <div className="flex items-left justify-start gap-2">
          <span className="text-gray-500">To:</span>
          <div
            className="ml-2 px-3 py-1 rounded-full"
            style={{
              backgroundColor: "#EFF3F8",
              fontSize: "14px",
              fontWeight: "bold",
              border: "1px solid #D1D5DB",
            }}
          >
            All {employerName} Employees
          </div>
        </div>

        {/* Gray separator */}
        <div className="border-b my-2" style={{ borderBottom: "1px solid #D1D5DB" }}></div>

        {/* Subject Line */}
        <div className="flex items-center justify-start gap-2">
          <span className="text-gray-500">Subject:</span>
          <span className="text-gray-900 font-semibold">New Employee Benefit</span>
        </div>

        {/* Gray separator */}
        <div className="border-b my-2" style={{ borderBottom: "1px solid #D1D5DB" }}></div>
      </div>

      {/* Email Body (Wrapped for Copying) */}
      <div id="email-content" className="px-4 bg-white" style={{ paddingTop: "10px" }}>
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          border="0"
          style={{
            maxWidth: "100%",
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.6",
            color: "#000",
          }}
        >
          <tbody>
          <tr>
            <td align="left" style={{ padding: "10px 20px 20px 20px" }}>
              {/* Title */}
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                  {employerName} Employees Now Have Access to Private Pricing Plans
                </span>

              {/* Intro */}
              <p>Hi team,</p>
              <p>
                As part of our commitment to providing meaningful benefits for our employees, we are pleased to introduce a new opportunity for membership in{" "}
                <strong>private, unadvertised pricing</strong> on premium mobile plans.
              </p>
              <p>
                We’ve recently joined a private pricing network that gives you and your family access to exclusive rates not available to the public.
              </p>

              {/* Voluntary Benefit Section */}
              <p>
                <em>
                  This is a <strong>voluntary benefit</strong> available to all {employerName} employees. You can enroll as many lines as you need for your household, and{" "}
                  <strong>your plan stays with you—even if you leave {employerName}.</strong>
                </em>
              </p>

              {/* Features */}
              <table width="100%" cellPadding="5" cellSpacing="0" border="0">
                <tbody>
                <tr>
                  <td>✔ <strong>Unlimited</strong> talk, text, and data</td>
                </tr>
                <tr>
                  <td>✔ <strong>$20 per line</strong> (T-Mobile)</td>
                </tr>
                <tr>
                  <td>✔ <strong>No contracts, no activation fees</strong></td>
                </tr>
                <tr>
                  <td>✔ <strong>Keep your phones &amp; numbers</strong></td>
                </tr>
                </tbody>
              </table>

              {/* CTA Section (Re-added) */}
              <table
                width="100%"
                cellPadding="15"
                cellSpacing="0"
                border="0"
                style={{
                  backgroundColor: "#f4f4f4",
                  textAlign: "center",
                  borderRadius: "5px",
                  margin: "20px 0",
                }}
              >
                <tbody>
                <tr>
                  <td>
                    <p>
                      <em>
                        Use our{" "}
                        <a
                          href={enrollmentLink}
                          style={{ color: "#007bff", textDecoration: "none" }}
                        >
                          {employerName} Access Link
                        </a>{" "}
                        to Check Your Private Pricing Now:
                      </em>
                    </p>
                    <a
                      href={enrollmentLink}
                      style={{
                        display: "inline-block",
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: "12px 24px",
                        textDecoration: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Get Pricing
                    </a>
                  </td>
                </tr>
                </tbody>
              </table>

              {/* Disclaimer */}
              <p
                style={{
                  fontSize: "14px",
                  fontStyle: "italic",
                  color: "#555",
                  textAlign: "center",
                }}
              >
                This benefit is exclusive to {employerName} employees and accessible only through the private link above.
                <br />
                You are welcome to enroll as many lines as you need for your household, but please do not share your access outside of our team.
              </p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="px-4 py-3 bg-gray-100 border-t">
        <span className="text-gray-700 font-semibold text-sm">Edit and Send Email</span>

        {/* Copy to Edit Button */}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 mt-2 px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 transition"
        >
          <CopyIcon className="w-5 h-5 stroke-white" />
          <span>Copy HTML</span>
        </button>
      </div>
    </div>
  );
}
