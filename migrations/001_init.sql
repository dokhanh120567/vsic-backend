-- Migration: Khởi tạo bảng users, listings, claims, orders, reviews, volunteer_tasks, threads, messages

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(20),
    rating_avg FLOAT DEFAULT 0,
    rating_count INT DEFAULT 0,
    lat FLOAT,
    lng FLOAT,
    address_hint VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(id),
    type VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    photos JSONB,
    portions INT,
    original_price_cents INT,
    sale_price_cents INT,
    commission_cents INT,
    lat FLOAT,
    lng FLOAT,
    expires_at TIMESTAMP,
    pickup_start TIMESTAMP,
    pickup_end TIMESTAMP,
    status VARCHAR(12) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    listing_id INT REFERENCES listings(id),
    requester_id INT REFERENCES users(id),
    status VARCHAR(12) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    listing_id INT REFERENCES listings(id),
    buyer_id INT REFERENCES users(id),
    amount_cents INT,
    commission_cents INT,
    seller_take_cents INT,
    paid VARCHAR(8) DEFAULT 'NO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    from_user INT REFERENCES users(id),
    to_user INT REFERENCES users(id),
    stars INT,
    tags JSONB,
    note TEXT,
    listing_id INT REFERENCES listings(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE volunteer_tasks (
    id SERIAL PRIMARY KEY,
    listing_id INT REFERENCES listings(id),
    volunteer_id INT REFERENCES users(id),
    status VARCHAR(12) DEFAULT 'OPEN',
    pickup_eta TIMESTAMP,
    proof_photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    listing_id INT REFERENCES listings(id),
    member_ids INT[],
    last_message_at TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    thread_id INT REFERENCES threads(id),
    sender_id INT REFERENCES users(id),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
