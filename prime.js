// Import Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 🔹 Initialize Supabase
const supabaseUrl = 'https://ftlgxxntrqcxsagsymvw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bGd4eG50cnFjeHNhZ3N5bXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MTk5NzEsImV4cCI6MjA3ODA5NTk3MX0.XmzDMeZLGKQvjQgA-4iLRKMnvTJs2GcfQC3FLVLxKhA';
const supabase = createClient(supabaseUrl, supabaseKey);

// 🔹 Price Constant
const pricePerSqInch = 0.0278;
let orderItems = [];
let selectedFile = null;

// 🔹 Handle Image Upload & Auto-Measure Dimensions
document.getElementById("imageUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected.");
        return;
    }
    if (file.type !== "image/png") {
        alert("Only PNG files are allowed.");
        event.target.value = "";
        return;
    }
    selectedFile = file;

    const reader = new FileReader();
    reader.onload = function(e) {
        const buffer = e.target.result;
        const view = new DataView(buffer);

        // Search for pHYs chunk in PNG
        let offset = 8; // Skip PNG signature
        let dpi = 300; // Default fallback
        while (offset < buffer.byteLength) {
            const length = view.getUint32(offset);
            const type = String.fromCharCode(
                view.getUint8(offset + 4),
                view.getUint8(offset + 5),
                view.getUint8(offset + 6),
                view.getUint8(offset + 7)
            );
            if (type === 'pHYs') {
                const xPPM = view.getUint32(offset + 8);
                const units = view.getUint8(offset + 16);
                if (units === 1) { // Units in meters
                    dpi = Math.round(xPPM * 0.0254);
                }
                break;
            }
            offset += 12 + length;
        }

        if (dpi < 300) {
            alert("⚠️ Warning: This image is below 300 DPI. It may not print clearly. We recommend uploading files at 300 DPI or higher.");
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            let top = null, bottom = null, left = null, right = null;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const alpha = imageData[(y * canvas.width + x) * 4 + 3];
                    if (alpha !== 0) {
                        if (top === null) top = y;
                        bottom = y;
                        if (left === null || x < left) left = x;
                        if (right === null || x > right) right = x;
                    }
                }
            }

            if (top === null || bottom === null || left === null || right === null) {
                alert("Could not detect content bounds.");
                return;
            }

            const contentWidth = right - left + 1;
            const contentHeight = bottom - top + 1;

            document.getElementById("width").value = (contentWidth / dpi).toFixed(2);
            document.getElementById("height").value = (contentHeight / dpi).toFixed(2);
            updatePrice();
        };
        document.getElementById("previewImage").src = img.src;
    };
    reader.readAsArrayBuffer(file);
});

// 🔹 Function to Calculate Price
function updatePrice() {
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const quantity = parseInt(document.getElementById("quantity").value) || 1;
    
    if (!isNaN(width) && !isNaN(height) && !isNaN(quantity)) {
        let finalWidth = width + 0.24;
        let finalHeight = height + 0.24;
        if (finalWidth > 22) finalWidth = 24;
        if (finalHeight > 40) finalHeight = 40;
        if (finalHeight > finalWidth && finalWidth <= 22) {
            [finalWidth, finalHeight] = [finalHeight, finalWidth];
        }
        const area = finalWidth * finalHeight;
        let price = area * pricePerSqInch * quantity;
        document.getElementById("totalPrice").textContent = price.toFixed(2);
    } else {
        document.getElementById("totalPrice").textContent = "0.00";
    }
}

// 🔹 Update Price on Input Change
document.getElementById("width").addEventListener("input", updatePrice);
document.getElementById("height").addEventListener("input", updatePrice);
document.getElementById("quantity").addEventListener("input", updatePrice);

// 🔹 Handle "Add to Order"
document.getElementById("addToOrder").addEventListener("click", function() {
    if (!selectedFile) {
        alert("Please upload an image before adding to the order.");
        return;
    }
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const quantity = parseInt(document.getElementById("quantity").value) || 1;
    const price = parseFloat(document.getElementById("totalPrice").textContent);

    orderItems.push({
        file: selectedFile,
        fileName: selectedFile.name,
        quantity: quantity,
        price: price
    });

    updateOrderSummary();
    selectedFile = null;
    document.getElementById("imageUpload").value = "";
    document.getElementById("width").value = "";
    document.getElementById("height").value = "";
    document.getElementById("quantity").value = "1";
    document.getElementById("totalPrice").textContent = "0.00";
});

// 🔹 Function to Update Order Summary
function updateOrderSummary() {
    const table = document.getElementById("orderTable");
    table.innerHTML = `
        <tr>
            <th>File Name</th>
            <th>Cost</th>
            <th>Quantity</th>
            <th>Remove</th>
        </tr>
    `;
    let totalPrice = 0;
    orderItems.forEach((item, index) => {
        const row = table.insertRow(-1);
        row.innerHTML = `
            <td>${item.fileName}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td><button class="delete-btn" data-index="${index}">❌</button></td>
        `;
        totalPrice += item.price;
        row.querySelector(".delete-btn").addEventListener("click", function() {
            orderItems.splice(index, 1);
            updateOrderSummary();
        });
    });

    // 🔹 Update Estimated Total Price
    document.getElementById("totalPriceFinal").textContent = `$${totalPrice.toFixed(2)}`;
}

// 🔹 Handle Order Submission & Upload to Supabase
document.getElementById("submitOrder").addEventListener("click", async function() {
    if (orderItems.length === 0) {
        alert("Please add at least one item to the order before submitting.");
        return;
    }

    // 🔹 Show "Submitting Please Wait..." popup
    document.getElementById("submissionPopup").style.display = "block";

    try {
        const customerInfo = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            street: document.getElementById("street").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            zip: document.getElementById("zip").value,
            deliveryMethod: document.querySelector('input[name="delivery"]:checked').value
        };

        // 🔹 Upload files to Supabase Storage and collect URLs
        let uploadedFiles = [];
        for (let item of orderItems) {
            const timestamp = Date.now();
            const fileName = `${timestamp}_${item.fileName}`;
            const filePath = `orders/${fileName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('order-images')
                .upload(filePath, item.file);

            if (uploadError) {
                throw new Error(`Failed to upload ${item.fileName}: ${uploadError.message}`);
            }

            // Get public URL for the uploaded file
            const { data: urlData } = supabase.storage
                .from('order-images')
                .getPublicUrl(filePath);

            uploadedFiles.push({
                fileName: item.fileName,
                filePath: filePath,
                fileURL: urlData.publicUrl,
                quantity: item.quantity,
                price: item.price.toFixed(2)
            });
        }

        // 🔹 Insert order into database
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{
                first_name: customerInfo.firstName,
                last_name: customerInfo.lastName,
                email: customerInfo.email,
                phone: customerInfo.phone,
                street: customerInfo.street,
                city: customerInfo.city,
                state: customerInfo.state,
                zip: customerInfo.zip,
                delivery_method: customerInfo.deliveryMethod,
                total_price: parseFloat(document.getElementById("totalPriceFinal").textContent.replace('$', ''))
            }])
            .select();

        if (orderError) {
            throw new Error(`Failed to create order: ${orderError.message}`);
        }

        const orderId = orderData[0].id;

        // 🔹 Insert order items
        const orderItemsData = uploadedFiles.map(file => ({
            order_id: orderId,
            file_name: file.fileName,
            file_path: file.filePath,
            quantity: file.quantity,
            price: parseFloat(file.price)
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

        if (itemsError) {
            throw new Error(`Failed to create order items: ${itemsError.message}`);
        }

        // 🔹 Call edge function to send email
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-order-email', {
            body: {
                orderId: orderId,
                customerInfo: customerInfo,
                items: uploadedFiles,
                totalPrice: document.getElementById("totalPriceFinal").textContent
            }
        });

        if (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't throw error here - order is already submitted
        }

        // 🔹 Hide "Submitting Please Wait..." popup
        document.getElementById("submissionPopup").style.display = "none";

        alert(`✅ Order submitted successfully!`);
        resetOrder();
    } catch (error) {
        // 🔹 Hide popup on error
        document.getElementById("submissionPopup").style.display = "none";
        alert(`❌ Error submitting order: ${error.message}`);
        console.error('Submission error:', error);
    }
});

// 🔹 Reset Order After Submission
function resetOrder() {
    document.getElementById("orderTable").innerHTML = `
        <tr>
            <th>File Name</th>
            <th>Cost</th>
            <th>Quantity</th>
            <th>Remove</th>
        </tr>
    `;
    orderItems = [];
    document.getElementById("totalPriceFinal").textContent = "0.00";
    
    // Reset form fields
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("street").value = "";
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";
    document.getElementById("zip").value = "";
    document.getElementById("previewImage").src = "uploadhere.png";
}
