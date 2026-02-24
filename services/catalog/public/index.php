<?php
/**
 * =====================================================
 *  CATALOG MICROSERVICE — PHP natif
 *  CRUD complet pour les films du cinéma
 *  Port : 4001 | BDD : PostgreSQL catalog_db
 * =====================================================
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../src/index.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Strip optional gateway prefix
$path = preg_replace('#^/catalogue#', '', $path) ?: '/';

// ============================================================
//  ROUTES
// ============================================================

// --- Health check ---
if ($method === 'GET' && $path === '/health') {
    try {
        $pdo = getDbConnection();
        $pdo->query('SELECT 1');
        jsonResponse(['status' => 'healthy', 'service' => 'catalog', 'db' => 'connected']);
    } catch (Exception $e) {
        jsonResponse(['status' => 'unhealthy', 'service' => 'catalog', 'db' => 'disconnected', 'error' => $e->getMessage()], 503);
    }
}

// --- GET /movies or /films (list all) ---
if ($method === 'GET' && ($path === '/movies' || $path === '/films')) {
    try {
        $pdo = getDbConnection();
        seedFilmsIfEmpty($pdo);
        $stmt = $pdo->query('SELECT * FROM films ORDER BY id DESC');
        $rows = $stmt->fetchAll();
        jsonResponse(array_map('rowToCamel', $rows));
    } catch (Exception $e) {
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}

// --- GET /movies/stats/all ---
if ($method === 'GET' && $path === '/movies/stats/all') {
    try {
        $pdo = getDbConnection();
        $total = $pdo->query('SELECT COUNT(*) AS c FROM films')->fetch()['c'];
        $avg = $pdo->query('SELECT COALESCE(AVG(rating),0) AS a FROM films')->fetch()['a'];
        $genres = $pdo->query("SELECT genre, COUNT(*) AS count FROM films WHERE genre IS NOT NULL GROUP BY genre ORDER BY count DESC")->fetchAll();
        jsonResponse([
            'totalMovies' => (int) $total,
            'averageRating' => round((float) $avg, 2),
            'genres' => $genres,
        ]);
    } catch (Exception $e) {
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}

// --- GET /movies/:id or /films/:id ---
if ($method === 'GET' && preg_match('#^/(movies|films)/(\d+)$#', $path, $m)) {
    $id = (int) $m[2];
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare('SELECT * FROM films WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            jsonResponse(['error' => 'Film non trouvé'], 404);
        }
        jsonResponse(rowToCamel($row));
    } catch (Exception $e) {
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}

// --- GET /hello ---
if ($method === 'GET' && $path === '/hello') {
    jsonResponse(['status' => 'ok', 'message' => 'Hello World']);
}

// --- GET /db-test ---
if ($method === 'GET' && $path === '/db-test') {
    try {
        $pdo = getDbConnection();
        $row = $pdo->query('SELECT current_database() AS db, current_user AS user')->fetch();
        jsonResponse([
            'status' => 'ok',
            'db' => $row['db'] ?? null,
            'user' => $row['user'] ?? null,
        ]);
    } catch (Exception $e) {
        jsonResponse([
            'status' => 'error',
            'message' => 'DB connection failed',
            'error' => $e->getMessage(),
        ], 500);
    }
}

// --- POST /movies  (create) ---
if ($method === 'POST' && $path === '/movies') {
    $body = getJsonBody();
    if (empty($body['title'])) {
        jsonResponse(['error' => 'Le champ "title" est obligatoire'], 400);
    }
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("
            INSERT INTO films (title, genre, duration, rating, year, age_rating, image, description, synopsis, director, writer, producer, studio, release_date, budget)
            VALUES (:title, :genre, :duration, :rating, :year, :age_rating, :image, :description, :synopsis, :director, :writer, :producer, :studio, :release_date, :budget)
            RETURNING *
        ");
        $stmt->execute([
            'title' => $body['title'],
            'genre' => $body['genre'] ?? null,
            'duration' => isset($body['duration']) ? (int) $body['duration'] : null,
            'rating' => isset($body['rating']) ? (float) $body['rating'] : null,
            'year' => isset($body['year']) ? (int) $body['year'] : null,
            'age_rating' => $body['ageRating'] ?? $body['age_rating'] ?? null,
            'image' => $body['image'] ?? null,
            'description' => $body['description'] ?? null,
            'synopsis' => $body['synopsis'] ?? null,
            'director' => $body['director'] ?? null,
            'writer' => $body['writer'] ?? null,
            'producer' => $body['producer'] ?? null,
            'studio' => $body['studio'] ?? null,
            'release_date' => $body['releaseDate'] ?? $body['release_date'] ?? null,
            'budget' => $body['budget'] ?? null,
        ]);
        $row = $stmt->fetch();
        jsonResponse(rowToCamel($row), 201);
    } catch (Exception $e) {
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}

// --- PUT /movies/:id  (update) ---
if ($method === 'PUT' && preg_match('#^/movies/(\d+)$#', $path, $m)) {
    $id = (int) $m[1];
    $body = getJsonBody();
    try {
        $pdo = getDbConnection();

        // Check exists
        $check = $pdo->prepare('SELECT id FROM films WHERE id = :id');
        $check->execute(['id' => $id]);
        if (!$check->fetch()) {
            jsonResponse(['error' => 'Film non trouvé'], 404);
        }

        $stmt = $pdo->prepare("
            UPDATE films SET
                title        = :title,
                genre        = :genre,
                duration     = :duration,
                rating       = :rating,
                year         = :year,
                age_rating   = :age_rating,
                image        = :image,
                description  = :description,
                synopsis     = :synopsis,
                director     = :director,
                writer       = :writer,
                producer     = :producer,
                studio       = :studio,
                release_date = :release_date,
                budget       = :budget,
                updated_at   = CURRENT_TIMESTAMP
            WHERE id = :id
            RETURNING *
        ");
        $stmt->execute([
            'id' => $id,
            'title' => $body['title'] ?? '',
            'genre' => $body['genre'] ?? null,
            'duration' => isset($body['duration']) ? (int) $body['duration'] : null,
            'rating' => isset($body['rating']) ? (float) $body['rating'] : null,
            'year' => isset($body['year']) ? (int) $body['year'] : null,
            'age_rating' => $body['ageRating'] ?? $body['age_rating'] ?? null,
            'image' => $body['image'] ?? null,
            'description' => $body['description'] ?? null,
            'synopsis' => $body['synopsis'] ?? null,
            'director' => $body['director'] ?? null,
            'writer' => $body['writer'] ?? null,
            'producer' => $body['producer'] ?? null,
            'studio' => $body['studio'] ?? null,
            'release_date' => $body['releaseDate'] ?? $body['release_date'] ?? null,
            'budget' => $body['budget'] ?? null,
        ]);
        $row = $stmt->fetch();
        jsonResponse(rowToCamel($row));
    } catch (Exception $e) {
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}

// --- DELETE /movies/:id ---
if ($method === 'DELETE' && preg_match('#^/movies/(\d+)$#', $path, $m)) {
    $id = (int) $m[1];
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare('DELETE FROM films WHERE id = :id');
        $stmt->execute(['id' => $id]);
        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Film non trouvé'], 404);
        }
        jsonResponse(['message' => 'Film supprimé avec succès', 'id' => $id]);
    } catch (Exception $e) {
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}

// --- Fallback 404 ---
jsonResponse(['error' => 'Route non trouvée', 'method' => $method, 'path' => $path], 404);
