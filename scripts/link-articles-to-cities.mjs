import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import os from 'os';
const H = os.homedir();
const sb = createClient(
  fs.readFileSync(H+'/.relocost/supabase_url','utf8').trim(),
  fs.readFileSync(H+'/.relocost/supabase_service_role_key','utf8').trim(),
  {auth:{persistSession:false}}
);

// Ручные алиасы: ключевое слово в slug статьи → slug города в базе
const CITY_ALIASES = {
  // Транслитерации, которые отличаются от slug города
  'eyndhoven': 'eindhoven',   // нет в базе — пропустим
  'zalcburg': 'salzburg',      // нет в базе
  'budva': 'budva',
  'kotora': 'kotor',           // нет в базе
  'rotterdam': 'rotterdam',    // нет в базе
  'gothenburg': 'gothenburg',  // нет в базе
  'busan': 'busan',            // нет в базе
  'kotor': 'kotor',
  'thessaloniki': 'thessaloniki',
  'nikosiya': 'nicosia',
  'bratislava': 'bratislava',
  'medellin': 'medellin',
  'budapesht': 'budapest',
  'mehiko': 'mexico-city',
  'stokgolm': 'stockholm',
  'varshava': 'warsaw',
  'varshave': 'warsaw',
  'neapol': 'naples',
  'barcelona': 'barcelona',
  'vena': 'vienna',
  'berlin': 'berlin',
  'amsterdam': 'amsterdam',
  'tbilisi': 'tbilisi',
  'istanbul': 'istanbul',
  'izmir': 'izmir',
  'dubai': 'dubai',
  'singapore': 'singapore',
  'bangkok': 'bangkok',
  'phuket': 'phuket',
  'bali': 'bali',
  'goa': 'goa',
  'lisbon': 'lisbon',
  'porto': 'porto',
  'rome': 'rome',
  'milan': 'milan',
  'paris': 'paris',
  'madrid': 'madrid',
  'barcelone': 'barcelona',
  'dublin': 'dublin',
  'brussels': 'brussels',
  'bruxelles': 'brussels',
  'brussels': 'brussels',
  'brussel': 'brussels',
  'geneva': 'geneva',
  'zurich': 'zurich',
  'munich': 'munich',
  'hamburg': 'hamburg',
  'frankfurt': 'frankfurt',
  'dusseldorf': 'dusseldorf',
  'cologne': 'cologne',
  'warsaw': 'warsaw',
  'krakow': 'krakow',
  'wroclaw': 'wroclaw',
  'gdansk': 'gdansk',
  'prague': 'prague',
  'zagreb': 'zagreb',
  'dubrovnik': 'dubrovnik',
  'split': 'split',
  'podgorica': 'podgorica',
  'budva': 'budva',
  'tivat': 'tivat',
  'belgrade': 'belgrade',
  'beograd': 'belgrade',
  'yerevan': 'yerevan',
  'batumi': 'batumi',
  'kutaisi': 'kutaisi',
  'tbilisi': 'tbilisi',
  'almaty': 'almaty',
  'astana': 'astana',
  'bishkek': 'bishkek',
  'tashkent': 'tashkent',
  'samarkand': 'samarkand',
  'baku': 'baku',
  'chisinau': 'chisinau',
  'minsk': 'minsk',
  'riga': 'riga',
  'tallinn': 'tallinn',
  'vilnius': 'vilnius',
  'athens': 'athens',
  'heraklion': 'heraklion',
  'thessaloniki': 'thessaloniki',
  'nicosia': 'nicosia',
  'limassol': 'limassol',
  'paphos': 'paphos',
  'larnaca': 'larnaca',
  'cairo': 'cairo',
  'tel-aviv': 'tel-aviv',
  'haifa': 'haifa',
  'amman': 'amman',
  'doha': 'doha',
  'abu-dhabi': 'abu-dhabi',
  'muscat': 'muscat',
  'bangkok': 'bangkok',
  'chiangmai': 'chiang-mai',
  'chiang-mai': 'chiang-mai',
  'pattaya': 'pattaya',
  'samui': 'samui',
  'krabi': 'krabi',
  'phu-quoc': 'phu-quoc',
  'hanoi': 'hanoi',
  'ho-chi-minh': 'ho-chi-minh',
  'da-nang': 'da-nang',
  'jakarta': 'jakarta',
  'kuala-lumpur': 'kuala-lumpur',
  'manila': 'manila',
  'seoul': 'seoul',
  'osaka': 'osaka',
  'tokyo': 'tokyo',
  'taipei': 'taipei',
  'hong-kong': 'hong-kong',
  'singapore': 'singapore',
  'sydney': 'sydney',
  'melbourne': 'melbourne',
  'toronto': 'toronto',
  'montreal': 'montreal',
  'vancouver': 'vancouver',
  'new-york': 'new-york',
  'los-angeles': 'los-angeles',
  'miami': 'miami',
  'buenos-aires': 'buenos-aires',
  'santiago': 'santiago',
  'bogota': 'bogota',
  'lima': 'lima',
  'montevideo': 'montevideo',
  'medellin': 'medellin',
  'london': 'london',
  'stockholm': 'stockholm',
  'copenhagen': 'copenhagen',
  'helsinki': 'helsinki',
  'oslo': 'oslo',       // нет в базе
  'reykjavik': 'reykjavik',
  'amsterdam': 'amsterdam',
  'bruges': 'bruges',   // нет в базе
  'lyon': 'lyon',
  'nice': 'nice',
  'seville': 'seville',
  'valencia': 'valencia',
  'alicante': 'alicante',
  'malaga': 'malaga',
  'tenerife': 'tenerife',
  'funchal': 'funchal',
  'florence': 'florence',
  'naples': 'naples',
  'rome': 'rome',
  'bucharest': 'bucharest',
  'tirana': 'tirana',
  'skopje': 'skopje',
  'ohrid': 'ohrid',
  'valletta': 'valletta',
  'varna': 'varna',
  'bratislava': 'bratislava',
  'ljubljana': 'ljubljana',
  'dubai': 'dubai',
  'sharjah': 'sharjah',
  'nairobi': 'nairobi',
  'casablanca': 'casablanca',
  'marrakesh': 'marrakesh',
  'johannesburg': 'johannesburg',
  'cape-town': 'cape-town',
  'hurghada': 'hurghada',
  'sharm-el-sheikh': 'sharm-el-sheikh',
  'sousse': 'sousse',
  'colombo': 'colombo',
  'bangalore': 'bangalore',
  'mumbai': 'mumbai',
  'delhi': 'delhi',
  'chennai': 'chennai',
  'goa': 'goa',
  'kathmandu': 'kathmandu',
  'dushanbe': 'dushanbe',
  'tbilisi': 'tbilisi',
  'mexico-city': 'mexico-city',
  'budapest': 'budapest',
  'warsaw': 'warsaw',
  'izmir': 'izmir',
  // Русские части слагов
  'stambul': 'istanbul',
  'parizh': 'paris',
  'niderlandy-amsterdam': 'amsterdam',
  'rim': 'rome',
  'milan': 'milan',
  'barselona': 'barcelona',
  'vena': 'vienna',
};

// Страны: ключевое слово в slug → country_slug
const COUNTRY_MAP = {
  'gruziya': 'georgia',
  'georgia': 'georgia',
  'armeniya': 'armenia',
  'armenia': 'armenia',
  'serbiya': 'serbia',
  'serbia': 'serbia',
  'turtsiya': 'turkey',
  'turkey': 'turkey',
  'tailand': 'thailand',
  'thailand': 'thailand',
  'ispaniya': 'spain',
  'spain': 'spain',
  'italiya': 'italy',
  'italy': 'italy',
  'frantsiya': 'france',
  'france': 'france',
  'germaniya': 'germany',
  'germany': 'germany',
  'niderlandy': 'netherlands',
  'netherlands': 'netherlands',
  'portugalia': 'portugal',
  'portugal': 'portugal',
  'polska': 'poland',
  'poland': 'poland',
  'chehiya': 'czech-republic',
  'czech': 'czech-republic',
  'avstriya': 'austria',
  'austria': 'austria',
  'shveytsariya': 'switzerland',
  'switzerland': 'switzerland',
  'belgiya': 'belgium',
  'belgium': 'belgium',
  'khorvatiya': 'croatia',
  'croatia': 'croatia',
  'khroatiya': 'croatia',
  'chernogoriya': 'montenegro',
  'montenegro': 'montenegro',
  'slovakiya': 'slovakia',
  'slovakia': 'slovakia',
  'sloveniya': 'slovenia',
  'slovenia': 'slovenia',
  'bolgariya': 'bulgaria',
  'bulgaria': 'bulgaria',
  'gretsiya': 'greece',
  'greece': 'greece',
  'kiplr': 'cyprus',
  'kipr': 'cyprus',
  'cyprus': 'cyprus',
  'izrail': 'israel',
  'israel': 'israel',
  'oa-e': 'uae',
  'uae': 'uae',
  'emirat': 'uae',
  'egipet': 'egypt',
  'egypt': 'egypt',
  'marokko': 'morocco',
  'morocco': 'morocco',
  'kenia': 'kenya',
  'kenya': 'kenya',
  'indiya': 'india',
  'india': 'india',
  'indoneziya': 'indonesia',
  'indonesia': 'indonesia',
  'vietnam': 'vietnam',
  'malaiziya': 'malaysia',
  'malaysia': 'malaysia',
  'filipiny': 'philippines',
  'philippines': 'philippines',
  'koreya': 'south-korea',
  'korea': 'south-korea',
  'yaponia': 'japan',
  'japan': 'japan',
  'tayvan': 'taiwan',
  'taiwan': 'taiwan',
  'kitay': 'china',
  'china': 'china',
  'avstraliya': 'australia',
  'australia': 'australia',
  'kanada': 'canada',
  'canada': 'canada',
  'ssha': 'usa',
  'usa': 'usa',
  'meksika': 'mexico',
  'mexico': 'mexico',
  'kolumbiya': 'colombia',
  'colombia': 'colombia',
  'panama': 'panama',
  'argentina': 'argentina',
  'chili': 'chile',
  'chile': 'chile',
  'peru': 'peru',
  'urugvay': 'uruguay',
  'uruguay': 'uruguay',
  'braziliya': 'brazil',
  'brazil': 'brazil',
  'shvetsiya': 'sweden',
  'sweden': 'sweden',
  'norvegiya': 'norway',
  'norway': 'norway',
  'daniya': 'denmark',
  'denmark': 'denmark',
  'finlyandiya': 'finland',
  'finland': 'finland',
  'islandiya': 'iceland',
  'iceland': 'iceland',
  'irlandiya': 'ireland',
  'ireland': 'ireland',
  'velika-britaniya': 'united-kingdom',
  'united-kingdom': 'united-kingdom',
  'london': 'united-kingdom',
  'rumyniya': 'romania',
  'romania': 'romania',
  'albaniya': 'albania',
  'albania': 'albania',
  'makedonia': 'north-macedonia',
  'moldova': 'moldova',
  'kazahstan': 'kazakhstan',
  'kazakhstan': 'kazakhstan',
  'kirgiziya': 'kyrgyzstan',
  'kyrgyzstan': 'kyrgyzstan',
  'tadzhikistan': 'tajikistan',
  'tajikistan': 'tajikistan',
  'uzbekistan': 'uzbekistan',
  'azerbaydzhan': 'azerbaijan',
  'azerbaijan': 'azerbaijan',
  'singapur': 'singapore',
  'singapore': 'singapore',
  'abkhaziya': 'abkhazia',
  'tunisa': 'tunisia',
  'tunis': 'tunisia',
  'kosta-rika': 'costa-rica',
  'panamu': 'panama',
};

// Загружаем все города
const { data: cities } = await sb.from('cities').select('id,slug,country_slug');
const cityBySlug = {};
cities.forEach(c => cityBySlug[c.slug] = c);

// Загружаем все статьи без city_id
const { data: posts } = await sb
  .from('blog_posts')
  .select('id,slug,city_id,country_slug')
  .eq('published', true)
  .is('city_id', null);

console.log(`Статей без city_id: ${posts.length}`);

let cityLinked = 0, countryLinked = 0, noMatch = 0;

for (const post of posts) {
  const s = post.slug;
  let foundCity = null;
  let foundCountry = post.country_slug || null;

  // 1. Прямое совпадение: city slug в slug статьи
  for (const city of cities) {
    if (s.includes(city.slug)) {
      foundCity = city;
      break;
    }
  }

  // 2. Алиасы
  if (!foundCity) {
    for (const [alias, citySlug] of Object.entries(CITY_ALIASES)) {
      if (s.includes(alias) && cityBySlug[citySlug]) {
        foundCity = cityBySlug[citySlug];
        break;
      }
    }
  }

  // 3. Страна из слага
  if (!foundCountry) {
    for (const [keyword, countrySlug] of Object.entries(COUNTRY_MAP)) {
      if (s.includes(keyword)) {
        foundCountry = countrySlug;
        break;
      }
    }
  }

  // Если нашли город — берём country_slug из города
  if (foundCity && !foundCountry) {
    foundCountry = foundCity.country_slug;
  }

  // Обновляем только если есть что обновить
  if (foundCity || foundCountry) {
    const update = {};
    if (foundCity) update.city_id = foundCity.id;
    if (foundCountry) update.country_slug = foundCountry;

    const { error } = await sb.from('blog_posts').update(update).eq('id', post.id);
    if (!error) {
      if (foundCity) {
        console.log(`[CITY] ${s} → ${foundCity.slug}`);
        cityLinked++;
      } else {
        console.log(`[COUNTRY] ${s} → ${foundCountry}`);
        countryLinked++;
      }
    }
  } else {
    noMatch++;
  }
}

console.log(`\nГотово: ${cityLinked} статей привязано к городу, ${countryLinked} к стране, ${noMatch} без совпадений`);
