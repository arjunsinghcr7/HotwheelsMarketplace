// Initial seed data. Bundled into the serverless function as the source of
// truth on read-only filesystems (e.g. Vercel) and used as the fallback when
// no writable DB file exists yet. Kept as a plain TS module (not a JSON import)
// so it bundles reliably across tsx (local) and esbuild (Vercel).
import type { Database } from './app.js';

const seed: Database = {
  "collectibles": [
    {
      "id": "1",
      "name": "Nissan Skyline GT-R R34",
      "brand": "Nissan",
      "vehicleType": "JDM",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1999,
      "price": 29.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW J-Imports",
      "image": "/cars/01-nissan-skyline-gtr-r34.jpg",
      "notes": "Nissan Skyline GT-R R34 in Bayside Blue. JDM collectible, 1:64 premium die-cast.",
      "demandScore": 86
    },
    {
      "id": "2",
      "name": "Toyota Supra MK4",
      "brand": "Toyota",
      "vehicleType": "JDM",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1998,
      "price": 27.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW J-Imports",
      "image": "/cars/02-toyota-supra-mk4.jpg",
      "notes": "Toyota Supra MK4 in Orange. JDM collectible, 1:64 premium die-cast.",
      "demandScore": 84
    },
    {
      "id": "3",
      "name": "Mazda RX-7 FD",
      "brand": "Mazda",
      "vehicleType": "JDM",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1997,
      "price": 24.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW J-Imports",
      "image": "/cars/03-mazda-rx7-fd.jpg",
      "notes": "Mazda RX-7 FD in Yellow. JDM collectible, 1:64 premium die-cast.",
      "demandScore": 83
    },
    {
      "id": "4",
      "name": "Honda NSX",
      "brand": "Honda",
      "vehicleType": "JDM",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1992,
      "price": 26.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW J-Imports",
      "image": "/cars/04-honda-nsx.jpg",
      "notes": "Honda NSX in Red. JDM collectible, 1:64 premium die-cast.",
      "demandScore": 84
    },
    {
      "id": "5",
      "name": "Nissan Silvia S15",
      "brand": "Nissan",
      "vehicleType": "JDM",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2002,
      "price": 22.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW J-Imports",
      "image": "/cars/05-nissan-silvia-s15.jpg",
      "notes": "Nissan Silvia S15 in Pearl White. JDM collectible, 1:64 premium die-cast.",
      "demandScore": 81
    },
    {
      "id": "6",
      "name": "Porsche 911 GT3 RS",
      "brand": "Porsche",
      "vehicleType": "Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 149.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Exotics",
      "image": "/cars/06-porsche-911-gt3-rs.jpg",
      "notes": "Track-bred flat-six icon in GT Silver with the signature swan-neck rear wing. Premium Spectraflame finish, Real Rider tires. Serial #001/250.",
      "demandScore": 89,
      "isFeatured": true
    },
    {
      "id": "7",
      "name": "Ferrari F40",
      "brand": "Ferrari",
      "vehicleType": "Classic Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1987,
      "price": 199.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Exotics",
      "image": "/cars/07-ferrari-f40.jpg",
      "notes": "Ferrari F40 in Red. Classic Supercar collectible, 1:64 premium die-cast.",
      "demandScore": 93
    },
    {
      "id": "8",
      "name": "Lamborghini Aventador SVJ",
      "brand": "Lamborghini",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2021,
      "price": 129.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Hypercars",
      "image": "/cars/08-lamborghini-aventador-svj.jpg",
      "notes": "Lamborghini Aventador SVJ in Verde Mantis. Hypercar collectible, 1:64 premium die-cast.",
      "demandScore": 96
    },
    {
      "id": "9",
      "name": "McLaren P1",
      "brand": "McLaren",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2015,
      "price": 119.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Hypercars",
      "image": "/cars/09-mclaren-p1.jpg",
      "notes": "McLaren P1 in Volcano Orange. Hypercar collectible, 1:64 premium die-cast.",
      "demandScore": 96
    },
    {
      "id": "10",
      "name": "Bugatti Chiron",
      "brand": "Bugatti",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2022,
      "price": 229.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Hypercars",
      "image": "/cars/10-bugatti-chiron.jpg",
      "notes": "Bugatti Chiron in Blue. Hypercar collectible, 1:64 premium die-cast.",
      "demandScore": 99
    },
    {
      "id": "11",
      "name": "Koenigsegg Jesko",
      "brand": "Koenigsegg",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 219.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Hypercars",
      "image": "/cars/11-koenigsegg-jesko.jpg",
      "notes": "Koenigsegg Jesko in White. Hypercar collectible, 1:64 premium die-cast.",
      "demandScore": 99
    },
    {
      "id": "12",
      "name": "Pagani Huayra",
      "brand": "Pagani",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2018,
      "price": 139.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Hypercars",
      "image": "/cars/12-pagani-huayra.jpg",
      "notes": "Pagani Huayra in Silver. Hypercar collectible, 1:64 premium die-cast.",
      "demandScore": 96
    },
    {
      "id": "13",
      "name": "Ford Mustang GT",
      "brand": "Ford",
      "vehicleType": "Muscle",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1969,
      "price": 49.99,
      "rarityLevel": "Chase",
      "series": "HW Muscle",
      "image": "/cars/13-ford-mustang-gt.jpg",
      "notes": "Ford Mustang GT in Black. Muscle collectible, 1:64 premium die-cast.",
      "demandScore": 86
    },
    {
      "id": "14",
      "name": "Dodge Challenger SRT Demon",
      "brand": "Dodge",
      "vehicleType": "Muscle",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2018,
      "price": 54.99,
      "rarityLevel": "Chase",
      "series": "HW Muscle",
      "image": "/cars/14-dodge-challenger-srt-demon.jpg",
      "notes": "Dodge Challenger SRT Demon in Plum Crazy Purple. Muscle collectible, 1:64 premium die-cast.",
      "demandScore": 89
    },
    {
      "id": "15",
      "name": "Chevrolet Camaro ZL1",
      "brand": "Chevrolet",
      "vehicleType": "Muscle",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2019,
      "price": 44.99,
      "rarityLevel": "Chase",
      "series": "HW Muscle",
      "image": "/cars/15-chevrolet-camaro-zl1.jpg",
      "notes": "Chevrolet Camaro ZL1 in Yellow. Muscle collectible, 1:64 premium die-cast.",
      "demandScore": 88
    },
    {
      "id": "16",
      "name": "Mercedes-AMG GT Black Series",
      "brand": "Mercedes-Benz",
      "vehicleType": "Performance",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2021,
      "price": 64.99,
      "rarityLevel": "Chase",
      "series": "HW Performance",
      "image": "/cars/16-mercedes-amg-gt-black-series.jpg",
      "notes": "Mercedes-AMG GT Black Series in Matte Black. Performance collectible, 1:64 premium die-cast.",
      "demandScore": 93
    },
    {
      "id": "17",
      "name": "BMW M4 CSL",
      "brand": "BMW",
      "vehicleType": "Sports Coupe",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 59.99,
      "rarityLevel": "Chase",
      "series": "HW Speed Series",
      "image": "/cars/17-bmw-m4-csl.jpg",
      "notes": "BMW M4 CSL in Frozen Grey. Sports Coupe collectible, 1:64 premium die-cast.",
      "demandScore": 91
    },
    {
      "id": "18",
      "name": "Audi R8 V10 Performance",
      "brand": "Audi",
      "vehicleType": "Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2022,
      "price": 57.99,
      "rarityLevel": "Chase",
      "series": "HW Exotics",
      "image": "/cars/18-audi-r8-v10-performance.jpg",
      "notes": "Audi R8 V10 Performance in Nardo Grey. Supercar collectible, 1:64 premium die-cast.",
      "demandScore": 91
    },
    {
      "id": "19",
      "name": "Aston Martin Valkyrie",
      "brand": "Aston Martin",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2022,
      "price": 249.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Hypercars",
      "image": "/cars/19-aston-martin-valkyrie.jpg",
      "notes": "Aston Martin Valkyrie in Lime Green. Hypercar collectible, 1:64 premium die-cast.",
      "demandScore": 99
    },
    {
      "id": "20",
      "name": "Tesla Roadster (Concept)",
      "brand": "Tesla",
      "vehicleType": "Electric Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2025,
      "price": 69.99,
      "rarityLevel": "Chase",
      "series": "HW Future Electric",
      "image": "/cars/20-tesla-roadster.jpg",
      "notes": "Tesla Roadster (Concept) in Midnight Silver. Electric Hypercar collectible, 1:64 premium die-cast.",
      "demandScore": 93
    }
  ],
  "deals": [
    {
      "id": "d1",
      "name": "'69 Dodge Charger",
      "price": 12.0,
      "originalPrice": 18.5,
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuALYI0_-QMe8qn-hCRXuTBeQiMe3ag6cj22xXRYHPBDFqWbFM4f8KY-7uRrNnuge4W6E-skEvkKHisOG9wdsFEeT-_o_ZXcIdw5RO4jJIqk1atajErB4fvIIvPtFMyvW1Qo8v-bvxLCo79VJGI3PL9D8LU7lJoS10msQLKMYsheuGu8DYWFeJkE2C4Gh4BL06hCJ_hKo3mboDMcwhSddex90xENWWDOgQDHRhqLRDd2EAQVqVeFUSrb5q4VK1XS5tNJ7VoaowUpEm5h",
      "notes": "Blue 1960s muscle car with white racing stripes."
    },
    {
      "id": "d2",
      "name": "Lotus Evija",
      "price": 8.5,
      "originalPrice": 12.0,
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBXmL0cJxzhaZDlcoJv3S6Szf-xqhQJfGzRFjqHwr3gwvIHmK7dDKSnRMOYKbeCufXT9MdTg3B24z7z41BoK1XQeBefawVc1Zc929LLyZG9dikRcY2rT9MsqUnPQ65nNCbFU7MDpaxNJ-TqR3JM7HqtUaFJIPk-C76wm1VoFbKmIMZUjZ8PJo4yNY0aTrRfkOFTYCH7E6MuIIzolEBzHap4JCaFf0NIM1QbwEshV9Y8MAbso42KH0Wv5TAd4RNBK24uasCRoLZOgLcg",
      "notes": "Sleek modern electric hypercar toy in lime green."
    },
    {
      "id": "d3",
      "name": "Deora II Custom",
      "price": 35.0,
      "originalPrice": 45.0,
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA21cdG7VdDYl6YyIi7vJUuXkT3KoIrRoqqmQdcq6q0GaW32SpJP2jUh302uzhzVlnwKh4GqPj1_AyMMrjRzPfNsojcEyqQavjABWdIeKii7E0qSA6xHwt0WGONpb_AyzCj-D_DKAAKbaiVOVWx9JWD8OJ5N7phs11UZMwdi1gkIf6YyNN-deud1caeYLnZmZvRBzmII5sdgrPQJEMpuyVnMc_TUQ5HDyDql57OUqvbZ6cJWjuZwiLuy4mkhcAD3ie2LhOcoP7eLwI9",
      "notes": "Classic 1930s style hot rod toy with exposed engine."
    },
    {
      "id": "d4",
      "name": "Mazda RX-7 FD",
      "price": 9.5,
      "originalPrice": 15.0,
      "image": "/cars/03-mazda-rx7-fd.jpg",
      "notes": "JDM rotary icon in competition yellow."
    },
    {
      "id": "d5",
      "name": "'70 Chevelle SS",
      "price": 11.0,
      "originalPrice": 16.5,
      "image": "/cars/13-ford-mustang-gt.jpg",
      "notes": "Muscle-era heavyweight in Cranberry red."
    }
  ],
  "ticker": [
    {
      "name": "Aston Martin Valkyrie",
      "price": 249.99,
      "change": 3.8,
      "direction": "up"
    },
    {
      "name": "Bugatti Chiron",
      "price": 229.99,
      "change": 1.1,
      "direction": "up"
    },
    {
      "name": "Koenigsegg Jesko",
      "price": 219.99,
      "change": 5.0,
      "direction": "up"
    },
    {
      "name": "Ferrari F40",
      "price": 199.99,
      "change": 3.1,
      "direction": "up"
    },
    {
      "name": "Porsche 911 GT3 RS",
      "price": 149.99,
      "change": 4.2,
      "direction": "up"
    },
    {
      "name": "Pagani Huayra",
      "price": 139.99,
      "change": 0.8,
      "direction": "up"
    },
    {
      "name": "Lamborghini Aventador SVJ",
      "price": 129.99,
      "change": 2.5,
      "direction": "up"
    },
    {
      "name": "Tesla Roadster",
      "price": 69.99,
      "change": 6.2,
      "direction": "up"
    },
    {
      "name": "Mercedes-AMG GT Black",
      "price": 64.99,
      "change": -0.4,
      "direction": "down"
    },
    {
      "name": "Nissan Skyline GT-R R34",
      "price": 29.99,
      "change": 2.1,
      "direction": "up"
    },
    {
      "name": "Toyota Supra MK4",
      "price": 27.99,
      "change": 1.4,
      "direction": "up"
    },
    {
      "name": "Mazda RX-7 FD",
      "price": 24.99,
      "change": -0.6,
      "direction": "down"
    }
  ],
  "chartData": {
    "1W": [
      80,
      78,
      85,
      83,
      89,
      92,
      95
    ],
    "1M": [
      80,
      78,
      85,
      82,
      80,
      87,
      85,
      89,
      93,
      91,
      95,
      98
    ],
    "1Y": [
      50,
      65,
      58,
      72,
      70,
      85,
      80,
      92,
      88,
      95,
      102,
      110,
      120
    ]
  },
  "stats": {
    "totalCollectionValue": 42850.25,
    "itemsInVault": 1428,
    "setCompletePercent": 85,
    "setCompleteName": "Set #2024-B"
  },
  "community": [
    {
      "id": "t1",
      "author": "DieCastDan",
      "avatar": "https://i.pravatar.cc/80?u=dan",
      "car": "'67 Custom Mustang (STH)",
      "rarity": "Super Treasure Hunt",
      "question": "Found a '67 Custom Mustang STH still on the card, serial #014/250. What's a fair asking price right now?",
      "askedAgo": "12 min ago",
      "replies": [
        {
          "author": "VaultKeeper",
          "avatar": "https://i.pravatar.cc/80?u=vault",
          "text": "Carded STH with a low serial is gold. Mint examples have been moving around $1.2k\u2013$1.3k lately.",
          "suggestedPrice": 1250,
          "helpful": 24
        },
        {
          "author": "RedlineRita",
          "avatar": "https://i.pravatar.cc/80?u=rita",
          "text": "Agreed. If the blister is crease-free you can hold out for the higher end.",
          "suggestedPrice": 1300,
          "helpful": 11
        }
      ]
    },
    {
      "id": "t2",
      "author": "GarageGail",
      "avatar": "https://i.pravatar.cc/80?u=gail",
      "car": "Nissan Skyline GT-R (Chase)",
      "rarity": "Chase",
      "question": "How much is a loose R34 Skyline chase in Bayside Blue worth? Mine has light wheel rub.",
      "askedAgo": "38 min ago",
      "replies": [
        {
          "author": "JDM_Collector",
          "avatar": "https://i.pravatar.cc/80?u=jdm",
          "text": "Loose with wheel rub I'd price it ~$380\u2013$420. Carded mint is closer to $450+.",
          "suggestedPrice": 400,
          "helpful": 17
        }
      ]
    },
    {
      "id": "t3",
      "author": "NewToTheHunt",
      "avatar": "https://i.pravatar.cc/80?u=newbie",
      "car": "Lamborghini Centenario (STH)",
      "rarity": "Super Treasure Hunt",
      "question": "Is $1,100 too much to pay for a gold-chrome Centenario STH? First big purchase, want a sanity check \ud83d\ude4f",
      "askedAgo": "1 hr ago",
      "replies": [
        {
          "author": "VaultKeeper",
          "avatar": "https://i.pravatar.cc/80?u=vault",
          "text": "That's market rate for a clean one. Not overpaying \u2014 just confirm the Spectraflame has no rub.",
          "suggestedPrice": 1100,
          "helpful": 31
        },
        {
          "author": "ChaseChaser",
          "avatar": "https://i.pravatar.cc/80?u=chase",
          "text": "Welcome to the hobby! Fair price. Buy the condition, not just the car.",
          "helpful": 9
        }
      ]
    },
    {
      "id": "t4",
      "author": "PorscheHunter",
      "avatar": "https://i.pravatar.cc/80?u=porsche",
      "car": "Porsche 911 GT3 RS (STH)",
      "rarity": "Super Treasure Hunt",
      "question": "Just pulled a GT3 RS STH #001/250 in GT Silver! Holding or flipping \u2014 what are these going for carded?",
      "askedAgo": "2 hr ago",
      "replies": [
        {
          "author": "VaultKeeper",
          "avatar": "https://i.pravatar.cc/80?u=vault",
          "text": "A #001 serial carded is a grail. Clean ones have crossed $1.8k. Hold it.",
          "suggestedPrice": 1850,
          "helpful": 42
        }
      ]
    }
  ]
};

export default seed;
