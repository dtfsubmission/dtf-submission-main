import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

// 🔹 Gmail Credentials - Replace 'your-16-char-app-password-here' with your actual Gmail App Password
const GMAIL_USER = 'dtfsubmission@gmail.com'
const GMAIL_APP_PASSWORD = 'ckil sydh ojno ppqm'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { orderId, customerInfo, items, totalPrice } = await req.json()

    // Build email HTML content
    let itemsHtml = ''
    items.forEach((item: any) => {
      itemsHtml += `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${item.fileName}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">$${item.price}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">
            <a href="${item.fileURL}" download style="color: #0066cc; text-decoration: none; font-weight: bold;">📥 Download High-Res Image</a>
          </td>
        </tr>
      `
    })

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #0066cc; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #0066cc; color: white; padding: 12px; text-align: left; }
          .info-section { background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎨 New DTF Order Submission</h1>
          <p><strong>Order ID:</strong> ${orderId}</p>
          
          <div class="info-section">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> ${customerInfo.firstName} ${customerInfo.lastName}</p>
            <p><strong>Email:</strong> ${customerInfo.email}</p>
            <p><strong>Phone:</strong> ${customerInfo.phone}</p>
            <p><strong>Address:</strong> ${customerInfo.street}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zip}</p>
            <p><strong>Delivery Method:</strong> ${customerInfo.deliveryMethod}</p>
          </div>

          <h2>Order Items</h2>
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px;">
            <p>Estimated Total: ${totalPrice}</p>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
            <p><strong>Note:</strong> This is an estimated total. Review the artwork and send the final invoice to the customer.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Configure SMTP client for Gmail
    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 587,
        tls: true,
        auth: {
          username: GMAIL_USER,
          password: GMAIL_APP_PASSWORD,
        },
      },
    })

    // Send email
    await client.send({
      from: GMAIL_USER,
      to: GMAIL_USER,
      subject: `NEW ORDER - ${customerInfo.firstName} ${customerInfo.lastName}`,
      content: 'This is an HTML email. Please use an HTML-capable email client.',
      html: emailHtml,
    })

    await client.close()

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 500,
      }
    )
  }
})
