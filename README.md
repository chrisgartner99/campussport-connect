# CampusSport Connect

CampusSport Connect ist eine Webplattform für Studierende der Hochschule
Heilbronn, um Sporttreffen zu finden, selbst zu erstellen und Mitspieler
kennenzulernen. Das Projekt entsteht als benoteter Prototyp im Rahmen
einer Lehrveranstaltung.

## Tech-Stack

- [Next.js](https://nextjs.org/) (App Router) mit TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) für Auth, Datenbank und Realtime (folgt in Schritt 2)
- ESLint

## Setup

Voraussetzungen: Node.js 20+ und npm.

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (http://localhost:3000)
npm run dev

# Produktions-Build prüfen
npm run build
```

## Datenbank-Setup

1. `.env.example` nach `.env.local` kopieren und die Werte aus dem
   Supabase-Dashboard (Project Settings → API) eintragen.
2. Den Inhalt von [`supabase/schema.sql`](supabase/schema.sql) im
   Supabase SQL Editor ausführen (legt Tabellen, Trigger, RLS-Policies
   und Indizes an; kann gefahrlos erneut ausgeführt werden).
3. Demo-Daten einspielen:

   ```bash
   node scripts/seed.mjs
   ```

   Das Skript ist idempotent – ein erneuter Lauf erzeugt keine
   Duplikate.

**Hinweis:** Alle Nutzer, Treffen und Orte sind Demo-Daten für den
Prototyp. Die Demo-Accounts (z. B. `lena@demo.campussport.de`) haben
einheitlich das Passwort `Demo1234!`.

## Feature → Pain Point aus Nutzerinterviews

| Feature | Pain Point aus Nutzerinterviews |
| ------- | ------------------------------- |
| Onboarding mit Semesterabfrage | Fehlende Kontakte und Unsicherheit bei Erstsemestern |
| "Was erwartet dich"-Abschnitt | Unklare Infos zu Ablauf und Niveau |
| "X von Y kommen allein" | Soziale Hemmung, Angst nicht dazuzugehören |
| Verbindliches Beitreten/Absagen | Unverbindliche Verabredungen und spontane Absagen |
| Filter (Sportart, Datum, Ort, Niveau) | Unklare Infos zu Zeit, Ort, Sportart, Niveau |
| Startseite mit Abschnitt "Speziell für Erstsemester" | Unsicherheit und Hemmschwelle beim Studienstart |
| "So funktioniert's"-Schritte | Unklarheit, wie man als Neuling überhaupt anfängt |
| Personalisierte Erstie-Begrüßung nach dem Onboarding (Name + Sportarten) | Gefühl, fehl am Platz zu sein und niemanden zu kennen |
| Erstie-Fokus: anfängerfreundliche Treffen zuerst, "allein"-Hinweis betont | Angst, als Einzige:r ohne Anschluss dazustehen |
| Mitspieler-Suche mit "auch neu hier"-Filter | Kennt zu wenige Leute / Abhängigkeit vom Freundeskreis |
| Anfragen an andere Studierende | Soziale Hemmung beim Ansprechen neuer Personen |
| Freundesliste + 1:1-Chat | Soziale Vernetzung über Sport, Kontakte halten und koordinieren |

## Projektstruktur

Siehe [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) für eine Übersicht der
Seiten und der geplanten Datenstruktur.

## Lizenz

Siehe [LICENSE](LICENSE) (CC-BY).
