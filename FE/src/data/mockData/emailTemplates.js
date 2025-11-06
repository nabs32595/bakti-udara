export const INITIAL_EMAIL_TEMPLATES = [
  {
    id: 1,
    name: 'Quotation About To Expire',
    description: 'Notify customers about expiring quotations',
    category: 'Welcome',
    subject: 'Welcome to Bakti Udara!',
    content: '<h2>Welcome to Bakti Udara!</h2><p>Thank you for choosing us for your aviation needs...</p>',
    status: 'Active',
    lastModified: '2 days ago'
  },
  {
    id: 2,
    name: 'Order Confirmation',
    description: 'Confirm customer orders and provide details',
    category: 'Transactional',
    subject: 'Order Confirmation - {{orderNumber}}',
    content: '<h2>Order Confirmed!</h2><p>Your order has been successfully placed...</p>',
    status: 'Active',
    lastModified: '1 week ago'
  },
  {
    id: 3,
    name: 'Delivery Notification',
    description: 'Notify customers about delivery status',
    category: 'Notification',
    subject: 'Your Order is Ready for Pickup',
    content: '<h2>Delivery Update</h2><p>Your order is ready for pickup at our warehouse...</p>',
    status: 'Active',
    lastModified: '3 days ago'
  }
]

