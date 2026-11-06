---
title: "Eine Sicherheitsänderung unter Linux zurücknehmen und sich aus einer Sperre befreien"
description: "Setzen Sie vor jeder Änderung einen Sicherungspunkt, nehmen Sie über den Verlauf zurück, sehen Sie, warum Netzänderungen auf Bestätigung warten, und erholen Sie sich, wenn eine Regel Sie ausgesperrt hat."
slug: "undo-a-security-change"
date: 2026-11-06
updated: 2026-11-06
tags: [rücknahme, wiederherstellung, sicherheit]
related_hardening: [kernel.kexec, net.rp-filter]
faq:
  - q: "Wie nehme ich eine Firewall- oder DNS-Änderung zurück, die mein Netz gebrochen hat?"
    a: "Listen Sie von einem lokalen Terminal oder der Konsole die letzten Änderungen auf und nehmen Sie die letzte zurück. Haben Sie sie mit IbexWall gemacht und nicht rechtzeitig bestätigt, geht sie von selbst zurück."
  - q: "Was, wenn ich von einer entfernten Maschine ausgesperrt bin?"
    a: "Eine Änderung, die das Netz kappen kann, wartet auf Bestätigung und geht zurück, wenn Sie nicht bestätigen. Bei anderen Werkzeugen nutzen Sie die Anbieter-Konsole oder einen Rettungsstart, um die Regel zu entfernen."
---

Der beste Schutz vor einer schlechten Änderung ist, sie zurücknehmen zu können. Bevor Sie eine Firewall, eine DNS-Einstellung oder einen Kernelparameter bearbeiten, sichern Sie, was jetzt da ist, ändern Sie eine Sache, testen Sie sie und behalten Sie einen Rückweg, der nicht von dem abhängt, was Sie ändern. Dieser Artikel behandelt die Gewohnheit und wie IbexWall sie für Sie übernimmt.

## Warum der Sicherungspunkt zuerst kommt

Die meisten Sicherheitsänderungen sind kleine Dateiänderungen: eine Zeile in `/etc/sysctl.d`, ein Drop-in für SSH, ein nftables-Regelsatz. Kopieren Sie zuerst die alte Datei, ist das Zurücknehmen ein Zurückkopieren. Berührt die Änderung mehrere Dinge zugleich, macht ein Fehler bei einem schwer zu erinnern, was die anderen waren.

Von Hand ist das Minimum:

```sh
sudo cp -a /etc/ssh/sshd_config.d /root/sshd_config.d.bak
```

Bearbeiten, testen und erst dann die alte Sitzung schließen. Für Firewall-Änderungen ist die sichere Reihenfolge: ein zweites Terminal öffnen, die Regel anwenden, mit einer neuen Verbindung prüfen, dass Sie sich noch verbinden können, und das erste Terminal offen halten, bis das geht.

## Änderungen, die Sie abschneiden können

Manche Änderungen nehmen den Weg, über den Sie die Maschine erreichten: eine Firewall-Regel, die den SSH-Port blockiert, eine DNS-Einstellung, die auf einen unerreichbaren Resolver zeigt, ein VPN-Kill-Switch, eine Regel, die den Host isoliert. Die Gefahr ist nicht die Änderung, sondern dass Sie sie von dort, wo Sie sind, nicht beheben können.

IbexWall behandelt diese Fälle anders. Eine als Netzrisiko markierte Änderung wartet auf Ihre Bestätigung, standardmäßig innerhalb von 60 Sekunden. Bestätigen Sie nicht, weil die Verbindung weg ist oder die Seite nicht mehr antwortet, geht sie von selbst zurück. Das ist der Punkt: Die Rücknahme braucht Sie nicht. Stoppt der Daemon selbst mittendrin, nimmt er beim nächsten Start eine Änderung zurück, die noch angewendet wurde oder auf Bestätigung wartete.

Sie bestätigen in der Oberfläche oder auf der Befehlszeile:

```sh
ibexctl confirm <transaction-id>
```

## Über den Verlauf zurücknehmen

Jede Änderung, die IbexWall anwendet, setzt zuerst einen Sicherungspunkt. Der Bildschirm Verlauf listet sie alle, und eine zurückzunehmen stellt das wieder her, was da war. Dasselbe vom Terminal:

```sh
ibexctl history
ibexctl rollback <transaction-id>
```

Manche Änderungen sind nicht vollständig umkehrbar, und IbexWall sagt das, bevor Sie sie anwenden. So lässt sich [das Laden eines weiteren Kernels zu verbieten](/de/hardening/kernel.kexec/) erst beim nächsten Neustart aufheben. Andere können eine bestimmte Einrichtung brechen, wie [Pakete mit gefälschter Absenderadresse zu verwerfen](/de/hardening/net.rp-filter/), was manchen VPNs und Maschinen mit mehreren Routen nicht passt. Der Plan zeigt diese Warnungen zuerst.

## Erholen, wenn Sie ausgesperrt sind

Haben Sie andere Werkzeuge benutzt oder half die automatische Rücknahme nicht, arbeiten Sie vom nächsten Ort, an dem Sie noch Kontrolle haben.

1. Lokale Maschine: wechseln Sie mit Ctrl+Alt+F3 auf eine Textkonsole oder nutzen Sie den Desktop mit abgeschaltetem Netz. Für einen lokalen Befehl brauchen Sie kein Netz.
2. Virtueller Server: nutzen Sie die Web-Konsole des Anbieters, die nicht über das von Ihnen gebrochene Netz läuft.
3. Entfernen Sie die Ursache. Für die Firewall-Regeln von IbexWall ist `ibexctl rollback` der Weg. Im letzten Ausweg lässt sich seine Tabelle löschen, denn es ist eine eigene Tabelle, die nur eigene Regeln enthält: `sudo nft delete table inet ibexwall`. Löschen Sie keine Tabellen, die Sie nicht angelegt haben.
4. Bei einer sysctl-Datei entfernen Sie sie aus `/etc/sysctl.d/` und setzen den alten Wert mit `sysctl -w`.
5. Startet nichts mehr, booten Sie ein Live-System oder den Rettungseintrag, hängen das Wurzeldateisystem ein und stellen Ihre Kopie der Datei wieder her.

Finden Sie danach heraus, warum es scheiterte, bevor Sie es erneut versuchen. Oft war es ein unerwartetes Detail, wie eine zweite Netzschnittstelle.

## Eine Aufzeichnung behalten

Eine Faustregel, die für Menschen wie für Werkzeuge gilt: Schreiben Sie auf, was Sie geändert haben, warum und wie es zurückzunehmen ist. Der Verlauf von IbexWall hält das fest, und jeder Eintrag steht in einem Audit-Log, dessen Zeilen verkettet sind, sodass Änderungen an alten Zeilen erkennbar sind (`ibexctl audit verify`).

## Prüfen Sie mit IbexWall

Der Bildschirm Verlauf listet Änderungen und nimmt sie zurück, und `ibexctl history` sowie `ibexctl rollback` tun dasselbe vom Terminal. Jede Änderung ist ein Plan, den Sie zuerst prüfen, mit einem Sicherungspunkt, den Sie wiederherstellen, und Änderungen mit Netzrisiko warten auf Ihre Bestätigung oder gehen von selbst zurück. Der Notfallmodus (endpoint.isolate), der das Netz bis auf von Ihnen benannte Adressen kappt, wird ebenfalls über den Verlauf zurückgenommen. Version 1.0 ist in Vorbereitung.
