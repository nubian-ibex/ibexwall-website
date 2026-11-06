---
title: "Datenschutz"
description: "IbexWall hat keine Telemetrie, kein Konto und keine Analyse. Was auf Ihrem Computer gespeichert wird, was der Resolver aufzeichnet und wie Sie prüfen, dass nichts abfließt."
updated: 2026-11-06
---

IbexWall sammelt keine Daten über Sie oder Ihren Computer. Es gibt keine Telemetrie, kein Konto, keine Analyse und keine Update-Prüfung, die sich bei Dritten meldet. Diese Website verwendet keine Cookies, keine Analyse und keine Anfragen an Dritte. Schriften und Bilder kommen von derselben Adresse wie die Seiten.

## Was auf Ihrem Computer bleibt

- Der Zustand des Programms (Pläne, Verlauf, das Audit-Protokoll) liegt in `/var/lib/ibexwall`, die Einstellungen in `/etc/ibexwall`. Wo es nötig ist, kann nur root sie lesen.
- Das Audit-Protokoll ist eine Kette: Jede Zeile enthält den Hash der vorherigen, sodass eine entfernte oder geänderte Zeile auffällt.
- Der Resolver für sicheres DNS zählt Abfragen und Sperren. Die Namen, die Sie abfragen, zeichnet er nie auf.

## Was Ihren Computer verlässt, und nur auf Ihren Wunsch

IbexWall nutzt das Netzwerk, wenn Sie es dazu auffordern: Eine DNS-Abfrage von Ihnen geht über eine verschlüsselte Verbindung an den Resolver, den Sie gewählt haben. Ein Paket-Update, das Sie starten, geht an Ihre Distribution. Ein KI-Assistent, den Sie verbinden, kann einen geschwärzten Status lesen, über eine Verbindung, die Sie eingerichtet haben, mit einem Schlüssel, den Sie entfernen können.

## Prüfen Sie es selbst

Sie müssen das nicht einfach glauben. Beobachten Sie die Verbindungen mit `ss -tup`, zeichnen Sie den Datenverkehr mit `tcpdump` auf oder nutzen Sie die Netzwerkansicht pro Programm, um zu sehen, was jeder Prozess kontaktiert. Der Artikel [Keine Telemetrie in einem Sicherheitswerkzeug](/de/articles/no-telemetry-in-a-security-tool/) zeigt, wie.

## Diese Website

Die Seiten sind statische Dateien. Es gibt keine Cookies, keine Skripte von anderen Websites und kein Tracking. Links zu anderen Websites, etwa GitHub und der Dokumentation, sind gewöhnliche Links.
