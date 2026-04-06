export const parseLineItems = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [productName = '', quantity = '1', price = ''] = line.split('|').map((part) => part.trim());
      return {
        productName,
        quantity: Number(quantity) || 1,
        ...(price !== '' ? { price: Number(price) || 0 } : {}),
      };
    })
    .filter((item) => item.productName);

export const staffModuleConfigs = {
  reports: {
    title: 'Daily Reports',
    description: 'Submit field updates, visited clients, and follow-up notes before the day closes.',
    endpoint: '/staff-portal/reports',
    fields: [
      { name: 'date', label: 'Report Date', type: 'date', required: true },
      { name: 'summary', label: 'Day Summary', type: 'textarea', required: true },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      {
        name: 'followUpNeeded',
        label: 'Follow-up Needed',
        type: 'select',
        options: [
          { value: false, label: 'No' },
          { value: true, label: 'Yes' },
        ],
      },
    ],
  },
  orders: {
    title: 'Sales Orders',
    description: 'Capture customer orders in the field and notify the company mailbox immediately.',
    endpoint: '/staff-portal/orders',
    fields: [
      { name: 'customerName', label: 'Customer Name', required: true },
      { name: 'companyName', label: 'Hospital / Company' },
      { name: 'contactPerson', label: 'Contact Person' },
      {
        name: 'itemsText',
        label: 'Items',
        type: 'textarea',
        required: true,
        placeholder: 'One line per item: Product Name | Quantity | Price',
      },
      {
        name: 'urgency',
        label: 'Urgency',
        type: 'select',
        options: ['low', 'normal', 'high', 'urgent'].map((value) => ({ value, label: value })),
      },
      { name: 'deliveryNote', label: 'Delivery Note' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    transformPayload: (values) => ({
      ...values,
      items: parseLineItems(values.itemsText),
    }),
  },
  expenses: {
    title: 'Expense Requests',
    description: 'Submit expenses with receipts from the field and track approvals without extra admin friction.',
    endpoint: '/staff-portal/expenses',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'category', label: 'Category', required: true },
      { name: 'amount', label: 'Amount (BHD)', type: 'number', required: true },
      { name: 'expenseDate', label: 'Expense Date', type: 'date', required: true },
      { name: 'paymentMethod', label: 'Payment Method' },
      { name: 'receiptUrl', label: 'Receipt Upload', type: 'file' },
      { name: 'relatedReference', label: 'Related Reference' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  clients: {
    title: 'Clients',
    description: 'Keep the field CRM tidy so visits, follow-ups, quotations, and collections stay linked to the right accounts.',
    endpoint: '/staff-portal/clients',
    fields: [
      { name: 'name', label: 'Client / Facility Name', required: true },
      { name: 'companyType', label: 'Company Type' },
      { name: 'department', label: 'Department' },
      { name: 'contactPerson', label: 'Contact Person' },
      { name: 'phone', label: 'Phone' },
      { name: 'email', label: 'Email' },
      { name: 'location', label: 'Location' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  visits: {
    title: 'Client Visits',
    description: 'Log every visit with outcomes and next steps so follow-up work is never lost.',
    endpoint: '/staff-portal/visits',
    fields: [
      { name: 'clientName', label: 'Client Name' },
      { name: 'visitDate', label: 'Visit Date', type: 'date', required: true },
      { name: 'visitTime', label: 'Visit Time', type: 'time' },
      { name: 'location', label: 'Location' },
      { name: 'metPerson', label: 'Met Person' },
      { name: 'purpose', label: 'Purpose', required: true },
      { name: 'discussionSummary', label: 'Discussion Summary', type: 'textarea' },
      { name: 'outcome', label: 'Outcome', type: 'textarea' },
      { name: 'followUpDate', label: 'Follow-up Date', type: 'date' },
    ],
  },
  followups: {
    title: 'Follow-Ups',
    description: 'Track what is due next and close the loop on every visit, quote, and order.',
    endpoint: '/staff-portal/followups',
    statusPatch: '/staff-portal/followups',
    statusOptions: ['pending', 'completed', 'missed'],
    fields: [
      { name: 'clientName', label: 'Client Name' },
      { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { name: 'note', label: 'Reminder Note', type: 'textarea', required: true },
    ],
  },
  quotations: {
    title: 'Quotations',
    description: 'Track quoted opportunities, proposed pricing, and conversion status.',
    endpoint: '/staff-portal/quotations',
    statusPatch: '/staff-portal/quotations',
    statusOptions: ['draft', 'sent', 'approved', 'rejected', 'converted_to_order'],
    fields: [
      { name: 'clientName', label: 'Client Name' },
      { name: 'itemsText', label: 'Items', type: 'textarea', placeholder: 'Product Name | Quantity | Price' },
      { name: 'proposedPrice', label: 'Proposed Price', type: 'number' },
      { name: 'dateSent', label: 'Date Sent', type: 'date' },
      { name: 'validityDate', label: 'Validity Date', type: 'date' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ['draft', 'sent', 'approved', 'rejected', 'converted_to_order'].map((value) => ({ value, label: value })),
      },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    transformPayload: (values) => ({
      ...values,
      items: parseLineItems(values.itemsText),
    }),
  },
  collections: {
    title: 'Collections',
    description: 'Track amounts due, amounts collected, and the follow-up state on each payment conversation.',
    endpoint: '/staff-portal/collections',
    statusPatch: '/staff-portal/collections',
    statusOptions: ['pending', 'partial', 'collected', 'overdue'],
    fields: [
      { name: 'clientName', label: 'Client Name' },
      { name: 'reference', label: 'Reference / Invoice' },
      { name: 'amountDue', label: 'Amount Due', type: 'number' },
      { name: 'amountCollected', label: 'Amount Collected', type: 'number' },
      { name: 'collectionDate', label: 'Collection Date', type: 'date' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ['pending', 'partial', 'collected', 'overdue'].map((value) => ({ value, label: value })),
      },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  requests: {
    title: 'Stock / Item Requests',
    description: 'Ask for samples, brochures, tools, or stock support without leaving the field workflow.',
    endpoint: '/staff-portal/stock-requests',
    fields: [
      { name: 'item', label: 'Item', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'reason', label: 'Reason', type: 'textarea' },
      {
        name: 'urgency',
        label: 'Urgency',
        type: 'select',
        options: ['low', 'normal', 'high', 'urgent'].map((value) => ({ value, label: value })),
      },
    ],
  },
  demand: {
    title: 'Product Demand',
    description: 'Capture product requests even when the item is not yet in stock or in the current catalog.',
    endpoint: '/staff-portal/product-demands',
    fields: [
      { name: 'clientName', label: 'Client Name' },
      { name: 'productName', label: 'Requested Product', required: true },
      { name: 'quantityEstimate', label: 'Quantity Estimate' },
      {
        name: 'urgency',
        label: 'Urgency',
        type: 'select',
        options: ['low', 'normal', 'high', 'urgent'].map((value) => ({ value, label: value })),
      },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  issues: {
    title: 'Issues & Complaints',
    description: 'Report delivery problems, complaints, damaged items, or internal issues with clear priority.',
    endpoint: '/staff-portal/issues',
    fields: [
      { name: 'issueType', label: 'Issue Type', required: true },
      {
        name: 'priority',
        label: 'Priority',
        type: 'select',
        options: ['low', 'medium', 'high', 'critical'].map((value) => ({ value, label: value })),
      },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
};

export const adminModuleConfigs = {
  attendance: { title: 'Attendance Logs', endpoint: '/admin-portal/attendance', supportsDate: true, supportsUser: true },
  reports: { title: 'Daily Reports', endpoint: '/admin-portal/reports', supportsDate: true, supportsUser: true },
  orders: { title: 'Sales Orders', endpoint: '/admin-portal/orders', statusPatch: '/admin-portal/orders', supportsStatus: true, supportsUser: true, statusOptions: ['submitted', 'reviewed', 'emailed', 'confirmed', 'delivered', 'cancelled'] },
  expenses: { title: 'Expense Requests', endpoint: '/admin-portal/expenses', statusPatch: '/admin-portal/expenses', supportsStatus: true, supportsUser: true, statusOptions: ['submitted', 'under_review', 'approved', 'rejected', 'paid'] },
  clients: { title: 'Clients', endpoint: '/admin-portal/clients' },
  visits: { title: 'Visit Logs', endpoint: '/admin-portal/visits', supportsUser: true },
  followups: { title: 'Follow-Ups', endpoint: '/admin-portal/followups', supportsStatus: true, supportsUser: true, statusOptions: ['pending', 'completed', 'missed'] },
  quotations: { title: 'Quotations', endpoint: '/admin-portal/quotations', supportsUser: true },
  collections: { title: 'Collections', endpoint: '/admin-portal/collections', supportsUser: true },
  requests: { title: 'Stock / Item Requests', endpoint: '/admin-portal/stock-requests', statusPatch: '/admin-portal/stock-requests', supportsStatus: true, supportsUser: true, statusOptions: ['submitted', 'under_review', 'approved', 'rejected', 'fulfilled'] },
  demand: { title: 'Product Demand', endpoint: '/admin-portal/product-demands', supportsUser: true },
  issues: { title: 'Issues & Complaints', endpoint: '/admin-portal/issues', statusPatch: '/admin-portal/issues', supportsStatus: true, supportsUser: true, statusOptions: ['submitted', 'under_review', 'resolved', 'closed'] },
  notifications: { title: 'Notifications', endpoint: '/admin-portal/notifications' },
  logs: { title: 'Activity Logs', endpoint: '/admin-portal/activity-logs', supportsUser: true },
};
