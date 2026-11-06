---
title: "Linux-Kernel mit sysctl härten, in einfachen Worten"
description: "Was sysctl-Härtung ist, mit welchen Einstellungen Sie gefahrlos beginnen, welche Flatpak, VPNs oder IPv6 brechen können, und wie Sie sauber anwenden und zurücknehmen."
slug: "linux-kernel-hardening-sysctl-in-plain-words"
date: 2026-11-06
updated: 2026-11-06
tags: [sysctl, kernel, härtung]
related_hardening: [kernel.kptr-restrict, kernel.dmesg-restrict, net.tcp-syncookies, kernel.user-namespaces]
faq:
  - q: "Was ist sysctl-Härtung?"
    a: "Der Kernel hat Einstellungen, die Sie im laufenden Betrieb ändern können. Härten heißt, strengere Werte zu wählen, etwa Kernel-Adressen vor normalen Programmen zu verbergen, damit eine Lücke schwerer auszunutzen ist."
  - q: "Wie nehme ich eine sysctl-Änderung zurück?"
    a: "Löschen Sie die Datei, die Sie in /etc/sysctl.d angelegt haben, setzen Sie den alten Wert mit sysctl -w, oder starten Sie neu. Notieren Sie vorher den alten Wert."
---

Sysctl ist die Liste der Einstellungen, die der laufende Linux-Kernel ohne Neukompilieren ändern lässt. Mit sysctl härten heißt, für die sicherheitsrelevanten davon strengere Werte zu wählen. Jede Einstellung ist klein, die meisten sind sicher. Einige können Software brechen, die Sie nutzen; daher ist der vernünftige Weg, mit den harmlosen anzufangen und den Rest einzeln zu testen.

## So funktioniert es

Einen Wert lesen:

```sh
sysctl kernel.kptr_restrict
```

Bis zum nächsten Neustart ändern:

```sh
sudo sysctl -w kernel.kptr_restrict=2
```

Über Neustarts hinweg behalten, indem Sie ihn in eine Datei unter `/etc/sysctl.d/` schreiben, deren Dateien auf `.conf` enden und in Namensreihenfolge gelesen werden:

```sh
echo 'kernel.kptr_restrict = 2' | sudo tee /etc/sysctl.d/90-beispiel.conf
sudo sysctl --system
```

Das funktioniert auf Fedora, Ubuntu, Debian und Arch gleich. Bearbeiten Sie nicht die Dateien Ihrer Distribution; legen Sie eigene an, damit ein Update Ihre Arbeit nicht überschreibt und Sie sie später entfernen können. Da Dateien in Reihenfolge gelesen werden, gewinnt ein späterer Name, wenn zwei denselben Schlüssel setzen.

## Gefahrlose zum Anfang

Diese ändern auf einem Desktop wenig und haben einen klaren Nutzen.

- [`kernel.kptr_restrict`](/de/hardening/kernel.kptr-restrict/) verbirgt Kernel-Speicheradressen vor normalen Programmen. Angreifer nutzen diese Adressen, um einen Exploit zu zielen.
- [`kernel.dmesg_restrict`](/de/hardening/kernel.dmesg-restrict/) lässt nur einen Administrator das Kernel-Log lesen, das Adressen und Hardwaredetails zeigen kann.
- [`net.ipv4.tcp_syncookies`](/de/hardening/net.tcp-syncookies/) hält die Maschine am Antworten, wenn jemand sie mit halboffenen Verbindungen flutet. Viele Distributionen setzen es schon auf 1.
- `fs.protected_symlinks`, `fs.protected_hardlinks`, `fs.protected_fifos` und `fs.protected_regular` blockieren alte Tricks, bei denen ein Angreifer einen Link oder eine Datei in einem gemeinsamen Ordner wie `/tmp` ablegt, damit ein privilegiertes Programm schreibt, wo er will. Der Katalog fasst sie als [gemeinsame Ordner schützen](/de/hardening/fs.protected-files/) zusammen.

Manche sind auf Ihrem System vermutlich schon gesetzt. Den Wert vorher zu lesen, verrät es.

## Die, die etwas brechen können

Ein strengerer Wert kann etwas entfernen, das ein Programm braucht. Bekannte Fälle:

- [`user.max_user_namespaces=0`](/de/hardening/kernel.user-namespaces/) entfernt einen großen Teil der Angriffsfläche des Kernels und stoppt zugleich Flatpak, die Sandboxes von Chromium und Firefox, rootless Container und viele AppImages. Für die meisten Desktops ist das zu teuer.
- `kernel.yama.ptrace_scope` auf strengerer Stufe bedeutet, dass ein Debugger wie `gdb` oder `strace` sich ohne Zusatzrechte nicht mehr an ein laufendes Programm hängt. Entwickler merken es schnell.
- `kernel.perf_event_paranoid` hoch stoppt unprivilegiertes Profiling mit `perf`.
- `net.ipv4.conf.all.rp_filter=1` verwirft Pakete, die auf einer Schnittstelle ankommen, über die der Kernel nicht antworten würde. Das kann manche VPNs und Maschinen mit mehreren Netzrouten brechen.
- IPv6-Router-Ankündigungen zu ignorieren, lässt IPv6 in den meisten Heimnetzen ohne Adresse.
- `kernel.sysrq=0` entfernt die Notfall-Tasten einer eingefrorenen Maschine.
- kexec zu sperren, lässt sich erst beim nächsten Neustart aufheben und betrifft Absturz-Werkzeuge.

Die Regel ist einfach: Ändern Sie eines, benutzen Sie den Rechner einen Tag, und heben Sie den Rest für später auf.

## Wie Sie eine Änderung testen

Benutzen Sie die Maschine nach jeder Änderung wie sonst. Öffnen Sie den Browser, starten Sie eine Flatpak-App, falls Sie welche nutzen, verbinden Sie Ihr VPN, stecken Sie ein Gerät an, bauen Sie etwas. Arbeiten Sie entfernt, halten Sie eine zweite Sitzung offen. Probleme durch sysctl zeigen sich meist als ein Programm, das mit „permission denied“ oder „operation not permitted“ ohne erkennbare Ursache scheitert; passiert das kurz nach einer Änderung, verdächtigen Sie zuerst diese. Ein Wert nach dem anderen macht den Schuldigen offensichtlich und das Zurücknehmen zu einer einzigen Zeile.

## Anwenden und zurücknehmen

Notieren Sie die aktuellen Werte, bevor Sie etwas ändern:

```sh
sysctl kernel.kptr_restrict kernel.dmesg_restrict
```

Um eine dauerhafte Änderung zurückzunehmen, entfernen Sie die Datei und setzen Sie den alten Wert zurück, denn nur die Datei zu löschen ändert den laufenden Kernel nicht:

```sh
sudo rm /etc/sysctl.d/90-beispiel.conf
sudo sysctl -w kernel.kptr_restrict=0
```

Ein Neustart kehrt ebenfalls zu dem zurück, was die verbleibenden Dateien und der Kernel-Standard sagen. Bricht eine Einstellung etwas, ohne dass Sie wissen welche, teilen Sie: Entfernen Sie die Hälfte Ihrer Datei, führen Sie `sudo sysctl --system` aus und testen Sie.

## Prüfen Sie mit IbexWall

Der Bildschirm Härtung listet 26 Kernel-, Netz-, Dateisystem- und Moduleinstellungen, jede mit dem, was sie brechen kann, und Sie haken an, was Sie möchten. Das Kernel-Härtungs-Plugin (system.sysctl) liest jeden Wert, vergleicht ihn mit der Referenz und wendet Ihre Wahl über einen Plan an. Der Plan zeigt die genaue Datei, die IbexWall als `/etc/sysctl.d/90-ibexwall.conf` schreibt, und den Diff, bevor etwas geschieht. Zuerst wird ein Sicherungspunkt gesetzt, und der Verlauf nimmt es zurück. Version 1.0 ist in Vorbereitung.
