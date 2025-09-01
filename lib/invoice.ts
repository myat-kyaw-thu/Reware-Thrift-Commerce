import { formatCurrency, formatDateTime } from "@/lib/utils";

interface InvoiceData {
  order: {
    id: string;
    createdAt: Date;
    itemsPrice: string;
    shippingPrice: string;
    taxPrice: string;
    totalPrice: string;
    isPaid: boolean;
    paidAt?: Date | null;
    paymentMethod: string;
    shippingAddress: {
      fullName: string;
      streetAddress: string;
      city: string;
      postalCode: string;
      country: string;
    };
    orderitems: Array<{
      name: string;
      qty: number;
      price: string;
      image?: string;
    }>;
  };
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const { order, user } = data;
  const invoiceNumber = `INV-${order.id.slice(-8).toUpperCase()}`;
  const invoiceDate = formatDateTime(order.createdAt).dateTime;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 20px auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .invoice-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .invoice-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          font-weight: 300;
        }
        
        .invoice-header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        
        .invoice-body {
          padding: 30px;
        }
        
        .invoice-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .info-section h3 {
          color: #667eea;
          margin-bottom: 10px;
          font-size: 1.1rem;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 5px;
        }
        
        .info-section p {
          margin-bottom: 5px;
          color: #666;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .items-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e9ecef;
        }
        
        .items-table td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .items-table tr:hover {
          background-color: #f8f9fa;
        }
        
        .total-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 5px 0;
        }
        
        .total-row.final {
          border-top: 2px solid #667eea;
          padding-top: 15px;
          margin-top: 15px;
          font-weight: bold;
          font-size: 1.2rem;
          color: #667eea;
        }
        
        .payment-status {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .payment-status.paid {
          background: #d4edda;
          color: #155724;
        }
        
        .payment-status.pending {
          background: #fff3cd;
          color: #856404;
        }
        
        .footer {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          color: #666;
          font-size: 0.9rem;
        }
        
        @media print {
          body {
            background: white;
          }
          
          .invoice-container {
            box-shadow: none;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <h1>INVOICE</h1>
          <p>Invoice #${invoiceNumber}</p>
        </div>
        
        <div class="invoice-body">
          <div class="invoice-info">
            <div class="info-section">
              <h3>Bill To</h3>
              <p><strong>${order.shippingAddress.fullName}</strong></p>
              <p>${order.shippingAddress.streetAddress}</p>
              <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
              <p>${order.shippingAddress.country}</p>
              ${user?.email ? `<p>Email: ${user.email}</p>` : ''}
            </div>
            
            <div class="info-section">
              <h3>Invoice Details</h3>
              <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <p><strong>Status:</strong> 
                <span class="payment-status ${order.isPaid ? 'paid' : 'pending'}">
                  ${order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </p>
              ${order.isPaid && order.paidAt ? `<p><strong>Paid On:</strong> ${formatDateTime(order.paidAt).dateTime}</p>` : ''}
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderitems.map(item => `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td>${item.qty}</td>
                  <td>${formatCurrency(item.price)}</td>
                  <td>${formatCurrency((parseFloat(item.price) * item.qty).toString())}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(order.itemsPrice)}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>${parseFloat(order.shippingPrice) === 0 ? 'Free' : formatCurrency(order.shippingPrice)}</span>
            </div>
            <div class="total-row">
              <span>Tax:</span>
              <span>${formatCurrency(order.taxPrice)}</span>
            </div>
            <div class="total-row final">
              <span>Total:</span>
              <span>${formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>This is a computer-generated invoice. No signature required.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function downloadInvoice(data: InvoiceData): void {
  const html = generateInvoiceHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${data.order.id.slice(-8)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}