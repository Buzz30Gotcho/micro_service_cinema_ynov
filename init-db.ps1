# Script d'initialisation et de seed des bases de données MS-Cinema
# Usage: .\init-db.ps1
# ou:    .\init-db.ps1 -importJson "C:\path\to\seed-data.json"

param(
    [string]$importJson = ""
)

# Couleurs
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Red = [System.ConsoleColor]::Red

function Write-Status {
    param([string]$message, [System.ConsoleColor]$color = $Green)
    Write-Host ">> $message" -ForegroundColor $color
}

function Wait-Service {
    param([int]$port, [int]$maxWait = 30)
    $elapsed = 0
    while ($elapsed -lt $maxWait) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port/health" -UseBasicParsing -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                return $true
            }
        } catch {
            # Service not ready yet
        }
        Start-Sleep -Seconds 1
        $elapsed++
    }
    return $false
}

Write-Status "=== INITIALISATION MS-CINEMA ===" $Yellow
Write-Status ""

# 1. Arrêter et relancer tous les containers
Write-Status "Arrêt des containers existants..." $Yellow
docker compose down 2>&1 | Out-Null

Write-Status "Lancement des containers..." $Yellow
docker compose up -d 2>&1 | Out-Null

Write-Status "Attente du démarrage des services..." $Yellow
Start-Sleep -Seconds 8

# 2. Attendre que les services soient prêts
Write-Status "Vérification de la disponibilité de Catalog (port 4001)..." $Yellow
if (Wait-Service -port 4001) {
    Write-Status "Catalog est prêt" $Green
} else {
    Write-Status "Catalog n'a pas répondu à temps" $Red
}

Write-Status "Vérification de la disponibilité de Booking (port 4003)..." $Yellow
if (Wait-Service -port 4003) {
    Write-Status "Booking est prêt" $Green
} else {
    Write-Status "Booking n'a pas répondu à temps" $Red
}

Write-Status ""
Write-Status "Population des bases de données..." $Yellow
Write-Status ""

# 3. Seed des movies
$today = (Get-Date).ToString("yyyy-MM-dd")
$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")

$movieObjects = @()
$movieObjects += [PSCustomObject]@{
    title = "Lumières de la Ville"
    genre = "Comédie Dramatique"
    duration = 138
    rating = 4.7
    year = 2025
    ageRating = "12+"
    image = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80"
    description = "Dans une métropole futuriste, un artiste marginal découvre un complot."
    director = "Sophie Martin"
    synopsis = "Un voyage épique à travers la ville."
}

$movieObjects += [PSCustomObject]@{
    title = "Océan Bleu"
    genre = "Documentaire"
    duration = 102
    rating = 4.3
    year = 2024
    image = "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&q=80"
    description = "Explorez les profondeurs inconnues des abysses."
    director = "Jean Dupont"
}

$movieObjects += [PSCustomObject]@{
    title = "Nocturne"
    genre = "Thriller"
    duration = 116
    rating = 4.1
    year = 2025
    image = "https://images.unsplash.com/photo-1505432197924-c36723205007?w=800&q=80"
    description = "Un détective hanté par son passé."
    director = "Marc Levy"
}

$movieObjects += [PSCustomObject]@{
    title = "Atlas"
    genre = "Aventure"
    duration = 129
    rating = 4.5
    year = 2024
    image = "https://images.unsplash.com/photo-1511203348235-99893a036329?w=800&q=80"
    description = "Une exploratrice part à la recherche d une cité perdue."
    director = "Lara Croft"
}

$movieObjects += [PSCustomObject]@{
    title = "Hyperdrive"
    genre = "Science-Fiction"
    duration = 138
    rating = 4.6
    year = 2025
    image = "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=800&q=80"
    description = "L équipage d un vaisseau spatial doit survivre."
    director = "James Cameron"
}

$movieObjects += [PSCustomObject]@{
    title = "Renaissance"
    genre = "Historique"
    duration = 145
    rating = 4.2
    year = 2024
    image = "https://images.unsplash.com/photo-1533109721025-d1ae7ee7c452?w=800&q=80"
    description = "La Florence du XVe siècle et deux artistes rivaux."
    director = "Ridley Scott"
}

Write-Status "Création des movies..." $Yellow
foreach ($movie in $movieObjects) {
    try {
        $json = $movie | ConvertTo-Json
        $response = Invoke-WebRequest -Uri http://localhost:3030/catalogue/movies -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -ErrorAction Stop
        Write-Host "  OK: $($movie.title)" -ForegroundColor $Green
    } catch {
        Write-Host "  ERREUR: $($movie.title) - $($_.Exception.Message)" -ForegroundColor $Red
    }
}

# 4. Seed des sessions
Write-Status ""
Write-Status "Création des sessions..." $Yellow

$sessionObjects = @()
$sessionObjects += [PSCustomObject]@{
    nameMovie = "Lumières de la Ville"
    numberPlace = 120
    hourStart = "20:00"
    hourEnd = "22:18"
    dateSeance = $today
    salleId = "Salle 1"
    price = 12.50
}

$sessionObjects += [PSCustomObject]@{
    nameMovie = "Nocturne"
    numberPlace = 80
    hourStart = "14:30"
    hourEnd = "16:26"
    dateSeance = $today
    salleId = "Salle 2"
    price = 10.00
}

$sessionObjects += [PSCustomObject]@{
    nameMovie = "Atlas"
    numberPlace = 150
    hourStart = "18:00"
    hourEnd = "20:09"
    dateSeance = $today
    salleId = "Salle 3"
    price = 12.50
}

$sessionObjects += [PSCustomObject]@{
    nameMovie = "Hyperdrive"
    numberPlace = 200
    hourStart = "21:00"
    hourEnd = "23:18"
    dateSeance = $tomorrow
    salleId = "Salle 1"
    price = 14.00
}

foreach ($session in $sessionObjects) {
    try {
        $json = $session | ConvertTo-Json
        $response = Invoke-WebRequest -Uri http://localhost:3030/sessions/seance -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -ErrorAction Stop
        Write-Host "  OK: $($session.nameMovie) - $($session.dateSeance)" -ForegroundColor $Green
    } catch {
        Write-Host "  ERREUR: $($session.nameMovie) - $($_.Exception.Message)" -ForegroundColor $Red
    }
}

# 5. Import JSON custom si fourni
if ($importJson -and (Test-Path $importJson)) {
    Write-Status ""
    Write-Status "Import depuis fichier JSON: $importJson" $Yellow
    
    try {
        $data = Get-Content $importJson | ConvertFrom-Json
        
        # Import movies depuis JSON
        if ($data.movies -and $data.movies.Count -gt 0) {
            Write-Status "Import des movies depuis JSON..." $Yellow
            foreach ($movie in $data.movies) {
                try {
                    $json = $movie | ConvertTo-Json
                    $response = Invoke-WebRequest -Uri http://localhost:3030/catalogue/movies -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -ErrorAction Stop
                    Write-Host "  OK: $($movie.title)" -ForegroundColor $Green
                } catch {
                    Write-Host "  ERREUR: $($movie.title) - $($_.Exception.Message)" -ForegroundColor $Red
                }
            }
        }
        
        # Import sessions depuis JSON
        if ($data.sessions -and $data.sessions.Count -gt 0) {
            Write-Status "Import des séances depuis JSON..." $Yellow
            foreach ($session in $data.sessions) {
                try {
                    $json = $session | ConvertTo-Json
                    $response = Invoke-WebRequest -Uri http://localhost:3030/sessions/seance -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -ErrorAction Stop
                    Write-Host "  OK: $($session.nameMovie)" -ForegroundColor $Green
                } catch {
                    Write-Host "  ERREUR: $($session.nameMovie) - $($_.Exception.Message)" -ForegroundColor $Red
                }
            }
        }
        
    } catch {
        Write-Status "ERREUR lecture JSON: $($_.Exception.Message)" $Red
    }
}

# 6. Afficher les infos d'accès
Write-Status ""
Write-Status "=== INITIALISATION COMPLÈTE ===" $Green
Write-Status ""
Write-Status "Frontal: http://localhost:5173" $Green
Write-Status "Admin: http://localhost:5173/admin" $Green
Write-Status "Gateway: http://localhost:3030" $Green
Write-Status "Catalog: http://localhost:4001" $Green
Write-Status "Booking: http://localhost:4003" $Green
Write-Status "Auth: http://localhost:4002" $Green
Write-Status ""
