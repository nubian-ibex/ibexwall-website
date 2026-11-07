---
title: "Was ist ein Security Center für Linux?"
description: "Ein Security Center ist ein einziger Ort, um zu sehen, wie sicher ein Linux ist, zu verstehen, was zu beheben ist, und jede Korrektur sicher anzuwenden. Warum Linux keines hatte, und was IbexWall dagegen tut."
slug: "what-is-a-security-center-for-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [security-center, überblick, postur, geschichte]
related_hardening: []
---

Windows und macOS bringen ein Bedienfeld mit, das eine Frage an einem einzigen Ort beantwortet: Wie sicher ist diese Maschine, und was tue ich dagegen. Linux hat die Teile, aber nicht den Ort. Dieser Artikel handelt vom Ort, und von IbexWall als dem Versuch, ihn zu bauen.

## Was ein Security Center ist

Ein Security Center hat drei Aufgaben:

- Zeigen. Den Zustand der Maschine lesen und in einer einzigen Ansicht bündeln: Ist die Festplatte verschlüsselt, ist die Firewall an, warten Updates, welche Konten können root werden, was lauscht im Netz.
- Erklären. Eine Einstellung oder eine Warnung in Worte fassen, mit denen ein Mensch handeln kann, und sagen, was eine Änderung kaputtmachen kann.
- Sicher ändern. Eine Korrektur als einen Schritt anwenden, den man vorher prüft, mit einem Weg zurück.

Beim letzten Punkt hören die meisten Linux-Werkzeuge auf. Sie sagen, dass etwas nicht stimmt, aber das Anwenden bleibt an dir hängen: eine Datei bearbeiten, einen Befehl als root ausführen, hoffen, dass die Maschine noch bootet.

## Warum Linux nie eines hatte

Sicherheit unter Linux ist eine Sammlung kleiner, scharfer Werkzeuge, jedes mit eigener Konfigurationsdatei und eigener Oberfläche:

- Die Firewall ist `firewalld`, `ufw` oder reines `nftables`, je nach Distribution.
- Mandatory Access Control ist AppArmor unter Ubuntu und SELinux unter Fedora und RHEL.
- Auditing ist `auditd`; Festplattenverschlüsselung ist LUKS; SSH ist `/etc/ssh/sshd_config`.
- Jedes hat seine eigene Manpage, seine eigene Syntax und seine eigene Vorstellung von „an".

Keines spricht mit dem anderen. Wer eine einzige Antwort will, muss zuerst Systemadministrator werden.

## Was SuSE und andere bauten

Die Idee ist nicht neu. SUSE's `SuSEfirewall2` verpackte `iptables` in ein Bündel von Skripten mit einer einzigen Konfigurationsdatei, sodass die Firewall zu etwas wurde, das man einschaltete und beschrieb, statt zu einem Haufen Regeln. YaST, das Verwaltungswerkzeug von openSUSE, ging weiter: eine einzige Oberfläche mit Modulen für Firewall, Bootloader, Benutzer und Dienste.

Das waren Verwaltungswerkzeuge, gedacht für den, der die Maschine betreibt. Sie erfüllten „zeigen" und „ändern", aber das „erklären und prüfen", der Teil, der eine Änderung für Laien sicher macht, blieb dünn. Diese Lücke ist der Grund, warum ein Security Center für den Linux-Desktop noch immer fehlt.

## Was ein modernes braucht

Ein Security Center für den Desktop muss die Teile zusammenarbeiten lassen, ohne so zu tun, als wären sie eins:

- Ein Postur-Check, der den echten Zustand liest und ehrlich bewertet, wobei „unbekannt" niemals ein Bestehen ist.
- Eine einzige Firewall-Oberfläche, ob die Maschine nun firewalld, ufw oder nichts nutzt.
- Netzwerkkontrolle pro Programm, damit ein neues Programm erst fragen muss, bevor es ins Internet darf.
- Ein Prüfschritt für jede Änderung: die genauen Dateien, Regeln und Dienste, die sie berührt, und was kaputtgehen kann, mit Schnappschuss und Rückgängig.
- Keine Telemetrie. Ein Sicherheitswerkzeug, das nach Hause telefoniert, ist ein Widerspruch.

## Wie IbexWall dieser Ort sein will

IbexWall ist ein Security Center für Linux-Desktops. Sein Bildschirm Überblick zeigt einen Score und die Befunde dahinter. Die Systempostur listet die Prüfungen: Boot, Festplatte, Firewall, Konten, Updates und offene Ports. Härtung zeigt 26 Einstellungen mit dem, was jede schützt und was sie brechen kann. Der Firewall-Bildschirm schließt, was nicht lauschen sollte, und entscheidet, welche Programme ins Netz dürfen. Sicheres DNS lenkt Anfragen auf einen verschlüsselten Resolver. Compliance vergleicht die Maschine mit einem Rahmen und sagt ehrlich, was sie nicht beweist.

Jede Änderung ist ein Plan, den du prüfst, angewandt mit Schnappschuss und rückgängig gemacht über den Verlauf. Eine Änderung, die dein Netz kappen könnte, wartet auf deine Bestätigung. Das Projekt ist freie Software, veröffentlicht unter GPL-3.0-or-later, und sendet nichts nach Hause.
