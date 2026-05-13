export const BUSINESS_HOURS = [
  { day: 'Monday', opens: '08:00', closes: '16:00', label: '8:00am - 4:00pm' },
  { day: 'Tuesday', opens: '08:00', closes: '16:00', label: '8:00am - 4:00pm' },
  { day: 'Wednesday', opens: '08:00', closes: '16:00', label: '8:00am - 4:00pm' },
  { day: 'Thursday', opens: '08:00', closes: '16:00', label: '8:00am - 4:00pm' },
  { day: 'Saturday', opens: '08:00', closes: '16:00', label: '8:00am - 4:00pm' },
  { day: 'Sunday', opens: '08:00', closes: '16:00', label: '8:00am - 4:00pm' },
];

export const businessAddress = {
  streetAddress: 'Office 109, Building 658, Road 16, Block 616, Warehousing World, Um Al-Baidh',
  addressLocality: 'Sitra',
  addressCountry: 'BH',
  addressRegion: 'Capital Governorate',
};

export const businessContact = {
  telephone: '+97339939582',
  email: 'admin@lte-bh.com',
};

export const businessLocationText =
  'Office 109, Building 658, Road 16, Block 616, Warehousing World, Um Al-Baidh, Sitra, Bahrain';

const encodedLocation = encodeURIComponent(businessLocationText);

export const businessMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
export const businessMapsEmbedUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
