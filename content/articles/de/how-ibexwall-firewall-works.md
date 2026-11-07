---
title: "So funktioniert die Firewall von IbexWall: nftables plus Kontrolle pro Programm"
description: "IbexWall nutzt zwei Schichten: nftables für eingehende Regeln und eBPF, um zu entscheiden, welche Programme ins Netz dürfen. Wie sie zusammenspielen, und wie eine Änderung prüfbar bleibt."
slug: "how-ibexwall-firewall-works"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, eBPF, nftables, pro-programm]
related_hardening: []
---

Eine Firewall beantwortet zwei verschiedene Fragen: Was darf von außen an diese Maschine, und was darf sie verlassen. Die meisten Linux-Firewalls beantworten nur die erste. IbexWall beantwortet beide mit zwei Schichten und macht aus jeder Änderung einen Plan, den du vorher prüfst.

## Schicht eins: eingehend, durch die Distribution

Für eingehenden Verkehr ersetzt IbexWall deine Firewall nicht. Auf einer Maschine mit firewalld oder ufw steuert es diese Oberfläche; auf einer Maschine ohne beides verwaltet es seine eigene nftables-Tabelle `inet ibexwall`. In beiden Fällen schreibt es nur in seine eigene Tabelle, niemals in die Tabelle eines anderen Programms.

Das Erste, was man aktiviert, ist das eingehende Standard-Verweigern: Nichts darf auf neue Verbindungen lauschen, außer du hast es geöffnet. Von da an zeigt der Firewall-Bildschirm, was erreichbar ist, was du geöffnet hast, und lässt es schließen. Eine Änderung ist ein Plan, der die genauen Regeln auflistet, und der Verlauf kann sie zurückgeben.

## Schicht zwei: ausgehend, pro Programm

Die zweite Frage, was die Maschine verlassen darf, ist der Ort der echten Kontrolle. IbexWall lädt ein kleines eBPF-Programm, das jede Verbindung beobachtet, die ein Programm öffnen will. Beim ersten Mal, dass ein neues Programm das Netz erreicht, fragt IbexWall: erlauben, blockieren oder immer erlauben. Deine Antwort wird pro Programm und pro Ziel gemerkt.

Das ist stärker als eine portbasierte Firewall, die nur Ports sieht. Ein Browser und ein Keylogger nutzen beide HTTPS auf Port 443; der Port unterscheidet sie nicht. Die Schicht pro Programm tut es, und sie funktioniert über TCP, UDP und QUIC.

## Fragemodus und das Sicherheitsventil

Ein Programm, über das du noch nicht entschieden hast, kann im Fragemodus bleiben: Seine erste Verbindung wartet, bis du antwortest, und die ältesten gehaltenen Verbindungen erscheinen zuerst. Eine Änderung, die deinen eigenen Netzzugang kappen könnte, wird als riskant markiert und wartet auf deine Bestätigung; bestätigst du nicht rechtzeitig, macht sie sich selbst rückgängig.

## Warum das prüfbar bleibt

Jede Firewall-Änderung, eingehend oder pro Programm, läuft durch dieselbe Engine wie jede andere Änderung in IbexWall: Ein Plan zeigt die Operationen, ein Schnappschuss wird gemacht und der Verlauf kann zurückrollen. Eine Firewall ist nur so gut wie das Vertrauen, das du in sie hast, und Vertrauen kommt davon, jede Regel sehen und rückgängig machen zu können.
