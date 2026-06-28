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
  telephone2: '+97333708928',
  whatsapp: '+97317210665',
  email: 'admin@lte-bh.com',
};

export const businessLocationText =
  'Office 109, Building 658, Road 16, Block 616, Warehousing World, Um Al-Baidh, Sitra, Bahrain';

const encodedLocation = encodeURIComponent(businessLocationText);

export const businessMapsUrl = 'https://www.google.com/maps/dir//Leading+Trading+Est,+Warehouse+World,+Sitra/@26.1425389,50.5643008,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3e49ab189024342b:0x97e14e1e0fd8b940!2m2!1d50.6307677!2d26.1151676?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D';
export const businessMapsEmbedUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
