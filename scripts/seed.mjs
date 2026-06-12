/**
 * Seed-Skript für CampusSport Connect.
 *
 * Legt Demo-Nutzer, Profile, Sporttreffen und Teilnahmen an.
 * Voraussetzung: supabase/schema.sql wurde im SQL Editor ausgeführt
 * und .env.local enthält den SUPABASE_SERVICE_ROLE_KEY.
 *
 * Aufruf:  node scripts/seed.mjs
 * Idempotent: erneutes Ausführen erzeugt keine Duplikate.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// --- .env.local einlesen (ohne zusätzliche Abhängigkeit) -------------------

const envFile = new URL("../.env.local", import.meta.url);
const env = Object.fromEntries(
  readFileSync(envFile, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => [
      line.slice(0, line.indexOf("=")).trim(),
      line.slice(line.indexOf("=") + 1).trim(),
    ])
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt in .env.local"
  );
  process.exit(1);
}

// Service-Role-Client: umgeht RLS, nur für Seeding/Adminaufgaben.
const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "Demo1234!";

// --- Demo-Daten -------------------------------------------------------------

const demoUsers = [
  { vorname: "Lena",  studiengang: "Betriebswirtschaft",          semester: 3, sportarten: ["Badminton", "Volleyball"], niveau: "Mittel" },
  { vorname: "Tim",   studiengang: "Informatik",                  semester: 1, sportarten: ["Fußball", "Basketball"],   niveau: "Anfänger" },
  { vorname: "Sara",  studiengang: "Wirtschaftsinformatik",       semester: 5, sportarten: ["Laufen", "Bouldern"],      niveau: "Fortgeschritten" },
  { vorname: "Jonas", studiengang: "Maschinenbau",                semester: 2, sportarten: ["Fußball", "Fitness"],      niveau: "Mittel" },
  { vorname: "Marie", studiengang: "Medizinische Informatik",     semester: 4, sportarten: ["Volleyball", "Badminton"], niveau: "Mittel" },
  { vorname: "Felix", studiengang: "Elektrotechnik",              semester: 6, sportarten: ["Tennis", "Fitness"],       niveau: "Fortgeschritten" },
  { vorname: "Aylin", studiengang: "International Business",      semester: 1, sportarten: ["Laufen", "Volleyball"],    niveau: "Anfänger" },
  { vorname: "David", studiengang: "Software Engineering",        semester: 3, sportarten: ["Basketball", "Bouldern"],  niveau: "Mittel" },
];

const emailFor = (vorname) =>
  `${vorname.toLowerCase()}@demo.campussport.de`;

/** Datum in X Tagen um HH:MM Uhr (lokale Zeit). */
function inDays(days, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// creator: Vorname; teilnehmer: [Vorname, kommt_allein]
const demoMeetings = [
  {
    titel: "Badminton Runde",
    sportart: "Badminton",
    ort: "Sporthalle Sontheim",
    datum: inDays(2, 18, 30),
    niveau: "Mittel",
    max_plaetze: 8,
    erstie_freundlich: true,
    creator: "Lena",
    beschreibung:
      "Lockere Badminton-Runde nach den Vorlesungen. Wir spielen Doppel und wechseln regelmäßig durch, damit jeder mit jedem spielt.",
    ablauf:
      "Wir treffen uns am Halleneingang, wärmen uns 10 Minuten gemeinsam auf und spielen dann ca. 90 Minuten Doppel. Schläger können gestellt werden, danach gehen oft ein paar Leute noch etwas trinken.",
    teilnehmer: [["Marie", true], ["Tim", true], ["Aylin", false]],
  },
  {
    titel: "Fußball Campusfeld",
    sportart: "Fußball",
    ort: "Campusfeld Sontheim",
    datum: inDays(3, 17, 0),
    niveau: "Anfänger",
    max_plaetze: 14,
    erstie_freundlich: true,
    creator: "Jonas",
    beschreibung:
      "Entspanntes Kicken auf dem Campusfeld – es geht um Spaß, nicht um Leistung. Alle Niveaus willkommen, auch komplette Anfänger.",
    ablauf:
      "Teams werden vor Ort fair gemischt. Wir spielen zwei Halbzeiten à 30 Minuten auf Kleinfeldtore. Bring nur Sportschuhe und etwas zu trinken mit.",
    teilnehmer: [["Tim", true], ["David", true], ["Felix", true], ["Lena", false]],
  },
  {
    titel: "Gym Buddy gesucht",
    sportart: "Fitness",
    ort: "McFit Heilbronn",
    datum: inDays(4, 16, 0),
    niveau: "Mittel",
    max_plaetze: 4,
    erstie_freundlich: false,
    creator: "Felix",
    beschreibung:
      "Suche Trainingspartner für regelmäßiges Krafttraining. Aktuell Push/Pull/Legs, Plan kann aber angepasst werden.",
    ablauf:
      "Wir treffen uns im Eingangsbereich vom McFit. Erst kurzes Aufwärmen am Cardio-Gerät, dann ca. 60–75 Minuten Krafttraining. Wer noch keinen Plan hat, bekommt Hilfe beim Einstieg.",
    teilnehmer: [["Jonas", true], ["David", true]],
  },
  {
    titel: "Laufgruppe Neckarufer",
    sportart: "Laufen",
    ort: "Neckarufer Heilbronn",
    datum: inDays(5, 8, 0),
    niveau: "Anfänger",
    max_plaetze: 10,
    erstie_freundlich: true,
    creator: "Sara",
    beschreibung:
      "Gemeinsame Morgenrunde am Neckar entlang, ca. 5–7 km in lockerem Tempo. Niemand wird zurückgelassen!",
    ablauf:
      "Treffpunkt an der Friedrich-Ebert-Brücke. Gemeinsames Aufwärmen, dann laufen wir in einem Tempo, bei dem man sich noch unterhalten kann. Am Ende leichtes Dehnen.",
    teilnehmer: [["Aylin", true], ["Lena", true], ["Marie", true]],
  },
  {
    titel: "Volleyball Abend",
    sportart: "Volleyball",
    ort: "Sporthalle Heilbronn",
    datum: inDays(7, 19, 0),
    niveau: "Mittel",
    max_plaetze: 12,
    erstie_freundlich: false,
    creator: "Marie",
    beschreibung:
      "Volleyball-Abend für alle, die schon mal gespielt haben. Grundtechniken (Baggern, Pritschen) sollten sitzen.",
    ablauf:
      "Wir bauen gemeinsam die Netze auf, spielen uns ein und machen dann Matches 4 gegen 4 oder 6 gegen 6, je nach Teilnehmerzahl. Hallenschuhe nicht vergessen.",
    teilnehmer: [["Lena", true], ["Aylin", true], ["David", false]],
  },
  {
    titel: "Basketball am Campus",
    sportart: "Basketball",
    ort: "Basketballplatz Campus Sontheim",
    datum: inDays(9, 17, 30),
    niveau: "Mittel",
    max_plaetze: 10,
    erstie_freundlich: true,
    creator: "David",
    beschreibung:
      "Streetball auf dem Campusplatz. Wir spielen 3 gegen 3 oder 5 gegen 5, je nachdem wie viele kommen.",
    ablauf:
      "Erst ein paar Wurfspiele zum Warmwerden, dann Teams auslosen und Matches bis 21 Punkte. Bei Regen weichen wir auf die Halle aus – Info kommt hier rein.",
    teilnehmer: [["Tim", true], ["Jonas", true]],
  },
  {
    titel: "Tennis Doppel",
    sportart: "Tennis",
    ort: "TC Heilbronn",
    datum: inDays(11, 10, 0),
    niveau: "Fortgeschritten",
    max_plaetze: 4,
    erstie_freundlich: false,
    creator: "Felix",
    beschreibung:
      "Suche drei Leute für ein Doppel am Samstagvormittag. Solide Grundschläge und etwas Matcherfahrung wären gut.",
    ablauf:
      "Platz ist für zwei Stunden reserviert. Wir schlagen uns 20 Minuten ein und spielen dann zwei Sätze Doppel mit wechselnden Paarungen. Bälle bringe ich mit.",
    teilnehmer: [["Sara", true]],
  },
  {
    titel: "Bouldern für Einsteiger",
    sportart: "Bouldern",
    ort: "Kletterhalle Heilbronn",
    datum: inDays(13, 18, 0),
    niveau: "Anfänger",
    max_plaetze: 6,
    erstie_freundlich: true,
    creator: "Sara",
    beschreibung:
      "Bouldern ausprobieren ohne Vorkenntnisse! Ich klettere seit drei Jahren und zeige euch gern die Basics.",
    ablauf:
      "Wir treffen uns an der Kasse (Studierendenrabatt mitnehmen!). Kurze Einführung zu Regeln und Sicherheit, dann klettern wir gemeinsam die leichten Routen. Leihschuhe gibt es vor Ort.",
    teilnehmer: [["David", true], ["Tim", true], ["Aylin", true], ["Marie", false]],
  },
];

// --- Seeding ----------------------------------------------------------------

/** Bricht bei Supabase-Fehlern mit Meldung ab. */
function check(error, kontext) {
  if (error) {
    console.error(`Fehler bei ${kontext}:`, error.message);
    process.exit(1);
  }
}

async function seedUsers() {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });
  check(error, "listUsers");
  const existing = new Map(data.users.map((u) => [u.email, u.id]));

  const ids = new Map(); // Vorname -> user id
  for (const user of demoUsers) {
    const email = emailFor(user.vorname);
    let id = existing.get(email);
    if (!id) {
      const { data: created, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          password: PASSWORD,
          email_confirm: true,
        });
      check(createError, `createUser ${email}`);
      id = created.user.id;
      console.log(`Nutzer angelegt: ${email}`);
    } else {
      console.log(`Nutzer existiert bereits: ${email}`);
    }
    ids.set(user.vorname, id);
  }

  const profiles = demoUsers.map((user) => ({
    id: ids.get(user.vorname),
    name: user.vorname,
    studiengang: user.studiengang,
    semester: user.semester,
    sportarten: user.sportarten,
    niveau: user.niveau,
  }));
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profiles, { onConflict: "id" });
  check(profileError, "profiles upsert");
  console.log(`${profiles.length} Profile aktualisiert.`);

  return ids;
}

async function seedMeetings(userIds) {
  const { data: existing, error } = await supabase
    .from("meetings")
    .select("id, titel");
  check(error, "meetings select");
  const byTitel = new Map(existing.map((m) => [m.titel, m.id]));

  const meetingIds = new Map(); // titel -> id
  for (const meeting of demoMeetings) {
    let id = byTitel.get(meeting.titel);
    if (!id) {
      const { data: inserted, error: insertError } = await supabase
        .from("meetings")
        .insert({
          creator_id: userIds.get(meeting.creator),
          titel: meeting.titel,
          sportart: meeting.sportart,
          beschreibung: meeting.beschreibung,
          ablauf: meeting.ablauf,
          datum: meeting.datum,
          ort: meeting.ort,
          niveau: meeting.niveau,
          max_plaetze: meeting.max_plaetze,
          erstie_freundlich: meeting.erstie_freundlich,
        })
        .select("id")
        .single();
      check(insertError, `meeting "${meeting.titel}"`);
      id = inserted.id;
      console.log(`Treffen angelegt: ${meeting.titel}`);
    } else {
      console.log(`Treffen existiert bereits: ${meeting.titel}`);
    }
    meetingIds.set(meeting.titel, id);
  }
  return meetingIds;
}

async function seedParticipations(userIds, meetingIds) {
  const rows = demoMeetings.flatMap((meeting) =>
    meeting.teilnehmer.map(([vorname, kommtAllein]) => ({
      meeting_id: meetingIds.get(meeting.titel),
      user_id: userIds.get(vorname),
      kommt_allein: kommtAllein,
    }))
  );
  const { error } = await supabase
    .from("participations")
    .upsert(rows, { onConflict: "meeting_id,user_id" });
  check(error, "participations upsert");
  console.log(`${rows.length} Teilnahmen aktualisiert.`);
}

const userIds = await seedUsers();
const meetingIds = await seedMeetings(userIds);
await seedParticipations(userIds, meetingIds);
console.log("Seeding abgeschlossen.");
