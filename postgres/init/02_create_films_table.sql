\c catalog_db;

CREATE TABLE IF NOT EXISTS films (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    duration INTEGER,
    rating NUMERIC(3, 1) DEFAULT 0,
    year INTEGER,
    age_rating VARCHAR(10),
    image TEXT,
    description TEXT,
    synopsis TEXT,
    director VARCHAR(255),
    writer VARCHAR(255),
    producer VARCHAR(255),
    studio VARCHAR(255),
    release_date VARCHAR(100),
    budget VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE films OWNER TO catalog_user;

GRANT ALL PRIVILEGES ON TABLE films TO catalog_user;

GRANT USAGE, SELECT ON SEQUENCE films_id_seq TO catalog_user;