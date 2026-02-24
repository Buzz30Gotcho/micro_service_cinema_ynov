\c booking_db;

-- Create seances table
CREATE TABLE IF NOT EXISTS seances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "nameMovie" VARCHAR(255) NOT NULL,
    "numberPlace" INTEGER,
    "hourStart" VARCHAR(50),
    "hourEnd" VARCHAR(50),
    "dateSeance" VARCHAR(50),
    "salleId" VARCHAR(50),
    price NUMERIC(10, 2),
    type VARCHAR(20) DEFAULT 'standard',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "seanceId" UUID NOT NULL REFERENCES seances (id),
    "userEmail" VARCHAR(255),
    "userName" VARCHAR(255),
    "seatCode" VARCHAR(50),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices
CREATE INDEX idx_seances_date ON seances ("dateSeance");

CREATE INDEX idx_reservations_seance ON reservations ("seanceId");

-- Grant permissions to booking user
ALTER TABLE seances OWNER TO booking_user;

ALTER TABLE reservations OWNER TO booking_user;

GRANT ALL PRIVILEGES ON TABLE seances TO booking_user;

GRANT ALL PRIVILEGES ON TABLE reservations TO booking_user;

GRANT USAGE,
SELECT
    ON ALL SEQUENCES IN SCHEMA public TO booking_user;