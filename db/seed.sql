-- Seed data: common Indian cattle & buffalo breeds
-- Expand this list as your training dataset grows (target: 50+ breeds)

INSERT INTO breeds (name, animal_type, origin_state, milk_yield_liters_per_day, adaptability_score, disease_resistance, coat_color, horn_type, body_size, notes)
VALUES
('Gir', 'cattle', 'Gujarat', '10-15', 'High', 'High', 'White with reddish-brown patches', 'Curved, drooping', 'Medium-Large', 'Known for A2 milk, heat tolerant'),
('Sahiwal', 'cattle', 'Punjab', '8-12', 'High', 'High', 'Reddish-brown to pale red', 'Short, thick', 'Medium', 'One of the best dairy breeds among zebu cattle'),
('Red Sindhi', 'cattle', 'Sindh region (reared across India)', '6-10', 'High', 'High', 'Deep red to light red', 'Short, curved', 'Medium', 'Hardy, good for crossbreeding'),
('Tharparkar', 'cattle', 'Rajasthan', '8-10', 'High', 'High', 'White to grey', 'Medium, curved', 'Medium', 'Dual purpose - milk and draught'),
('Rathi', 'cattle', 'Rajasthan', '6-8', 'Medium', 'High', 'White/brown patches', 'Short', 'Medium', 'Desert-adapted breed'),
('Kankrej', 'cattle', 'Gujarat/Rajasthan', '6-10', 'High', 'High', 'Silver-grey to steel grey', 'Lyre-shaped, large', 'Large', 'Strong draught breed, also decent milk yield'),
('Ongole', 'cattle', 'Andhra Pradesh', '3-5', 'Medium', 'High', 'White', 'Short, stout', 'Large', 'Known for strength, exported for beef breeding globally'),
('Hariana', 'cattle', 'Haryana', '6-8', 'Medium', 'Medium', 'White/grey', 'Short, curved', 'Medium', 'Dual purpose breed'),
('Deoni', 'cattle', 'Maharashtra/Karnataka', '5-8', 'Medium', 'Medium', 'Black and white spotted', 'Medium, curved', 'Medium', 'Dual purpose'),
('Khillari', 'cattle', 'Maharashtra', '3-5', 'Medium', 'High', 'Grey/white', 'Long, pointed backward', 'Medium', 'Draught breed, fast and agile'),
('Holstein Friesian (crossbred)', 'cattle', 'Exotic (crossbred in India)', '15-25', 'Low', 'Low', 'Black and white patches', 'Small/polled', 'Large', 'High yield but low heat/disease tolerance, common crossbred'),
('Jersey (crossbred)', 'cattle', 'Exotic (crossbred in India)', '12-18', 'Medium', 'Low', 'Light brown/fawn', 'Small', 'Small-Medium', 'Popular crossbred for smallholder dairy'),
('Murrah', 'buffalo', 'Haryana', '10-16', 'High', 'High', 'Jet black', 'Tightly curled', 'Large', 'Best dairy buffalo breed in India, widely used for crossbreeding'),
('Nili-Ravi', 'buffalo', 'Punjab', '10-14', 'High', 'High', 'Black, often with white markings on face/legs', 'Tightly curled', 'Large', 'Known as "panj kalyanka" for white markings'),
('Surti', 'buffalo', 'Gujarat', '6-10', 'Medium', 'High', 'Black or brown', 'Sickle-shaped', 'Medium', 'Known for high fat content milk'),
('Jaffarabadi', 'buffalo', 'Gujarat', '10-15', 'High', 'High', 'Black', 'Heavy, curled downward', 'Large', 'Heaviest buffalo breed in India'),
('Mehsana', 'buffalo', 'Gujarat', '8-12', 'Medium', 'High', 'Black/grey', 'Curved', 'Medium-Large', 'Cross between Murrah and Surti origins'),
('Bhadawari', 'buffalo', 'Uttar Pradesh', '4-6', 'Medium', 'Medium', 'Copper/light brown', 'Sickle-shaped', 'Small-Medium', 'High fat content, smaller build'),
('Toda', 'buffalo', 'Tamil Nadu', '2-4', 'Medium', 'High', 'Grey/black', 'Long, curved', 'Medium', 'Reared by Toda tribal community in Nilgiris'),
('Pandharpuri', 'buffalo', 'Maharashtra', '5-8', 'Medium', 'Medium', 'Black', 'Long, sword-like, flat', 'Medium', 'Distinctive long straight horns')
ON CONFLICT (name) DO NOTHING;
