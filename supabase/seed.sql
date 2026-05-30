-- =========================================================
-- Echoo E-commerce Seed Data
-- Old website products migrated from Django sqlite_data.json
-- Products: 38 | Product Images: 128
-- =========================================================

delete from product_images;
delete from products;

-- =========================================================
-- Insert Products
-- =========================================================

insert into products (
  name, slug, brand, category, description, short_description,
  price, discount_price, stock, rating, is_featured,
  variants, features, specs
) values
  ('iPhone 17 Pro', 'iphone-17-pro', 'Apple', 'smartphone', 'iPhone 17 Pro — titanium frame and pro camera system.', 'iPhone 17 Pro — titanium frame and pro camera system.', 129999.00, null, 16, 4.5, true, '{"storage": ["256GB", "512GB", "1TB"], "colors": ["Orange", "Deep Blue", "White"]}'::jsonb, '["6.1-inch Super Retina XDR display", "Titanium design with textured matte glass back", "A17 Pro chip with 6-core CPU", "Pro camera system with 48MP Main camera", "USB-C connector for charging and data transfer"]'::jsonb, '{"display": "6.1-inch ProMotion OLED", "chip": "A19 Pro", "mainCamera": "48MP Pro triple-lens", "material": "Titanium", "os": "iOS 19"}'::jsonb),
  ('iPhone 17', 'iphone-17', 'Apple', 'smartphone', 'iPhone 17 with upgraded performance and battery.', 'iPhone 17 with upgraded performance and battery.', 79999.00, null, 5, 4.5, true, '{"storage": ["128GB", "256GB", "512GB"], "colors": ["Lavender", "Sage", "Mist Blue", "White", "Black"]}'::jsonb, '[]'::jsonb, '{"display": "6.1-inch Super Retina XDR", "chip": "A18 Pro", "mainCamera": "48MP + 12MP", "battery": "Improved battery life", "os": "iOS 19"}'::jsonb),
  ('iPhone 17 Pro Max', 'iphone-17-pro-max', 'Apple', 'smartphone', 'iPhone 17 Pro Max — largest display and best battery.', 'iPhone 17 Pro Max — largest display and best battery.', 149999.00, null, 0, 4.5, true, '{"storage": ["512GB", "1TB"], "colors": ["Orange", "Silver", "Deep Blue"]}'::jsonb, '[]'::jsonb, '{"display": "6.7-inch ProMotion OLED", "chip": "A19 Pro", "mainCamera": "48MP Pro quad-lens", "battery": "Extended battery life", "material": "Titanium"}'::jsonb),
  ('iPhone Air', 'iphone-air', 'Apple', 'smartphone', 'iPhone Air — lightweight design, great performance.', 'iPhone Air — lightweight design, great performance.', 139999.00, null, 39, 4.5, true, '{"storage": ["64GB", "128GB", "256GB"], "colors": ["Light Gold", "Sky", "White", "Black"]}'::jsonb, '[]'::jsonb, '{"display": "6.1-inch OLED", "chip": "A17 Lite", "mainCamera": "48MP", "battery": "Good battery life", "weight": "Lightweight"}'::jsonb),
  ('iPhone 16', 'iphone-16', 'Apple', 'smartphone', 'iPhone 16 with advanced camera and A18 chip.', 'iPhone 16 with advanced camera and A18 chip.', 74999.00, null, 9, 4.5, false, '{"storage": ["128GB", "256GB", "512GB"], "colors": ["Teal", "Blue", "Pink", "White", "Black"]}'::jsonb, '[]'::jsonb, '{"display": "6.1-inch Super Retina XDR", "chip": "A18", "mainCamera": "48MP", "battery": "All-day battery", "os": "iOS 19"}'::jsonb),
  ('Nothing Phone 3', 'nothing-phone-3', 'Nothing', 'smartphone', 'Nothing Phone 3 — improved camera & performance.', 'Nothing Phone 3 — improved camera & performance.', 36999.00, null, 27, 4.5, true, '{"storage": ["128GB", "256GB"], "colors": ["Black", "Silver"]}'::jsonb, '[]'::jsonb, '{"display": "6.6-inch OLED", "chip": "Snapdragon 8 Gen 3", "camera": "50MP + 12MP", "battery": "4700mAh"}'::jsonb),
  ('Nothing Phone 3a Pro', 'nothing-phone-3a-pro', 'Nothing', 'smartphone', 'Nothing Phone 3a Pro — clean design & smooth UI.', 'Nothing Phone 3a Pro — clean design & smooth UI.', 32999.00, null, 38, 4.5, true, '{"storage": ["128GB", "256GB"], "colors": ["Gray", "Black"]}'::jsonb, '[]'::jsonb, '{"display": "6.5-inch OLED", "chip": "Snapdragon 7s Gen 3", "camera": "50MP", "battery": "5000mAh"}'::jsonb),
  ('Nothing Phone 3a', 'nothing-phone-3a', 'Nothing', 'smartphone', 'Nothing Phone 3a — budget-friendly with signature design.', 'Nothing Phone 3a — budget-friendly with signature design.', 23999.00, null, 60, 4.5, false, '{"storage": ["64GB", "128GB"], "colors": ["White", "Black"]}'::jsonb, '[]'::jsonb, '{"display": "6.2-inch OLED", "chip": "Mid-range SoC", "camera": "48MP", "battery": "5300mAh"}'::jsonb),
  ('Acer Nitro V15 (2025)', 'acer-nitro-v15-2025', 'Acer', 'laptop', 'Acer Nitro V15 — gaming laptop with RTX graphics.', 'Acer Nitro V15 — gaming laptop with RTX graphics.', 74999.00, null, 20, 4.5, false, '{"ram": ["16GB", "32GB"], "storage": ["512GB", "1TB"]}'::jsonb, '[]'::jsonb, '{"processor": "Intel i7 13th Gen", "gpu": "NVIDIA RTX 4060", "ram": "16GB", "storage": "512GB SSD", "display": "15.6-inch FHD 144Hz"}'::jsonb),
  ('Acer Nitro V16 (2025)', 'acer-nitro-v16-2025', 'Acer', 'laptop', 'Acer Nitro V16 — larger display, high-refresh gaming.', 'Acer Nitro V16 — larger display, high-refresh gaming.', 89999.00, null, 11, 4.5, false, '{"ram": ["16GB", "32GB"], "storage": ["1TB"]}'::jsonb, '[]'::jsonb, '{"processor": "Intel i7 14th Gen", "gpu": "NVIDIA RTX 4070", "ram": "16GB", "storage": "1TB SSD", "display": "16-inch QHD 165Hz"}'::jsonb),
  ('Acer Nitro V16 Lite', 'acer-nitro-v16-lite', 'Acer', 'laptop', 'Acer Nitro V16 — larger display, high-refresh gaming.', 'Acer Nitro V16 — larger display, high-refresh gaming.', 89999.00, null, 11, 4.5, false, '{"ram": ["16GB", "32GB"], "storage": ["1TB"]}'::jsonb, '[]'::jsonb, '{"processor": "Intel Core i5-13420H Processor", "gpu": "NVIDIA GeForce RTX 4050-6 GB GDDR6", "ram": "16 GB", "storage": "512 GB SSD", "display": "16-inch QHD 165Hz"}'::jsonb),
  ('Lenovo LOQ 3 (High) - RTX 4080', 'lenovo-loq-3-high-rtx-4080', 'Lenovo', 'laptop', 'Lenovo LOQ 3 high model with top-tier GPU.', 'Lenovo LOQ 3 high model with top-tier GPU.', 189999.00, null, 6, 4.5, false, '{"ram": ["32GB"], "storage": ["1TB", "2TB"]}'::jsonb, '[]'::jsonb, '{"processor": "Intel i9 / Ryzen 9", "gpu": "NVIDIA RTX 4060", "ram": "32GB", "storage": "1TB SSD", "display": "16-inch QHD 240Hz"}'::jsonb),
  ('Lenovo LOQ 3 (High) - RTX 4070', 'lenovo-loq-3-high-rtx-4070', 'Lenovo', 'laptop', 'Lenovo LOQ 3 high model balancing price and power.', 'Lenovo LOQ 3 high model balancing price and power.', 139999.00, null, 8, 4.5, false, '{"ram": ["16GB", "32GB"], "storage": ["1TB"]}'::jsonb, '[]'::jsonb, '{"processor": "Intel i7 / Ryzen 7", "gpu": "NVIDIA RTX 4070", "ram": "16GB", "storage": "1TB SSD", "display": "16-inch FHD 165Hz"}'::jsonb),
  ('ASUS TUF Gaming F16', 'asus-tuf-gaming-f16', 'ASUS', 'laptop', 'ASUS TUF — durable gaming laptop, value-focused.', 'ASUS TUF — durable gaming laptop, value-focused.', 84999.00, null, 15, 4.5, false, '{"ram": ["8GB", "16GB"], "storage": ["512GB", "1TB"]}'::jsonb, '[]'::jsonb, '{"processor": "13th Gen,Intel Core i5-13450HX", "gpu": "NVIDIA RTX 5050-8GB", "ram": "16GB", "storage": "512GB SSD", "display": "15.6-inch FHD 165Hz"}'::jsonb),
  ('ASUS TUF A15', 'asus-tuf-a15', 'ASUS', 'laptop', 'ASUS TUF A15 — AMD powered gaming performance.', 'ASUS TUF A15 — AMD powered gaming performance.', 69999.00, null, 18, 4.5, false, '{"ram": ["8GB", "16GB"], "storage": ["512GB"]}'::jsonb, '[]'::jsonb, '{"processor": "Ryzen 7", "gpu": "NVIDIA RTX 3050", "ram": "16GB", "storage": "512GB SSD", "display": "15.6-inch FHD 144Hz"}'::jsonb),
  ('ASUS TUF F16', 'asus-tuf-f16', 'ASUS', 'laptop', 'ASUS TUF F16 — higher-end TUF with stronger GPU.', 'ASUS TUF F16 — higher-end TUF with stronger GPU.', 139990.00, null, 10, 4.5, false, '{"ram": ["16GB", "32GB"], "storage": ["1TB"]}'::jsonb, '[]'::jsonb, '{"processor": "14th Gen, Smartchoice,Intel Core i7 14650HX", "gpu": "NVIDIA RTX 5060-8GB", "ram": "16GB", "storage": "1TB SSD", "display": "16-inch QHD 165Hz"}'::jsonb),
  ('HP Victus 16', 'hp-victus-16', 'HP', 'laptop', 'HP Victus 16 — larger display with improved thermals.', 'HP Victus 16 — larger display with improved thermals.', 89999.00, null, 12, 4.5, false, '{"ram": ["16GB", "32GB"], "storage": ["1TB"]}'::jsonb, '[]'::jsonb, '{"processor": "AMD Ryzen 9-8945HS", "gpu": "NVIDIA 8GB RTX 4060", "ram": "16GB", "storage": "1TB SSD", "display": "16.1-inch FHD 144Hz"}'::jsonb),
  ('HP Victus 15', 'hp-victus-15', 'HP', 'laptop', 'HP Victus 15 — solid mid-range gaming laptop.', 'HP Victus 15 — solid mid-range gaming laptop.', 74999.00, null, 20, 4.5, false, '{"ram": ["8GB", "16GB"], "storage": ["512GB"]}'::jsonb, '[]'::jsonb, '{"processor": "Intel Core i7, 13th Gen-13620H", "gpu": "NVIDIA 6 GB RTX 3050", "ram": "8GB", "storage": "512GB SSD", "display": "15.6-inch FHD 144Hz"}'::jsonb),
  ('Lenovo Legion 5', 'lenovo-legion-5', 'Lenovo', 'laptop', 'Lenovo Legion 5 — powerful gaming with excellent cooling.', 'Lenovo Legion 5 — powerful gaming with excellent cooling.', 129999.00, null, 9, 4.5, false, '{"ram": ["16GB", "32GB"], "storage": ["1TB", "2TB"]}'::jsonb, '[]'::jsonb, '{"processor": "AMD Ryzen 9", "gpu": "NVIDIA RTX 4070", "ram": "16GB", "storage": "1TB SSD", "display": "15.6-inch QHD 165Hz"}'::jsonb),
  ('Lenovo Legion 7', 'lenovo-legion-7', 'Lenovo', 'laptop', 'Lenovo Legion 7 — flagship Legion with top specs.', 'Lenovo Legion 7 — flagship Legion with top specs.', 169999.00, null, 5, 4.5, false, '{"ram": ["32GB"], "storage": ["2TB"]}'::jsonb, '[]'::jsonb, '{"processor": "Intel i9", "gpu": "NVIDIA RTX 4080", "ram": "32GB", "storage": "2TB SSD", "display": "16-inch QHD 240Hz"}'::jsonb),
  ('MacBook M5 13-inch', 'macbook-m5-13-inch', 'Apple', 'laptop', 'MacBook with M5 — top performance for professionals.', 'MacBook with M5 — top performance for professionals.', 129999.00, null, 8, 4.5, true, '{"ram": ["8GB", "16GB"], "storage": ["256GB", "512GB"]}'::jsonb, '[]'::jsonb, '{"processor": "Apple M5", "ram": "8GB", "storage": "256GB SSD", "display": "13.3-inch Liquid Retina", "battery": "Up to 20 hours"}'::jsonb),
  ('MacBook M4 14-inch', 'macbook-m4-14-inch', 'Apple', 'laptop', 'MacBook M4 series — balanced power and portability.', 'MacBook M4 series — balanced power and portability.', 149999.00, null, 6, 4.5, true, '{"ram": ["16GB", "32GB"], "storage": ["512GB", "1TB"]}'::jsonb, '[]'::jsonb, '{"processor": "Apple M4", "ram": "16GB", "storage": "512GB SSD", "display": "14-inch Liquid Retina", "battery": "Up to 18 hours"}'::jsonb),
  ('Silicone Case for iPhone 17 pro', 'silicone-case-for-iphone-17-pro', 'StoreBrand', 'accessory', 'Slim silicone case for iPhone 16 series.', 'Slim silicone case for iPhone 16 series.', 799.00, null, 200, 4.5, false, '{"colors": ["Black", "Blue", "White"]}'::jsonb, '[]'::jsonb, '{"material": "Silicone", "compatibility": "iPhone 16 / 17 / Air", "colors": "Black, Blue, White"}'::jsonb),
  ('True Wireless Earbuds', 'true-wireless-earbuds', 'SoundBrand', 'accessory', 'Wireless earbuds with active noise cancellation.', 'Wireless earbuds with active noise cancellation.', 3999.00, null, 120, 4.5, false, '{"colors": ["Black", "White"]}'::jsonb, '[]'::jsonb, '{"battery": "30 hours (with case)", "features": "ANC, Bluetooth 5.3, Quick Pair"}'::jsonb),
  ('Logitech Lift Vertical Ergonomic Mouse', 'logitech-lift-vertical-ergonomic-mouse', 'Logitech', 'accessory', 'Wireless, Bluetooth or Logi Bolt USB Receiver, Quiet clicks, 4 Buttons, Compatible with Windows/macOS/iPadOS, Laptop, PC - Graphite', 'Wireless, Bluetooth or Logi Bolt USB Receiver, Quiet clicks, 4 Buttons, Compatible with Windows/macOS/iPadOS, Laptop, PC - Graphite', 5495.00, null, 298, 4.5, false, '{"models": ["Graphite"]}'::jsonb, '[]'::jsonb, '{"hardness": "9H", "compatibility": "iPhone 16 / 17 / Air", "features": "Oleophobic coating"}'::jsonb),
  ('Offbeat - Armored premium Laptop 27ltr backapcks series', 'offbeat-armored-premium-laptop-27ltr-backapcks-series', 'offbeat', 'accessory', 'Slim padded laptop sleeve for 13–15 inch laptops.', 'Slim padded laptop sleeve for 13–15 inch laptops.', 1890.00, null, 180, 4.5, false, '{"sizes": ["13-inch", "15-inch"], "colors": ["Grey", "Black"]}'::jsonb, '[]'::jsonb, '{"material": "Neoprene", "sizes": "13-inch, 15-inch", "features": "Water resistant"}'::jsonb),
  ('USB-C to Lightning Cable (1m)', 'usb-c-to-lightning-cable-1m', 'Apple', 'accessory', 'Durable braided USB-C to Lightning cable (1m).', 'Durable braided USB-C to Lightning cable (1m).', 1999.00, null, 350, 4.5, false, '{"lengths": ["1m", "2m"]}'::jsonb, '[]'::jsonb, '{"length": "1m", "compatibility": "iPhone, iPad", "features": "Fast charging support"}'::jsonb),
  ('iPhone FineWoven Wallet with MagSafe Moss', 'iphone-finewoven-wallet-with-magsafe-moss', 'Apple', 'accessory', 'MagSafe compatible wallet for iPhone (holds 3 cards).', 'MagSafe compatible wallet for iPhone (holds 3 cards).', 2499.00, null, 90, 4.5, false, '{"colors": ["Black", "Brown"]}'::jsonb, '[]'::jsonb, '{"material": "Leatherette", "compatibility": "iPhone 12 and later (MagSafe)", "capacity": "3 cards"}'::jsonb),
  ('CMF Phone 2 Pro 5G', 'cmf-phone-2-pro-5g', 'Nothing', 'smartphone', 'Inside, the CMF Phone 2 Pro is powered by the MediaTek Dimensity 7300 Pro 5G chip. It has an 8-core CPU that can go up to 2.5GHz, making it 10% faster than the CMF Phone 1. The graphics performance is also 5% better, which should help with gaming and everyday use.', 'Inside, the CMF Phone 2 Pro is powered by the MediaTek Dimensity 7300 Pro 5G chip. It has an 8-core CPU that can go up to 2.5GHz, making it 10% faster than the CMF Phone 1. The graphics performance is also 5% better, which should help with gaming and everyday use.', 19499.00, null, 49, 4.5, false, '{"ram": ["128gb", "256gb"], "colors": ["Orange", "Black", "White", "Light green"]}'::jsonb, '[]'::jsonb, '{"Brand": "CMF BY NOTHING", "Operating System": "Android 15", "RAM Memory Installed Size": "8 GB", "Connectivity technologies": "Bluetooth, NFC, USB, Wi-Fi"}'::jsonb),
  ('Nothing Headphone(1) 42dB ANC', 'nothing-headphone1-42db-anc', 'Nothing', 'accessory', 'Clear and Rich Sound
This Headphone (1) features a meticulously engineered 40 mm dynamic driver paired with a high-linearity suspension system and 8.9 mm PU surround for exceptional sound performance. The nickel-plated coating minimises distortion, delivering clear high frequencies and depth in the bass. The diaphragm, rim, and dome are balanced to be lightweight yet rigid, allowing enhanced response times and minimising unwanted vibrations. This results in consistent and precise sound reproduction. The advanced PU surround in this Headphone (1) is engineered for efficient sound delivery and vivid bass. It moves more effectively, producing deeper, richer tones in the low frequencies. Its 8.9 mm width exceeds industry norms, minimising sound distortion and keeping the driver stable for precise vibrations, for clear vocals, vibrant mids, and an overall immersive sound.', 'Clear and Rich Sound
This Headphone (1) features a meticulously engineered 40 mm dynamic driver paired with a high-linearity suspension system and 8.9 mm PU surround for exceptional sound performance. The nickel-plated coating minimises distortion, delivering clear high frequencies and depth in the bass. The diaphragm, rim, and dome are balanced to be lightweight yet rigid, allowing enhanced response times and minimising unwanted vibrations. This results in consistent and precise sound reproduction. The advanced PU surround in this Headphone (1) is engineered for efficient sound delivery and vivid bass. It moves more effectively, producing deeper, richer tones in the low frequencies. Its 8.9 mm width exceeds industry norms, minimising sound distortion and keeping the driver stable for precise vibrations, for clear vocals, vibrant mids, and an overall immersive sound.', 19999.00, null, 39, 4.5, false, '{}'::jsonb, '[]'::jsonb, '{"Battery": "Up to 80 hours of playback", "Collab With": "Sound by KEF", "Working ANC": "Real-time adaptive ANC"}'::jsonb),
  ('Nothing Ear 2024', 'nothing-ear-2024', 'Nothing', 'accessory', 'We''ve mastered sound, and now you can too. Nothing Ear delivers our best-ever audio experience, giving you complete control of your sound in high fidelity. Bringing you closer to the artist, wherever you are.', 'We''ve mastered sound, and now you can too. Nothing Ear delivers our best-ever audio experience, giving you complete control of your sound in high fidelity. Bringing you closer to the artist, wherever you are.', 8499.00, null, 42, 4.5, false, '{}'::jsonb, '[]'::jsonb, '{"Battery": "40.5 h battery 24-bit Hi-Res Audio", "Sound": "24 bit Hi-Res Audio with LDAC & LHDC for the ultimate sound experience", "Noise": "45 dB active noise cancellation"}'::jsonb),
  ('Nothing Phone 4a 5G', 'nothing-phone-4a-5g-1774337062366', 'Nothing', 'smartphone', 'dsc', 'dsc', 31999.00, null, 10, 4.5, false, '{"ram": ["8GB", "12GB"], "storage": ["128GB", "256GB"], "colors": ["Pink", "White", "Blue", "Black"]}'::jsonb, '[]'::jsonb, '{"Display": "17.22 cm (6.78 inch) AMOLED Display", "Processor": "Qualcomm Snapdragon 7s Gen 4 Octa-Core Processor", "Operating System": "Android 16 (Nothing OS)", "Camera": "50 MP + 50 MP + 8 MP Rear Camera / 32 MP Front Camera", "Battery": "5400 mAh Battery with Fast Charging Support", "Highlights": "Glyph Bar, Transparent Design, In-Display Fingerprint Sensor, 5G Connectivity"}'::jsonb),
  ('Nothing Phone 4a Pro 5G', 'nothing-phone-4a-pro-5g-1774341431105', 'Nothing', 'smartphone', 'Qualcomm Snapdragon 7 Gen 4 | 5400 mAh Battery | Glyph Interface (Black)', 'Qualcomm Snapdragon 7 Gen 4 | 5400 mAh Battery | Glyph Interface (Black)', 39999.00, null, 10, 4.5, false, '{"colors": ["White", "Black", "Pink"], "ram": ["8GB", "12GB"]}'::jsonb, '[]'::jsonb, '{}'::jsonb),
  ('Phone ( 3a ) Community Edition', 'phone-3a-community-edition-1774352880710', 'Nothing Community', 'smartphone', 'A collaborative celebration of community and creativity.', 'A collaborative celebration of community and creativity.', 42000.00, null, 5, 4.5, false, '{"ram": ["12GB"], "storage": ["256GB"]}'::jsonb, '[]'::jsonb, '{}'::jsonb),
  ('MacBook Neo', 'macbook-neo-1774353396159', 'Apple', 'laptop', '13″ Laptop with A18 Pro chip: Built for AI and Apple Intelligence, Liquid Retina Display, 8GB Unified Memory, 256GB SSD Storage, 1080p FaceTime HD Camera; Citrus', '13″ Laptop with A18 Pro chip: Built for AI and Apple Intelligence, Liquid Retina Display, 8GB Unified Memory, 256GB SSD Storage, 1080p FaceTime HD Camera; Citrus', 69000.00, null, 21, 4.5, false, '{"storage": ["256GB", "512GB"], "colors": ["4", "Citrus", "Deep Blue", "Pink", "Silver"]}'::jsonb, '[]'::jsonb, '{}'::jsonb),
  ('Pixel 10', 'pixel-10-1774357096227', 'Google', 'smartphone', 'The power of Gemini, supercharged on Pixel.
Pixel phones have Gemini built in to help you do more, faster, and easier. Enabled by our next-gen chip, Google Tensor G5, it’s the extraordinary AI assistant for all things you.1', 'The power of Gemini, supercharged on Pixel.
Pixel phones have Gemini built in to help you do more, faster, and easier. Enabled by our next-gen chip, Google Tensor G5, it’s the extraordinary AI assistant for all things you.1', 74000.00, null, 20, 4.5, false, '{"colors": ["Blue", "Lemon", "mist blue", "Black"], "ram": ["12GB"], "storage": ["256GB"]}'::jsonb, '[]'::jsonb, '{}'::jsonb),
  ('Pixel 10 Pro & Pro XL', 'pixel-10-pro-pro-xl-1774357644813', 'Google', 'smartphone', 'Next-gen chip for the ultimateAI experience on a phone.
The new Google Tensor G5 chip is Pixel’s biggest leap in performance yet. It''s custom built with a TPU that’s up to 60% more powerful and a CPU that’s on average 34% faster for Google’s most advanced AI and performance.22 It also delivers Pixel’s highest-quality photos and videos with an upgraded ISP.', 'Next-gen chip for the ultimateAI experience on a phone.
The new Google Tensor G5 chip is Pixel’s biggest leap in performance yet. It''s custom built with a TPU that’s up to 60% more powerful and a CPU that’s on average 34% faster for Google’s most advanced AI and performance.22 It also delivers Pixel’s highest-quality photos and videos with an upgraded ISP.', 109999.00, null, 10, 4.5, false, '{"storage": ["256GB", "512GB", "1TB"], "ram": ["16GB"], "colors": ["Lemon", "Gray", "Light Gold", "Black"]}'::jsonb, '[]'::jsonb, '{}'::jsonb),
  ('AirPods Max 2', 'airpods-max-2-1774365775475', 'Apple', 'accessory', 'Superior sound down to a science.
Transformed by the H2 chip, AirPods Max 2 deliver more stunningly detailed, high‑fidelity audio. A new high-dynamic-range amplifier adds even more headroom used by the custom‑built driver to reveal richer bass, more natural vocals and precise instrument localisation across a wider soundstage.', 'Superior sound down to a science.
Transformed by the H2 chip, AirPods Max 2 deliver more stunningly detailed, high‑fidelity audio. A new high-dynamic-range amplifier adds even more headroom used by the custom‑built driver to reveal richer bass, more natural vocals and precise instrument localisation across a wider soundstage.', 67900.00, null, 15, 4.5, false, '{"colors": ["Black", "Light Gold", "Teal", "Lavender"]}'::jsonb, '[]'::jsonb, '{}'::jsonb);

-- =========================================================
-- Insert Product Images
-- =========================================================

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-17pro-202509?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=WVVFRzUzVk1oblJhbW9PbGNSU25jaUtlSkZ1cHdCU1J4ZWZjamdoYzhpRkMxQXc4S3pBZE5lUDJlTzVYSUYydFMwV0hhcmdVdXZzZ1NwTlFUaEgwTDc0akx0V0lSSVRoL2tPb3ZabW5DM0k', true, 0 from products where slug = 'iphone-17-pro';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17pro-digitalmat-gallery-3-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=ekJPc2lPUlRuRk50SkcyOVdnU1d0TjFla0N0Znl3UThxdjB3SW91ZDVJeGNmQmJPaDM2aGx4aDFNbXhCczNyV28xUkhYejcxalRvY0FPQVpMcmoxMDlLQzdVZ2V3VnpqcXFKTGxlK1dFUXhxRHVRU1Y3V3BkbTR4MkxPZTk5REQ', false, 1 from products where slug = 'iphone-17-pro';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17pro-digitalmat-gallery-5-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=ekJPc2lPUlRuRk50SkcyOVdnU1d0TjFla0N0Znl3UThxdjB3SW91ZDVJeG1hWkZ6UHNRSXhlQnZJMURpUmV1QW8xUkhYejcxalRvY0FPQVpMcmoxMDlLQzdVZ2V3VnpqcXFKTGxlK1dFUXpucGszV1kvUjNNUmdVQ1lGWXlTekY', false, 2 from products where slug = 'iphone-17-pro';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17pro-digitalmat-gallery-4-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=ekJPc2lPUlRuRk50SkcyOVdnU1d0TjFla0N0Znl3UThxdjB3SW91ZDVJeW44a2VheUNSOWt5dkdpV3ArUU1HZG8xUkhYejcxalRvY0FPQVpMcmoxMDlLQzdVZ2V3VnpqcXFKTGxlK1dFUXkvQ2svUmdCYndZbnB5SWh3WFZNNWk', false, 3 from products where slug = 'iphone-17-pro';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17pro-digitalmat-gallery-2-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=ekJPc2lPUlRuRk50SkcyOVdnU1d0TjFla0N0Znl3UThxdjB3SW91ZDVJempueExUTkVtdVNxK2VpSU1Ja0hLVm8xUkhYejcxalRvY0FPQVpMcmoxMDlLQzdVZ2V3VnpqcXFKTGxlK1dFUXl3WUo3NEhENThaODkzU2xiZzlIRjY', false, 4 from products where slug = 'iphone-17-pro';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17pro-digitalmat-gallery-6-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=ekJPc2lPUlRuRk50SkcyOVdnU1d0TjFla0N0Znl3UThxdjB3SW91ZDVJekUvTEM4WjJGZEN4em41Q2lvalVzaG8xUkhYejcxalRvY0FPQVpMcmoxMDlLQzdVZ2V3VnpqcXFKTGxlK1dFUXo4ZlI3QkpWSVN2MGtZNno5SVhENkg', false, 5 from products where slug = 'iphone-17-pro';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-digitalmat-gallery-3-202509_GEO_EMEA?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=SVhTK013TmU5bXcxZm9yb0hnWkxGU0JYMGNRelI2WXAyb0IycFNGSFF5QXlNUWtzZldTWFRVcW9XNGZ1blhXOWVkZGptNUJaWitJZ3gyOURkSTlZQ3VCc3FjamJwVXJjd2U3WEc3Smc2MXpkZWxUbVcrZTZlY2ZZSjRZQ2QyaW1mbW94YnYxc1YvNXZ4emJGL0IxNFp3', true, 0 from products where slug = 'iphone-17';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-unselect-gallery-1-202509_GEO_EMEA?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxdFgrSXpWVEhWaW9YTGlWRHFoSHU0OGVVRGcwVkxmNk9rdGtMbGV1WEU3aHNCckZqMTMrS3dIUWFPL2dFWXJDTmhNQnJMcnc4RkxJd3ZMc3hKZVVFWHUxNjR2WDVZSE9wdmlwTk5JUnpsUEZyYW1LQys4QTB0dktyalpuNkJlVVN3&traceId=1', false, 1 from products where slug = 'iphone-17';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-digitalmat-gallery-2-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=SVhTK013TmU5bXcxZm9yb0hnWkxGZHp0bzhwRTZxYVNNMnVRTXVpMUZES0U5aWg1WE9Xd3BOSWtnNzkvSWZLd0ZGMGUwb1Y3aUJoOFNtZnEvQXJFMEJYVzFZSG9ORXhsSkhTN0hjejcrL012STE2N3lLaGN2TEw1SWFFVXhJdG8', false, 2 from products where slug = 'iphone-17';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-digitalmat-gallery-4-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=SVhTK013TmU5bXcxZm9yb0hnWkxGV01QRDErVGRSejdiZElhV1JWdUVLeUU5aWg1WE9Xd3BOSWtnNzkvSWZLd0ZGMGUwb1Y3aUJoOFNtZnEvQXJFMEJYVzFZSG9ORXhsSkhTN0hjejcrL1ArTXlFTTV6c1Ayd1o2ZkVhV1JhK0U', false, 3 from products where slug = 'iphone-17';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-digitalmat-gallery-5-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=SVhTK013TmU5bXcxZm9yb0hnWkxGUjZZYjZUb0RCWElvSXlYUWhuREtTeUU5aWg1WE9Xd3BOSWtnNzkvSWZLd0ZGMGUwb1Y3aUJoOFNtZnEvQXJFMEJYVzFZSG9ORXhsSkhTN0hjejcrL012STE2N3lLaGN2TEw1SWFFVXhJdG8', false, 4 from products where slug = 'iphone-17';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-digitalmat-gallery-6-202509?wid=728&hei=666&fmt=jpeg&qlt=90&.v=SVhTK013TmU5bXcxZm9yb0hnWkxGYnFKc2ptWjJYakpPRXdPVUNzTGpNT0U5aWg1WE9Xd3BOSWtnNzkvSWZLd1l1V3dXQmdJWnFRbkcraVFaYnkzVFk1WkdmSmlSUHRjbjg3K3JzSXZQSU81aWdqNHVwcUtlVHFoZ0JJaFYvWUs', false, 5 from products where slug = 'iphone-17';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17pro-digitalmat-gallery-5-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=ekJPc2lPUlRuRk50SkcyOVdnU1d0TjFla0N0Znl3UThxdjB3SW91ZDVJeG1hWkZ6UHNRSXhlQnZJMURpUmV1QW8xUkhYejcxalRvY0FPQVpMcmoxMDlLQzdVZ2V3VnpqcXFKTGxlK1dFUXpucGszV1kvUjNNUmdVQ1lGWXlTekY', true, 0 from products where slug = 'iphone-17-pro-max';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17promax-digitalmat-gallery-2-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=WkVhZXB4WmFzZmdNeXA3cHg3WUZFU0tjazZmSzdrSHdxTW9VUlF0akdCdVNDb201c3lKa2NEYURnZ1VuSk5xQXpGbHdxTU5oSkkwKzZZOXF0cVNPL1V0RmgycTRGTHI3SUVxVFVFNFI5Qyt6aitNLzYzbUlaaklNYXhYUEpnVXU', false, 1 from products where slug = 'iphone-17-pro-max';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17promax-digitalmat-gallery-1-202509_GEO_EMEA?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=WkVhZXB4WmFzZmdNeXA3cHg3WUZFU0tjazZmSzdrSHdxTW9VUlF0akdCdTZhTHJkRit4dmNvT3JoY0NOUVJTRitzMU1qbXEvNjlBN1VxbHRaS1dQS2NQOWxuYmZSN0NKOEpIS2RzTDlRVVFUd2h0eWVsVXNFSXNxYyt3ZEFEVStKTjNIVGtvY0IzalVQV0ZqbHBCUjZR', false, 2 from products where slug = 'iphone-17-pro-max';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17promax-digitalmat-gallery-3-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=WkVhZXB4WmFzZmdNeXA3cHg3WUZFU0tjazZmSzdrSHdxTW9VUlF0akdCc2hJek5jUXlGL2hrRE9PQW1MczdvOXpGbHdxTU5oSkkwKzZZOXF0cVNPL1V0RmgycTRGTHI3SUVxVFVFNFI5Qy9MaS85TmIwRFdiWE5HcWJteWMrRGQ', false, 3 from products where slug = 'iphone-17-pro-max';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-silver_AV3?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RVRqUkJqUGFyN1pGMnlaV3JkWU9jdmdrZ1hLRVJweE1Ld0hrelZYQUxRVWZQWFVaUmg1QWFsTVJFWjd1RElva2hnM0hWZ2pCcFpSZTVSV1k3SjhURDRMaElvNnRvQmpNZTUweTNnQlFCT1B3&traceId=1', false, 4 from products where slug = 'iphone-17-pro-max';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-deepblue_AV3?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RWhhOHJGRUNHdlh6a3VuZVVqdnNrNVJ2dnZ6eHdCQ0dUd3RuYU1ZcENUSHdDb1F2RTNvUEVHRkpGaGtOSVFHak5NTEhXRE11VU1QNVo2eDJsWlpuWHQ1V3E2amljcVUyYTdYMlk2dDNTTllR&traceId=1', false, 5 from products where slug = 'iphone-17-pro-max';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-17air-202509?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=WVVFRzUzVk1oblJhbW9PbGNSU25jci9mUU0zMkc5ekxlZHFEM05NWkp3NUMxQXc4S3pBZE5lUDJlTzVYSUYydFMwV0hhcmdVdXZzZ1NwTlFUaEgwTCtUZHJHS0dDSWYyeUtQd0tjOERiaFE', true, 0 from products where slug = 'iphone-air';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-digitalmat-gallery-1-202509_GEO_EMEA?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=cjBEZlU5bVdKZEVBTk45K09QMzAwRzYrc3EwZ1VoVGgyY0J1bS9COCtuZ1lMQnk0NlU1Q0YrZ2hIbjFrUkVtaGQ5S3Q4dnBGQmd2K0NENXJLTFNwNzhmSGN3NTUxbDRHZDZXK1V3b1o4a1MzQ2RtWllHVXFBTG9GU1VuVXUrcFpGQlRRRytmTHd2bTlDU2RZMUtqVTRR', false, 1 from products where slug = 'iphone-air';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-digitalmat-gallery-2-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=cjBEZlU5bVdKZEVBTk45K09QMzAwT1BCRHJhQ0hmOWpiYTg5dm5FQWI3dHZibThWRUlEV2tlZ2JSNmpmUlp1TlFuOTJXc2JVdks4czlZWHJTOHkzNkg4SnkwY0diclR3aWNnek5QTEFaZFJOWDUzbkRhQW1IMmtSeU8zS2hzSWE', false, 2 from products where slug = 'iphone-air';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-digitalmat-gallery-3-202509_GEO_EMEA?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=cjBEZlU5bVdKZEVBTk45K09QMzAwTjJ1T24yemhudm9NaWo1cUl6SVN6RVlMQnk0NlU1Q0YrZ2hIbjFrUkVtaGQ5S3Q4dnBGQmd2K0NENXJLTFNwNzhmSGN3NTUxbDRHZDZXK1V3b1o4a1FHTkhMY1JTVVlSYVMxTGw2ZWJDT3hka0xmckVNVTBkS20yTzkwa0dhU09n', false, 3 from products where slug = 'iphone-air';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-digitalmat-gallery-4-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=cjBEZlU5bVdKZEVBTk45K09QMzAwQ29tZGFRcVl5Vm12RlEvdm1xNU1vdHZibThWRUlEV2tlZ2JSNmpmUlp1TlFuOTJXc2JVdks4czlZWHJTOHkzNkg4SnkwY0diclR3aWNnek5QTEFaZFQ0SUJEdG9iY1h3NUYwNDNqMUY3YXo', false, 4 from products where slug = 'iphone-air';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-digitalmat-gallery-5-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=cjBEZlU5bVdKZEVBTk45K09QMzAwR015UmNzenFKUHB0bGtqQUxXNExEVnZibThWRUlEV2tlZ2JSNmpmUlp1TlFuOTJXc2JVdks4czlZWHJTOHkzNkg4SnkwY0diclR3aWNnek5QTEFaZFRUdFBEQ2lzRUQ0Yk4rVVZQOGJ6ZHA', false, 5 from products where slug = 'iphone-air';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-digitalmat-gallery-6-202509?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=cjBEZlU5bVdKZEVBTk45K09QMzAwQWlINEF4cWpiTXVBQzlOalN3V1o1WnZibThWRUlEV2tlZ2JSNmpmUlp1TlFuOTJXc2JVdks4czlZWHJTOHkzNkg4SnkwY0diclR3aWNnek5QTEFaZFFOVHhaMzM2dnpoZnlQV2FXblJuN3A', false, 6 from products where slug = 'iphone-air';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/o/l/2/-original-imahgfmzvanpgncf.jpeg?q=90', true, 0 from products where slug = 'iphone-16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/g/l/q/-original-imahgfmzdbnzzjjg.jpeg?q=90', false, 1 from products where slug = 'iphone-16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/c/v/v/-original-imahgfmypevfehpc.jpeg?q=90', false, 2 from products where slug = 'iphone-16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/h/u/i/-original-imahgfmyczqxhtm2.jpeg?q=90', false, 3 from products where slug = 'iphone-16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/n/q/h/-original-imahgfmzjj8gtqbc.jpeg?q=90', false, 4 from products where slug = 'iphone-16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/d/o/r/-original-imahfvx3ywpmyexy.jpeg?q=90', false, 5 from products where slug = 'iphone-16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/r/z/s/-original-imahfvx3gkzzpjud.jpeg?q=90', false, 6 from products where slug = 'iphone-16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/t/u/o/-original-imahfvx39gh3ddzy.jpeg?q=90', false, 7 from products where slug = 'iphone-16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0012_Phone-3-black.png?v=1753757353', true, 0 from products where slug = 'nothing-phone-3';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0011_Phone-3-white.png?v=1753757325', false, 1 from products where slug = 'nothing-phone-3';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0009_Phone-3a-Pro-grey.png?v=1753435871', true, 0 from products where slug = 'nothing-phone-3a-pro';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0010_Phone-3a-Pro-black.png?v=1753757371', false, 1 from products where slug = 'nothing-phone-3a-pro';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0004_Phone-3a-white.png?v=1753436094', true, 0 from products where slug = 'nothing-phone-3a';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Arc1352x1352-Black-Glyphon_4677e90c-2628-407c-b286-e6b96238dedf.png?v=1740649954', false, 1 from products where slug = 'nothing-phone-3a';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/becdad013a788bc6f8d8fbdc8a6314c3349409bb-1316x1645.jpg?auto=format', false, 2 from products where slug = 'nothing-phone-3a';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/0df691b675e706bd67f87ee850de3838462cd1bf-864x862.jpg?auto=format', false, 3 from products where slug = 'nothing-phone-3a';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/83d3ab4062686b5ad48285af7ea6f007293642d0-400x400.jpg?auto=format', false, 4 from products where slug = 'nothing-phone-3a';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/2e27c9b97e5643f36b5f3b36621961740be27653-3000x1877.jpg?auto=format', false, 5 from products where slug = 'nothing-phone-3a';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/0565a4337e05847e87ea5a8e6f9192c553fe2b63-400x400.jpg?auto=format', false, 6 from products where slug = 'nothing-phone-3a';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSLfr7dY8I9aMS-7SSNvK0xtd8WZ-kCHCrr5IngrcsZJs50rI2yovBCbVsx6LdtfHHYfgBeppbNAkvpy968JqFSgLHQeTTUK8zDd5491mKCev6gQBgveo7I', true, 0 from products where slug = 'acer-nitro-v15-2025';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQzKkDkta9raFHZk1l6fF0qD7XJ0i3O5-M-7EUIxue81CRJyDUJ3oXHQdmCpc_eiU8lGXf_xcJj2Nu8fgnvxJZqs3tfJuzbRSzWXkzO5kfqVMQuMmnMDam0eQ', true, 0 from products where slug = 'acer-nitro-v16-2025';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://static-ecapac.acer.com/media/catalog/product/n/i/nitro_base_image_i5_un.366si.006.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=500&width=500&canvas=500:500', true, 0 from products where slug = 'acer-nitro-v16-lite';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://m.media-amazon.com/images/I/81f7dTXcl4L.jpg', true, 0 from products where slug = 'lenovo-loq-3-high-rtx-4080';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://m.media-amazon.com/images/I/81AFuufzY-L.jpg', true, 0 from products where slug = 'lenovo-loq-3-high-rtx-4070';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://m.media-amazon.com/images/I/81esbxfsMlL._SX679_.jpg', true, 0 from products where slug = 'asus-tuf-gaming-f16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://m.media-amazon.com/images/I/81+DaZP4aSL._SX679_.jpg', true, 0 from products where slug = 'asus-tuf-a15';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://m.media-amazon.com/images/I/81uhoF43yAL._SX679_.jpg', true, 0 from products where slug = 'asus-tuf-f16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://m.media-amazon.com/images/I/41-Fy0V3XZL._SY300_SX300_QL70_FMwebp_.jpg', true, 0 from products where slug = 'hp-victus-16';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://m.media-amazon.com/images/I/71yAQOj0FTL._SX679_.jpg', true, 0 from products where slug = 'hp-victus-15';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQmDh-P-LjJMDwMEhQYWe5hw-aPLpN1CtNc4uD63s3VAULe5p-o_qdqHzw5r_EvobgQZnvkipKSiavaszC7SVCXwITtjkuOoPz_4Txlex8eKoU0GYbpLifocMzGD4KN&usqp=CAc', true, 0 from products where slug = 'lenovo-legion-5';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRzE-LF68BIl_IKwC4pj_xwi6nVO2S8KV0WeQCm0np75W-uiJMZqdZocYnnG68T2eDDWKlwxyOYMxbmjpcA6YtvTJZRV4gNAhR4YqNlUkOQiwq8D1OM9JJ1', true, 0 from products where slug = 'lenovo-legion-7';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/assets-www/en_WW/mac/01_product_tile/xlarge/mbp_14_16_b933a4e71_2x.jpg', true, 0 from products where slug = 'macbook-m5-13-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/macbook-pro/av/images/overview/performance/performance_mx_chip_startframe__bfgs77zni2sy_large_2x.jpg', false, 1 from products where slug = 'macbook-m5-13-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/macbook-pro/av/images/overview/artificial-intelligence/ai_features_endframe__fr82kdy8eeem_large.jpg', false, 2 from products where slug = 'macbook-m5-13-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/macbook-pro/av/images/overview/welcome/hero_endframe__e4ls9pihykya_xlarge_2x.jpg', false, 3 from products where slug = 'macbook-m5-13-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/assets-www/en_WW/mac/01_product_tile/xlarge/mba_13_15_140e630d3_2x.jpg', true, 0 from products where slug = 'macbook-m4-14-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-m4-skyblue-gallery1-202503?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=dFJNbHJtN3hkZlFORmN2VUlkWnZyRXYwRGVrS3RUdEhkRUtkS2E1aGdYZmd1eUJ6eHZMSFFNMld6aTRncXNRUlJWYlIvRkkxemNIb09FY29ZRmVrUDV4ZVYvN2VacDZmMzVpdWVtV014N1RyMTdVV05yRXMxSlVPemtESDIwNVE', false, 1 from products where slug = 'macbook-m4-14-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-m4-skyblue-gallery2-202503?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=dFJNbHJtN3hkZlFORmN2VUlkWnZySHB1eEZuT0djdFIvaGtSV0tRQ3lXcmd1eUJ6eHZMSFFNMld6aTRncXNRUlJWYlIvRkkxemNIb09FY29ZRmVrUDVRZFpWRGhqRDhIZHNORWNaTWxnaCtycDU0Zm9tS1NLYWZhaWJKS1VJSUo', false, 2 from products where slug = 'macbook-m4-14-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-m4-skyblue-gallery3-202503?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=dFJNbHJtN3hkZlFORmN2VUlkWnZyTjlvU0tjcXRFSTRCQmxWYlhhckRTN2d1eUJ6eHZMSFFNMld6aTRncXNRUlJWYlIvRkkxemNIb09FY29ZRmVrUHpEdmdxeCtvQXIySWpQWVFFTEVIUit0cWcyZmNzMEx0dHVPQ21kOTEvcTQ', false, 3 from products where slug = 'macbook-m4-14-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-m4-skyblue-gallery4-202503?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=dFJNbHJtN3hkZlFORmN2VUlkWnZyS090QVV3bTNqT2lCUW11ak84QUNXUGd1eUJ6eHZMSFFNMld6aTRncXNRUlJWYlIvRkkxemNIb09FY29ZRmVrUDk3b3A2MTZjVElvS05OR0xlT2MraklnbVJYM29hTEY2aG9Va0ptMTVFdnI', false, 4 from products where slug = 'macbook-m4-14-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-m4-gallery7-202503?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=TkdkdTYvZmdKUlhJb2I0VXBWbFVFY3VoMUZNNDRVL2pzWmc0SVRMZjBwQXBFd2F2YlBVdmtrWUs2bExmOEpiQ2dsbGZlRHV0Q3JlbHJxWXRlWjZpMnA2UjRCeUZ1cmNrQmUvQ1hmTmlERzA', false, 5 from products where slug = 'macbook-m4-14-inch';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MGF64?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=S0R5bjkzbTk4d0FPVGtMK2hQZUdVZ2tuVHYzMERCZURia3c5SzJFOTlPZ3JTRTZ5Yi94UDBnUUhiU2ZvQ2ZITkxhdEF2Qnk0U2VobnRLanVtaVJ5THc', true, 0 from products where slug = 'silicone-case-for-iphone-17-pro';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0069_CMF-Buds-Pro-2-case-orange.png?v=1753437680', true, 0 from products where slug = 'true-wireless-earbuds';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://m.media-amazon.com/images/I/61OkuiCWbDL._SX679_.jpg', true, 0 from products where slug = 'logitech-lift-vertical-ergonomic-mouse';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://m.media-amazon.com/images/I/61CnZjeZGgL._SX679_.jpg', true, 0 from products where slug = 'offbeat-armored-premium-laptop-27ltr-backapcks-series';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MU2G3_AV1?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=ejdRTlJjUmp1dHRXbG9mdkF0dmJpRlZya2lKWlJmUEwrYndWOTJiVWJWQUYwVmtIbGRkS25RMVpBRlo0bk5DUVo0R3pnVmdwR2k3OGlKTzYyNVpEbFE', true, 0 from products where slug = 'usb-c-to-lightning-cable-1m';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MGH74_AV4?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=aXg0N3ppSVJKcTF1eHV1dU5tVjNEU1RkTXNZOFJZTitTVFE0NHl0VW5Cb0YwVmtIbGRkS25RMVpBRlo0bk5DUUdBT1NodzZZMVZMR3o5cWtzVUVud3c', true, 0 from products where slug = 'iphone-finewoven-wallet-with-magsafe-moss';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MGH74?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=QWVQRnQzSTQvSSthZ0FrN0hIaDFaZ2tuVHYzMERCZURia3c5SzJFOTlPaWc2VXhiaHNBT1NtRnhyVHFkMm1SKzd2U2F3ZkUrYkNLNElnendiZnh3THc', false, 1 from products where slug = 'iphone-finewoven-wallet-with-magsafe-moss';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0054_CMF-Phone-2-Pro-Orange.png?v=1753757344', true, 0 from products where slug = 'cmf-phone-2-pro-5g';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0058_CMF-Phone-2-Pro-black.png?v=1753757371', false, 1 from products where slug = 'cmf-phone-2-pro-5g';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0055_CMF-Phone-2-Pro-lightgrey.png?v=1753757347', false, 2 from products where slug = 'cmf-phone-2-pro-5g';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0056_CMF-Phone-2-Pro-Lightgreen.png?v=1753757364', false, 3 from products where slug = 'cmf-phone-2-pro-5g';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0021_Headphone1-white.png?v=1753757251', true, 0 from products where slug = 'nothing-headphone1-42db-anc';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/c45d469722841bcffddc4bb2520582f0e6c414d8-864x864.jpg?auto=format', false, 1 from products where slug = 'nothing-headphone1-42db-anc';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/c05efb71ebf47b15989185802054b726c0b74edf-864x864.jpg?auto=format', false, 2 from products where slug = 'nothing-headphone1-42db-anc';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://image.mux.com/d2SMbGKYhLtjbtiBoNI8jbdZRcszD017dblEwqljLC014/thumbnail.webp', false, 3 from products where slug = 'nothing-headphone1-42db-anc';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0024_Ear-black.png?v=1753757359&width=600&height=600&crop=center', true, 0 from products where slug = 'nothing-ear-2024';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0023_Ear-white.png?v=1753757347&width=600&height=600&crop=center', false, 1 from products where slug = 'nothing-ear-2024';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/892ca1fee54f0c221d55289e8072c84df0537aa2-396x396.jpg?auto=format', false, 2 from products where slug = 'nothing-ear-2024';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/BA_360_ENTEI_030_blackBud_rgb_00_4fdaba7c-5568-4db0-aaa5-5129d524d8bd.png?v=1713169144', false, 3 from products where slug = 'nothing-ear-2024';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Phone-4a-Pink.png?v=1772251226', true, 0 from products where slug = 'nothing-phone-4a-5g-1774337062366';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Phone-4a-White.png?v=1772251226', false, 1 from products where slug = 'nothing-phone-4a-5g-1774337062366';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Phone-4a-Blue.png?v=1772251226', false, 2 from products where slug = 'nothing-phone-4a-5g-1774337062366';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Phone-4a-Black.png?v=1772251226', false, 3 from products where slug = 'nothing-phone-4a-5g-1774337062366';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/w/s/r/-original-imahh7x7jkxraxfg.jpeg?q=90', false, 4 from products where slug = 'nothing-phone-4a-5g-1774337062366';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/h/r/e/-original-imahh7x7zafczyrp.jpeg?q=90', false, 5 from products where slug = 'nothing-phone-4a-5g-1774337062366';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/mobile/t/j/f/-original-imahh7x7e2f5wbyw.jpeg?q=90', false, 6 from products where slug = 'nothing-phone-4a-5g-1774337062366';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Phone-4a-Pro-White.png?v=1772251228', true, 0 from products where slug = 'nothing-phone-4a-pro-5g-1774341431105';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Phone-4a-Pro-Black.png?v=1772251228', false, 1 from products where slug = 'nothing-phone-4a-pro-5g-1774341431105';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Phone-4a-Pro-Pink.png?v=1772251228', false, 2 from products where slug = 'nothing-phone-4a-pro-5g-1774341431105';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.shopify.com/s/files/1/0586/3270/0077/files/Primary-Phone-3a-Community-Editon.png?v=1764905578', true, 0 from products where slug = 'phone-3a-community-edition-1774352880710';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/0a2270698227bfdc24eaa3d70f4c30ae97445315-552x552.jpg?auto=format', false, 1 from products where slug = 'phone-3a-community-edition-1774352880710';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://cdn.sanity.io/images/gtd4w1cq/production/1779eceb137927118428234af692435dd045dc7b-552x552.jpg?auto=format', false, 2 from products where slug = 'phone-3a-community-edition-1774352880710';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-neo-color-unselect-202603-gallery-1?wid=5120&hei=3280&fmt=webp&qlt=90&.v=TytZbDBUUnRqRElRcFlBSHpmZVVDK3BoR2lIdGdhMDNQSUZrOHIycWd6Vmd1bjBBbHBBMFNjNjVIN0pUcUg2U0tZMGFKbG9yanhQdjZDS1dZUFFhRVE4bm1RcmlWRWp2eDN1WHNkSjNmUmFub3B6RFdCcnJtSHE1TzBCb3pCcis&traceId=1', true, 0 from products where slug = 'macbook-neo-1774353396159';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-neo-color-select-202603-citrus?wid=5120&hei=3280&fmt=webp&qlt=90&.v=TytZbDBUUnRqRElRcFlBSHpmZVVDNFdhaFd1bmVlZEFaaDd5ZjhzZmNGanBDNVRWUi9VODI0cmtDTHVBWWcxQ1NpWFhQQ1I0WVI5WjBkZjUvejV2QlNoZWpHdXpsK0owWUFtZzZCNmNiVHgzd29KOHZNUm00R0YvelN0WmhxUWY&traceId=1', false, 1 from products where slug = 'macbook-neo-1774353396159';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-neo-color-select-202603-indigo?wid=5120&hei=3280&fmt=webp&qlt=90&.v=TytZbDBUUnRqRElRcFlBSHpmZVVDNFdhaFd1bmVlZEFaaDd5ZjhzZmNGaHRKR2NLSndGNTNZcDVqTWZTTjVHa1NpWFhQQ1I0WVI5WjBkZjUvejV2QlNoZWpHdXpsK0owWUFtZzZCNmNiVHdxQWpnMkppejJoUjdMNjR5bHZrUlU&traceId=1', false, 2 from products where slug = 'macbook-neo-1774353396159';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-neo-color-select-202603-blush?wid=5120&hei=3280&fmt=webp&qlt=90&.v=TytZbDBUUnRqRElRcFlBSHpmZVVDNFdhaFd1bmVlZEFaaDd5ZjhzZmNGaTJXcGV0S1RvcFFEZ3lwQkF6ZjJpUGllL1JtdmgzcGVIUDRDUVJnTDZxRjN2TUJEekVlZHpBZVEwZnY0SVpRaUFSYk9JNHJaUWt3Zm9IL2hlOVhoTGs&traceId=1', false, 3 from products where slug = 'macbook-neo-1774353396159';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-neo-color-select-202603-silver?wid=5120&hei=3280&fmt=webp&qlt=90&.v=TytZbDBUUnRqRElRcFlBSHpmZVVDNFdhaFd1bmVlZEFaaDd5ZjhzZmNGZ0VtRlA5OGp5bTVTTGk3Mkh6Z3U0UVNpWFhQQ1I0WVI5WjBkZjUvejV2QlNoZWpHdXpsK0owWUFtZzZCNmNiVHp0OXc4ZDQreEJkTzVIQzhjVm4xSmE&traceId=1', false, 4 from products where slug = 'macbook-neo-1774353396159';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-neo-color-select-202603-citrus_AV1?wid=5120&hei=3280&fmt=webp&qlt=90&.v=TytZbDBUUnRqRElRcFlBSHpmZVVDNFdhaFd1bmVlZEFaaDd5ZjhzZmNGaTVvak5OZlMxdTUzNFFmNm5mY2h1dkE0ZWxMVGt3djRUV0FHWk92REs5YjAxSlgrVWMrMzU1OXo2c2JyNjJZTGhqZ0ZtbXkvTFByVUFpdW1PQmJlVHQ&traceId=1', false, 5 from products where slug = 'macbook-neo-1774353396159';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-neo-color-select-202603-blush_AV2?wid=5120&hei=3280&fmt=webp&qlt=90&.v=TytZbDBUUnRqRElRcFlBSHpmZVVDNFdhaFd1bmVlZEFaaDd5ZjhzZmNGaStpRVl4UjU1RlFZN1NHN1M2a2JEN2ZvSGF2dFhlaXl5ZzZDVTRMdEVvNll2UjRaSC9URTlmd0FSb1ZTWjRnb3MrRjMvL1MxUUwvRHZwUmlDT2ltTkk&traceId=1', false, 6 from products where slug = 'macbook-neo-1774353396159';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-neo-color-select-202603-indigo_AV3?wid=5120&hei=3280&fmt=webp&qlt=90&.v=TytZbDBUUnRqRElRcFlBSHpmZVVDNFdhaFd1bmVlZEFaaDd5ZjhzZmNGaWlRbzM4aXpwVXJZRVlGd2xiUEN6REE0ZWxMVGt3djRUV0FHWk92REs5YjAxSlgrVWMrMzU1OXo2c2JyNjJZTGgrU2xIMEFiK1ZLaURMVjA2d0lCT2w&traceId=1', false, 7 from products where slug = 'macbook-neo-1774353396159';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/0udrEfNYmIpHmSaNU6fWHp3S0YJ4faYdDghUveqZxK4CfJB54EqAuQhJ9KLzY8q0xtRIBFLAQNKPnongqMjW5ry9p4KMpE6Ay7c=s6000-w6000-e365-rw-v0-nu', true, 0 from products where slug = 'pixel-10-1774357096227';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/INS1FNcKTpxGrrtrSv4L2Mde41meyin4qz9N-vghnFJWwhhOY-LF2KUoywzG5E1AIDg09qjemweZHHAAcFrrTKsP1qsvU-I-QpmB=s6000-w6000-e365-rw-v0-nu', false, 1 from products where slug = 'pixel-10-1774357096227';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/kZe13KTBUHP0gilMpAsn_sNj4CNPsDN2sdaawTFpFHkXnsnKPsKzkak0rV8RETT8mMIXi2CqovidA5BAjdq8slaRhcLZO3eeXu4=s6000-w6000-e365-rw-v0-nu', false, 2 from products where slug = 'pixel-10-1774357096227';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/uKS6tpepgnOv8cPyZiguZjy78QN3u4t8AYgtrLNJPbNUYwq1RXBC9R3q4xx-4gCSYkKJXzxAJvFfurgmkGLB28VcSMRAEMvHNQ=s6000-w6000-e365-rw-v0-nu', false, 3 from products where slug = 'pixel-10-1774357096227';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/qwGtRkzaEVLYpTCOL8Dt305kUdLLJ9A5kFLwEtAsYLa1lEAi3uPZvQknirERfPbxpiV4E36DwinwAtY_Z4FFSMO_GUToo0gmXWM=s6000-w6000-e365-rw-v0-nu', false, 4 from products where slug = 'pixel-10-1774357096227';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/Y9WF2kAFPvcLB79X5--drBixY7gYcsdML-7GyO2gkNBPOb2pM9k-VUPhEYLcsVf_FqLt57A7yjn-a07dsPX8eGu1qBrcG7oX-lmR=s6000-w6000-e365-rw-v0-nu', false, 5 from products where slug = 'pixel-10-1774357096227';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/J5fWw5wbCmadkp4ftM5JMukPDrIk8IcRXLajCv9vSCvTFL-iEtuBRsW2t0q2wxFAqh11AygQCnV6MIQ86yOFK8rncLbMF1mpH9Q=s6000-w6000-e365-rw-v0-nu', false, 6 from products where slug = 'pixel-10-1774357096227';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/4kkQjV9_KKefMkgavfvN8SzF32NqktTrd1tXo6UatDhj4uEt2pna3X7-Qd48a8RW37xfg-t00jd8xLs75Iu_nKRlAr9_ool7KA=s6000-w6000-e365-rw-v0-nu', false, 7 from products where slug = 'pixel-10-1774357096227';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/fJdAO7TvHzN0DbBnfbLFLGd4Jn4eyUuXqCfVrcIQ8MZQTvSsZyHqov1QTGcVFg7QZkQSz6DGqrbwujU6YVrQQfLz_wOsjiFl-u8=s6000-w6000-e365-rw-v0-nu', true, 0 from products where slug = 'pixel-10-pro-pro-xl-1774357644813';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/D93LpE5G1J_UNtPaod5Zr1dlJkRXi68DM6NVI-dRpmAV5P9BKAy8GW7Wn3jEnVyJWFJXYMkCWv3U15bvz8wQPTjSp8JbTZbz1g=s6000-w6000-e365-rw-v0-nu', false, 1 from products where slug = 'pixel-10-pro-pro-xl-1774357644813';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/g-wDNHws__1H63i7rilmWzNaIj1BKalZHcZWf22a6RoHg3bAYGp08WLvAPGKHSClnpGvi135lkG916UcFE0V5zOtSyv8W84F9jQ=s6000-w6000-e365-rw-v0-nu', false, 2 from products where slug = 'pixel-10-pro-pro-xl-1774357644813';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://lh3.googleusercontent.com/QN0PAB_Q19QFiED43V_jrAhNF7k7_ifUUXB0fFBnoK0TAG2NXk5RQKPi5t4eF4uSKf5CaL7hs3UIFrnbv4gadjCvuIgBHPah=s6000-w6000-e365-rw-v0-nu', false, 3 from products where slug = 'pixel-10-pro-pro-xl-1774357644813';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/bento/midnight/bento_1_airpod_max_midnight__4jy1tkqh9qay_small.jpg', true, 0 from products where slug = 'airpods-max-2-1774365775475';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/bento/starlight/bento_1_airpod_max_starlight__f7v0k5blkzqm_small.jpg', false, 1 from products where slug = 'airpods-max-2-1774365775475';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/bento/blue/bento_1_airpod_max_blue__blqgkfdancya_small.jpg', false, 2 from products where slug = 'airpods-max-2-1774365775475';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/bento/purple/bento_1_airpod_max_purple__2udwesqoiyq2_small.jpg', false, 3 from products where slug = 'airpods-max-2-1774365775475';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/product-stories/hifi-sound/audio_airpod_max__filcqiddcmye_large_2x.jpg', false, 4 from products where slug = 'airpods-max-2-1774365775475';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/product-stories/anc/anc_airpod_max_lifestyle__duzobvqwpz42_small.jpg', false, 5 from products where slug = 'airpods-max-2-1774365775475';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/product-stories/hifi-sound/modal/audio_bc_microphone__c4kgd4pga3cm_xsmall.png', false, 6 from products where slug = 'airpods-max-2-1774365775475';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/media-card/hifi_static__fbsq0dr3be2q_xsmall.jpg', false, 7 from products where slug = 'airpods-max-2-1774365775475';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/media-card/design_static__dph7m26odtg2_xsmall_2x.jpg', false, 8 from products where slug = 'airpods-max-2-1774365775475';

insert into product_images (product_id, image_url, is_primary, sort_order)
select id, 'https://www.apple.com/v/airpods-max/k/images/overview/bento/blue/bento_4_airpod_max_blue__cfidljp9xd7m_xlarge.jpg', false, 9 from products where slug = 'airpods-max-2-1774365775475';

-- =========================================================
-- Test after running: select name, slug, category, price from products order by created_at desc;
-- =========================================================