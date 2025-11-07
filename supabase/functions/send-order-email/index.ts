import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// 🔹 Gmail Credentials - Replace 'your-16-char-app-password-here' with your actual Gmail App Password
const GMAIL_USER = 'dtfsubmission@gmail.com'
const GMAIL_APP_PASSWORD = 'ckil sydh ojno ppqm'

serve(async (req) => {
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

    // Send email using Gmail SMTP via basic auth
    const message = [
      `From: ${GMAIL_USER}`,
      `To: ${GMAIL_USER}`,
      `Subject: NEW ORDER - ${customerInfo.firstName} ${customerInfo.lastName}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      emailHtml
    ].join('\r\n')

    const base64Message = btoa(unescape(encodeURIComponent(message)))
    
    // Use Gmail API to send
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${GMAIL_USER}:${GMAIL_APP_PASSWORD}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: base64Message
      })
    })

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.statusText}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
