# Script d'initialisation et de seed des bases de donnees MS-Cinema
# Usage: .\init-db.ps1
# ou:    .\init-db.ps1 -importJson "C:\path\to\seed-data.json"

param(
    [string]$importJson = ""
)

$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Red = [System.ConsoleColor]::Red

function Write-Status {
    param([string]$message, [System.ConsoleColor]$color = $Green)
    Write-Host ">> $message" -ForegroundColor $color
}

function Wait-Service {
    param([int]$port, [int]$maxWait = 45)
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

Write-Status "Arret des containers existants..." $Yellow
docker compose down 2>&1 | Out-Null

Write-Status "Lancement des containers..." $Yellow
docker compose up -d 2>&1 | Out-Null

Write-Status "Attente du demarrage des services..." $Yellow
Start-Sleep -Seconds 8

Write-Status "Verification de la disponibilite de Catalog (port 4001)..." $Yellow
if (Wait-Service -port 4001) {
    Write-Status "Catalog est pret" $Green
} else {
    Write-Status "Catalog n'a pas repondu a temps" $Red
}

Write-Status "Verification de la disponibilite de Booking (port 4003)..." $Yellow
if (Wait-Service -port 4003) {
    Write-Status "Booking est pret" $Green
} else {
    Write-Status "Booking n'a pas repondu a temps" $Red
}

Write-Status ""
Write-Status "Purge logique des donnees Catalog/Booking..." $Yellow
docker exec ms-cinema-postgres psql -U postgres -d catalog_db -c 'DO $$ BEGIN IF to_regclass(''public.movies'') IS NOT NULL THEN TRUNCATE TABLE movies RESTART IDENTITY CASCADE; END IF; END $$;' 2>&1 | Out-Null
docker exec ms-cinema-postgres psql -U postgres -d booking_db -c 'DO $$ BEGIN IF to_regclass(''public.reservations'') IS NOT NULL THEN TRUNCATE TABLE reservations RESTART IDENTITY CASCADE; END IF; IF to_regclass(''public.seances'') IS NOT NULL THEN TRUNCATE TABLE seances RESTART IDENTITY CASCADE; END IF; END $$;' 2>&1 | Out-Null

Write-Status ""
Write-Status "Population des bases de donnees..." $Yellow
Write-Status ""

$today = (Get-Date).ToString("yyyy-MM-dd")
$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")

$movieObjects = @()
$movieObjects += [PSCustomObject]@{
    title = "Dune: Part Two"
    genre = "Science-Fiction"
    duration = 166
    rating = 4.7
    year = 2024
    ageRating = "12+"
    image = "https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg"
    description = "Paul Atreides s'unit aux Fremen pour affronter les Harkonnen."
    director = "Denis Villeneuve"
    synopsis = "Suite epique de Dune avec la guerre pour Arrakis."
}

$movieObjects += [PSCustomObject]@{
    title = "Oppenheimer"
    genre = "Biopic / Drame"
    duration = 180
    rating = 4.6
    year = 2023
    ageRating = "12+"
    image = "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg"
    description = "Portrait de J. Robert Oppenheimer pendant le projet Manhattan."
    director = "Christopher Nolan"
    synopsis = "Le parcours du physicien derriere la bombe atomique."
}

$movieObjects += [PSCustomObject]@{
    title = "Parasite"
    genre = "Thriller / Drame"
    duration = 132
    rating = 4.6
    year = 2019
    ageRating = "16+"
    image = "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png"
    description = "Une famille precaire infiltre peu a peu une famille riche."
    director = "Bong Joon-ho"
    synopsis = "Satire sociale coreenne oscarisee."
}

$movieObjects += [PSCustomObject]@{
    title = "The Dark Knight"
    genre = "Action / Crime"
    duration = 152
    rating = 4.8
    year = 2008
    ageRating = "12+"
    image = "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg"
    description = "Batman affronte le Joker qui plonge Gotham dans le chaos."
    director = "Christopher Nolan"
    synopsis = "Un classique moderne du film de super-heros."
}

$movieObjects += [PSCustomObject]@{
    title = "The Godfather"
    genre = "Crime / Drame"
    duration = 175
    rating = 4.9
    year = 1972
    ageRating = "16+"
    image = "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg"
    description = "Le pouvoir et les conflits de la famille Corleone."
    director = "Francis Ford Coppola"
    synopsis = "Reference absolue du cinema de mafia."
}

$movieObjects += [PSCustomObject]@{
    title = "Casablanca"
    genre = "Romance / Drame"
    duration = 102
    rating = 4.5
    year = 1942
    ageRating = "TP"
    image = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/CasablancaPoster-Gold.jpg/330px-CasablancaPoster-Gold.jpg"
    description = "Dans le Maroc de la guerre, Rick retrouve son amour passe."
    director = "Michael Curtiz"
    synopsis = "Un grand classique du cinema hollywoodien."
}

Write-Status "Creation des movies..." $Yellow
foreach ($movie in $movieObjects) {
    try {
        $json = $movie | ConvertTo-Json
        Invoke-WebRequest -Uri http://localhost:3030/catalogue/movies -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -ErrorAction Stop | Out-Null
        Write-Host "  OK: $($movie.title)" -ForegroundColor $Green
    } catch {
        Write-Host "  ERREUR: $($movie.title) - $($_.Exception.Message)" -ForegroundColor $Red
    }
}

Write-Status ""
Write-Status "Creation des sessions..." $Yellow

$sessionObjects = @()
$sessionObjects += [PSCustomObject]@{
    nameMovie = "Dune: Part Two"
    numberPlace = 120
    hourStart = "20:00"
    hourEnd = "22:46"
    dateSeance = $today
    salleId = "Salle 1"
    price = 14.50
}

$sessionObjects += [PSCustomObject]@{
    nameMovie = "Oppenheimer"
    numberPlace = 80
    hourStart = "14:30"
    hourEnd = "17:30"
    dateSeance = $today
    salleId = "Salle 2"
    price = 13.50
}

$sessionObjects += [PSCustomObject]@{
    nameMovie = "The Dark Knight"
    numberPlace = 150
    hourStart = "18:00"
    hourEnd = "20:32"
    dateSeance = $today
    salleId = "Salle 3"
    price = 12.00
}

$sessionObjects += [PSCustomObject]@{
    nameMovie = "Casablanca"
    numberPlace = 200
    hourStart = "21:00"
    hourEnd = "22:42"
    dateSeance = $tomorrow
    salleId = "Salle 1"
    price = 9.50
}

foreach ($session in $sessionObjects) {
    try {
        $json = $session | ConvertTo-Json
        Invoke-WebRequest -Uri http://localhost:3030/sessions -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -ErrorAction Stop | Out-Null
        Write-Host "  OK: $($session.nameMovie) - $($session.dateSeance)" -ForegroundColor $Green
    } catch {
        Write-Host "  ERREUR: $($session.nameMovie) - $($_.Exception.Message)" -ForegroundColor $Red
    }
}

if ($importJson -and (Test-Path $importJson)) {
    Write-Status ""
    Write-Status "Import depuis fichier JSON: $importJson" $Yellow

    try {
        $data = Get-Content $importJson | ConvertFrom-Json

        if ($data.movies -and $data.movies.Count -gt 0) {
            Write-Status "Import des movies depuis JSON..." $Yellow
            foreach ($movie in $data.movies) {
                try {
                    $json = $movie | ConvertTo-Json
                    Invoke-WebRequest -Uri http://localhost:3030/catalogue/movies -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -ErrorAction Stop | Out-Null
                    Write-Host "  OK: $($movie.title)" -ForegroundColor $Green
                } catch {
                    Write-Host "  ERREUR: $($movie.title) - $($_.Exception.Message)" -ForegroundColor $Red
                }
            }
        }

        if ($data.sessions -and $data.sessions.Count -gt 0) {
            Write-Status "Import des seances depuis JSON..." $Yellow
            foreach ($session in $data.sessions) {
                try {
                    $json = $session | ConvertTo-Json
                    Invoke-WebRequest -Uri http://localhost:3030/sessions -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -ErrorAction Stop | Out-Null
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

Write-Status ""
Write-Status "=== INITIALISATION COMPLETE ===" $Green
Write-Status ""
Write-Status "Frontal: http://localhost:5173" $Green
Write-Status "Admin: http://localhost:5173/admin" $Green
Write-Status "Gateway: http://localhost:3030" $Green
Write-Status "Catalog: http://localhost:4001" $Green
Write-Status "Booking: http://localhost:4003" $Green
Write-Status "Auth: http://localhost:4002" $Green
Write-Status ""
