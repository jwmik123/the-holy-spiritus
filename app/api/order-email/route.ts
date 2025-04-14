import { NextResponse } from "next/server";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

interface OrderEmailInput {
  orderId: number;
  customerEmail: string;
}

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

async function sendOrderConfirmationEmail(
  to: string,
  subject: string,
  body: string
): Promise<SendEmailResponse | null> {
  const fromAddress = "noreply@theholyspiritus.com";

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
          clientMutationId: "order-confirmation",
          from: fromAddress,
          to: to,
          body: body,
          subject: subject,
        },
      },
    }
  );

  return data?.sendEmail || null;
}

function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `€ ${numAmount.toFixed(2)}`;
}

function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function POST(request: Request) {
  try {
    const { orderId, customerEmail }: OrderEmailInput = await request.json();

    if (!orderId || !customerEmail) {
      return NextResponse.json(
        { error: "Order ID and customer email are required" },
        { status: 400 }
      );
    }

    // Fetch order details from WooCommerce
    const wooCommerce = getWooCommerceClient();
    const orderResponse = await wooCommerce.get(`orders/${orderId}`);
    const order = orderResponse.data;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create email content
    const formattedSubject = `Betaling verwerkt: Bedankt voor je bestelling #${orderId} - The Holy Spiritus`;

    // Build order item rows
    let orderItemsHtml = "";
    order.line_items.forEach((item: any) => {
      orderItemsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
            item.name
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(
            item.price
          )}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(
            item.total
          )}</td>
        </tr>
      `;
    });

    const formattedBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; padding: 20px;">
          <img src="${
            process.env.NEXT_PUBLIC_SITE_URL
          }/images/logo.png" alt="The Holy Spiritus" style="max-width: 200px;">
        </div>
        
        <div style="padding: 20px; border-top: 3px solid #7aa187; border-bottom: 1px solid #eee;">
          <h1 style="color: #7aa187; margin-top: 0;">Bedankt voor je bestelling!</h1>
          <p>Hallo ${order.billing.first_name},</p>
          <p>Je betaling is succesvol verwerkt en we zijn bezig met het verwerken van je bestelling.</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #7aa187;">Bestellinggegevens</h2>
          <p><strong>Bestelnummer:</strong> #${order.id}</p>
          <p><strong>Besteldatum:</strong> ${formatOrderDate(
            order.date_created
          )}</p>
          <p><strong>Betaalmethode:</strong> ${order.payment_method_title}</p>
          
          <h3 style="color: #7aa187; margin-top: 30px;">Bestelde producten</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Product</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #eee;">Aantal</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Prijs</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Totaal</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <th colspan="3" style="padding: 10px; text-align: right; border-top: 1px solid #eee;">Subtotaal:</th>
                <td style="padding: 10px; text-align: right; border-top: 1px solid #eee;">${formatCurrency(
                  order.total_ex_tax
                )}</td>
              </tr>
              <tr>
                <th colspan="3" style="padding: 10px; text-align: right;">Verzendkosten:</th>
                <td style="padding: 10px; text-align: right;">${formatCurrency(
                  order.shipping_total
                )}</td>
              </tr>
              ${
                order.discount_total > 0
                  ? `
              <tr>
                <th colspan="3" style="padding: 10px; text-align: right;">Korting:</th>
                <td style="padding: 10px; text-align: right;">- ${formatCurrency(
                  order.discount_total
                )}</td>
              </tr>
              `
                  : ""
              }
              <tr>
                <th colspan="3" style="padding: 10px; text-align: right; font-size: 1.2em;">Totaal:</th>
                <td style="padding: 10px; text-align: right; font-size: 1.2em; font-weight: bold;">${formatCurrency(
                  order.total
                )}</td>
              </tr>
            </tfoot>
          </table>
          
          <h3 style="color: #7aa187; margin-top: 30px;">Verzendgegevens</h3>
          <p>
            ${order.shipping.first_name} ${order.shipping.last_name}<br>
            ${order.shipping.address_1}<br>
            ${order.shipping.postcode} ${order.shipping.city}<br>
            ${order.shipping.country === "NL" ? "Nederland" : "België"}
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>Als je vragen hebt over je bestelling, neem dan contact met ons op via <a href="mailto:info@theholyspiritus.com" style="color: #7aa187;">info@theholyspiritus.com</a>.</p>
            <p>Met vriendelijke groet,<br>The Holy Spiritus Team</p>
          </div>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 0.8em; color: #666;">
          <p>&copy; ${new Date().getFullYear()} The Holy Spiritus. Alle rechten voorbehouden.</p>
          <p>
            <a href="${
              process.env.NEXT_PUBLIC_SITE_URL
            }" style="color: #7aa187; text-decoration: none;">Website</a> | 
            <a href="${
              process.env.NEXT_PUBLIC_SITE_URL
            }/contact" style="color: #7aa187; text-decoration: none;">Contact</a> | 
            <a href="${
              process.env.NEXT_PUBLIC_SITE_URL
            }/privacy-policy" style="color: #7aa187; text-decoration: none;">Privacybeleid</a>
          </p>
        </div>
      </div>
    `;

    // Send the email
    const result = await sendOrderConfirmationEmail(
      customerEmail,
      formattedSubject,
      formattedBody
    );

    // Also send a copy to the shop owner
    await sendOrderConfirmationEmail(
      "joel@mikdevelopment.nl",
      `Nieuwe bestelling #${orderId} ontvangen`,
      formattedBody
    );

    if (!result || !result.sent) {
      return NextResponse.json(
        { error: result?.message || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Order email sending error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
