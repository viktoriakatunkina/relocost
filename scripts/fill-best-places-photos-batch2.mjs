// Заливает фото для best_places в lib/cities-content.ts для городов, где ВСЕ
// 12 мест без фото (30-31 город из общего списка 102 городов / 705 мест).
// Источник: Unsplash Search API -> Supabase Storage bucket "photos".
// Останавливается при HTTP 403 (rate limit) и сохраняет прогресс инкрементально
// (файл lib/cities-content.ts переписывается после каждого успешного места).
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import { createHash } from "node:crypto";

const H = os.homedir();
const SUPA_URL = fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${H}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const FILE = "/Users/viktoriadimark/Desktop/Работа/Клод/relocost/lib/cities-content.ts";

const CITY_QUERIES = {
  budapest: [
    ["VII район (Erzsébetváros)", "Erzsebetvaros Budapest street"],
    ["Великий рынок (Nagyvásárcsarnok)", "Great Market Hall Budapest"],
    ["Mazel Tov", "Mazel Tov Budapest ruin bar"],
    ["Loffice Coworking", "coworking office Budapest"],
    ["Рыбацкий бастион", "Fisherman's Bastion Budapest"],
    ["Термы Сечени", "Szechenyi Baths Budapest"],
    ["Остров Маргит", "Margaret Island Budapest"],
    ["Цепной мост", "Chain Bridge Budapest"],
    ["Будайская крепость", "Buda Castle Budapest"],
    ["Szimpla Kert", "Szimpla Kert Budapest ruin bar"],
    ["Лангош у рынка", "langos Hungarian street food"],
    ["Дунайская набережная и Парламент", "Danube promenade Parliament Budapest"],
  ],
  kutaisi: [
    ["Храм Баграта", "Bagrati Cathedral Kutaisi"],
    ["Аэропорт Кутаиси", "Kutaisi airport Georgia"],
    ["Pheasant's Tears", "natural wine bar Georgia vineyard"],
    ["Каньон Окаце", "Okatse Canyon Georgia"],
    ["Монастырь Гелати", "Gelati Monastery Georgia"],
    ["Монастырь Моцамета", "Motsameta Monastery Georgia"],
    ["Белый мост через Риони", "White Bridge Kutaisi Rioni river"],
    ["Фонтан Колхети", "Colchis Fountain Kutaisi"],
    ["Зеленый рынок Кутаиси", "Kutaisi market Georgia"],
    ["Набережная реки Риони", "Rioni river embankment Kutaisi"],
    ["Театр им. Ладо Месхишвили", "Lado Meskhishvili Theatre Kutaisi"],
    ["Пещера Прометея", "cave stalactites Georgia"],
  ],
  sofia: [
    ["Витошка", "Vitosha Boulevard Sofia"],
    ["Гора Витоша", "Vitosha Mountain Sofia"],
    ["Betahaus Sofia", "coworking space office Sofia"],
    ["Графа Игнатиева", "Sofia street cafes Bulgaria"],
    ["Собор Александра Невского", "Alexander Nevsky Cathedral Sofia"],
    ["Ротонда Святого Георгия", "St George Rotunda Sofia"],
    ["Женский рынок (Женски пазар)", "street market Sofia Bulgaria"],
    ["Национальный дворец культуры (НДК)", "National Palace of Culture Sofia"],
    ["Боянская церковь", "Boyana Church Sofia"],
    ["Синагога Софии", "synagogue Bulgaria interior"],
    ["Хаджидраганови къщи", "traditional Bulgarian restaurant Sofia"],
    ["Южный парк", "South Park Sofia"],
  ],
  varna: [
    ["Морская градина", "Sea Garden Varna"],
    ["Гръцка махала", "Varna old town street Bulgaria"],
    ["Аладжа", "Aladzha Monastery Varna"],
    ["Workspace Varna", "coworking office Bulgaria"],
    ["Варненский археологический музей", "Varna museum Bulgaria"],
    ["Кафедральный собор Успения Богородицы", "Varna cathedral Bulgaria"],
    ["Аквариум Варна", "Varna Aquarium"],
    ["Златни пясъци", "Golden Sands beach Bulgaria"],
    ["Централна пазарна зала", "market hall Bulgaria"],
    ["Дельфинариум Варна", "dolphinarium Bulgaria"],
    ["Чевермето", "Bulgarian grilled meat restaurant"],
    ["Морская станция", "Sea Station Varna port"],
  ],
  valencia: [
    ["Эль-Кармен", "El Carmen district Valencia street"],
    ["Город искусств и наук", "City of Arts and Sciences Valencia"],
    ["Wayco", "Wayco coworking Valencia"],
    ["Русафа", "Ruzafa Valencia district"],
    ["Меркадо Централь", "Mercado Central Valencia"],
    ["Торрес де Серранос", "Torres de Serranos Valencia"],
    ["Лонха-де-ла-Седа", "Lonja de la Seda Valencia"],
    ["Альбуфера", "Albufera Valencia lake"],
    ["Меркадо де Колон", "Mercado de Colon Valencia"],
    ["Casa Carmela", "Casa Carmela paella Valencia"],
    ["Хардин-дель-Турия", "Jardin del Turia Valencia"],
    ["Кафедральный собор Валенсии", "Valencia Cathedral"],
  ],
  bodrum: [
    ["Замок Святого Петра", "Bodrum Castle St Peter"],
    ["Марина и набережная", "Bodrum marina promenade"],
    ["Гюмбет и Тургутрейс", "Gumbet Turgutreis Bodrum"],
    ["Античный амфитеатр", "Bodrum ancient theatre amphitheatre"],
    ["Рыбный базар (Balık Pazarı)", "Balik Pazari fish market Bodrum"],
    ["Гюмюшлюк", "Gumusluk Bodrum"],
    ["Ветряные мельницы Бодрума", "Bodrum windmills"],
    ["Пляж Бардакчы", "Bardakci beach Bodrum"],
    ["Улица Нейзен Тевфик", "Neyzen Tevfik street Bodrum"],
    ["Halikarnas", "Halikarnas club Bodrum"],
    ["Марина Ялыкавак", "Yalikavak Marina Bodrum"],
    ["Кофейня у крепости", "cafe Bodrum castle"],
  ],
  colombo: [
    ["Галле Фейс Грин", "Galle Face Green Colombo"],
    ["Форт (Colombo Fort)", "Colombo Fort Sri Lanka"],
    ["Пеградаси и Петтах", "Pettah market Colombo"],
    ["Храм Гангарамая", "Gangaramaya Temple Colombo"],
    ["Площадь Независимости", "Independence Square Colombo"],
    ["Датч Хоспитал", "Dutch Hospital Colombo"],
    ["Национальный музей Коломбо", "Colombo National Museum"],
    ["Хопперсы на завтрак", "Sri Lanka hoppers breakfast"],
    ["Дегустация цейлонского чая", "Ceylon tea tasting Sri Lanka"],
    ["Коттху роти у Галле Фейс", "kottu roti street food Sri Lanka"],
    ["Пляж Маунт-Лавиния", "Mount Lavinia beach Colombo"],
    ["Красная мечеть (Jami-Ul-Alfar)", "Red Mosque Jami Ul Alfar Colombo"],
  ],
  cebu: [
    ["Ай-ти Парк (IT Park)", "Cebu IT Park"],
    ["Храм Лотоса (Taoist Temple)", "Cebu Taoist Temple"],
    ["Остров Мактан", "Mactan Island Cebu"],
    ["Магелланов крест", "Magellan's Cross Cebu"],
    ["Форт Сан-Педро", "Fort San Pedro Cebu"],
    ["Улица Колон", "Colon Street Cebu"],
    ["Рынок Карбон", "Carbon Market Cebu"],
    ["Базилика Санто-Ниньо", "Basilica Minore del Santo Nino Cebu"],
    ["Ларсиан BBQ", "Larsian BBQ Cebu"],
    ["Смотровая Топс", "Tops Lookout Cebu"],
    ["Себуанский лечон", "Cebu lechon roast pig"],
    ["Кофейня в IT Park", "cafe Cebu IT Park"],
  ],
  hurghada: [
    ["Эль-Гуна", "El Gouna Egypt"],
    ["Марина и набережная", "Hurghada marina"],
    ["Старый город (Эд-Дахар)", "El Dahar old town Hurghada"],
    ["Гифтун (острова)", "Giftun Island Hurghada"],
    ["Сахль-Хашиш", "Sahl Hasheesh Egypt"],
    ["Макади-Бей", "Makadi Bay Egypt"],
    ["Дайв-сайт Абу-Рамада", "Abu Ramada dive site Red Sea"],
    ["Мечеть Эль-Мина", "El Mina Mosque Hurghada"],
    ["Дельфиний риф Шаб-эль-Эрг", "Shaab El Erg dolphin reef Hurghada"],
    ["Пустынное сафари на джипах", "desert safari jeep Hurghada"],
    ["Рынок и набережная Сакала", "Sakkala Hurghada promenade"],
    ["Рыбные рестораны корниша", "seafood restaurant Hurghada corniche"],
  ],
  cairo: [
    ["Пирамиды Гизы", "Pyramids of Giza"],
    ["Замалек", "Zamalek Cairo"],
    ["Хан-эль-Халили", "Khan el-Khalili bazaar Cairo"],
    ["Старый (коптский) Каир", "Coptic Cairo old town"],
    ["Египетский музей на Тахрир", "Egyptian Museum Tahrir Cairo"],
    ["Кафе Эль-Фишави", "El Fishawy cafe Cairo"],
    ["Кошари у Abou Tarek", "Abou Tarek koshary Cairo"],
    ["Мечеть Аль-Хусейн", "Al-Hussein Mosque Cairo"],
    ["Мечеть Аль-Азхар", "Al-Azhar Mosque Cairo"],
    ["Набережная Корниш", "Cairo Corniche Nile"],
    ["Прогулка на фелуке", "felucca boat Nile Cairo"],
    ["Каирская телебашня", "Cairo Tower"],
  ],
  bogota: [
    ["Площадь Боливара", "Plaza Bolivar Bogota"],
    ["Ла Канделария", "La Candelaria Bogota"],
    ["Музей Ботеро", "Museo Botero Bogota"],
    ["Чорро-де-Кеведо", "Chorro de Quevedo Bogota"],
    ["Гора Монсеррат", "Monserrate Bogota"],
    ["Рынок Палокемао", "Paloquemao market Bogota"],
    ["La Puerta Falsa", "La Puerta Falsa Bogota restaurant"],
    ["Усакен", "Usaquen Bogota"],
    ["Зона Т", "Zona T Bogota"],
    ["Зона G (гастрономическая)", "Zona G Bogota restaurants"],
    ["Кофейня в Чапинеро", "cafe Chapinero Bogota"],
    ["Парк 93", "Parque 93 Bogota"],
  ],
  brussels: [
    ["Гран-Плас", "Grand Place Brussels"],
    ["Писающий мальчик", "Manneken Pis Brussels"],
    ["Маршрут комиксов (BD Parcours)", "Comic Strip Route Brussels mural"],
    ["Сабон", "Sablon Brussels"],
    ["Мароль", "Marolles Brussels"],
    ["Парк Пятидесятилетия", "Parc du Cinquantenaire Brussels"],
    ["Delirium Café", "Delirium Cafe Brussels"],
    ["Сент-Катрин", "Sainte-Catherine Brussels"],
    ["Королевские галереи Святого Юбера", "Galeries Royales Saint-Hubert Brussels"],
    ["Атомиум", "Atomium Brussels"],
    ["Шоколатерия в Сабоне", "chocolate shop Sablon Brussels"],
    ["Фритери у Гран-Плас", "frites fry shop Brussels"],
  ],
  bucharest: [
    ["Дворец Парламента", "Palace of Parliament Bucharest"],
    ["Липскань (Старый город)", "Lipscani old town Bucharest"],
    ["Cărturești Carusel", "Carturesti Carusel bookstore Bucharest"],
    ["Сады Чишмиджиу", "Cismigiu Gardens Bucharest"],
    ["Парк Херэстрэу", "Herastrau Park Bucharest"],
    ["Caru' cu Bere", "Caru cu Bere restaurant Bucharest"],
    ["Музей румынского крестьянина под открытым небом", "Village Museum Bucharest open air"],
    ["Румынский Атенеум", "Romanian Athenaeum Bucharest"],
    ["Церковь Ставрополеос", "Stavropoleos Church Bucharest"],
    ["Винный бар в Старом городе", "wine bar old town Bucharest"],
    ["Кофейня в Липскань", "cafe Lipscani Bucharest"],
    ["Революционная площадь", "Revolution Square Bucharest"],
  ],
  "cape-town": [
    ["Компани-Гарденс", "Company's Garden Cape Town"],
    ["Бо-Каап", "Bo-Kaap Cape Town"],
    ["Гринмаркет-сквер", "Greenmarket Square Cape Town"],
    ["Ви-энд-Эй Ватерфронт", "V&A Waterfront Cape Town"],
    ["Столовая гора", "Table Mountain Cape Town"],
    ["Сигнал-Хилл", "Signal Hill Cape Town"],
    ["Groot Constantia", "Groot Constantia wine estate"],
    ["Кэмпс-Бей", "Camps Bay Cape Town"],
    ["The Neighbourgoods Market", "Neighbourgoods Market Cape Town"],
    ["Лонг-стрит", "Long Street Cape Town"],
    ["Пингвины на пляже Боулдерс", "Boulders Beach penguins Cape Town"],
    ["Кирстенбос", "Kirstenbosch Botanical Garden Cape Town"],
  ],
  casablanca: [
    ["Мечеть Хасана II", "Hassan II Mosque Casablanca"],
    ["Старая медина", "old medina Casablanca"],
    ["Площадь Мохаммеда V", "Mohammed V Square Casablanca"],
    ["Квартал Хабус", "Habous district Casablanca"],
    ["Корниш Аин-Диаб", "Ain Diab Corniche Casablanca"],
    ["Центральный рынок (Marché Central)", "Central Market Casablanca"],
    ["Rick's Café", "Rick's Cafe Casablanca"],
    ["Кафе в старой медине", "cafe old medina Casablanca"],
    ["Патисри в Хабусе", "patisserie Habous Casablanca"],
    ["Морская набережная Айн-Диаб", "Casablanca corniche sunset beach"],
    ["Собор Sacré-Cœur", "Sacre-Coeur Cathedral Casablanca"],
    ["Мавзолей Мохаммеда V (Рабат, дневной выезд)", "Mausoleum of Mohammed V Rabat"],
  ],
  chennai: [
    ["Пляж Марина", "Marina Beach Chennai"],
    ["Храм Капалишварар", "Kapaleeshwarar Temple Chennai"],
    ["Форт Сент-Джордж", "Fort St George Chennai"],
    ["Базилика Сан-Томе", "San Thome Basilica Chennai"],
    ["Пляж Бесант-Нагар", "Besant Nagar Beach Chennai"],
    ["Saravana Bhavan", "Saravana Bhavan restaurant Chennai"],
    ["Соукарпет", "Sowcarpet Chennai market"],
    ["Ти-Нагар", "T Nagar Chennai"],
    ["Кофейня фильтр-кофе", "South Indian filter coffee cafe"],
    ["Дворец Ченнакесава (Каннагипарк)", "Kannagi Park Chennai"],
    ["Государственный музей Ченнаи", "Government Museum Chennai"],
    ["IT-корридор OMR", "OMR IT corridor Chennai"],
  ],
  cologne: [
    ["Кёльнский собор", "Cologne Cathedral"],
    ["Мост Гогенцоллернов", "Hohenzollern Bridge Cologne"],
    ["Старый город (Altstadt)", "Cologne Altstadt old town"],
    ["Набережная Рейна", "Rhine riverside Cologne"],
    ["Бельгийский квартал", "Belgian Quarter Cologne"],
    ["Früh am Dom", "Fruh am Dom brewery Cologne"],
    ["Музей шоколада Lindt", "Chocolate Museum Cologne"],
    ["Карривурст на улице", "currywurst street food Germany"],
    ["Музей Людвига", "Museum Ludwig Cologne"],
    ["Рынок на Wilhelmplatz (Эренфельд)", "Wilhelmplatz market Ehrenfeld Cologne"],
    ["Ботанический сад Флора", "Flora botanical garden Cologne"],
    ["Шоколадный музей и пивные сады Старого города", "beer garden old town Cologne"],
  ],
  copenhagen: [
    ["Нюхавн", "Nyhavn Copenhagen"],
    ["Русалочка", "Little Mermaid Copenhagen"],
    ["Королевский сад (Kongens Have)", "Kongens Have Copenhagen"],
    ["Стрёгет", "Stroget Copenhagen"],
    ["Кристиания", "Freetown Christiania Copenhagen"],
    ["Torvehallerne", "Torvehallerne market Copenhagen"],
    ["Смёрребрёд-ресторан", "smorrebrod restaurant Copenhagen"],
    ["Reffen", "Reffen street food Copenhagen"],
    ["Кристиансхавн", "Christianshavn Copenhagen canal"],
    ["Тиволи", "Tivoli Gardens Copenhagen"],
    ["Датская пекарня с канельснегле", "Danish bakery pastry Copenhagen"],
    ["Ратушная площадь", "Copenhagen City Hall Square"],
  ],
  "herceg-novi": [
    ["Старый город Херцег-Нови", "Herceg Novi old town"],
    ["Крепость Каньели (Kanli Kula)", "Kanli Kula fortress Herceg Novi"],
    ["Форте Маре", "Forte Mare Herceg Novi"],
    ["Ботанический сад", "Herceg Novi botanical garden"],
    ["Игало", "Igalo Montenegro"],
    ["Шеталиште Пет Даница", "Herceg Novi promenade Montenegro"],
    ["Рынок Херцег-Нови", "Herceg Novi market"],
    ["Топла", "Topla Herceg Novi"],
    ["Мельины", "Meljine Montenegro"],
    ["Пляжи Ньивице", "beach Herceg Novi Montenegro"],
    ["Konoba Feral", "Konoba Feral restaurant Montenegro"],
    ["Кафе на набережной Шеталиште", "cafe promenade Herceg Novi"],
  ],
  "los-angeles": [
    ["Пирс Санта-Моники", "Santa Monica Pier"],
    ["Набережная Венис-Бич", "Venice Beach boardwalk"],
    ["Обсерватория Гриффита", "Griffith Observatory"],
    ["Аллея славы Голливуда", "Hollywood Walk of Fame"],
    ["The Getty Center", "Getty Center Los Angeles"],
    ["Grand Central Market", "Grand Central Market Los Angeles"],
    ["Водохранилище Силвер-Лейк", "Silver Lake Reservoir"],
    ["Abbot Kinney Boulevard", "Abbot Kinney Boulevard Venice"],
    ["Runyon Canyon Park", "Runyon Canyon Park Los Angeles"],
    ["LACMA", "LACMA Los Angeles museum"],
    ["Родео-драйв", "Rodeo Drive Beverly Hills"],
    ["Коворкинг в Санта-Монике/Калвер-Сити", "coworking office Santa Monica"],
  ],
  lyon: [
    ["Вьё-Лион (Старый город)", "Vieux Lyon old town"],
    ["Базилика Нотр-Дам-де-Фурвьер", "Basilique Notre-Dame de Fourviere Lyon"],
    ["Площадь Белькур", "Place Bellecour Lyon"],
    ["Les Halles de Lyon Paul Bocuse", "Les Halles de Lyon Paul Bocuse market"],
    ["Парк Тет-д'Ор", "Parc de la Tete d'Or Lyon"],
    ["Рынок Круа-Русс", "Croix-Rousse market Lyon"],
    ["Musée des Confluences", "Musee des Confluences Lyon"],
    ["Римский амфитеатр Фурвьер", "Fourviere Roman amphitheatre Lyon"],
    ["Круа-Русс", "Croix-Rousse Lyon district"],
    ["Café des Fédérations", "bouchon lyonnais restaurant Lyon"],
    ["Конфлюанс", "Confluence Lyon district"],
    ["Коворкинг в Пар-Дьё", "coworking office Part-Dieu Lyon"],
  ],
  medan: [
    ["Истана Маймун (Дворец Маймун)", "Maimun Palace Medan"],
    ["Мечеть Аль-Машун (Masjid Raya)", "Masjid Raya Al Mashun Medan"],
    ["Особняк Тьонг А Фи", "Tjong A Fie Mansion Medan"],
    ["Кесаван", "Kesawan Medan old town"],
    ["Merdeka Walk", "Merdeka Walk Medan"],
    ["Pusat Pasar (Центральный рынок)", "Pusat Pasar Medan market"],
    ["Sun Plaza", "Sun Plaza Medan mall"],
    ["Озеро Тоба", "Lake Toba Sumatra"],
    ["Maha Vihara Maitreya", "Maha Vihara Maitreya Medan"],
    ["Храм Шри Мариамман", "Sri Mariamman Temple Medan"],
    ["Варунги в районе Медан-Бару", "Medan Baru street food warung"],
    ["Парк у дворца Маймун", "Maimun Palace garden Medan"],
  ],
  nairobi: [
    ["Национальный парк Найроби", "Nairobi National Park"],
    ["Центр жирафов (Giraffe Centre)", "Giraffe Centre Nairobi"],
    ["Приют слонов Дэвида Шелдрика", "David Sheldrick Wildlife Trust elephant"],
    ["Музей Карен Бликсен", "Karen Blixen Museum Nairobi"],
    ["Вестлендс", "Westlands Nairobi"],
    ["Рынок масаи (Maasai Market)", "Maasai Market Nairobi"],
    ["Килимани", "Kilimani Nairobi"],
    ["iHub", "iHub Nairobi coworking"],
    ["Национальный музей Кении", "Nairobi National Museum"],
    ["Парк Ухуру", "Uhuru Park Nairobi"],
    ["Village Market", "Village Market Nairobi mall"],
    ["Лес Карура", "Karura Forest Nairobi"],
  ],
  naples: [
    ["Чентро-Сторико (Спакканаполи)", "Spaccanapoli Naples old town"],
    ["Кафедральный собор Неаполя (Дуомо)", "Naples Cathedral Duomo"],
    ["Капелла Сансеверо", "Cappella Sansevero Naples"],
    ["Замок Яйца (Castel dell'Ovo)", "Castel dell'Ovo Naples"],
    ["Лунгомаре (набережная Неаполя)", "Lungomare Naples promenade"],
    ["Вомеро и замок Сант-Эльмо", "Castel Sant'Elmo Vomero Naples"],
    ["Чертоза ди Сан-Мартино", "Certosa di San Martino Naples"],
    ["Помпеи", "Pompeii ruins"],
    ["Кьяйя", "Chiaia Naples district"],
    ["Antica Pizzeria da Michele", "Antica Pizzeria da Michele Naples"],
    ["Рынок Порта-Нолана", "Porta Nolana market Naples"],
    ["Галерея Умберто I", "Galleria Umberto I Naples"],
  ],
  "new-york": [
    ["Центральный парк", "Central Park New York"],
    ["Таймс-сквер", "Times Square New York"],
    ["Статуя Свободы", "Statue of Liberty"],
    ["Бруклинский мост", "Brooklyn Bridge"],
    ["Эмпайр-стейт-билдинг", "Empire State Building"],
    ["Метрополитен-музей (The Met)", "Metropolitan Museum of Art New York"],
    ["Хай-Лайн (High Line)", "High Line New York"],
    ["Уильямсбург", "Williamsburg Brooklyn"],
    ["Челси-маркет", "Chelsea Market New York"],
    ["Сохо", "SoHo New York"],
    ["Гринвич-Виллидж", "Greenwich Village New York"],
    ["Коворкинг в Манхэттене (WeWork)", "coworking office Manhattan New York"],
  ],
  rome: [
    ["Колизей", "Colosseum Rome"],
    ["Римский форум и Палатинский холм", "Roman Forum Palatine Hill"],
    ["Пантеон", "Pantheon Rome"],
    ["Ватикан", "Vatican St Peter's Basilica"],
    ["Фонтан Треви", "Trevi Fountain Rome"],
    ["Трастевере", "Trastevere Rome"],
    ["Монти", "Monti Rome district"],
    ["Кампо-де-Фьори", "Campo de' Fiori Rome"],
    ["Вилла Боргезе", "Villa Borghese Rome"],
    ["Тестаччо", "Testaccio Rome district"],
    ["Caffè Sant'Eustachio", "Caffe Sant'Eustachio Rome"],
    ["Talent Garden Roma", "Talent Garden Roma coworking"],
  ],
  santiago: [
    ["Серро-Сан-Кристобаль и Парк Метрополитано", "Cerro San Cristobal Santiago"],
    ["Пласа-де-Армас", "Plaza de Armas Santiago"],
    ["Ла-Часкона", "La Chascona Pablo Neruda house"],
    ["Бельявиста", "Bellavista Santiago district"],
    ["Ластарья и Музей изящных искусств", "Lastarria Santiago Museum of Fine Arts"],
    ["Меркадо Сентраль", "Mercado Central Santiago"],
    ["Ла-Вега Сентраль", "La Vega Central market Santiago"],
    ["Провиденсия и Лас-Кондес («Санхэттен»)", "Providencia Las Condes Santiago skyline"],
    ["Винные долины Майпо и Касабланка", "Maipo Valley vineyard Chile"],
    ["Горнолыжные курорты Вальє-Невадо и Фарельонес", "Valle Nevado ski resort Chile"],
    ["Парк Бисентенарио", "Parque Bicentenario Santiago"],
    ["Коворкинг в Провиденсии", "coworking office Providencia Santiago"],
  ],
  seminyak: [
    ["Пляж Семиньяк", "Seminyak Beach Bali"],
    ["Пляж Петитенгет", "Petitenget Beach Bali"],
    ["Пура Петитенгет", "Pura Petitenget temple Bali"],
    ["Джалан Кайю Айя (улица Оберой)", "Jalan Kayu Aya Oberoi street Seminyak"],
    ["Potato Head Beach Club", "Potato Head Beach Club Bali"],
    ["Ku De Ta", "Ku De Ta Bali beach club"],
    ["Double Six Beach", "Double Six Beach Seminyak"],
    ["La Favela", "La Favela Seminyak Bali"],
    ["Sisterfields", "Sisterfields cafe Bali"],
    ["Bali Deli", "Bali Deli Seminyak"],
    ["Seminyak Village", "Seminyak Village mall Bali"],
    ["Кероболан", "Kerobokan Bali"],
  ],
  tulum: [
    ["Руины Тулума", "Tulum ruins Mayan"],
    ["Гран Сеноте", "Gran Cenote Tulum"],
    ["Сенот Дос-Охос", "Dos Ojos Cenote Tulum"],
    ["Биосферный заповедник Сиан-Каан", "Sian Ka'an biosphere reserve"],
    ["Плайя-Парайсо (Зона Отелера)", "Playa Paraiso Tulum beach"],
    ["Альдеа Зама", "Aldea Zama Tulum"],
    ["Ла-Велета", "La Veleta Tulum"],
    ["Эль-Сентро (Tulum Pueblo)", "Tulum Pueblo town center"],
    ["Mercado 23", "Mercado 23 Tulum"],
    ["Selina Tulum", "Selina Tulum coworking hostel"],
    ["Matcha Mama", "Matcha Mama Tulum cafe"],
    ["Hartwood", "Hartwood restaurant Tulum"],
  ],
  ubud: [
    ["Рисовые террасы Тегаллаланг", "Tegallalang Rice Terrace Bali"],
    ["Дворец Убуда (Пури Сарен)", "Ubud Palace Puri Saren"],
    ["Священный лес обезьян", "Sacred Monkey Forest Ubud"],
    ["Кампуан Ридж Уок", "Campuhan Ridge Walk Ubud"],
    ["Рынок Убуда", "Ubud Market Bali"],
    ["Тирта Эмпул", "Tirta Empul temple Bali"],
    ["Музей Пури Лукисан", "Museum Puri Lukisan Ubud"],
    ["The Yoga Barn", "Yoga Barn Ubud"],
    ["Casa Luna", "Casa Luna restaurant Ubud"],
    ["Alchemy", "Alchemy raw vegan cafe Ubud"],
    ["Hubud", "Hubud coworking Ubud"],
    ["Пенестанан", "Penestanan Ubud"],
  ],
  valletta: [
    ["Ко-кафедральный собор Святого Иоанна", "St John's Co-Cathedral Valletta"],
    ["Сады Верхняя Барракка", "Upper Barrakka Gardens Valletta"],
    ["Дворец Великих Магистров", "Grandmaster's Palace Valletta"],
    ["Репаблик-стрит", "Republic Street Valletta"],
    ["Форт Сент-Эльмо", "Fort St Elmo Valletta"],
    ["Три города", "Three Cities Malta"],
    ["Слима", "Sliema Malta"],
    ["Сент-Джулианс / Пачевилль", "St Julian's Paceville Malta"],
    ["Is-Suq tal-Belt", "Is-Suq tal-Belt Valletta market"],
    ["Caffè Cordina", "Caffe Cordina Valletta"],
    ["SmartCity Malta", "SmartCity Malta"],
    ["Nenu the Baker", "Nenu the Baker Valletta"],
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPhoto(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (res.status === 403) {
    const body = await res.text();
    if (/Rate Limit Exceeded/i.test(body)) throw new Error("RATE_LIMIT");
    throw new Error(`Unsplash 403: ${body}`);
  }
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) return null;
  return { rawUrl: p.urls.raw, authorName: p.user.name, id: p.id };
}

async function uploadToStorage(key, rawUrl) {
  const imgRes = await fetch(rawUrl + "&w=1200&q=80&fm=jpg");
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const hash = createHash("md5").update(key).digest("hex").slice(0, 16);
  const storagePath = `u/${hash}.jpg`;
  const { error } = await sb.storage.from("photos").upload(storagePath, buf, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) throw error;
  return `${SUPA_URL}/storage/v1/object/public/photos/${storagePath}`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setImageUrlInFile(slug, placeName, url) {
  let text = fs.readFileSync(FILE, "utf8");
  let cityIdx = text.indexOf(`\n  ${slug}: {`);
  if (cityIdx === -1) cityIdx = text.indexOf(`\n  "${slug}": {`);
  if (cityIdx === -1) throw new Error(`city marker not found: ${slug}`);
  const bpMarker = "\n    best_places: [";
  const bpIdx = text.indexOf(bpMarker, cityIdx);
  if (bpIdx === -1) throw new Error(`best_places not found: ${slug}`);
  const closeIdx = text.indexOf("\n    ],", bpIdx);
  if (closeIdx === -1) throw new Error(`best_places close not found: ${slug}`);

  const before = text.slice(0, bpIdx);
  const block = text.slice(bpIdx, closeIdx);
  const after = text.slice(closeIdx);

  const nameEsc = escapeRegex(placeName);
  const re = new RegExp(`(\\{ name: "${nameEsc}", type: "[a-z]+", description: "(?:[^"\\\\]|\\\\.)*")( \\},)`);
  if (!re.test(block)) {
    throw new Error(`line not found for place "${placeName}" in ${slug}`);
  }
  const newBlock = block.replace(re, `$1, image_url: "${url}"$2`);

  fs.writeFileSync(FILE, before + newBlock + after, "utf8");
}

function alreadyHasImage(slug, placeName) {
  const text = fs.readFileSync(FILE, "utf8");
  let cityIdx = text.indexOf(`\n  ${slug}: {`);
  if (cityIdx === -1) cityIdx = text.indexOf(`\n  "${slug}": {`);
  if (cityIdx === -1) return false;
  const bpIdx = text.indexOf("\n    best_places: [", cityIdx);
  if (bpIdx === -1) return false;
  const closeIdx = text.indexOf("\n    ],", bpIdx);
  if (closeIdx === -1) return false;
  const block = text.slice(bpIdx, closeIdx);
  const nameEsc = escapeRegex(placeName);
  const re = new RegExp(`\\{ name: "${nameEsc}", type: "[a-z]+", description: "(?:[^"\\\\]|\\\\.)*", image_url:`);
  return re.test(block);
}

async function run() {
  let ok = 0;
  let failed = 0;
  const failedItems = [];
  const doneItems = [];
  let citiesFullyDone = [];

  outer:
  for (const [slug, places] of Object.entries(CITY_QUERIES)) {
    let cityFail = 0;
    for (const [name, query] of places) {
      if (alreadyHasImage(slug, name)) {
        continue;
      }
      try {
        const photo = await fetchPhoto(query);
        if (!photo) {
          console.log(`~ ${slug} / ${name}: нет результата для "${query}"`);
          failed++;
          cityFail++;
          failedItems.push({ slug, name, query, reason: "no_result" });
          continue;
        }
        const url = await uploadToStorage(`${slug}::${name}`, photo.rawUrl);
        setImageUrlInFile(slug, name, url);
        console.log(`✓ ${slug} / ${name} -> "${query}" (${photo.authorName})`);
        doneItems.push({ slug, name, query, url });
        ok++;
        await sleep(300);
      } catch (e) {
        if (e.message === "RATE_LIMIT") {
          console.error(`\n✗ RATE LIMIT достигнут на ${slug} / ${name}. Останавливаюсь.`);
          failedItems.push({ slug, name, query, reason: "rate_limit_stop" });
          break outer;
        }
        console.error(`✗ ${slug} / ${name}: ${e.message}`);
        failed++;
        cityFail++;
        failedItems.push({ slug, name, query, reason: e.message });
      }
    }
    if (cityFail === 0 && !failedItems.some((f) => f.slug === slug && f.reason === "rate_limit_stop")) {
      citiesFullyDone.push(slug);
    }
  }

  console.log(`\nГотово (до лимита или до конца списка). ok=${ok} failed=${failed}`);
  console.log("Полностью закрытые города в этом прогоне:", citiesFullyDone.join(", ") || "(нет)");
  fs.writeFileSync(
    "/private/tmp/claude-501/-Users-viktoriadimark/7cc9059d-467f-41f1-b2ea-ed28c09919f9/scratchpad/batch2-results.json",
    JSON.stringify({ ok, failed, doneItems, failedItems, citiesFullyDone }, null, 2)
  );
}

run().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
