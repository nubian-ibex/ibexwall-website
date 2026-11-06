---
title: "Warum ein Sicherheitswerkzeug nichts nach Hause senden sollte, und wie Sie es prüfen"
description: "Ein Sicherheitswerkzeug sieht Ihre Ports, Apps und Protokolle, also darf es nie nach Hause telefonieren. Was IbexWall sendet, nämlich nichts, und wie Sie es selbst prüfen."
slug: "no-telemetry-in-a-security-tool"
date: 2026-11-06
updated: 2026-11-06
tags: [datenschutz, telemetrie, vertrauen]
related_hardening: []
faq:
  - q: "Sendet IbexWall Daten an seine Autoren?"
    a: "Nein. Keine Telemetrie, keine Analyse, kein Konto. Netzverkehr entsteht nur, wenn Sie ihn veranlassen, etwa eine DNS-Abfrage, die Sie machen, oder eine Paketaktualisierung, die Sie anstoßen."
  - q: "Wie prüfe ich, dass ein Programm nichts sendet?"
    a: "Beobachten Sie seine Verbindungen mit ss oder einer Paketaufzeichnung, während es läuft, oder legen Sie eine Firewall-Regel an, die seinen ausgehenden Verkehr blockiert, und sehen Sie, dass nichts bricht."
---

Ein Sicherheitswerkzeug liest Dinge, die die meisten Programme nie sehen: welche Dienste auf Ihrer Maschine lauschen, welche Programme sich wohin verbinden, welche Konten es gibt, was Ihre Protokolle sagen. Würde so ein Werkzeug zugleich nach Hause melden, selbst auf „harmlose“ anonyme Art, wäre das eine Karte Ihres Systems, die das Gebäude verlässt. Die Regel ist also einfach: Es darf nichts senden, außer Sie verlangen es. IbexWall folgt dieser Regel. Keine Telemetrie, keine Analyse, keine Konten, und kein Anruf beim Autor.

## Warum das hier mehr zählt

Telemetrie in einer gewöhnlichen App sagt den Autoren, welcher Knopf geklickt wird. In einem Sicherheitswerkzeug würde derselbe Kanal Fakten tragen wie „dieser Rechner hat einen offenen SSH-Port und einen alten Kernel“. Solche Daten nützen der einen Person, die sie nicht haben sollte. Sie zu anonymisieren ist schwer, weil Maschinendetails oft einzigartig genug sind, um Sie zu erkennen. Das einfachste sichere Design ist, nicht zu sammeln.

Dazu kommt Vertrauen. Ein Werkzeug, das root verlangt, den Systemzustand liest und Änderungen anwendet, muss es sich verdienen. „Nichts verlässt die Maschine“ ist eine Behauptung, die Sie prüfen können, und das ist besser als eine Datenschutzerklärung, an die Sie glauben müssen.

## Was IbexWall sendet

Von sich aus nichts. Die Fälle, in denen Netzverkehr entsteht, sind solche, die Sie veranlassen:

- Eine DNS-Abfrage, die Sie machen. Nutzen Sie den Bildschirm Sicheres DNS, leitet der Resolver Ihre Abfragen an den von Ihnen gewählten Upstream weiter, weil das seine Aufgabe ist.
- Eine Paketaktualisierung, die Sie mit Ihrem Paketmanager anstoßen.
- Eine entfernte Assistentenverbindung, wenn Sie sie einschalten. Der MCP-Server nimmt Verbindungen nur über TLS an und nur, wenn Sie die Remote-Option aktivieren.
- Downloads, die Sie anfordern, etwa Sperrlisten für den DNS-Filter.

Die Prüfung auf bekannte Schwachstellen arbeitet offline, aus dem Cache des Paketmanagers. Dafür wird nichts versendet.

## So prüfen Sie selbst

Sie müssen uns nicht beim Wort nehmen, und das müssen Sie auch nicht. Drei Wege.

Listen Sie die Verbindungen eines Programms im Moment auf:

```sh
sudo ss -tupn | grep -i ibex
```

Beobachten Sie die echte Netzwerkschnittstelle, während Sie es nutzen (den Namen finden Sie mit `ip -br link`):

```sh
sudo tcpdump -ni wlan0 -w ibex.pcap
```

Öffnen Sie die Datei danach mit `tcpdump -nr ibex.pcap` oder Wireshark und suchen Sie Ziele, die Sie nicht kennen. Bedenken Sie, dass auch Ihre anderen Programme sprechen; filtern Sie daher nach der Zeit, in der Sie IbexWall genutzt haben, und nach dem, was Sie getan haben.

Der stärkste Test ist eine Regel. Legen Sie eine Firewall-Regel an, die den ausgehenden Verkehr des Programm-Benutzers oder der ganzen Maschine blockiert, benutzen Sie das Werkzeug, und sehen Sie, dass es weiter funktioniert. Funktionen, die von Natur aus Netz brauchen, wie ein Upstream-DNS-Server, halten natürlich an.

Der Bildschirm Apps und Netz von IbexWall zeigt, welches Programm mit wem spricht; er kann also auch über sich selbst berichten und über alles andere auf Ihrer Maschine.

## Was Sie von jedem Werkzeug verlangen sollten

Dieselben Fragen gelten für jedes Programm, das Sie installieren, Sicherheitswerkzeug oder nicht. Braucht es ein Konto? Sagt es, was es wann sendet? Funktioniert es mit blockiertem Netz weiter? Können Sie den Quelltext lesen oder wenigstens den Verkehr einsehen? Gibt es einen Aus-Schalter, der eingehalten wird? Ein Werkzeug, das das nicht klar beantwortet, hat Ihnen schon etwas gesagt.

## Andere Telemetrie auf Ihrem System

Ihre Distribution und manche Ihrer Apps senden möglicherweise Nutzungsberichte. Das ist getrennt vom Sicherheitswerkzeug, und es kann Ihnen wichtig sein oder nicht. Das Telemetrie-Plugin (privacy.telemetry) listet auf, was es findet, damit Sie entscheiden, und es listet nur. Für die breitere Gewohnheit des Prüfens sehen Sie den [Zehn-Minuten-Selbsttest](/de/articles/how-secure-is-my-linux-computer/).

## Was dazugehört

Open Source hilft hier. Der Code liegt auf GitHub unter GPL-3.0-or-later, also kann jeder lesen, wie der Netzzugriff genutzt wird, und die Versionen sollen Prüfsummen, Signaturen, ein SBOM und eine Herkunftserklärung mitbringen. Die erste Version ist noch nicht veröffentlicht.

## Prüfen Sie mit IbexWall

Öffnen Sie Apps und Netz, um die Verbindungen jedes Programms zu sehen, und Plugins, um zu lesen, was jedes Plugin lesen und ändern darf. Jede Änderung ist ein Plan, den Sie prüfen, mit Sicherungspunkt und Rücknahme im Verlauf. Version 1.0 ist in Vorbereitung.
