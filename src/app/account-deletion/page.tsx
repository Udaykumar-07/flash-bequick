
import React from "react";

export default function AccountDeletion() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Flash: Be Quick – Account Deletion Request</h1>
      <div className="space-y-4 text-base leading-relaxed">
        <p>To request deletion of your Flash: Be Quick account and associated data, please email us with the following details:</p>
        
        <ul className="list-disc ml-6 space-y-2 bg-card p-4 rounded-lg">
            <li><strong>Email to:</strong> <a href="mailto:flashhqteam@flashbequick.in" className="underline text-primary">flashhqteam@flashbequick.in</a></li>
            <li><strong>Subject:</strong> Account Deletion Request</li>
            <li><strong>In the email body:</strong> Please include your registered phone number.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">Data That Will Be Deleted</h2>
        <p>Upon processing your request, the following data associated with your account will be permanently deleted:</p>
        <ul className="list-disc ml-6">
          <li>Phone number</li>
          <li>Profile information (name, etc.)</li>
          <li>Order history</li>
          <li>Stored location data</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6">Data That May Be Retained</h2>
        <p>For legal and compliance reasons, we may retain certain information for a limited period:</p>
        <ul className="list-disc ml-6">
          <li>Transaction records may be retained for up to 90 days to comply with financial and legal obligations before being permanently deleted.</li>
        </ul>

        <p className="mt-6">We are committed to protecting your privacy. If you have any questions, feel free to contact us at the email address above.</p>
      </div>
    </div>
  );
}
