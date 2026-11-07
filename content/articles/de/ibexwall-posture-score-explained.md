---
title: "Was der Postur-Score von IbexWall bedeutet"
description: "Der Score von 0 bis 100 ist eine Zusammenfassung dessen, was ein Programm über deine Maschine lesen konnte. Was er einschließt, was nicht, und wie man ihn liest, ohne ihm zu viel zu trauen."
slug: "ibexwall-posture-score-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [postur, score, prüfungen, befunde]
related_hardening: []
---

Der Bildschirm Überblick öffnet mit einer Zahl, einem Score von 0 bis 100. Eine Zahl lädt zu viel Vertrauen ein, also hilft es, genau zu wissen, was sie zusammenfasst und wo sie absichtlich schweigt.

## Woraus der Score besteht

Der Score wird aus den Ergebnissen der Prüfungen berechnet, die die Plugins melden: Festplatten- und Swap-Verschlüsselung, Secure Boot und Kernel-Lockdown, die Firewall, Konten (leere Passwörter, verirrte uid 0, Sperre), ob sudo ein Passwort verlangt, Updates, offene Ports und mehr. Jede Prüfung hat ein Ergebnis: bestanden, fehlgeschlagen, nicht anwendbar oder nicht bewertet.

Eine bestandene Prüfung trägt zum Score bei; eine fehlgeschlagene senkt ihn. Nicht anwendbare Prüfungen bleiben außen vor, und nicht bewertete zählen niemals als bestanden.

## Was der Score nicht weiß

Der Score ist eine Zusammenfassung von Einstellungen, die ein Programm lesen konnte. Er kennt dein Passwort nicht, auch nicht, ob du es wiederverwendest, was du herunterlädst oder welche Skripte du ausführst. Er sieht keine Phishing-Mail und keine bösartige Browser-Erweiterung. Eine hohe Zahl bedeutet, dass das Grundlegende sitzt, nicht dass nichts passieren kann. Behandle eine niedrige Zahl als Aufgabenliste und eine hohe als „der Boden ist gedeckt".

## Die Teile hinter der Zahl

Die Systempostur listet jede Prüfung hinter dem Score, gruppiert, damit du siehst, welche Einstellung die Zahl gesenkt hat. Die Befunde sind die fehlgeschlagenen Prüfungen, jede mit einfacher Erklärung und einer Schwere. Die Schutzmaßnahmen sind das, was schon sitzt. Wenn eine Prüfung ihre Eingabe nicht lesen kann, sagt sie es, statt zu raten, denn eine Zahl, die ihre eigene Unwissenheit versteckt, ist schlimmer als eine niedrigere, ehrliche.

## Wie eine Korrektur daraus fließt

Jeder Befund zeigt auf eine Korrektur, und jede Korrektur ist ein Plan, den du vorher prüfst: die genauen Dateien, Regeln oder Dienste, die er ändert, und was er brechen kann. Eine Änderung, die dein Netz kappen könnte, wartet auf deine Bestätigung, und der Verlauf macht alles rückgängig. Der Score steigt, wenn du eine Korrektur anwendest, und du kannst ihn sich bewegen sehen, was der Punkt ist: Die Zahl ist Fortschritt, kein Urteil.
