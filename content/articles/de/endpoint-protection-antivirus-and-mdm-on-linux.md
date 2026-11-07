---
title: "Endpoint-Schutz, Antivirus und MDM unter Linux, erklärt"
description: "Was Antivirus, EDR, Endpoint-Schutz und MDM wirklich bedeuten, welche es für Linux gibt, und wo ein lokales Security Center wie IbexWall hineinpasst."
slug: "endpoint-protection-antivirus-and-mdm-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [endpoint, antivirus, edr, mdm, unternehmen]
related_hardening: []
---

Die Wörter werden austauschbar benutzt und bedeuten Verschiedenes. Dieser Artikel trennt sie, sagt, welche es für Linux gibt, und verortet IbexWall auf der Karte.

## Die vier Wörter

- Antivirus (AV). Sucht bekannte schädliche Dateien per Signatur. ClamAV ist das Open-Source-Programm unter Linux; es gibt auch kommerzielle Scanner. Auf einem Linux-Desktop liegt sein Hauptwert darin, Dateien zu prüfen, die durch die Maschine laufen (Mail, Downloads, ein geteilter Ordner), denn Windows-Malware läuft unter Linux selten, kann aber in einem Anhang stecken, den jemand weiterleitet.
- Endpoint Protection (EPP). Antivirus plus ein paar Schichten mehr: Host-Firewall, Anwendungskontrolle, Gerätekontrolle und eine Verwaltungskonsole. Denk an „Antivirus mit Richtlinien".
- Endpoint Detection and Response (EDR). Zeichnet auf, was auf der Maschine läuft, und sucht nach Verhalten, nicht nur Signatur: eine Shell, die ein Dokumentenleser startet, ein Prozess, der den Speicher eines anderen liest. Hier leben CrowdStrike Falcon, SentinelOne, Sophos und Microsoft Defender for Endpoint (das einen Linux-Agenten hat).
- Mobile Device Management (MDM). Nicht wirklich „Sicherheit", sondern Flottenkontrolle: ein Gerät registrieren, Konfiguration ausrollen, Festplattenverschlüsselung erzwingen, löschen. Unter Linux sind die nächsten Fleet, Ubuntu Landscape, SUSE Manager und Red Hat Satellite.

EPP, EDR und MDM bauen alle auf eine zentrale Konsole. Sie setzen eine Organisation voraus, der die Geräte gehören und die einen einzigen Betreiber will, der alle sieht und steuert.

## Was sie alle gemeinsam haben

Sie melden nach oben und steuern nach unten. Der Endpoint sendet Daten an eine Konsole, und die Konsole schickt Richtlinien zurück. Für eine verwaltete Flotte ist das gut, aber es hat zwei Kosten für den Desktop-Nutzer: Die Daten verlassen die Maschine, und die Kontrolle liegt woanders.

## Wo IbexWall hineinpasst

IbexWall ist absichtlich keines der vier. Es ist ein lokales Security Center: Es zeigt einen Score, erklärt die Befunde und wendet jede Korrektur als einen Plan an, den du prüfst, mit Schnappschuss und Rückgängig. Es gibt keine Konsole, keine Telemetrie und niemanden außer dir, der die Maschine ändern kann.

Das macht es zu einer Ergänzung, nicht zu einem Ersatz. Ein Unternehmen, das ein EDR betreibt, profitiert trotzdem von IbexWall, weil:

- Der Mensch an der Maschine bekommt eine Sicht, die der Konsolenbetreiber nicht geben kann: was sich geändert hat, warum es wichtig ist und wie man es rückgängig macht.
- Der Postur-Check und die 26 Härtungs-Einstellungen schließen die Lücken, die das EDR nicht verwaltet, etwa Festplattenverschlüsselung, Login-Banner, Passwortrichtlinie und eingehendes Standard-Verweigern.
- Der Compliance-Bildschirm erzeugt einen signierten Bericht, den ein Flottenmanager oder Prüfer einsammeln kann, ohne dass IbexWall selbst nach Hause telefoniert.

Für eine Organisation, die Menschen auf Linux-Desktops umstellt, ist das Hindernis oft nicht der Endpoint-Agent, sondern der Alltag: Ist diese Maschine verschlüsselt, gepatcht und gesperrt, und kann das jemand ohne Sysadmin beantworten? IbexWall beantwortet es auf der Maschine selbst, ehrlich, und liefert den Beleg, den das Unternehmen aufbewahren kann.
