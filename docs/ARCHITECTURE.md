# Architektur-Übersicht

Kurzübersicht der geplanten Struktur von CampusSport Connect.
Stand: Schritt 1 (Grundgerüst, noch ohne Features und ohne Supabase).

## Seiten (App Router)

| Route | Zweck |
| ----- | ----- |
| `/` | Startseite mit Einstieg in die Plattform |
| `/treffen` | Übersicht aller Sporttreffen (Liste/Filter) |
| `/treffen/[id]` | Detailansicht eines Sporttreffens, Teilnahme |
| `/treffen/neu` | Formular zum Erstellen eines Sporttreffens |
| `/mitspieler` | Mitspieler-Suche nach Sportart/Niveau |
| `/meine-treffen` | Eigene und zugesagte Treffen |
| `/freunde` | Freundesliste und Freundschaftsanfragen |
| `/chat` | Nachrichten mit anderen Studierenden |
| `/login` | Anmeldung |
| `/registrieren` | Registrierung |
| `/onboarding` | Profil-Einrichtung nach der Registrierung |

## Ordnerstruktur

```
app/         Routen und Layout (App Router)
components/  Wiederverwendbare UI-Komponenten (Header, Footer, ...)
lib/         Hilfsfunktionen, Typen, Clients (folgt)
supabase/    Supabase-Konfiguration und Migrationen (folgt in Schritt 2)
docs/        Projektdokumentation
```

## Geplante Supabase-Tabellen

| Tabelle | Inhalt |
| ------- | ------ |
| `profiles` | Nutzerprofile (Name, Studiengang, Sportarten, Niveau) |
| `meetings` | Sporttreffen (Sportart, Ort, Zeit, max. Teilnehmer, Ersteller) |
| `participations` | Teilnahmen von Nutzern an Treffen |
| `requests` | Anfragen (z. B. Teilnahme- oder Mitspieler-Anfragen) |
| `friendships` | Freundschaften zwischen Nutzern |
| `messages` | Chat-Nachrichten |

Auth läuft über Supabase Auth; Zugriffe werden über Row Level Security
abgesichert. Details folgen, sobald das Datenmodell in Schritt 2
umgesetzt wird.
