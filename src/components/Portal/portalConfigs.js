const parseQuantity = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return 1;

  const directNumber = Number(normalized);
  if (Number.isFinite(directNumber) && directNumber > 0) return directNumber;

  const numericMatch = normalized.match(/-?\d+(?:\.\d+)?/);
  if (!numericMatch) return 1;

  const parsedNumber = Number(numericMatch[0]);
  return Number.isFinite(parsedNumber) && parsedNumber > 0 ? parsedNumber : 1;
};

export const parseLineItems = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [productName = '', quantity = '1', price = ''] = line.split('|').map((part) => part.trim());
      return {
        productName,
        quantity: parseQuantity(quantity),
        ...(price !== '' ? { price: Number(price) || 0 } : {}),
      };
    })
    .filter((item) => item.productName);

export const staffModuleConfigs = {
  reports: {
    title: 'Daily Reports',
    description: 'Submit field updates and visited client notes before the day closes.',
    endpoint: '/staff-portal/reports',
    fields: [
      { name: 'date', label: 'Report Date', type: 'date', required: true },
      { name: 'summary', label: 'Day Summary', type: 'textarea', required: true },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Only add notes if they are needed for this report.' },
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
  clients: {
    title: 'Clients',
    description: 'Keep the field client list tidy so visits and orders stay linked to the right accounts.',
    endpoint: '/staff-portal/clients',
    fields: [
      { name: 'name', label: 'Client / Facility Name', required: true },
      { name: 'companyType', label: 'Company Type', placeholder: 'Leave blank if not applicable' },
      { name: 'department', label: 'Department', placeholder: 'Leave blank if not applicable' },
      { name: 'contactPerson', label: 'Contact Person', placeholder: 'Leave blank if not applicable' },
      { name: 'phone', label: 'Phone', placeholder: 'Leave blank if not applicable' },
      { name: 'email', label: 'Email', placeholder: 'Leave blank if not applicable' },
      { name: 'location', label: 'Location', placeholder: 'Leave blank if not applicable' },
      { name: 'address', label: 'Address', type: 'textarea', placeholder: 'Leave blank if not applicable' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Leave blank if not applicable' },
    ],
  },
  visits: {
    title: 'Client Visits',
    description: 'Log every visit with outcomes and next steps so field activity is always recorded.',
    endpoint: '/staff-portal/visits',
    fields: [
      { name: 'clientName', label: 'Client Name', placeholder: 'Leave blank if not applicable' },
      { name: 'visitDate', label: 'Visit Date', type: 'date', required: true },
      { name: 'visitTime', label: 'Visit Time', type: 'time', placeholder: 'Optional' },
      { name: 'location', label: 'Location', placeholder: 'Leave blank if not applicable' },
      { name: 'metPerson', label: 'Met Person', placeholder: 'Leave blank if not applicable' },
      { name: 'purpose', label: 'Purpose', required: true },
      { name: 'discussionSummary', label: 'Discussion Summary', type: 'textarea', placeholder: 'Leave blank if not applicable' },
      { name: 'outcome', label: 'Outcome', type: 'textarea', placeholder: 'Leave blank if not applicable' },
    ],
  },
};

export const adminModuleConfigs = {
  attendance: { title: 'Attendance Logs', endpoint: '/admin-portal/attendance', supportsDate: true, supportsUser: true },
  reports: { title: 'Daily Reports', endpoint: '/admin-portal/reports', supportsDate: true, supportsUser: true },
  orders: { title: 'Sales Orders', endpoint: '/admin-portal/orders', statusPatch: '/admin-portal/orders', supportsStatus: true, supportsUser: true, statusOptions: ['submitted', 'reviewed', 'emailed', 'confirmed', 'delivered', 'cancelled'] },
  clients: { title: 'Clients', endpoint: '/admin-portal/clients', supportsUser: true },
  visits: { title: 'Visit Logs', endpoint: '/admin-portal/visits', supportsUser: true },
  notifications: { title: 'Notifications', endpoint: '/admin-portal/notifications' },
  logs: { title: 'Activity Logs', endpoint: '/admin-portal/activity-logs', supportsUser: true },
};
