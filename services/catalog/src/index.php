<?php
/**
 * Catalog Microservice - Core helpers
 * Database connection + utility functions
 */

function getDbConnection(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $host = getenv('DB_HOST') ?: 'localhost';
    $port = getenv('DB_PORT') ?: '5432';
    $dbname = getenv('DB_NAME') ?: 'catalog_db';
    $user = getenv('DB_USER') ?: 'catalog_user';
    $password = getenv('DB_PASSWORD') ?: 'catalog_pass';

    $dsn = "pgsql:host={$host};port={$port};dbname={$dbname}";

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function seedFilmsIfEmpty(PDO $pdo): void
{
    $count = (int) $pdo->query('SELECT COUNT(*) AS c FROM films')->fetch()['c'];
    if ($count > 0) {
        return;
    }

    $seed = [
        [
            'title' => 'The Matrix',
            'genre' => 'Science-Fiction',
            'duration' => 136,
            'rating' => 4.7,
            'year' => 1999,
            'age_rating' => 'R',
            'image' => '/images/the-matrix.jpg',
            'description' => 'Un hacker découvre la vraie nature de sa réalité à travers des révoltés mystérieux et doit combattre les contrôleurs du système.',
            'director' => 'Lana Wachowski, Lilly Wachowski',
        ],
        [
            'title' => 'Inception',
            'genre' => 'Science-Fiction',
            'duration' => 148,
            'rating' => 4.6,
            'year' => 2010,
            'age_rating' => 'PG-13',
            'image' => '/images/inception.jpg',
            'description' => 'Un voleur utilisant la technologie de partage de rêves pour voler des secrets doit cette fois-ci implanter une idée dans l\'esprit d\'un PDG.',
            'director' => 'Christopher Nolan',
        ],
        [
            'title' => 'Interstellar',
            'genre' => 'Science-Fiction',
            'duration' => 169,
            'rating' => 4.5,
            'year' => 2014,
            'age_rating' => 'PG-13',
            'image' => '/images/interstellar.jpg',
            'description' => 'Une équipe d\'explorateurs traverse un trou de ver spatial pour assurer la survie de l\'humanité.',
            'director' => 'Christopher Nolan',
        ],
        [
            'title' => 'Dune',
            'genre' => 'Science-Fiction',
            'duration' => 155,
            'rating' => 4.2,
            'year' => 2021,
            'age_rating' => 'PG-13',
            'image' => '/images/dune.jpg',
            'description' => 'Paul Atreides doit voyager sur la planète la plus dangereuse de l\'univers pour assurer l\'avenir de sa famille et de son peuple.',
            'director' => 'Denis Villeneuve',
        ],
        [
            'title' => 'The Dark Knight',
            'genre' => 'Action',
            'duration' => 152,
            'rating' => 4.9,
            'year' => 2008,
            'age_rating' => 'PG-13',
            'image' => '/images/the-dark-knight.jpg',
            'description' => 'Quand le Joker sème le chaos à Gotham, Batman doit affronter son plus grand défi psychologique.',
            'director' => 'Christopher Nolan',
        ],
        [
            'title' => 'Titanic',
            'genre' => 'Romance',
            'duration' => 194,
            'rating' => 4.6,
            'year' => 1997,
            'age_rating' => 'PG-13',
            'image' => '/images/titanic.jpg',
            'description' => 'Une aristocrate de dix-sept ans tombe amoureuse d\'un artiste pauvre à bord du Titanic, le paquebot maudit.',
            'director' => 'James Cameron',
        ],
        [
            'title' => 'The Shawshank Redemption',
            'genre' => 'Drame',
            'duration' => 142,
            'rating' => 4.9,
            'year' => 1994,
            'age_rating' => 'R',
            'image' => '/images/the-shawshank-redemption.jpg',
            'description' => 'Deux hommes emprisonnés nouent une amitié profonde qui deviendra leur salut et leur liberté.',
            'director' => 'Frank Darabont',
        ],
        [
            'title' => 'Forrest Gump',
            'genre' => 'Drame',
            'duration' => 142,
            'rating' => 4.8,
            'year' => 1994,
            'age_rating' => 'PG',
            'image' => '/images/forrest-gump.jpg',
            'description' => 'Un Américain sans prétention traverse les grands événements du XXe siècle avec innocence et bonté.',
            'director' => 'Robert Zemeckis',
        ],
        [
            'title' => 'The Godfather Part II',
            'genre' => 'Crime',
            'duration' => 200,
            'rating' => 4.9,
            'year' => 1974,
            'age_rating' => 'R',
            'image' => '/images/the-godfather-part-ii.jpg',
            'description' => 'La jeunesse de Vito Corleone dans les années 1920 est portraiturée tandis que Michael consolide son empire criminel.',
            'director' => 'Francis Ford Coppola',
        ],
        [
            'title' => 'The Avengers',
            'genre' => 'Action',
            'duration' => 143,
            'rating' => 4.5,
            'year' => 2012,
            'age_rating' => 'PG-13',
            'image' => '/images/the-avengers.jpg',
            'description' => 'Les plus puissants héros de la Terre doivent s\'unir pour combattre une invasion extraterrestre.',
            'director' => 'Joss Whedon',
        ],
        [
            'title' => 'Avatar: The Way of Water',
            'genre' => 'Science-Fiction',
            'duration' => 162,
            'rating' => 4.5,
            'year' => 2022,
            'age_rating' => 'PG-13',
            'image' => '/images/avatar-the-way-of-water.jpg',
            'description' => 'Jake Sully vit en harmonie avec sa nouvelle famille sur Pandora. Une menace ancienne l\'oblige à combattre pour protéger son peuple.',
            'director' => 'James Cameron',
        ],
        [
            'title' => 'Spider-Man: Far From Home',
            'genre' => 'Action',
            'duration' => 129,
            'rating' => 4.5,
            'year' => 2019,
            'age_rating' => 'PG-13',
            'image' => '/images/spider-man-far-from-home.jpg',
            'description' => 'Peter Parker passe l\'été en Europe avec ses amis. Une nouvelle menace émergente le force à mettre en action ses pouvoirs.',
            'director' => 'Jon Watts',
        ],
        [
            'title' => 'Aquaman',
            'genre' => 'Action',
            'duration' => 143,
            'rating' => 4.2,
            'year' => 2018,
            'age_rating' => 'PG-13',
            'image' => '/images/aquaman.jpg',
            'description' => 'Le roi d\'Atlantis doit accepter ses pouvoirs pour sauver son monde de la destruction.',
            'director' => 'James Wan',
        ],
        [
            'title' => 'Wonder Woman',
            'genre' => 'Action',
            'duration' => 141,
            'rating' => 4.5,
            'year' => 2017,
            'age_rating' => 'PG-13',
            'image' => '/images/wonder-woman.jpg',
            'description' => 'Une princesse amazone arrive sur Terre durant la Première Guerre mondiale pour affronter le mal et restaurer la paix.',
            'director' => 'Patty Jenkins',
        ],
        [
            'title' => 'Star Wars: The Last Jedi',
            'genre' => 'Science-Fiction',
            'duration' => 152,
            'rating' => 4.3,
            'year' => 2017,
            'age_rating' => 'PG-13',
            'image' => '/images/star-wars-the-last-jedi.jpg',
            'description' => 'Rey développe ses nouveaux pouvoirs sous la guidance de Luke Skywalker, troublé par sa puissance brute.',
            'director' => 'Rian Johnson',
        ],
        [
            'title' => 'Jumanji',
            'genre' => 'Action',
            'duration' => 104,
            'rating' => 4.3,
            'year' => 1995,
            'age_rating' => 'PG',
            'image' => '/images/jumanji.jpg',
            'description' => 'Un jeu de société magique libère des créatures terrifiantes et des événements surnaturels quand des enfants l\'ouvrent.',
            'director' => 'Joe Johnston',
        ],
        [
            'title' => 'Parasite',
            'genre' => 'Thriller',
            'duration' => 132,
            'rating' => 4.8,
            'year' => 2019,
            'age_rating' => 'R',
            'image' => '/images/parasite.jpg',
            'description' => 'L\'avarice et les discriminations sociales menacent la relation symbiotique entre une riche famille et une famille pauvre.',
            'director' => 'Bong Joon-ho',
        ],
        [
            'title' => 'Tirailleurs',
            'genre' => 'Drame',
            'duration' => 150,
            'rating' => 4.4,
            'year' => 2022,
            'age_rating' => 'PG-13',
            'image' => '/images/tirailleurs.jpg',
            'description' => 'Un régiment de soldats sénégalais se battent pour la France durant la Première Guerre mondiale, face au racisme.',
            'director' => 'Rachid Bouchareb',
        ],
        [
            'title' => 'Insaisissable',
            'genre' => 'Thriller',
            'duration' => 115,
            'rating' => 4.2,
            'year' => 2013,
            'age_rating' => 'PG-13',
            'image' => '/images/insaisissable.jpg',
            'description' => 'Quatre magiciens utilisent leurs illusions pour exposer la corruption et voler des millions aux puissants.',
            'director' => 'Louis Leterrier',
        ],
        [
            'title' => 'La Noire de',
            'genre' => 'Drame',
            'duration' => 107,
            'rating' => 4.3,
            'year' => 2022,
            'age_rating' => 'PG',
            'image' => '/images/la-noire-de.jpg',
            'description' => 'Une femme défie le système pour protéger et aider sa communauté contre l\'oppression.',
            'director' => 'Various',
        ],
    ];

    $stmt = $pdo->prepare("
        INSERT INTO films (title, genre, duration, rating, year, age_rating, image, description, director)
        VALUES (:title, :genre, :duration, :rating, :year, :age_rating, :image, :description, :director)
    ");

    foreach ($seed as $movie) {
        $stmt->execute($movie);
    }
}

function jsonResponse(mixed $data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Convert snake_case DB row to camelCase for the front-end
 */
function rowToCamel(array $row): array
{
    $image = resolvePosterUrl($row['title'] ?? 'movie', $row['image'] ?? null);
    return [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'genre' => $row['genre'],
        'duration' => $row['duration'] !== null ? (int) $row['duration'] : null,
        'rating' => $row['rating'] !== null ? (float) $row['rating'] : null,
        'year' => $row['year'] !== null ? (int) $row['year'] : null,
        'ageRating' => $row['age_rating'],
        'image' => $image,
        // Compatibility fields used by legacy front components
        'poster' => $image,
        'posterUrl' => $image,
        'posterRotationDeg' => 0,
        'description' => $row['description'],
        'synopsis' => $row['synopsis'],
        'director' => $row['director'],
        'writer' => $row['writer'],
        'producer' => $row['producer'],
        'studio' => $row['studio'],
        'releaseDate' => $row['release_date'],
        'budget' => $row['budget'],
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
    ];
}

function getPublicBaseUrl(): string
{
    $baseUrl = getenv('PUBLIC_BASE_URL');
    if ($baseUrl) {
        return rtrim($baseUrl, '/');
    }
    // Fallback: utilise le domaine du frontend si connu
    return 'http://jgsw0c0ggggwsg4ss000skgc.72.62.179.60.sslip.io';
}

function slugify(string $value): string
{
    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/i', '-', $value);
    $value = trim($value ?? '', '-');

    return $value ?: 'movie';
}

function resolvePosterUrl(string $title, ?string $image): string
{
    $baseUrl = getPublicBaseUrl();

    if ($image) {
        if (str_starts_with($image, '/')) {
            return $baseUrl . $image;
        }
        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            // Ignore external URLs when no domain/key is desired
            return $baseUrl . '/images/posters/' . slugify($title) . '.jpg';
        }
        return $baseUrl . '/' . ltrim($image, '/');
    }

    return $baseUrl . '/images/posters/' . slugify($title) . '.jpg';
}
