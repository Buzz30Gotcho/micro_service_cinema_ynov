<?php

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);
$query = $_GET;

function echo_response(string $status, int $response_code, string $method, string $uri, string $path, array $query): void
{
    http_response_code($response_code);
    echo json_encode([
        'status' => $status,
        'code' => $response_code,
        'method' => $method,
        'uri' => $uri,
        'path' => $path,
        'query' => $query
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

switch ($method) {
    case "GET":
        if ($path === '/health') {
            echo_response('healthy', 200, $method, $uri, $path, $query);
        }

        echo_response('Not Found', 404, $method, $uri, $path, $query);

    default:
        echo_response('Not Found', 404, $method, $uri, $path, $query);
}
