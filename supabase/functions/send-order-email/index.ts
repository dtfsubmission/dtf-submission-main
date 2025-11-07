import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// 🔹 Resend API Key - Replace with your actual key
const RESEND_API_KEY = 're_3xhL5QXr_CTkKpbujeu5rcJDLqd3YnVfG'

serve(async (req) => {
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

    console.log('Processing order:', orderId)

    // Build email HTML
    let itemsHtml = ''
    items.forEach((item: any) => {
      itemsHtml += `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${item.fileName}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">$${item.price}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">
            <a href="${item.fileURL}" style="color: #0066cc; text-decoration: none; font-weight: bold;">📥 Download High-Res Image</a>
          </td>
        </tr>
      `
    })

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0066cc;">🎨 New DTF Order Submission</h1>
          <p><strong>Order ID:</strong> ${orderId}</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> ${customerInfo.firstName} ${customerInfo.lastName}</p>
            <p><strong>Email:</strong> ${customerInfo.email}</p>
            <p><strong>Phone:</strong> ${customerInfo.phone}</p>
            <p><strong>Address:</strong> ${customerInfo.street}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zip}</p>
            <p><strong>Delivery Method:</strong> ${customerInfo.deliveryMethod}</p>
          </div>

          <h2>Order Items</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr>
                <th style="background-color: #0066cc; color: white; padding: 12px; text-align: left;">File Name</th>
                <th style="background-color: #0066cc; color: white; padding: 12px; text-align: left;">Quantity</th>
                <th style="background-color: #0066cc; color: white; padding: 12px; text-align: left;">Price</th>
                <th style="background-color: #0066cc; color: white; padding: 12px; text-align: left;">Download</th>
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

    console.log('Sending email via Resend...')

    // Send email using Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DTF Orders <onboarding@resend.dev>',
        to: ['dtfsubmission@gmail.com'],
        subject: `NEW ORDER - ${customerInfo.firstName} ${customerInfo.lastName}`,
        html: emailHtml
      })
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error('Resend API error:', errorData)
      throw new Error(`Failed to send email: ${resendResponse.status} - ${errorData}`)
    }

    const resendData = await resendResponse.json()
    console.log('Email sent successfully! ID:', resendData.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: resendData.id
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message
      }),
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
