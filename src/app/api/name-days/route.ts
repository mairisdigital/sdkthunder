import { NextResponse } from 'next/server';

// Latvijas valodas kods
const COUNTRY_CODE = 'lv';

// Mēnešu nosaukumi latviski
const LATVIAN_MONTHS = [
  'janvāris', 'februāris', 'marts', 'aprīlis', 'maijs', 'jūnijs',
  'jūlijs', 'augusts', 'septembris', 'oktobris', 'novembris', 'decembris'
];

// Nedēļas dienu nosaukumi latviski (ja nepieciešams)
const LATVIAN_WEEKDAYS = [
  'svētdiena', 'pirmdiena', 'otrdiena', 'trešdiena', 'ceturtdiena', 'piektdiena', 'sestdiena'
];

interface NameDayResponse {
  success: boolean;
  message: string;
  data: {
    [countryCode: string]: string;
  };
}

// GET - Iegūt šodienas vārda dienas
export async function GET() {
  try {
    const today = new Date();
    
    // Izsaucam ārējo API
    const response = await fetch(
      `https://nameday.abalin.net/api/V2/today/lv`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // Cache 1 stundu, lai samazinātu API izsaukumus
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data: NameDayResponse = await response.json();
    
    // LABOJUMS: Iegūstam vārda dienas no data.data.lv (nevis data.data.namedays.lv)
    const rawNames = data.data?.[COUNTRY_CODE];
    const namesArray = typeof rawNames === 'string' && rawNames.length > 0
      ? rawNames.split(', ').map(name => name.trim()).filter(Boolean)
      : [];
    
    // Formatējam datumu latviski
    const formattedDate = `${today.getDate()}. ${LATVIAN_MONTHS[today.getMonth()]}`;
    
    return NextResponse.json({
      date: formattedDate,
      names: namesArray.length > 0 ? namesArray : ['Nav vārda dienu'],
      dateKey: `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
      weekday: LATVIAN_WEEKDAYS[today.getDay()],
      raw: {
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        weekday: today.getDay()
      },
      source: 'https://nameday.abalin.net/api',
      debug: {
        apiResponse: data,
        rawNames: rawNames,
        parsedNames: namesArray
      }
    });
    
  } catch (error) {
    console.error('Error fetching name days:', error);
    
    // Fallback - ja ārējais API nefungē, atgriežam pamata informāciju
    const today = new Date();
    const formattedDate = `${today.getDate()}. ${LATVIAN_MONTHS[today.getMonth()]}`;
    
    return NextResponse.json({
      date: formattedDate,
      names: ['Nav datu'],
      dateKey: `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
      weekday: LATVIAN_WEEKDAYS[today.getDay()],
      raw: {
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        weekday: today.getDay()
      },
      source: 'fallback',
      error: 'External API unavailable'
    }, { status: 200 }); // 200 lai frontend var turpināt darboties
  }
}

// POST - Iegūt konkrēta datuma vārda dienas
export async function POST(request: Request) {
  try {
    const { date } = await request.json();
    const targetDate = new Date(date);
    
    // Pārbaudām, vai datums ir derīgs
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    // Formatējam datumu kā MM-DD
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    
    // Izsaucam ārējo API konkrētam datumam
    const response = await fetch(
      `https://nameday.abalin.net/api/V2/namedays?country=lv&month=${month}&day=${day}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // Cache 24 stundas, jo vēsturiskie dati nemainās
        next: { revalidate: 86400 }
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // LABOJUMS: Iegūstam vārda dienas no pareizās struktūras
    const rawNames = data.data?.[COUNTRY_CODE];
    const namesArray = typeof rawNames === 'string' && rawNames.length > 0
      ? rawNames.split(',').map(name => name.trim()).filter(Boolean)
      : [];
    
    // Formatējam datumu latviski
    const formattedDate = `${targetDate.getDate()}. ${LATVIAN_MONTHS[targetDate.getMonth()]}`;
    
    return NextResponse.json({
      date: formattedDate,
      names: namesArray.length > 0 ? namesArray : ['Nav vārda dienu'],
      dateKey: `${month}-${day}`,
      weekday: LATVIAN_WEEKDAYS[targetDate.getDay()],
      raw: {
        day: targetDate.getDate(),
        month: targetDate.getMonth() + 1,
        year: targetDate.getFullYear(),
        weekday: targetDate.getDay()
      },
      source: 'nameday.abalin.net'
    });
    
  } catch (error) {
    console.error('Error fetching name days for specific date:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch name days for the specified date' },
      { status: 500 }
    );
  }
}

// PUT - Refresh cache manuāli (admin funkcionalitātei)
export async function PUT() {
  try {
    const today = new Date();

    // Notīrām cache un iegūstam jaunus datus
    const response = await fetch(
      `https://nameday.abalin.net/api/V2/today/${COUNTRY_CODE}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store' // Force fresh data
      }
    );

    if (response.ok) {
      const data: NameDayResponse = await response.json();

      // LABOJUMS: Iegūstam vārda dienas no pareizās struktūras
      const rawNames = data.data?.[COUNTRY_CODE];
      const namesArray = typeof rawNames === 'string' && rawNames.length > 0
        ? rawNames.split(', ').map(name => name.trim()).filter(Boolean)
        : [];

      return NextResponse.json({ 
        message: 'Cache refreshed successfully',
        timestamp: new Date().toISOString(),
        names: namesArray
      });
    } else {
      throw new Error('Failed to refresh cache');
    }
    
  } catch (error) {
    console.error('Error refreshing cache:', error);
    return NextResponse.json(
      { error: 'Failed to refresh cache' },
      { status: 500 }
    );
  }
}