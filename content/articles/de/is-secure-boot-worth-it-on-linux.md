---
title: "Lohnt sich Secure Boot unter Linux? Was es abdeckt und was nicht"
description: "Secure Boot prüft, ob der Code, der Ihren Rechner startet, signiert ist. Was es schützt, was nicht, wie shim und MOK funktionieren, und wie Sie Ihres prüfen."
slug: "is-secure-boot-worth-it-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [secure-boot, boot, firmware]
related_hardening: [kernel.kexec]
faq:
  - q: "Lohnt es sich, Secure Boot unter Linux zu aktivieren?"
    a: "Ja, für die meisten. Es hält unsignierten Boot-Code vom Start ab und erlaubt dem Kernel, den Lockdown einzuschalten. Es schützt keine Dateien im laufenden System und keine gestohlene, unverschlüsselte Platte."
  - q: "Wie prüfe ich, ob Secure Boot an ist?"
    a: "Führen Sie mokutil --sb-state aus. Es druckt SecureBoot enabled oder disabled."
---

Für die meisten Desktop-Nutzer ja: Secure Boot lohnt sich, und die großen Linux-Distributionen funktionieren damit. Es schließt eine bestimmte Tür, nämlich unsignierten Code, der vor dem Start des Betriebssystems läuft. Es macht das laufende System nicht sicher und schützt keine Daten auf einer unverschlüsselten Platte.

## Was es tut

Beim Start kann die UEFI-Firmware alles ablehnen, dessen Signatur sie nicht vertraut. Mit aktivem Secure Boot prüft die Firmware den Bootloader, der Bootloader prüft den Kernel, und der Kernel kann die Module prüfen, die er lädt. Ein Werkzeug, das sich in die Boot-Kette setzt (ein Bootkit), muss von einem Schlüssel signiert sein, dem die Firmware vertraut, sonst läuft es nicht.

Ein anderer Effekt zählt im Alltag mehr. Ist Secure Boot an, kann der Kernel im Lockdown-Modus starten, der Wege schließt, mit denen root den laufenden Kernel ändern könnte, etwa in den Kernelspeicher schreiben oder unsignierte Module laden.

## Was es nicht tut

- Es schützt nicht vor Schadsoftware, die nach dem Systemstart als Sie läuft.
- Es verschlüsselt nichts. Wer Ihren Laptop hat, liest weiterhin eine unverschlüsselte Platte. Siehe [Festplattenverschlüsselung mit LUKS und TPM2](/de/articles/disk-encryption-on-linux-luks-and-tpm2/).
- Es prüft nicht Ihre eigenen Dateien, Skripte oder den Inhalt Ihres Home-Ordners.
- Es hängt von der Firmware ab. Eine signierte Boot-Kette mit veralteter, verwundbarer Firmware oder einem alten, gesperrten Bootloader ist nur so stark wie ihr schwächstes Glied.
- Es vertraut den Schlüsseln in Ihrer Firmware, auch dem, der die verbreitete Boot-Komponente shim signiert.

## Shim und MOK

Die meisten Firmware vertraut einem Microsoft-Schlüssel. Linux-Distributionen können nicht jeden Kernel damit signieren lassen, daher liefern sie ein kleines, signiertes Programm namens shim aus. Die Firmware vertraut shim, und shim vertraut dem eigenen Schlüssel der Distribution und einer vom Besitzer kontrollierten Liste namens MOK (Machine Owner Key).

MOK ist der Weg, Module von Drittanbietern wie manche Grafik- oder Virtualisierungstreiber mit aktivem Secure Boot zu laden. Sie signieren das Modul (oder lassen das Werkzeug Ihrer Distribution es tun), hinterlegen den Schlüssel mit `mokutil --import`, starten neu und bestätigen die Aufnahme im blauen Bildschirm beim Start mit dem von Ihnen gewählten Passwort. Nichts wird ohne Sie an der Konsole aufgenommen, und genau darum geht es.

Lädt ein Modul nicht und erwähnt das Log "required key not available", ist es für diese Schlüsselkette nicht signiert.

## Lockdown

Prüfen Sie den Modus des Kernels:

```sh
cat /sys/kernel/security/lockdown
```

Der aktive Modus steht in Klammern: `[none]`, `[integrity]` oder `[confidentiality]`. Integrity blockiert, was root erlauben würde, den Kernel zu ändern. Confidentiality blockiert zusätzlich das Lesen von Kernel-Geheimnissen. Viele Distributions-Kernel wählen integrity bei aktivem Secure Boot, aber prüfen Sie Ihren statt anzunehmen. Wegen des Lockdown hören manche alte Werkzeuge, darunter direkter Speicherzugriff, mit Secure Boot auf zu funktionieren.

## So prüfen Sie

```sh
mokutil --sb-state
```

Installieren Sie `mokutil` zuerst, falls der Befehl fehlt. Auf systemd-Systemen zeigt `bootctl status` ebenfalls den Secure-Boot-Zustand und die Firmware-Einstellung. Wo die Maschine kein UEFI hat (altes BIOS oder manche virtuelle Maschinen), zeigt keines von beiden etwas, und es gibt nichts zu aktivieren.

Zum Aktivieren öffnen Sie die Firmware-Einstellung (meist Entf, F2 oder F10 beim Start) und schalten Secure Boot ein. Auf Arch Linux und einigen anderen Setups müssen Sie zuerst Ihren eigenen Bootloader signieren oder ein Werkzeug wie `sbctl` nutzen, weil die Installation keine signierten Binärdateien mitbringt; folgen Sie der Secure-Boot-Seite des Arch-Wiki, statt die Reihenfolge zu raten.

## Lohnt sich der Aufwand

Wo Ihre Distribution die Signatur übernimmt, kostet es eine Einstellung und gelegentlich eine Schlüsselaufnahme, und Sie gewinnen Schutz vor einer Klasse dauerhafter Angriffe und den Lockdown-Modus. Bauen Sie eigene Kernel oder sind auf unsignierte Module angewiesen, ist die Arbeit größer und der Gewinn kleiner. Festplattenverschlüsselung und Updates verdienen zuerst Aufmerksamkeit.

## Prüfen Sie mit IbexWall

Der Bildschirm Systemzustand deckt Boot, Platte, Firewall und Konten ab, und die Kernel-Härtungseinstellungen im Katalog erklären, was jede Änderung bewirkt, etwa die, die [das Laden eines weiteren Kernels im Betrieb verbietet](/de/hardening/kernel.kexec/). IbexWall liest den Zustand und sagt, was zu beheben ist. Änderungen darin sind Pläne, die Sie prüfen und über den Verlauf rückgängig machen können. Version 1.0 ist in Vorbereitung.
