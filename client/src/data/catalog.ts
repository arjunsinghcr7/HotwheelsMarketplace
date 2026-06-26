// Bundled catalog — a client-side copy of the marketplace cars so the
// homepage and marketplace always render content even when the API is
// unreachable (e.g. server not running, or a serverless cold-start failure).
// The API still overrides this at runtime when it returns data.
// Generated from server/db.json — keep in sync.
import type { Collectible } from '../services/api';

export const CATALOG: Collectible[] = [
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
];
