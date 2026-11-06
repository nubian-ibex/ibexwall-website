---
title: "SELinux oder AppArmor für einen Desktop-Nutzer: was Sie wissen sollten"
description: "Mandatorische Zugriffskontrolle begrenzt ein gehacktes Programm. Welche Distributionen SELinux oder AppArmor nutzen, wie Sie prüfen und was tun, wenn etwas blockiert wird."
slug: "selinux-vs-apparmor-for-a-desktop-user"
date: 2026-11-06
updated: 2026-11-06
tags: [selinux, apparmor, mac]
related_hardening: []
faq:
  - q: "Was ist der Unterschied zwischen SELinux und AppArmor?"
    a: "Beide begrenzen, was ein Programm anfassen darf, selbst mit vollen Rechten. SELinux etikettiert jede Datei und jeden Prozess und setzt eine Politik über Etiketten um. AppArmor schreibt Regeln nach Dateipfad für jedes Programm."
  - q: "Soll ich SELinux oder AppArmor ausschalten, wenn etwas blockiert wird?"
    a: "Nein. Lesen Sie die Ablehnung im Log, dann korrigieren Sie das Etikett oder setzen Sie nur dieses eine Programm in den permissiven Modus. Das ganze System abzuschalten, nimmt allen den Schutz."
---

Die normalen Linux-Rechte beantworten eine Frage: Darf dieser Benutzer diese Datei öffnen? Mandatorische Zugriffskontrolle (MAC) fügt eine zweite hinzu: Darf dieses bestimmte Programm das, unter welchem Benutzer auch immer es läuft? Wird ein Browser oder ein Netzdienst kompromittiert, begrenzt MAC, wie weit der Eindringling kommt. Linux hat dafür zwei verbreitete Systeme, SELinux und AppArmor, und fast sicher haben Sie eines davon schon.

## Welche Distribution was nutzt

- Fedora nutzt SELinux, standardmäßig erzwingend.
- Ubuntu nutzt AppArmor, standardmäßig aktiv.
- Debian hat AppArmor seit Debian 10 standardmäßig an, mit einem kleineren Profilsatz als Ubuntu.
- Arch Linux aktiviert standardmäßig keines von beiden. Sie können eines hinzufügen, und das ist Handarbeit.

Sie wählen selten. Sie nutzen, was Ihre Distribution pflegt, denn deren Politik und Profile sind für die Pakete dieses Systems geschrieben und getestet.

## Worin sie sich unterscheiden

SELinux gibt jeder Datei, jedem Prozess und jedem Port ein Etikett und schreibt eine Politik darüber, welche Etiketten auf welche einwirken dürfen. Das ist gründlich und feinkörnig, und die Etiketten hängen an der Datei, daher kann das Verschieben oder Kopieren einer Datei ihr ein falsches Etikett lassen. AppArmor hängt einem Programm ein Profil an und listet die Pfade und Fähigkeiten, die es nutzen darf. Das ist einfacher zu lesen und zu schreiben und folgt Dateinamen statt Etiketten. Keines ist allgemein „sicherer“. Ihre Stärke hängt von der Politik je Programm ab, und auf einem Desktop zählt, dass das von Ihrer Distribution gelieferte an ist.

## Prüfen, ob es an ist

SELinux (Fedora):

```sh
getenforce
sestatus
```

`Enforcing` ist, was Sie wollen. `Permissive` protokolliert Probleme, ohne sie zu verhindern, und `Disabled` ist aus.

AppArmor (Ubuntu, Debian):

```sh
sudo aa-status
```

Es listet, wie viele Profile geladen sind und im Enforce- oder Complain-Modus. Auf Debian müssen Sie womöglich die Pakete `apparmor` und `apparmor-utils` installieren und das Modul beim Start aktivieren; sagt `aa-status`, es sei nicht geladen, braucht der Kernel `apparmor=1 security=apparmor` auf seiner Befehlszeile, und das Debian-Wiki beschreibt die Schritte.

## Wenn es etwas blockiert

Ein Programm, das als root funktioniert, aber unter MAC scheitert, oder ein Dienst, der scheitert, nachdem Sie seinen Datenordner verschoben haben, ist die typische Geschichte. Das System arbeitet: Es hat etwas gestoppt, das die Politik nicht erwartet hat. Die Antwort ist, die Ablehnung zu lesen, nicht den Schutz abzuschalten.

Unter SELinux suchen Sie Ablehnungen:

```sh
sudo ausearch -m AVC,USER_AVC -ts recent
```

Auf Fedora kann SETroubleshoot sie in Worten erklären, wenn sein Desktop-Alarm oder `sealert` installiert ist. Die häufigste Ursache ist ein falsches Etikett auf verschobenen Dateien, das `restorecon -Rv /pfad` behebt. Für einen Dienst, der einen ungewöhnlichen Ordner braucht, geben Sie ihm das richtige Etikett mit `semanage fcontext` und danach `restorecon`. Um zu testen, ob SELinux die Ursache ist, macht `sudo setenforce 0` es bis zum nächsten Neustart permissiv, und `sudo setenforce 1` schaltet es zurück. Lassen Sie es nicht so.

Unter AppArmor stehen die Ablehnungen im Kernel-Log:

```sh
sudo journalctl -k | grep -i 'apparmor="DENIED"'
```

Sie können ein einzelnes Profil mit `sudo aa-complain /pfad/zum/programm` in den Complain-Modus setzen und mit `sudo aa-enforce /pfad/zum/programm` zurück. Oder Sie legen eine lokale Überschreibung in `/etc/apparmor.d/local/` für den bestimmten Pfad an, den das Programm braucht, und laden das Profil mit `sudo apparmor_parser -r` auf seiner Datei neu.

## Müssen Sie etwas tun

Meistens nein. Lassen Sie es an, aktualisieren Sie das System, und lesen Sie das Log, wenn etwas seltsam scheitert. Schalten Sie es nicht als ersten Schritt ab, denn das nimmt allen Programmen den Schutz, um eines zu reparieren. Führen Sie Programme außerhalb der Distributionspakete aus, etwa ein Binärprogramm von der Website eines Anbieters, erwarten Sie, dass sie weniger eingeschränkt sind als gepackte.

## Prüfen Sie mit IbexWall

Der Resolver, der MCP-Server und die Plugins von IbexWall sind auf Debian und Ubuntu durch AppArmor-Profile und auf Fedora durch ein SELinux-Modul eingeschränkt, geliefert in getrennten Paketen (`ibexwall-apparmor` oder `ibexwall-selinux`). Der Bildschirm Systemzustand meldet den Stand des Schutzes Ihres Systems, und auf dem Bildschirm Plugins sehen Sie, was jedes Plugin lesen und ändern darf. Jede Änderung ist ein Plan, den Sie prüfen und über den Verlauf zurücknehmen. Version 1.0 ist in Vorbereitung.
