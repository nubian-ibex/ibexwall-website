---
title: "KI-Assistenten sicher mit Ihrem Linux-Computer verbinden"
description: "Was MCP ist, was ein KI-Assistent über IbexWall lesen, planen und vorschlagen (nie anwenden) kann, wie Schlüssel und Voreinstellungen ihn begrenzen und welche Risiken es gibt."
slug: "connect-an-ai-assistant-to-your-computer-safely"
date: 2026-11-06
updated: 2026-11-06
tags: [mcp, ki, zugriffskontrolle]
related_hardening: []
faq:
  - q: "Was ist MCP?"
    a: "Das Model Context Protocol ist ein Standard, mit dem ein KI-Assistent Werkzeuge aufrufen kann, die ein Programm anbietet, etwa um einen Status zu lesen oder einen Bericht abzurufen."
  - q: "Kann ein KI-Assistent über IbexWall mein System ändern?"
    a: "Nein. Er kann den Status lesen, Befunde erklären und eine Änderung vorschlagen. Ein Mensch muss einen Vorschlag genehmigen, und der Assistent hat kein Werkzeug, um etwas anzuwenden, zu genehmigen oder rückgängig zu machen."
---

Sie können einen KI-Assistenten den Sicherheitsstatus Ihres Computers lesen und Korrekturen vorschlagen lassen, ohne dass er etwas ändern darf. So ist die Assistentenanbindung von IbexWall gebaut: Der Assistent liest, plant und schlägt vor, und Sie entscheiden. Es gibt kein Werkzeug, mit dem er eine Änderung anwenden könnte.

## Was MCP ist

Das Model Context Protocol (MCP) ist ein Standard, mit dem ein KI-Assistent Werkzeuge aufrufen kann, die ein anderes Programm anbietet. Ein Coding-Assistent wie Claude Code, OpenCode oder ein Editor mit MCP-Unterstützung startet oder erreicht einen MCP-Server, lernt die Liste der Werkzeuge kennen und ruft sie bei Bedarf auf. Stellen Sie es sich als Speisekarte vor: Der Server bestimmt, was darauf steht.

Der MCP-Server von IbexWall (`ibexwall-mcp`) läuft als Ihr Benutzer, nicht als root. Er bietet neun Werkzeuge. Einige lesen: den Systemzustand, Befunde, die Erklärung eines Befunds, Ereignisse, welche Apps sich wohin verbunden haben, das Ausführen einer Prüfung. Eines zeigt, was ein Patch bewirken würde, ohne ihn einzureihen (ein Probelauf). Eines erstellt einen Vorschlag.

## Was ein Assistent tun kann

- Ihre Sicherheitswertung und die Liste der Befunde lesen.
- Einen Befund in einfachen Worten erklären.
- Eine Prüfung ausführen und aktuelle Ereignisse ansehen.
- Als Probelauf zeigen, was eine bestimmte Änderung bewirken würde.
- Einen Vorschlag erstellen: einen Plan für eine Änderung, der in einer Warteschlange liegt.

## Was er nicht tun kann

- Etwas anwenden, genehmigen, rückgängig machen oder ablehnen. Diese Werkzeuge gibt es nicht, und das Betriebssystem sichert das ab: Der Benutzer, als der ein Assistent läuft, darf diese Aktionen laut polkit nicht ausführen.
- Seine eigenen Berechtigungen oder irgendeine Richtlinie ändern.
- Systemkonten, Datenträger oder verwaltete Geräte sehen. Sie sind für jeden Client gesperrt.

Ein Vorschlag erscheint im Bildschirm Assistent. Sie sehen die tatsächlichen Operationen, die die Änderung ausführen würde, die eigenen Worte des Assistenten in einem Zitat, das als von der KI geschrieben und nicht geprüft gekennzeichnet ist, und was kaputtgehen könnte. Sie genehmigen oder lehnen ab. Hat sich der Plan zwischen Vorschlag und Genehmigung geändert, wird die Genehmigung abgelehnt. Eine genehmigte Änderung läuft über den üblichen Wiederherstellungspunkt, sodass der Verlauf sie rückgängig machen kann. Ein Vorschlag, der sich nicht rückgängig machen lässt, wird schon beim Erstellen abgelehnt.

## Voreinstellungen und Schlüssel

Der Zugriff wird über Voreinstellungen gewählt: lesen, planen oder vorschlagen. Lesen sieht nur den Status und die Befunde. Planen kann zusätzlich Probeläufe ausführen. Vorschlagen kann zusätzlich einen Vorschlag einreihen. Ein Client, der in der Konfiguration nicht genannt ist, bekommt nur den Systemzustand und die Befunde, mit niedriger Rate.

Ein Assistent auf demselben Computer erfordert, dass Ihr Benutzer in der Gruppe `ibexwall-assistants` ist. Für einen Assistenten auf einer anderen Maschine kann IbexWall eine Verbindung über HTTPS mit einem Token anbieten. Sie erstellen den Token in IbexWall, geben ihm einen Namen, eine Voreinstellung und optional ein Ablaufdatum. Das Geheimnis wird einmal angezeigt, gespeichert wird nur ein Hash, und der Token taucht in keinem Protokoll auf. Bewahren Sie ihn auf dem Client in einer Umgebungsvariablen auf statt in einer Datei, die Sie committen.

## Risiken, die Sie kennen sollten

Seien Sie ehrlich zu sich selbst.

- Alles, was die Voreinstellung erlaubt, wird an das Modell gesendet, das Sie verbinden. Private Werte werden durch stabile Pseudonyme ersetzt (Benutzer- und Hostnamen, Netzwerknamen, Hardware- und private Adressen; Home-Ordner werden zu `~`), aber Schwärzen senkt das Risiko, macht ein entferntes Modell aber nicht privat. Für den stärksten Datenschutz nutzen Sie ein Modell, das auf Ihrem Computer läuft.
- Ein Assistent kann durch Text in die Irre geführt werden, den er liest, etwa einen Prozessnamen oder eine Protokollzeile. IbexWall kennzeichnet externen Text als nicht vertrauenswürdige Daten, und der Aufbau sorgt dafür, dass ein irregeführter Assistent höchstens einen Vorschlag einreihen kann, den Sie ablehnen können. Er kann Ihnen trotzdem Irreführendes sagen, also lesen Sie selbst, was er vorschlägt.
- Ein gestohlener Token funktioniert, bis Sie ihn löschen oder er abläuft. Setzen Sie ein Ablaufdatum und widerrufen Sie Tokens, die Sie nicht mehr nutzen.
- Jeder Aufruf wird vor der Ausführung in ein Protokoll in Ihrem eigenen Verzeichnis geschrieben, jede Zeile mit der vorherigen verkettet, sodass Änderungen auffallen. Derselbe Benutzer kann allerdings die ganze Datei löschen.

## Mit IbexWall prüfen

Öffnen Sie Eine KI verbinden, um den Zugriff einzurichten, oder führen Sie `ibexctl mcp config claude-code` aus (auch `opencode` und `vscode`), um den Ausschnitt zu erhalten, den Sie in Ihren Assistenten einfügen. Das Plugin KI-Assistenten (system.assistant) steuert, was er lesen, planen oder vorschlagen darf. Das Ein- oder Ausschalten des Zugriffs ist ein Plan, den Sie prüfen, und der Verlauf kann ihn rückgängig machen. Version 1.0 ist in Vorbereitung. Beginnen Sie ohne Fernzugriff und überlegen Sie, was [Ihr Werkzeug irgendwohin sendet](/de/articles/no-telemetry-in-a-security-tool/), bevor Sie den Zugriff erweitern.
