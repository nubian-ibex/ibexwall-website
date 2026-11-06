---
title: "Wie sicher ist mein Linux-Computer? Selbsttest in 10 Minuten"
description: "Prüfen Sie Updates, Verschlüsselung, Firewall, Secure Boot, offene Ports, SSH, Benutzer und Backups in etwa zehn Minuten und lernen Sie, was eine Sicherheitswertung bedeutet."
slug: "how-secure-is-my-linux-computer"
date: 2026-11-06
updated: 2026-11-06
tags: [checkliste, grundlagen, systemzustand]
related_hardening: [mounts.tmp-noexec, fs.protected-files]
faq:
  - q: "Wie kann ich schnell prüfen, wie sicher mein Linux-Computer ist?"
    a: "Sehen Sie sich acht Dinge an: ausstehende Updates, Festplattenverschlüsselung, Firewall-Zustand, Secure Boot, lauschende Ports, den SSH-Server, Benutzerkonten und Backups. Jedes dauert mit einem einzigen Befehl ein bis zwei Minuten."
  - q: "Heißt eine hohe Sicherheitswertung, dass mein Computer sicher ist?"
    a: "Nein. Eine Wertung zählt die Einstellungen, die geprüft wurden. Sie sieht keine schwachen Passwörter, keine Phishing-Seite, auf die Sie geklickt haben, und keine Software, die Sie absichtlich installiert haben."
---

Ihr Linux-Computer ist wahrscheinlich in ordentlichem Zustand, wenn er Updates installiert, eine verschlüsselte Festplatte hat, eine Firewall läuft, die Sie erklären können, und dem Netzwerk nichts anbietet, was Sie nicht gewählt haben. All das können Sie in etwa zehn Minuten mit den folgenden Befehlen prüfen. Wo sich ein Befehl zwischen Distributionen unterscheidet, steht im Text, welcher gilt.

## Die acht Prüfungen

### 1. Updates

Die meisten erfolgreichen Angriffe nutzen eine Schwachstelle, für die es bereits eine Korrektur gibt. Sehen Sie nach, ob Korrekturen warten:

```sh
# Fedora
sudo dnf check-upgrade
# Ubuntu and Debian
sudo apt update && apt list --upgradable
# Arch
checkupdates   # from the pacman-contrib package
```

Ist die Liste lang, aktualisieren Sie jetzt. Prüfen Sie dann, ob sich Sicherheitsupdates selbst installieren: Ubuntu und Debian nutzen `unattended-upgrades`, Fedora nutzt `dnf-automatic` (dnf5 hat ein eigenes Automatic-Plugin), und Arch hat kein solches Werkzeug, weil es eine Rolling-Release-Distribution ist, die Sie von Hand aktualisieren.

### 2. Festplattenverschlüsselung

Wenn jemand Ihren Laptop mitnimmt, lässt sich eine unverschlüsselte Festplatte lesen, indem man sie an eine andere Maschine anschließt. Sehen Sie sich die Aufteilung an:

```sh
lsblk -f
```

Eine Zeile `crypto_LUKS` über Ihrem Root-Dateisystem bedeutet, dass die Festplatte verschlüsselt ist. Unser Artikel über [LUKS und TPM2](/de/articles/disk-encryption-on-linux-luks-and-tpm2/) behandelt, was das schützt und was nicht.

### 3. Firewall

Prüfen Sie, welche Ihr System nutzt:

```sh
sudo nft list ruleset | head -40
sudo ufw status            # Ubuntu, if ufw is installed
sudo firewall-cmd --state  # Fedora, if firewalld is installed
```

Leere Ausgabe beim ersten Befehl und „inactive“ bei den anderen bedeuten, dass überhaupt nicht gefiltert wird. Ob Sie eine brauchen, ist Thema eines [anderen Artikels](/de/articles/do-you-need-a-firewall-on-linux-desktop/).

### 4. Secure Boot

```sh
mokutil --sb-state
```

„SecureBoot enabled“ heißt, dass die Firmware nur signierte Boot-Software startet. Der Befehl steckt in allen vier Familien im Paket `mokutil`. Die Grenzen finden Sie unter [Lohnt sich Secure Boot unter Linux](/de/articles/is-secure-boot-worth-it-on-linux/).

### 5. Offene Ports

Ein Port ist eine Tür, die ein Programm offen hält. Listen Sie die auf, die auf Verbindungen warten:

```sh
sudo ss -tulpn
```

Alles, was auf `127.0.0.1` oder `::1` lauscht, ist nur von Ihrer eigenen Maschine aus erreichbar. Zeilen mit `0.0.0.0`, `[::]` oder `*` nehmen Verbindungen aus dem Netzwerk an. Fragen Sie sich bei jeder, ob Sie das Programm kennen und dort haben wollen. Wenn nicht, stoppen Sie seinen Dienst.

### 6. SSH

Wenn Sie sich nie von anderswo an diesem Computer anmelden, sollte der SSH-Server nicht laufen:

```sh
systemctl is-active sshd   # Fedora, Arch
systemctl is-active ssh    # Debian, Ubuntu
```

Wenn Sie ihn nutzen, prüfen Sie die wirksamen Einstellungen mit `sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication'`. Die Root-Anmeldung sollte `no` sein, und Schlüssel sind besser als Passwörter.

### 7. Benutzer

```sh
getent group sudo wheel
sudo awk -F: '$2 == "" {print $1}' /etc/shadow
```

Der erste Befehl listet, wer Administrator werden kann (die Gruppe heißt `sudo` unter Debian und Ubuntu, `wheel` unter Fedora und Arch). Der zweite gibt Konten mit leerem Passwortfeld aus, und er sollte nichts ausgeben.

### 8. Backups

Kein Befehl kann Ihnen sagen, dass Ihr Backup funktioniert. Öffnen Sie das neueste und stellen Sie eine einzelne Datei in einem Testordner wieder her. Schlägt das fehl, haben Sie Ihr wichtigstes Problem gefunden. Ransomware, eine ausfallende Festplatte und ein vertipptes `rm` enden alle am selben Punkt.

## Wo Sie anfangen, wenn die Liste lang ist

Versuchen Sie nicht, alles an einem Abend zu beheben. Aktualisieren Sie zuerst, denn das kostet nichts und schließt bekannte Lücken. Kümmern Sie sich dann um alles, was im Netzwerk lauscht und das Sie nicht kennen, danach um SSH und Konten. Festplattenverschlüsselung und Secure Boot erfordern meist eine Neuinstallation oder einen Besuch in den Firmware-Einstellungen, planen Sie sie also für ein Wochenende ein. Richten Sie Backups vor den riskanten Änderungen ein, nicht danach.

## Was eine Wertung bedeutet

Eine Wertung von 100 Punkten fasst Einstellungen zusammen, die ein Programm lesen konnte: Ist die Firewall an, ist die Festplatte verschlüsselt, gibt es ausstehende Updates. Sie eignet sich, um Lücken zu finden und Fortschritt nach einer Änderung zu sehen. Ein Urteil ist sie nicht. Sie weiß nicht, dass Ihr Passwort `hunter2` ist, dass Sie es mehrfach verwenden oder dass Sie ein Skript aus einem Forum ausgeführt haben. Verstehen Sie eine niedrige Zahl als To-do-Liste und eine hohe als „die Grundlagen sind abgedeckt“, nicht als „nichts kann passieren“.

## Mit IbexWall prüfen

Der Bildschirm Übersicht von IbexWall zeigt eine Wertung und eine Liste dessen, was zu beheben ist. Der Systemzustand listet jede Prüfung dahinter auf (Start, Festplatte, Firewall, Konten, Updates, offene Ports). Jede Korrektur ist ein Plan, den Sie zuerst prüfen, mit den genauen Dateien und dem, was kaputtgehen könnte, und Sie können sie im Verlauf rückgängig machen. Version 1.0 ist in Vorbereitung, es gibt also noch keinen Download. Den Stand finden Sie in der Dokumentation unter docs.ibexwall.com.
