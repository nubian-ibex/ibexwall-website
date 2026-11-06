---
title: "Festplattenverschlüsselung unter Linux: LUKS, TPM2, Swap, Ruhezustand"
description: "Wovor LUKS schützt, wie LUKS2 und TPM2-Entsperrung Komfort gegen Sicherheit abwägen, die Lücke bei Swap und Ruhezustand und wie Sie Ihr System prüfen."
slug: "disk-encryption-on-linux-luks-and-tpm2"
date: 2026-11-06
updated: 2026-11-06
tags: [verschlüsselung, luks, tpm2]
related_hardening: []
faq:
  - q: "Wovor schützt die LUKS-Festplattenverschlüsselung?"
    a: "Sie schützt ruhende Daten. Wenn Ihr Laptop verloren geht, gestohlen wird oder ausgeschaltet zerlegt wird, ist der Inhalt der Festplatte ohne Passphrase oder Schlüssel unlesbar."
  - q: "Ist die automatische TPM2-Entsperrung so sicher wie das Eintippen einer Passphrase?"
    a: "Sie tauscht etwas Sicherheit gegen Komfort. Die Festplatte öffnet sich ohne Passphrase, wenn die Boot-Kette passt. Wer die ausgeschaltete Maschine in diesem Zustand in die Hände bekommt, kommt also weiter. Eine zusätzliche PIN schränkt das ein."
---

Festplattenverschlüsselung schützt Ihre Dateien, wenn jemand den Computer hat, aber nicht Sie. Unter Linux erledigt das LUKS, ein Standardformat, das unter dem Dateisystem liegt. Sie geben beim Start eine Passphrase ein, die Festplatte wird entsperrt, und das System läuft wie gewohnt. Für einen Laptop, der verloren gehen könnte, ist es der nützlichste einzelne Schutz.

## Was es schützt und was nicht

Schützt vor:

- einem verlorenen oder gestohlenen Laptop oder Laufwerk;
- jemandem, der die Festplatte ausbaut und anderswo liest;
- Daten, die auf einer Festplatte bleiben, die Sie entsorgen oder verkaufen.

Schützt nicht vor:

- Schadsoftware, die läuft, während Sie angemeldet sind. Dann ist die Festplatte bereits entsperrt.
- Jemandem, der Ihre Passphrase erfährt.
- Einer laufenden Maschine, die im entsperrten Zustand beschlagnahmt wird, oder einer feindlich gesinnten Person, die Zugang zur Maschine und Zeit hat, die unverschlüsselte Boot-Partition zu manipulieren.

Deshalb ergänzt es [Secure Boot](/de/articles/is-secure-boot-worth-it-on-linux/): Das eine deckt die gespeicherten Daten ab, das andere den Startcode.

## LUKS2

LUKS gibt es in zwei Versionen. LUKS2 legen die aktuellen Installationsprogramme an. Es speichert mehr Metadaten, nutzt die Schlüsselableitungsfunktion Argon2id, die absichtlich aufwendig zu erraten ist, und erlaubt mehrere Schlüsselplätze gleichzeitig. So können eine Passphrase, ein Wiederherstellungsschlüssel und ein TPM2-Token jeweils dieselbe Festplatte entsperren.

Prüfen Sie, was Sie haben:

```sh
lsblk -f
sudo cryptsetup luksDump /dev/nvme0n1p3
```

Ersetzen Sie das Gerät durch das, das `lsblk` als `crypto_LUKS` anzeigt. Achten Sie auf `Version: 2` und die Schlüsselplätze. Ältere Installationen können LUKS1 sein. Eine Umwandlung ist möglich, erfordert aber vorher eine Sicherung. Lesen Sie daher `man cryptsetup`, bevor Sie es versuchen.

## TPM2-Entsperrung

Ein TPM2 ist ein Chip in den meisten modernen Computern, der ein Geheimnis aufbewahren und nur herausgeben kann, wenn der gemessene Zustand der Maschine passt. Mit `systemd-cryptenroll` können Sie einen Festplattenschlüssel daran binden, sodass die Maschine startet, ohne nach der Passphrase zu fragen:

```sh
sudo systemd-cryptenroll --tpm2-device=auto --tpm2-pcrs=7 /dev/nvme0n1p3
```

PCR 7 spiegelt die Secure-Boot-Konfiguration wider. Ihr initramfs muss das TPM2 nutzen können (es braucht systemd-basiertes Entsperren), und der crypttab-Eintrag braucht die Option `tpm2-device=auto`. Die genauen Schritte unterscheiden sich zwischen den Distributionen, folgen Sie also der Dokumentation Ihrer Distribution.

Der Kompromiss ist real. Die Festplatte öffnet sich von selbst für jeden, der die Maschine im erwarteten Zustand einschaltet, die Passwortabfrage wandert also zum Anmeldebildschirm. Ein schwaches Benutzerpasswort bewacht dann die Daten. Eine PIN mit `--tpm2-with-pin=yes` bringt ein Geheimnis zurück, das Sie eintippen. Bewahren Sie die ursprüngliche Passphrase oder einen Wiederherstellungsschlüssel an einem sicheren Ort auf: Ein Firmware-Update oder eine geänderte Boot-Konfiguration kann die Messwerte verändern, und das TPM gibt den Schlüssel dann nicht mehr heraus.

## Swap und Ruhezustand

Der Arbeitsspeicher kann auf zwei Wegen auf die Festplatte gelangen, und beide können Schlüssel und Dokumente preisgeben, wenn sie ungeschützt bleiben.

- Swap-Bereich. Ist er eine einfache Partition, ist alles Ausgelagerte lesbar. Legen Sie den Swap in das verschlüsselte Volume oder nutzen Sie zram, das ausgelagerte Seiten im Speicher hält.
- Ruhezustand. Das gesamte Speicherabbild wird in den Swap geschrieben und beim Fortsetzen zurückgelesen, einschließlich des Festplattenschlüssels. Der Ruhezustand ist nur so sicher wie der Swap, den er nutzt. Der Swap muss also im verschlüsselten Volume liegen, und die Resume-Einstellung müssen Sie oder das Installationsprogramm konfigurieren.

Viele Standardinstallationen von Fedora und Ubuntu legen den Swap auf verschlüsselten Speicher oder in zram, aber „viele“ heißt nicht „Ihre“. Prüfen Sie:

```sh
swapon --show
```

Wird ein Gerät aufgelistet, vergewissern Sie sich in `lsblk -f`, dass es unter einem Eltern-Eintrag `crypto_LUKS` liegt.

## Core Dumps

Wenn ein Programm abstürzt, schreibt das System möglicherweise seinen Speicher auf die Festplatte, und dieser Speicher kann Passwörter oder Schlüssel enthalten. Selbst auf einer verschlüsselten Festplatte sind diese Dateien lesbar, sobald Sie angemeldet sind. Es ist daher eine gute Gewohnheit, sie nur dort zu speichern, wo Sie es wollen.

## Wie Sie anfangen

Ist Ihre Festplatte nicht verschlüsselt, ist die saubere Lösung eine Neuinstallation, bei der Sie im Installationsprogramm die Verschlüsselung wählen. Das Verschlüsseln an Ort und Stelle ist mit Werkzeugen wie `cryptsetup-reencrypt` möglich, aber riskant. Erstellen Sie vorher eine vollständige Sicherung.

## Mit IbexWall prüfen

Der Systemzustand meldet, ob die Festplatte verschlüsselt ist, und die Prüfung Core Dumps (system.coredump) kann das Speichern von Absturzabbildern über einen Plan ausschalten. IbexWall verschlüsselt keine Festplatte für Sie und ändert keine LUKS-Schlüssel. Es weist auf die Lücke hin. Jede Änderung, die es vornimmt, ist ein Plan, den Sie prüfen, mit einem Wiederherstellungspunkt, den Sie im Verlauf rückgängig machen können. Version 1.0 ist in Vorbereitung.
