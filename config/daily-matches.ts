// src/config/daily-matches.ts

/**
 * MASTER MAPPING
 * Left Side (Key): The slug/ID from the browser URL (StreamD or ReedStream style)
 * Right Side (Value): The numeric ID your Rust Backend expects for ppvsu
 */
export const DAILY_MATCH_MAP: Record<string, string> = {
    // --- LALIGA ---
    "espanyol-vs-alaves-1391032": "16491",
    "espanyol-vs-deportivo-alav-s-2279607": "16491",
    "real-oviedo-vs-girona-2279613": "16496",
    "osasuna-vs-villarreal-2279611": "16501",
    "levante-vs-atl-tico-madrid-2279609": "16502",
    "elche-vs-barcelona-2279606": "16503",
    "real-madrid-vs-rayo-vallecano-football-1391037": "16504",
    "real-betis-vs-valencia-football-1391030": "16505",
    "athletic-club-vs-real-sociedad": "16507",
    "mallorca-vs-sevilla": "16508",

    // --- BUNDESLIGA ---
    "1-fc-koln-vs-vfl-wolfsburg-1388482": "16511",
    "eintracht-frankfurt-vs-bayer-leverkusen-2276811": "16512",
    "fc-augsburg-vs-st-pauli-2276809": "16513",
    "rb-leipzig-vs-mainz-2276815": "16514",
    "hoffenheim-vs-union-berlin-2276814": "16515",
    "werder-bremen-vs-borussia-m-nchengladbach-2276817": "16516",
    "hamburg-vs-bayern-munich-2276813": "16517",
    "vf-b-stuttgart-vs-sc-freiburg": "16518",
    "borussia-dortmund-vs-1-fc-heidenheim-1846": "16519",

    // --- PREMIER LEAGUE ---
    "brighton-and-hove-albion-vs-everton-2267304": "16520",
    "leeds-united-vs-arsenal-2267306": "16521",
    "wolverhampton-wanderers-vs-bournemouth-2267312": "16523", // Corrected Mapping
    "chelsea-vs-west-ham-united-2267305": "16523",
    "liverpool-vs-newcastle-united-2267307": "16524",
    "aston-villa-vs-brentford": "16525",
    "manchester-united-vs-fulham": "16526",
    "nottingham-forest-vs-crystal-palace": "16527",
    "tottenham-hotspur-vs-manchester-city": "16528",
    "sunderland-vs-burnley": "16529",

    // --- SERIE A ---
    "lazio-vs-genoa-2265260": "16530",
    "pisa-vs-sassuolo-2265263": "16531",
    "napoli-vs-fiorentina-2265261": "16532",
    "torino-vs-lecce": "16534",
    "como-vs-atalanta": "16535",
    "cremonese-vs-inter-milan": "16536",
    "parma-vs-juventus": "16537",
    "udinese-vs-as-roma": "16538",

    // --- LIGUE 1 ---
    "lens-vs-le-havre-2278281": "16539",
    "paris-fc-vs-marseille-2278286": "16540",
    "lorient-vs-nantes-2278282": "16541",
    "monaco-vs-rennes-2278284": "16542",
    "lyon-vs-lille": "16543",
    "angers-vs-metz": "16544",
    "nice-vs-brest": "16545",
    "toulouse-vs-aj-auxerre": "16546",
    "strasbourg-vs-paris-saint-germain": "16547",

    // --- BASKETBALL (NBA) ---
    "washington-wizards-vs-los-angeles-lakers-2358051": "16648",
    "orlando-magic-vs-toronto-raptors-2358050": "16650",
    "boston-celtics-vs-sacramento-kings-2358053": "16652",
    "new-york-knicks-vs-portland-trail-blazers-2358052": "16653",
    "new-orleans-pelicans-vs-memphis-grizzlies-2358054": "16654",
    "phoenix-suns-vs-cleveland-cavaliers-2358056": "16655",
    "denver-nuggets-vs-los-angeles-clippers-2358058": "16656",
    "utah-jazz-vs-brooklyn-nets-2358057": "16657",
    "golden-state-warriors-vs-detroit-pistons-2358059": "16658",

    // --- HOCKEY (NHL) ---
    "chicago-blackhawks-vs-columbus-blue-jackets-2347740": "16647",
    "philadelphia-flyers-vs-los-angeles-kings-2347741": "16647", // Grouped in JSON

    // --- COMBAT & SPECIAL ---
    "ufc-325-volkanovski-vs-lopes-2-2389037": "16484",
    "royal-rumble-2409413": "16378",
    "wwe-friday-night-smackdown-wwe-009": "16552",
    "aew-saturday-night-collision": "16553",
    "ye-mexico-city-day-1": "16464",
    "ye-mexico-city-day-2": "16465",
    "puppy-bowl-xxii": "16121",

    // --- MOTORSPORTS ---
    "pre-season-testing-day-1": "16395",
    "pre-season-testing-day-2": "16396",
    "pre-season-testing-day-3": "16397",
    "supercross-houston": "15856"
};