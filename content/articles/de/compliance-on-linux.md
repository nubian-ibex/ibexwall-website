---
title: "Compliance unter Linux: was es bedeutet und was nicht"
description: "Compliance ist keine Zertifizierung. Was ein Compliance-Check über eine Linux-Maschine beweisen kann, die sechs Kontrollzustände, und was ein Prüfer noch entscheiden muss."
slug: "compliance-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [compliance, rahmenwerke, bestätigung, export]
related_hardening: []
---

Compliance und Zertifizierung sind zwei verschiedene Dinge, und sie zu verwechseln ist die Art, wie ein Werkzeug übertreibt. Dieser Artikel trennt sie und erklärt, was ein lokaler Compliance-Check unter Linux beweisen kann und was nicht.

## Compliance ist keine Zertifizierung

Compliance bedeutet, dass die zugeordneten technischen Kontrollen auf dieser Maschine gelten. Zertifizierung kommt aus einer unabhängigen Prüfung, die auch Prozesse, Personen und Umfang abdeckt, die kein Programm auf einem einzelnen Rechner sehen kann. Ein Werkzeug kann sagen „diese technischen Kontrollen gelten"; es kann nicht sagen „diese Organisation ist zertifiziert". IbexWall sagt das Erste und nie das Zweite.

## Die sechs Zustände

Jede Kontrolle eines Rahmenwerks fällt in einen von sechs Zuständen:

- Konform: jede geforderte Prüfung bestand und ist frisch.
- Nicht konform: mindestens eine geforderte Prüfung schlug fehl.
- Nicht bewertet: eine Prüfung fehlt, ist veraltet oder unbekannt. Das ist niemals ein Bestehen.
- Bestätigung nötig: die Kontrolle ist organisatorisch, also muss eine Person erklären, dass sie gilt, mit Eigentümer und Ablauf.
- Nicht anwendbar: jede geforderte Prüfung sagt es.
- Mit Ausnahme: ein Risiko, das ein Eigentümer angenommen hat, getrennt gezeigt, niemals als konform gezählt.

Ein Rahmenwerk meldet Zählungen jedes Zustands, niemals einen einzigen Prozentsatz, der die Gruppen „nicht bewertet" und „Bestätigung" versteckt.

## Die Rahmenwerke der ersten Version

Die erste Version ordnet sechs zu: die IbexWall-Grundlage (der eigene empfohlene Satz des Projekts), Artikel 46 der LGPD, CMN 4.893/2021 geändert durch 5.274/2025, NIST SP 800-53 Rev. 5, NIST SP 800-171 Rev. 3 und Thema 8 des Anhangs A der ISO/IEC 27001:2022. Jede Kontrolle trägt die Referenznummer, eine URL und das Datum, an dem sie konsultiert wurde; lizenzierte Texte werden nie kopiert.

## Die ehrlichen Grenzen

Unbekannt ist niemals ein Bestehen, also sagt ein Bericht, der eine Kontrolle nicht beweisen kann, es, statt zu raten. Eine Zuordnung, die die eigene Lesart des Projekts ist, wie die LGPD, sagt es klar. Bestätigungs-Kontrollen sind organisatorisch und warten auf eine Person, nicht auf eine Prüfung.

## Export als Beleg

`ibexctl compliance export` schreibt einen signierten Bericht mit dem Datum, der Rahmenwerksversion, dem Zustand jeder Kontrolle, den rohen Prüfergebnissen, den Bestätigungen und dem Kopf der Audit-Kette. Er ist mit einem Geräteschlüssel versiegelt, also fällt eine manipulierte Kopie bei der Verifikation durch. Dieser Bericht ist ein Beleg, den ein Unternehmen sammeln kann, kein Zertifikat, das es schwenken kann.
