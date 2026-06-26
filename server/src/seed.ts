// Initial seed data. Bundled into the serverless function as the source of
// truth on read-only filesystems (e.g. Vercel) and used as the fallback when
// no writable DB file exists yet. Kept as a plain TS module (not a JSON import)
// so it bundles reliably across tsx (local) and esbuild (Vercel).
import type { Database } from './app.js';

const seed: Database = {
  "collectibles": [
    {
      "id": "1",
      "name": "Porsche 911 GT3 RS (992)",
      "brand": "Porsche",
      "vehicleType": "Premium Sports Car",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 34.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW Best Sellers",
      "image": "/cars/06-porsche-911-gt3-rs.jpg",
      "notes": "Porsche 911 GT3 RS (992) \u2014 Premium Sports Car. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "best-seller"
      ],
      "isFeatured": true
    },
    {
      "id": "2",
      "name": "Lamborghini Revuelto",
      "brand": "Lamborghini",
      "vehicleType": "Hybrid Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2024,
      "price": 49.99,
      "rarityLevel": "Chase",
      "series": "HW Best Sellers",
      "image": "/cars/08-lamborghini-aventador-svj.jpg",
      "notes": "Lamborghini Revuelto \u2014 Hybrid Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 85,
      "sections": [
        "best-seller"
      ]
    },
    {
      "id": "3",
      "name": "Ferrari 296 GTB",
      "brand": "Ferrari",
      "vehicleType": "Hybrid Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 44.99,
      "rarityLevel": "Chase",
      "series": "HW Best Sellers",
      "image": "/cars/07-ferrari-f40.jpg",
      "notes": "Ferrari 296 GTB \u2014 Hybrid Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 84,
      "sections": [
        "best-seller"
      ]
    },
    {
      "id": "4",
      "name": "Bugatti Chiron Super Sport",
      "brand": "Bugatti",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2022,
      "price": 49.99,
      "rarityLevel": "Chase",
      "series": "HW Best Sellers",
      "image": "/cars/10-bugatti-chiron.jpg",
      "notes": "Bugatti Chiron Super Sport \u2014 Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 85,
      "sections": [
        "best-seller"
      ]
    },
    {
      "id": "5",
      "name": "McLaren 765LT",
      "brand": "McLaren",
      "vehicleType": "Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2020,
      "price": 39.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW Best Sellers",
      "image": "/cars/09-mclaren-p1.jpg",
      "notes": "McLaren 765LT \u2014 Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 84,
      "sections": [
        "best-seller"
      ]
    },
    {
      "id": "6",
      "name": "Koenigsegg Jesko Attack",
      "brand": "Koenigsegg",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 49.99,
      "rarityLevel": "Chase",
      "series": "HW Best Sellers",
      "image": "/cars/11-koenigsegg-jesko.jpg",
      "notes": "Koenigsegg Jesko Attack \u2014 Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 85,
      "sections": [
        "best-seller"
      ]
    },
    {
      "id": "7",
      "name": "Chevrolet Corvette C8 Z06",
      "brand": "Chevrolet",
      "vehicleType": "American Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 34.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW Best Sellers",
      "image": "/cars/15-chevrolet-camaro-zl1.jpg",
      "notes": "Chevrolet Corvette C8 Z06 \u2014 American Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "best-seller"
      ]
    },
    {
      "id": "8",
      "name": "Nissan Skyline GT-R R34",
      "brand": "Nissan",
      "vehicleType": "JDM Coupe",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1999,
      "price": 29.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW Best Sellers",
      "image": "/cars/01-nissan-skyline-gtr-r34.jpg",
      "notes": "Nissan Skyline GT-R R34 \u2014 JDM Coupe. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "best-seller",
        "jdm"
      ]
    },
    {
      "id": "9",
      "name": "Toyota Supra MK4",
      "brand": "Toyota",
      "vehicleType": "JDM Sports Car",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1998,
      "price": 24.99,
      "rarityLevel": "Mainline",
      "series": "HW J-Imports",
      "image": "/cars/02-toyota-supra-mk4.jpg",
      "notes": "Toyota Supra MK4 \u2014 JDM Sports Car. 1:64 premium die-cast collectible.",
      "demandScore": 82,
      "sections": [
        "jdm"
      ]
    },
    {
      "id": "10",
      "name": "Mazda RX-7 FD3S",
      "brand": "Mazda",
      "vehicleType": "Rotary Sports Car",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1997,
      "price": 22.99,
      "rarityLevel": "Mainline",
      "series": "HW J-Imports",
      "image": "/cars/03-mazda-rx7-fd.jpg",
      "notes": "Mazda RX-7 FD3S \u2014 Rotary Sports Car. 1:64 premium die-cast collectible.",
      "demandScore": 82,
      "sections": [
        "jdm"
      ]
    },
    {
      "id": "11",
      "name": "Honda NSX (NA1)",
      "brand": "Honda",
      "vehicleType": "Mid-Engine Sports Car",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1992,
      "price": 26.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW J-Imports",
      "image": "/cars/04-honda-nsx.jpg",
      "notes": "Honda NSX (NA1) \u2014 Mid-Engine Sports Car. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "jdm"
      ]
    },
    {
      "id": "12",
      "name": "Nissan Silvia S15",
      "brand": "Nissan",
      "vehicleType": "Drift Coupe",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2002,
      "price": 21.99,
      "rarityLevel": "Mainline",
      "series": "HW J-Imports",
      "image": "/cars/05-nissan-silvia-s15.jpg",
      "notes": "Nissan Silvia S15 \u2014 Drift Coupe. 1:64 premium die-cast collectible.",
      "demandScore": 82,
      "sections": [
        "jdm"
      ]
    },
    {
      "id": "13",
      "name": "Subaru Impreza WRX STI (22B)",
      "brand": "Subaru",
      "vehicleType": "Rally Sedan",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1998,
      "price": 26.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW J-Imports",
      "image": "/cars/10-bugatti-chiron.jpg",
      "notes": "Subaru Impreza WRX STI (22B) \u2014 Rally Sedan. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "jdm"
      ]
    },
    {
      "id": "14",
      "name": "Mitsubishi Lancer Evolution IX",
      "brand": "Mitsubishi",
      "vehicleType": "Rally Sedan",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2005,
      "price": 24.99,
      "rarityLevel": "Mainline",
      "series": "HW J-Imports",
      "image": "/cars/04-honda-nsx.jpg",
      "notes": "Mitsubishi Lancer Evolution IX \u2014 Rally Sedan. 1:64 premium die-cast collectible.",
      "demandScore": 82,
      "sections": [
        "jdm"
      ]
    },
    {
      "id": "15",
      "name": "Toyota AE86 Trueno",
      "brand": "Toyota",
      "vehicleType": "Classic Drift Coupe",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1986,
      "price": 19.99,
      "rarityLevel": "Mainline",
      "series": "HW J-Imports",
      "image": "/cars/05-nissan-silvia-s15.jpg",
      "notes": "Toyota AE86 Trueno \u2014 Classic Drift Coupe. 1:64 premium die-cast collectible.",
      "demandScore": 82,
      "sections": [
        "jdm"
      ]
    },
    {
      "id": "16",
      "name": "Lexus LFA",
      "brand": "Lexus",
      "vehicleType": "Japanese Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2011,
      "price": 34.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW J-Imports",
      "image": "/cars/12-pagani-huayra.jpg",
      "notes": "Lexus LFA \u2014 Japanese Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "jdm"
      ]
    },
    {
      "id": "17",
      "name": "Nissan 400Z Nismo",
      "brand": "Nissan",
      "vehicleType": "Modern JDM Coupe",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2024,
      "price": 29.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW J-Imports",
      "image": "/cars/01-nissan-skyline-gtr-r34.jpg",
      "notes": "Nissan 400Z Nismo \u2014 Modern JDM Coupe. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "jdm"
      ]
    },
    {
      "id": "18",
      "name": "Ferrari F80",
      "brand": "Ferrari",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2025,
      "price": 59.99,
      "rarityLevel": "Chase",
      "series": "HW New Arrivals",
      "image": "/cars/07-ferrari-f40.jpg",
      "notes": "Ferrari F80 \u2014 Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 86,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "19",
      "name": "Lamborghini Temerario",
      "brand": "Lamborghini",
      "vehicleType": "Hybrid Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2025,
      "price": 49.99,
      "rarityLevel": "Chase",
      "series": "HW New Arrivals",
      "image": "/cars/08-lamborghini-aventador-svj.jpg",
      "notes": "Lamborghini Temerario \u2014 Hybrid Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 85,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "20",
      "name": "McLaren W1",
      "brand": "McLaren",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2025,
      "price": 59.99,
      "rarityLevel": "Chase",
      "series": "HW New Arrivals",
      "image": "/cars/09-mclaren-p1.jpg",
      "notes": "McLaren W1 \u2014 Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 86,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "21",
      "name": "Porsche 911 Turbo 50 Years",
      "brand": "Porsche",
      "vehicleType": "Sports Car",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2024,
      "price": 34.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW New Arrivals",
      "image": "/cars/06-porsche-911-gt3-rs.jpg",
      "notes": "Porsche 911 Turbo 50 Years \u2014 Sports Car. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "22",
      "name": "BMW M4 CS",
      "brand": "BMW",
      "vehicleType": "Performance Coupe",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2024,
      "price": 32.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW New Arrivals",
      "image": "/cars/17-bmw-m4-csl.jpg",
      "notes": "BMW M4 CS \u2014 Performance Coupe. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "23",
      "name": "Audi RS e-tron GT Performance",
      "brand": "Audi",
      "vehicleType": "Electric Performance Sedan",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2025,
      "price": 34.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW New Arrivals",
      "image": "/cars/18-audi-r8-v10-performance.jpg",
      "notes": "Audi RS e-tron GT Performance \u2014 Electric Performance Sedan. 1:64 premium die-cast collectible.",
      "demandScore": 83,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "24",
      "name": "Mercedes-AMG GT 63 Coupe",
      "brand": "Mercedes-Benz",
      "vehicleType": "Grand Tourer",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2024,
      "price": 39.99,
      "rarityLevel": "Treasure Hunt",
      "series": "HW New Arrivals",
      "image": "/cars/16-mercedes-amg-gt-black-series.jpg",
      "notes": "Mercedes-AMG GT 63 Coupe \u2014 Grand Tourer. 1:64 premium die-cast collectible.",
      "demandScore": 84,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "25",
      "name": "Aston Martin Valhalla",
      "brand": "Aston Martin",
      "vehicleType": "Hybrid Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2025,
      "price": 59.99,
      "rarityLevel": "Chase",
      "series": "HW New Arrivals",
      "image": "/cars/19-aston-martin-valkyrie.jpg",
      "notes": "Aston Martin Valhalla \u2014 Hybrid Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 86,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "26",
      "name": "Chevrolet Corvette ZR1 (C8)",
      "brand": "Chevrolet",
      "vehicleType": "Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2025,
      "price": 49.99,
      "rarityLevel": "Chase",
      "series": "HW New Arrivals",
      "image": "/cars/15-chevrolet-camaro-zl1.jpg",
      "notes": "Chevrolet Corvette ZR1 (C8) \u2014 Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 85,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "27",
      "name": "Ford Mustang GTD",
      "brand": "Ford",
      "vehicleType": "Track Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2025,
      "price": 54.99,
      "rarityLevel": "Chase",
      "series": "HW New Arrivals",
      "image": "/cars/13-ford-mustang-gt.jpg",
      "notes": "Ford Mustang GTD \u2014 Track Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 85,
      "sections": [
        "latest"
      ]
    },
    {
      "id": "28",
      "name": "Bugatti Bolide",
      "brand": "Bugatti",
      "vehicleType": "Track Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2024,
      "price": 149.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Limited Editions",
      "image": "/cars/10-bugatti-chiron.jpg",
      "notes": "Bugatti Bolide \u2014 Track Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 95,
      "sections": [
        "limited"
      ]
    },
    {
      "id": "29",
      "name": "Pagani Utopia",
      "brand": "Pagani",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 129.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Limited Editions",
      "image": "/cars/12-pagani-huayra.jpg",
      "notes": "Pagani Utopia \u2014 Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 93,
      "sections": [
        "limited"
      ]
    },
    {
      "id": "30",
      "name": "Koenigsegg CC850",
      "brand": "Koenigsegg",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 139.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Limited Editions",
      "image": "/cars/11-koenigsegg-jesko.jpg",
      "notes": "Koenigsegg CC850 \u2014 Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 94,
      "sections": [
        "limited"
      ]
    },
    {
      "id": "31",
      "name": "Ferrari Daytona SP3",
      "brand": "Ferrari",
      "vehicleType": "Limited Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2022,
      "price": 149.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Limited Editions",
      "image": "/cars/07-ferrari-f40.jpg",
      "notes": "Ferrari Daytona SP3 \u2014 Limited Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 95,
      "sections": [
        "limited"
      ]
    },
    {
      "id": "32",
      "name": "Lamborghini Sian FKP 37",
      "brand": "Lamborghini",
      "vehicleType": "Hybrid Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2020,
      "price": 129.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Limited Editions",
      "image": "/cars/08-lamborghini-aventador-svj.jpg",
      "notes": "Lamborghini Sian FKP 37 \u2014 Hybrid Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 93,
      "sections": [
        "limited"
      ]
    },
    {
      "id": "33",
      "name": "McLaren Speedtail",
      "brand": "McLaren",
      "vehicleType": "Hyper GT",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2020,
      "price": 129.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Limited Editions",
      "image": "/cars/09-mclaren-p1.jpg",
      "notes": "McLaren Speedtail \u2014 Hyper GT. 1:64 premium die-cast collectible.",
      "demandScore": 93,
      "sections": [
        "limited"
      ]
    },
    {
      "id": "34",
      "name": "Aston Martin Valkyrie",
      "brand": "Aston Martin",
      "vehicleType": "Track Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2022,
      "price": 149.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Limited Editions",
      "image": "/cars/19-aston-martin-valkyrie.jpg",
      "notes": "Aston Martin Valkyrie \u2014 Track Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 95,
      "sections": [
        "limited"
      ]
    },
    {
      "id": "35",
      "name": "Mercedes-AMG ONE",
      "brand": "Mercedes-Benz",
      "vehicleType": "Formula 1 Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2023,
      "price": 199.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Limited Editions",
      "image": "/cars/16-mercedes-amg-gt-black-series.jpg",
      "notes": "Mercedes-AMG ONE \u2014 Formula 1 Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 99,
      "sections": [
        "limited"
      ]
    },
    {
      "id": "36",
      "name": "Ferrari F40",
      "brand": "Ferrari",
      "vehicleType": "Classic Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1987,
      "price": 129.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Collector's Picks",
      "image": "/cars/07-ferrari-f40.jpg",
      "notes": "Ferrari F40 \u2014 Classic Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 93,
      "sections": [
        "collector"
      ]
    },
    {
      "id": "37",
      "name": "Ferrari Enzo",
      "brand": "Ferrari",
      "vehicleType": "Hypercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2003,
      "price": 139.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Collector's Picks",
      "image": "/cars/07-ferrari-f40.jpg",
      "notes": "Ferrari Enzo \u2014 Hypercar. 1:64 premium die-cast collectible.",
      "demandScore": 94,
      "sections": [
        "collector"
      ]
    },
    {
      "id": "38",
      "name": "Porsche Carrera GT",
      "brand": "Porsche",
      "vehicleType": "V10 Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2004,
      "price": 129.99,
      "rarityLevel": "Super Treasure Hunt",
      "series": "HW Collector's Picks",
      "image": "/cars/06-porsche-911-gt3-rs.jpg",
      "notes": "Porsche Carrera GT \u2014 V10 Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 93,
      "sections": [
        "collector"
      ]
    },
    {
      "id": "39",
      "name": "Mercedes-Benz 300SL Gullwing",
      "brand": "Mercedes-Benz",
      "vehicleType": "Classic Sports Car",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1955,
      "price": 88.99,
      "rarityLevel": "Chase",
      "series": "HW Collector's Picks",
      "image": "/cars/16-mercedes-amg-gt-black-series.jpg",
      "notes": "Mercedes-Benz 300SL Gullwing \u2014 Classic Sports Car. 1:64 premium die-cast collectible.",
      "demandScore": 89,
      "sections": [
        "collector"
      ]
    },
    {
      "id": "40",
      "name": "Jaguar XJ220",
      "brand": "Jaguar",
      "vehicleType": "Classic Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1992,
      "price": 99.99,
      "rarityLevel": "Chase",
      "series": "HW Collector's Picks",
      "image": "/cars/12-pagani-huayra.jpg",
      "notes": "Jaguar XJ220 \u2014 Classic Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 90,
      "sections": [
        "collector"
      ]
    },
    {
      "id": "41",
      "name": "Toyota 2000GT",
      "brand": "Toyota",
      "vehicleType": "Classic Japanese Sports Car",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1967,
      "price": 89.99,
      "rarityLevel": "Chase",
      "series": "HW Collector's Picks",
      "image": "/cars/02-toyota-supra-mk4.jpg",
      "notes": "Toyota 2000GT \u2014 Classic Japanese Sports Car. 1:64 premium die-cast collectible.",
      "demandScore": 89,
      "sections": [
        "collector"
      ]
    },
    {
      "id": "42",
      "name": "Dodge Viper ACR",
      "brand": "Dodge",
      "vehicleType": "American Track Car",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2016,
      "price": 79.99,
      "rarityLevel": "Chase",
      "series": "HW Collector's Picks",
      "image": "/cars/14-dodge-challenger-srt-demon.jpg",
      "notes": "Dodge Viper ACR \u2014 American Track Car. 1:64 premium die-cast collectible.",
      "demandScore": 88,
      "sections": [
        "collector"
      ]
    },
    {
      "id": "43",
      "name": "Ford GT (2005)",
      "brand": "Ford",
      "vehicleType": "American Supercar",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 2005,
      "price": 79.99,
      "rarityLevel": "Chase",
      "series": "HW Collector's Picks",
      "image": "/cars/13-ford-mustang-gt.jpg",
      "notes": "Ford GT (2005) \u2014 American Supercar. 1:64 premium die-cast collectible.",
      "demandScore": 88,
      "sections": [
        "collector"
      ]
    },
    {
      "id": "44",
      "name": "Shelby Cobra 427",
      "brand": "Shelby",
      "vehicleType": "Classic Roadster",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1966,
      "price": 79.99,
      "rarityLevel": "Chase",
      "series": "HW Collector's Picks",
      "image": "/cars/10-bugatti-chiron.jpg",
      "notes": "Shelby Cobra 427 \u2014 Classic Roadster. 1:64 premium die-cast collectible.",
      "demandScore": 88,
      "sections": [
        "collector"
      ]
    },
    {
      "id": "45",
      "name": "BMW M1 Procar",
      "brand": "BMW",
      "vehicleType": "Classic Racing Coupe",
      "scale": "1:64",
      "condition": "Mint (M)",
      "releaseYear": 1979,
      "price": 69.99,
      "rarityLevel": "Chase",
      "series": "HW Collector's Picks",
      "image": "/cars/17-bmw-m4-csl.jpg",
      "notes": "BMW M1 Procar \u2014 Classic Racing Coupe. 1:64 premium die-cast collectible.",
      "demandScore": 87,
      "sections": [
        "collector"
      ]
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
      "name": "Mercedes-AMG ONE",
      "price": 199.99,
      "change": 3.8,
      "direction": "up"
    },
    {
      "name": "Aston Martin Valkyrie",
      "price": 149.99,
      "change": 2.1,
      "direction": "up"
    },
    {
      "name": "Ferrari Daytona SP3",
      "price": 149.99,
      "change": 1.4,
      "direction": "up"
    },
    {
      "name": "Bugatti Bolide",
      "price": 149.99,
      "change": 4.2,
      "direction": "up"
    },
    {
      "name": "Ferrari Enzo",
      "price": 139.99,
      "change": 0.9,
      "direction": "up"
    },
    {
      "name": "Pagani Utopia",
      "price": 129.99,
      "change": -0.5,
      "direction": "down"
    },
    {
      "name": "McLaren W1",
      "price": 59.99,
      "change": 5.1,
      "direction": "up"
    },
    {
      "name": "Nissan Skyline GT-R R34",
      "price": 29.99,
      "change": 2.3,
      "direction": "up"
    },
    {
      "name": "Toyota Supra MK4",
      "price": 24.99,
      "change": 1.1,
      "direction": "up"
    },
    {
      "name": "Toyota AE86 Trueno",
      "price": 19.99,
      "change": -0.4,
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
