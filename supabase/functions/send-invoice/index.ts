
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, recipientEmail, subject, message, storeName } = await req.json();

    if (!pdfBase64 || !recipientEmail) {
      throw new Error("Missing required fields: pdfBase64 and recipientEmail are required");
    }

    // Send email with the PDF attachment
    const data = await resend.emails.send({
      from: `${storeName || "NextPOS"} <onboarding@resend.dev>`,
      to: [recipientEmail],
      subject: subject || "Your Receipt",
      html: `
        <div>
          <h1>Your Receipt</h1>
          <p>${message || "Thank you for your purchase. Please find your receipt attached."}</p>
          <p>Best regards,<br>${storeName || "NextPOS"}</p>
        </div>
      `,
      attachments: [
        {
          filename: "receipt.pdf",
          content: pdfBase64,
        },
      ],
    });

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send email",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
