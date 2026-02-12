\c catalog_db;

CREATE TABLE IF NOT EXISTS films (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration INTEGER,
    rating VARCHAR(50),
    director VARCHAR(255),
    description TEXT,
    posterUrl VARCHAR(255),
    posterRotationDeg INTEGER
);

INSERT INTO films (title, duration, rating, director, description, posterUrl, posterRotationDeg) VALUES
('The Matrix', 136, 'R', 'Lana Wachowski, Lilly Wachowski', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 'https://image.tmdb.org/t/p/w500/f8W0K7o1c8v3rQzNl7jN8l0fB1B.jpg', 0),
('Inception', 148, 'PG-13', 'Christopher Nolan', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'https://image.tmdb.org/t/p/w500/edv5bqhQ6K55S1yQ2E2lU82A3J2.jpg', 0),
('Interstellar', 169, 'PG-13', 'Christopher Nolan', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6BlYUyOpT8WQR.jpg', 0),
('Dune', 155, 'PG-13', 'Denis Villeneuve', 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.', 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94X لاکه4504.jpg', 0);
