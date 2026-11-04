// import { Product } from '../types';

// export const products: Product[] = [
//   {
//     id: 1,
//     name: "iPhone 15 Pro Max",
//     brand: "Apple",
//     price: 1099,
//     originalPrice: 1199,
//     image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
//     images: [
//       "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
//       "https://images.unsplash.com/photo-1695048133196-5ac88925872f",
//       "https://images.unsplash.com/photo-1695048133246-b23f8784e2bf"
//     ],
//     rating: 4.8,
//     reviews: 256,
//     category: "Smartphones",
//     stock: 50,
//     description: "Experience the pinnacle of mobile technology with the iPhone 15 Pro Max. Featuring a stunning display, powerful A17 Pro chip, and an advanced camera system.",
//     specifications: {
//       "Display": "6.7-inch Super Retina XDR OLED",
//       "Processor": "A17 Pro chip",
//       "RAM": "8GB",
//       "Storage": "256GB",
//       "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
//       "Battery": "4422mAh",
//       "OS": "iOS 17"
//     }
//   },
//   {
//     id: 2,
//     name: "MacBook Pro 16",
//     brand: "Apple",
//     price: 2499,
//     image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
//     images: [
//       "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
//       "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
//       "https://images.unsplash.com/photo-1541807084-5c52b6b3adef"
//     ],
//     rating: 4.9,
//     reviews: 189,
//     category: "Laptops",
//     stock: 25,
//     description: "The most powerful MacBook Pro ever is here. With the blazing-fast M2 Pro chip, stunning Liquid Retina XDR display, and exceptional battery life.",
//     specifications: {
//       "Display": "16.2-inch Liquid Retina XDR",
//       "Processor": "M2 Pro",
//       "RAM": "32GB",
//       "Storage": "1TB SSD",
//       "Graphics": "19-core GPU",
//       "Battery": "Up to 22 hours",
//       "OS": "macOS Sonoma"
//     }
//   },
//   {
//     id: 3,
//     name: "Samsung Galaxy S24 Ultra",
//     brand: "Samsung",
//     price: 1199,
//     originalPrice: 1299,
//     image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
//     images: [
//       "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
//       "https://images.unsplash.com/photo-1678911820864-e5c06d1a3f42",
//       "https://images.unsplash.com/photo-1678911820856-96c8ec7c1925"
//     ],
//     rating: 4.7,
//     reviews: 167,
//     category: "Smartphones",
//     stock: 45,
//     description: "The Galaxy S24 Ultra sets new standards with its advanced AI capabilities, stunning camera system, and the most powerful Galaxy performance yet.",
//     specifications: {
//       "Display": "6.8-inch QHD+ Dynamic AMOLED 2X",
//       "Processor": "Snapdragon 8 Gen 3",
//       "RAM": "12GB",
//       "Storage": "512GB",
//       "Camera": "200MP Main + 12MP Ultra Wide + 50MP Telephoto",
//       "Battery": "5000mAh",
//       "OS": "Android 14 with One UI 6.1"
//     }
//   },
//   {
//     id: 4,
//     name: "Dell XPS 15",
//     brand: "Dell",
//     price: 1999,
//     image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
//     images: [
//       "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"
//     ],
//     rating: 4.6,
//     reviews: 142,
//     category: "Laptops",
//     stock: 30,
//     description: "The Dell XPS 15 combines powerful performance with a stunning 4K OLED display in a premium, compact design perfect for creators and professionals.",
//     specifications: {
//       "Display": "15.6-inch 4K OLED Touch",
//       "Processor": "Intel Core i9-13900H",
//       "RAM": "32GB DDR5",
//       "Storage": "1TB NVMe SSD",
//       "Graphics": "NVIDIA RTX 4070",
//       "Battery": "86Whr",
//       "OS": "Windows 11 Pro"
//     }
//   },
//   {
//     id: 5,
//     name: "Sony WH-1000XM5",
//     brand: "Sony",
//     price: 399,
//     originalPrice: 449,
//     image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//     images: [
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"
//     ],
//     rating: 4.8,
//     reviews: 312,
//     category: "Accessories",
//     stock: 75,
//     description: "Industry-leading noise cancellation meets premium comfort and exceptional sound quality in these flagship wireless headphones.",
//     specifications: {
//       "Type": "Over-ear Wireless",
//       "Battery Life": "Up to 30 hours",
//       "Noise Cancellation": "Advanced ANC",
//       "Connectivity": "Bluetooth 5.2",
//       "Charging": "USB-C",
//       "Weight": "250g",
//       "Features": "Multipoint connection, Touch controls"
//     }
//   },
//   {
//     id: 6,
//     name: "iPad Pro 12.9",
//     brand: "Apple",
//     price: 1099,
//     image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//     images: [
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
//     ],
//     rating: 4.9,
//     reviews: 203,
//     category: "Tablets",
//     stock: 40,
//     description: "The ultimate iPad experience with the M2 chip, stunning mini-LED display, and pro-level features for demanding creative workflows.",
//     specifications: {
//       "Display": "12.9-inch Liquid Retina XDR",
//       "Processor": "M2 chip",
//       "Storage": "256GB",
//       "Camera": "12MP Wide + 10MP Ultra Wide",
//       "Features": "Face ID, Apple Pencil 2 support",
//       "Connectivity": "Wi-Fi 6E, 5G",
//       "OS": "iPadOS 17"
//     }
//   },
//   {
//     id: 7,
//     name: "OnePlus 11 5G",
//     brand: "OnePlus",
//     price: 799,
//     originalPrice: 899,
//     image: "https://tinyurl.com/3wxjuusv",
//     images: [
//       "https://tinyurl.com/3wxjuusv",
//       "https://tinyurl.com/3wxjuusv",
//       "https://tinyurl.com/3wxjuusv"
//     ],
//     rating: 4.7,
//     reviews: 132,
//     category: "Smartphones",
//     stock: 35,
//     description: "Flagship killer with Snapdragon 8 Gen 2, 120Hz AMOLED display, and Hasselblad cameras.",
//     specifications: {
//       "Display": "6.7-inch QHD+ AMOLED, 120Hz",
//       "Processor": "Snapdragon 8 Gen 2",
//       "RAM": "16GB",
//       "Storage": "256GB",
//       "Camera": "50MP Main + 48MP Ultra Wide + 32MP Telephoto",
//       "Battery": "5000mAh",
//       "OS": "Android 13"
//     }
//   },
//   {
//     id: 8,
//     name: "HP Spectre x360",
//     brand: "HP",
//     price: 1799,
//     image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
//     images: [
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"
//     ],
//     rating: 4.6,
//     reviews: 98,
//     category: "Laptops",
//     stock: 22,
//     description: "Premium 2-in-1 laptop with OLED touchscreen, Intel Core i7, and long battery life.",
//     specifications: {
//       "Display": "13.5-inch OLED Touchscreen",
//       "Processor": "Intel Core i7-13700H",
//       "RAM": "16GB LPDDR5",
//       "Storage": "1TB SSD",
//       "Graphics": "Intel Iris Xe",
//       "Battery": "17 hours",
//       "OS": "Windows 11"
//     }
//   },
//   {
//     id: 9,
//     name: "Samsung Galaxy Tab S9 Ultra",
//     brand: "Samsung",
//     price: 1199,
//     image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//     images: [
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
//     ],
//     rating: 4.8,
//     reviews: 145,
//     category: "Tablets",
//     stock: 27,
//     description: "Ultra-large AMOLED tablet with S Pen support and Snapdragon 8 Gen 2 chip.",
//     specifications: {
//       "Display": "14.6-inch Super AMOLED, 120Hz",
//       "Processor": "Snapdragon 8 Gen 2",
//       "RAM": "12GB",
//       "Storage": "512GB",
//       "Camera": "13MP Main + 6MP Ultra Wide",
//       "Battery": "11200mAh",
//       "OS": "Android 14 with One UI"
//     }
//   },
//   {
//     id: 10,
//     name: "Bose QuietComfort Ultra",
//     brand: "Bose",
//     price: 349,
//     image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//     images: [
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"
//     ],
//     rating: 4.9,
//     reviews: 268,
//     category: "Accessories",
//     stock: 80,
//     description: "Immersive noise-canceling headphones with adaptive sound technology.",
//     specifications: {
//       "Type": "Over-ear Wireless",
//       "Battery Life": "30 hours",
//       "Noise Cancellation": "Advanced ANC",
//       "Connectivity": "Bluetooth 5.3",
//       "Charging": "USB-C",
//       "Weight": "260g",
//       "Features": "Multi-device pairing, Touch controls"
//     }
//   },
//   {
//     id: 11,
//     name: "Google Pixel 8 Pro",
//     brand: "Google",
//     price: 999,
//     originalPrice: 1099,
//     image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
//     images: [
//       "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
//       "https://images.unsplash.com/photo-1695048133196-5ac88925872f",
//       "https://images.unsplash.com/photo-1695048133246-b23f8784e2bf"
//     ],
//     rating: 4.7,
//     reviews: 178,
//     category: "Smartphones",
//     stock: 42,
//     description: "The most advanced Pixel yet with Google's Tensor G3 chip, exceptional camera system, and AI-powered features.",
//     specifications: {
//       "Display": "6.7-inch LTPO OLED, 120Hz",
//       "Processor": "Google Tensor G3",
//       "RAM": "12GB",
//       "Storage": "256GB",
//       "Camera": "50MP Main + 48MP Ultra Wide + 48MP Telephoto",
//       "Battery": "5050mAh",
//       "OS": "Android 14"
//     }
//   },
//   {
//     id: 12,
//     name: "Lenovo ThinkPad X1 Carbon",
//     brand: "Lenovo",
//     price: 1899,
//     image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
//     images: [
//       "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"
//     ],
//     rating: 4.8,
//     reviews: 156,
//     category: "Laptops",
//     stock: 18,
//     description: "Ultra-lightweight business laptop with Intel Evo certification, exceptional keyboard, and enterprise-grade security.",
//     specifications: {
//       "Display": "14-inch WUXGA IPS, 500 nits",
//       "Processor": "Intel Core i7-1370P",
//       "RAM": "32GB LPDDR5",
//       "Storage": "1TB SSD",
//       "Graphics": "Intel Iris Xe",
//       "Battery": "57Whr",
//       "OS": "Windows 11 Pro"
//     }
//   },
//   {
//     id: 13,
//     name: "Microsoft Surface Pro 9",
//     brand: "Microsoft",
//     price: 1299,
//     image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//     images: [
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
//     ],
//     rating: 4.6,
//     reviews: 134,
//     category: "Tablets",
//     stock: 33,
//     description: "Versatile 2-in-1 tablet with Intel Core i7, Windows 11, and optional 5G connectivity.",
//     specifications: {
//       "Display": "13-inch PixelSense Flow, 120Hz",
//       "Processor": "Intel Core i7-1255U",
//       "RAM": "16GB",
//       "Storage": "512GB SSD",
//       "Camera": "10MP Rear + 5MP Front",
//       "Battery": "15.5 hours",
//       "OS": "Windows 11"
//     }
//   },
//   {
//     id: 14,
//     name: "Apple AirPods Pro 2",
//     brand: "Apple",
//     price: 249,
//     originalPrice: 279,
//     image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//     images: [
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"
//     ],
//     rating: 4.9,
//     reviews: 412,
//     category: "Accessories",
//     stock: 95,
//     description: "Premium wireless earbuds with active noise cancellation, spatial audio, and seamless Apple ecosystem integration.",
//     specifications: {
//       "Type": "In-ear Wireless",
//       "Battery Life": "6 hours (with ANC)",
//       "Noise Cancellation": "Active Noise Cancellation",
//       "Connectivity": "Bluetooth 5.3",
//       "Charging": "Lightning/USB-C",
//       "Features": "Spatial Audio, Transparency mode"
//     }
//   },
//   {
//     id: 15,
//     name: "Xiaomi 14 Ultra",
//     brand: "Xiaomi",
//     price: 899,
//     originalPrice: 999,
//     image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
//     images: [
//       "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
//       "https://images.unsplash.com/photo-1678911820864-e5c06d1a3f42",
//       "https://images.unsplash.com/photo-1678911820856-96c8ec7c1925"
//     ],
//     rating: 4.7,
//     reviews: 98,
//     category: "Smartphones",
//     stock: 28,
//     description: "Flagship smartphone with Leica optics, Snapdragon 8 Gen 3, and ultra-fast charging.",
//     specifications: {
//       "Display": "6.73-inch LTPO AMOLED, 120Hz",
//       "Processor": "Snapdragon 8 Gen 3",
//       "RAM": "16GB",
//       "Storage": "512GB",
//       "Camera": "50MP Main + 50MP Ultra Wide + 50MP Telephoto",
//       "Battery": "5000mAh",
//       "OS": "Android 14 with MIUI 15"
//     }
//   },
//   {
//     id: 16,
//     name: "ASUS ROG Zephyrus G14",
//     brand: "ASUS",
//     price: 1699,
//     image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
//     images: [
//       "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"
//     ],
//     rating: 4.8,
//     reviews: 167,
//     category: "Laptops",
//     stock: 15,
//     description: "Compact gaming laptop with AMD Ryzen 9, NVIDIA RTX 4070, and AniMe Matrix display.",
//     specifications: {
//       "Display": "14-inch QHD+ 165Hz",
//       "Processor": "AMD Ryzen 9 7940HS",
//       "RAM": "32GB DDR5",
//       "Storage": "1TB NVMe SSD",
//       "Graphics": "NVIDIA RTX 4070",
//       "Battery": "76Whr",
//       "OS": "Windows 11"
//     }
//   },
//   {
//     id: 17,
//     name: "Amazon Fire HD 10 Plus",
//     brand: "Amazon",
//     price: 179,
//     originalPrice: 229,
//     image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//     images: [
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
//       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
//     ],
//     rating: 4.5,
//     reviews: 287,
//     category: "Tablets",
//     stock: 62,
//     description: "Affordable tablet with Octa-core processor, 4GB RAM, and 12-hour battery life.",
//     specifications: {
//       "Display": "10.1-inch 1920x1200",
//       "Processor": "Octa-core 2.0 GHz",
//       "RAM": "4GB",
//       "Storage": "64GB",
//       "Camera": "8MP Rear + 2MP Front",
//       "Battery": "12 hours",
//       "OS": "Fire OS"
//     }
//   },
//   {
//     id: 18,
//     name: "Jabra Elite 8 Active",
//     brand: "Jabra",
//     price: 199,
//     originalPrice: 249,
//     image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//     images: [
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"
//     ],
//     rating: 4.7,
//     reviews: 156,
//     category: "Accessories",
//     stock: 45,
//     description: "Sport-focused true wireless earbuds with active noise cancellation and IP68 water resistance.",
//     specifications: {
//       "Type": "In-ear Wireless",
//       "Battery Life": "8 hours (with ANC)",
//       "Noise Cancellation": "Active Noise Cancellation",
//       "Connectivity": "Bluetooth 5.3",
//       "Water Resistance": "IP68",
//       "Features": "HearThrough, Multi-device connection"
//     }
//   },
//   {
//     id: 19,
//     name: "Nothing Phone 2",
//     brand: "Nothing",
//     price: 699,
//     originalPrice: 749,
//     image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
//     images: [
//       "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
//       "https://images.unsplash.com/photo-1678911820864-e5c06d1a3f42",
//       "https://images.unsplash.com/photo-1678911820856-96c8ec7c1925"
//     ],
//     rating: 4.6,
//     reviews: 112,
//     category: "Smartphones",
//     stock: 38,
//     description: "Unique smartphone with Glyph interface, clean Android experience, and dual 50MP cameras.",
//     specifications: {
//       "Display": "6.7-inch LTPO OLED, 120Hz",
//       "Processor": "Snapdragon 8+ Gen 1",
//       "RAM": "12GB",
//       "Storage": "256GB",
//       "Camera": "50MP Main + 50MP Ultra Wide",
//       "Battery": "4700mAh",
//       "OS": "Nothing OS 2.0"
//     }
//   },
//   {
//     id: 20,
//     name: "Razer Blade 18",
//     brand: "Razer",
//     price: 3499,
//     image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
//     images: [
//       "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
//       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"
//     ],
//     rating: 4.8,
//     reviews: 87,
//     category: "Laptops",
//     stock: 12,
//     description: "Ultimate gaming laptop with 18-inch 4K+ display, Intel Core i9, and NVIDIA RTX 4090.",
//     specifications: {
//       "Display": "18-inch 4K+ 200Hz Mini LED",
//       "Processor": "Intel Core i9-13950HX",
//       "RAM": "64GB DDR5",
//       "Storage": "4TB NVMe SSD",
//       "Graphics": "NVIDIA RTX 4090",
//       "Battery": "99.9Whr",
//       "OS": "Windows 11"
//     }
//   }
// ];

export const categories = [
  {
    id: "smartphones",
    name: "Smartphones",
    description: "Latest mobile phones from top brands",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569"
  },
  {
    id: "laptops",
    name: "Laptops",
    description: "Powerful laptops for work and play",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
  },
  {
    id: "tablets",
    name: "Tablets",
    description: "Versatile tablets for creativity and entertainment",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Essential accessories for your devices",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"
  }
];