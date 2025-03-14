import { NextResponse } from "next/server";

// Define types for the email data
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

// Helper function to fetch from WordPress GraphQL API
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

// Helper function (not exported at the module level)
async function sendMail(
  subject: string,
  body: string,
  mutationId: string = "contact"
): Promise<SendEmailResponse | null> {
  const fromAddress = "noreply@theholyspriritus.com";
  const toAddress = "someone@theholyspriritus.com";

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

// Next.js App Router API route handler
export async function POST(request: Request) {
  try {
    const { subject, body, mutationId } = await request.json();

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    const result = await sendMail(subject, body, mutationId);

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
