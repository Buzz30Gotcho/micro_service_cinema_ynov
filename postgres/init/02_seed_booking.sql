\c booking_db;

-- Seed: 3 séances par jour pour les 7 prochains jours
INSERT INTO
    seances (
        "nameMovie",
        "numberPlace",
        "hourStart",
        "hourEnd",
        "dateSeance",
        "salleId",
        "price"
    )
VALUES (
        'The Matrix',
        100,
        '18:00',
        '20:16',
        to_char (
            current_date + 0,
            'YYYY-MM-DD'
        ),
        'A1',
        10.00
    ),
    (
        'Inception',
        80,
        '20:30',
        '22:58',
        to_char (
            current_date + 0,
            'YYYY-MM-DD'
        ),
        'B1',
        15.00
    ),
    (
        'Interstellar',
        120,
        '17:00',
        '20:00',
        to_char (
            current_date + 0,
            'YYYY-MM-DD'
        ),
        'C1',
        10.00
    ),
    (
        'Dune',
        110,
        '19:00',
        '21:35',
        to_char (
            current_date + 1,
            'YYYY-MM-DD'
        ),
        'A1',
        10.00
    ),
    (
        'The Matrix',
        100,
        '21:00',
        '23:16',
        to_char (
            current_date + 1,
            'YYYY-MM-DD'
        ),
        'B1',
        10.00
    ),
    (
        'Inception',
        80,
        '16:00',
        '18:28',
        to_char (
            current_date + 1,
            'YYYY-MM-DD'
        ),
        'C1',
        15.00
    ),
    (
        'Interstellar',
        120,
        '18:30',
        '21:30',
        to_char (
            current_date + 2,
            'YYYY-MM-DD'
        ),
        'A1',
        15.00
    ),
    (
        'Dune',
        110,
        '20:00',
        '22:35',
        to_char (
            current_date + 2,
            'YYYY-MM-DD'
        ),
        'B1',
        15.00
    ),
    (
        'The Matrix',
        100,
        '15:00',
        '17:16',
        to_char (
            current_date + 2,
            'YYYY-MM-DD'
        ),
        'C1',
        15.00
    ),
    (
        'Inception',
        80,
        '19:30',
        '21:58',
        to_char (
            current_date + 3,
            'YYYY-MM-DD'
        ),
        'A1',
        15.00
    ),
    (
        'Interstellar',
        120,
        '21:00',
        '00:00',
        to_char (
            current_date + 3,
            'YYYY-MM-DD'
        ),
        'B1',
        7.00
    ),
    (
        'Dune',
        110,
        '17:30',
        '20:05',
        to_char (
            current_date + 3,
            'YYYY-MM-DD'
        ),
        'C1',
        15.00
    ),
    (
        'The Matrix',
        100,
        '20:30',
        '22:46',
        to_char (
            current_date + 4,
            'YYYY-MM-DD'
        ),
        'A1',
        15.00
    ),
    (
        'Inception',
        80,
        '14:00',
        '16:28',
        to_char (
            current_date + 4,
            'YYYY-MM-DD'
        ),
        'B1',
        15.00
    ),
    (
        'Interstellar',
        120,
        '16:30',
        '19:30',
        to_char (
            current_date + 4,
            'YYYY-MM-DD'
        ),
        'C1',
        7.00
    ),
    (
        'Dune',
        110,
        '18:00',
        '20:35',
        to_char (
            current_date + 5,
            'YYYY-MM-DD'
        ),
        'A1',
        10.00
    ),
    (
        'The Matrix',
        100,
        '13:00',
        '15:16',
        to_char (
            current_date + 5,
            'YYYY-MM-DD'
        ),
        'B1',
        10.00
    ),
    (
        'Inception',
        80,
        '21:30',
        '23:58',
        to_char (
            current_date + 5,
            'YYYY-MM-DD'
        ),
        'C1',
        10.00
    ),
    (
        'Interstellar',
        120,
        '19:00',
        '22:00',
        to_char (
            current_date + 6,
            'YYYY-MM-DD'
        ),
        'A1',
        10.00
    ),
    (
        'Dune',
        110,
        '15:00',
        '17:35',
        to_char (
            current_date + 6,
            'YYYY-MM-DD'
        ),
        'B1',
        10.00
    ),
    (
        'The Matrix',
        100,
        '17:30',
        '19:46',
        to_char (
            current_date + 6,
            'YYYY-MM-DD'
        ),
        'C1',
        10.00
    );