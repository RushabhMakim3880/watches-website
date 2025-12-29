-- ============================================
-- Seed Data for TM WATCH Database
-- ============================================

USE tmwatch_db;

-- Insert products from products.js
INSERT INTO products (id, name, brand, price, original_price, discount, rating, reviews, image, gender, category, strap_type, dial_color, movement, description, stock) VALUES
(1, 'Chronograph Master Elite', 'CHRONOLUX', 107817, 132717, 19, 4.8, 342, 'images/products/watch-1.jpg', 'men', 'chronograph', 'metal', 'black', 'automatic', 'Premium chronograph with automatic movement', 25),
(2, 'Executive Automatic', 'CHRONOLUX', 165717, 206717, 20, 4.9, 287, 'images/products/watch-2.jpg', 'men', 'automatic', 'leather', 'blue', 'automatic', 'Executive automatic watch with blue dial', 15),
(3, 'Sport Diver Pro', 'AQUAMASTER', 82617, 115917, 29, 4.7, 456, 'images/products/watch-3.jpg', 'men', 'sport', 'rubber', 'black', 'automatic', 'Professional diving watch', 30),
(4, 'Classic Heritage', 'CHRONOLUX', 132717, 165717, 20, 4.6, 198, 'images/products/watch-4.jpg', 'men', 'luxury-leather', 'leather', 'white', 'automatic', 'Classic heritage timepiece', 20),
(5, 'Moonphase Prestige', 'CHRONOLUX', 289917, 330717, 12, 4.9, 156, 'images/products/watch-5.jpg', 'men', 'luxury-leather', 'leather', 'blue', 'automatic', 'Moonphase complication watch', 10),
(6, 'Pilot Navigator', 'AVIATOR', 123917, 165717, 25, 4.8, 234, 'images/products/watch-6.jpg', 'men', 'automatic', 'leather', 'black', 'automatic', 'Aviation-inspired navigator watch', 18),
(7, 'Elegance Rose Gold', 'LUXELLE', 99517, 123917, 20, 4.7, 289, 'images/products/watch-7.jpg', 'women', 'luxury-leather', 'leather', 'gold', 'quartz', 'Rose gold elegant timepiece', 22),
(8, 'Diamond Prestige', 'LUXELLE', 206717, 247917, 17, 4.9, 167, 'images/products/watch-8.jpg', 'women', 'luxury-leather', 'metal', 'white', 'quartz', 'Diamond-studded prestige watch', 12),
(9, 'Sport Titanium', 'SPORTEX', 74217, 99517, 25, 4.6, 378, 'images/products/watch-9.jpg', 'unisex', 'sport', 'metal', 'black', 'quartz', 'Titanium sport watch', 35),
(10, 'Smart Hybrid Pro', 'TECHTIME', 57917, 82617, 30, 4.5, 512, 'images/products/watch-10.jpg', 'unisex', 'smart', 'rubber', 'black', 'smart', 'Hybrid smartwatch', 40),
(11, 'Vintage Leather Classic', 'HERITAGE', 91217, 115917, 21, 4.7, 223, 'images/products/watch-11.jpg', 'men', 'luxury-leather', 'leather', 'brown', 'automatic', 'Vintage-inspired classic', 16),
(12, 'Minimalist Modern', 'MODERNIST', 66317, 82617, 20, 4.6, 445, 'images/products/watch-12.jpg', 'unisex', 'luxury-leather', 'leather', 'white', 'quartz', 'Minimalist modern design', 28),
(13, 'Precision Chronograph Pro', 'CHRONOLUX', 140817, 165717, 15, 4.8, 198, 'images/products/watch-13.jpg', 'men', 'chronograph', 'metal', 'blue', 'automatic', 'Professional chronograph with precision movement', 20),
(14, 'Rose Gold Elegance', 'LUXELLE', 91217, 115917, 21, 4.7, 234, 'images/products/watch-14.jpg', 'women', 'luxury-leather', 'leather', 'gold', 'quartz', 'Elegant rose gold timepiece', 18),
(15, 'Ocean Explorer Diver', 'AQUAMASTER', 99517, 123917, 20, 4.8, 289, 'images/products/watch-1.jpg', 'men', 'sport', 'rubber', 'blue', 'automatic', 'Deep-sea diving watch', 25),
(16, 'Aviation Heritage', 'AVIATOR', 165717, 206717, 20, 4.9, 167, 'images/products/watch-2.jpg', 'men', 'automatic', 'leather', 'black', 'automatic', 'Heritage aviation timepiece', 15),
(17, 'Diamond Luxury Collection', 'LUXELLE', 248917, 289917, 14, 4.9, 145, 'images/products/watch-3.jpg', 'women', 'luxury-leather', 'metal', 'white', 'quartz', 'Luxury diamond collection', 10),
(18, 'Titanium Sport Elite', 'SPORTEX', 115917, 140817, 18, 4.7, 312, 'images/products/watch-4.jpg', 'men', 'sport', 'metal', 'black', 'automatic', 'Elite titanium sport watch', 22);

-- Create a demo user (password: password123)
INSERT INTO users (name, email, password, phone, address) VALUES
('Demo User', 'demo@tmwatch.com', '$2a$10$YourHashedPasswordHere', '+91-9876543210', 'Mumbai, Maharashtra, India');

-- Note: The password hash above is a placeholder. 
-- To create a real user, use the /api/auth/register endpoint
-- or hash the password using bcrypt with 10 rounds
