// Modified app/api/send-email/route.ts
import { NextResponse } from "next/server";

interface SendEmailInput {
  clientMutationId: string;
  from: string;
  to: string;
  body: string;
  subject: string;
}

interface SendEmailResponse {
  message: string;
  origin: string;
  sent: boolean;
}

async function fetchAPI<T>(
  query: string,
  { variables }: { variables: { input: SendEmailInput } }
): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || "Error fetching API");
  }
  return json.data;
}

async function sendMail(
  subject: string,
  body: string,
  mutationId: string = "contact"
): Promise<SendEmailResponse | null> {
  // Changed recipient email
  const fromAddress = "noreply@theholyspriritus.com";
  const toAddress = "info@theholyspiritus.com"; // Changed to new recipient

  const data = await fetchAPI<{ sendEmail: SendEmailResponse }>(
    `
      mutation SendEmail($input: SendEmailInput!) {
        sendEmail(input: $input) {
          message
          origin
          sent
        }
      }
    `,
    {
      variables: {
        input: {
          clientMutationId: mutationId,
          from: fromAddress,
          to: toAddress,
          body: body,
          subject: subject,
        },
      },
    }
  );

  return data?.sendEmail || null;
}

export async function POST(request: Request) {
  try {
    const { subject, name, email, phoneNumber, message, onderwerp, body } =
      await request.json();

    // Format the email with the nicer template
    const formattedSubject = `${
      onderwerp || subject
    } verzoek via theholyspiritus.com websiteformulier`;

    const formattedBody = `
      <p><strong>Onderwerp:</strong> ${onderwerp || subject}</p>
      <p><strong>Naam:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefoonnummer:</strong> ${phoneNumber}</p>
      <br>
      <p><strong>Bericht:</strong></p>
      <p>${(message || body).replace(/\n/g, "<br>")}</p>
    `;

    if (!formattedSubject || !formattedBody) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    const result = await sendMail(
      formattedSubject,
      formattedBody,
      "contact-form"
    );

    if (!result || !result.sent) {
      return NextResponse.json(
        { error: result?.message || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
