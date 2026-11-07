---
title: "Linux-Firewalls: netfilter, nftables, firewalld und ufw"
description: "Jede Linux-Firewall sitzt auf demselben Kernel-Rahmen, netfilter. Was iptables, nftables, firewalld und ufw sind, worin sich ihre Oberflächen unterscheiden und was sie teilen."
slug: "linux-firewalls-netfilter-nftables-firewalld-ufw"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, netfilter, nftables, firewalld, ufw]
related_hardening: []
---

Frag, welche Firewall Linux nutzt, und die Antwort wechselt je nach Distribution: firewalld unter Fedora, ufw unter Ubuntu, reines nftables anderswo. Darunter ist alles dasselbe. Dieser Artikel trennt die Schichten.

## Der gemeinsame Punkt: netfilter

Netfilter ist der Paketfilter-Rahmen im Linux-Kernel. Jede Firewall unter Linux ist eine Oberfläche, die Regeln in netfilter schreibt. Das ist der einzige Punkt, den alle teilen: Egal welches Werkzeug, die Entscheidung fällt in denselben Kernel-Hooks, für jedes Paket, das hindurchgeht.

## Die Befehlsschicht

- iptables ist das alte Userspace-Werkzeug. Es stammt von vor dem heutigen Rahmen und ist auf den meisten Distributionen im Wartungsmodus.
- nftables ist sein moderner Nachfolger. Es führt zusammen, was früher mehrere Werkzeuge waren (IPv4, IPv6, ARP, Bridging), in einem, mit einem einzigen Befehl `nft` und einer einzigen Regelsyntax.

Die meisten Menschen schreiben keine iptables- oder nftables-Regeln von Hand. Sie nutzen eine Oberfläche, und dort scheiden sich die Oberflächen.

## Die Oberflächen und ihre UIs

- firewalld ist der Daemon unter Fedora, RHEL und openSUSE. Er denkt in Zonen (Zuhause, öffentlich, Arbeit) und Diensten und wendet Änderungen zur Laufzeit an, ohne bestehende Verbindungen zu kappen. Seine Oberflächen sind `firewall-cmd` auf der Kommandozeile und das grafische `firewall-config`.
- ufw, die Uncomplicated Firewall, ist der Standard unter Debian und Ubuntu. Es ist eine dünne Schicht über iptables oder nftables mit viel einfacherer Syntax: `ufw allow 22/tcp`, `ufw enable`. Seine grafische Oberfläche ist `gufw`.
- Reines nftables ist die Wahl unter Arch und in Containern, wo die Distribution keine Oberfläche vorgibt und der Administrator die Tabelle direkt schreibt.

Das heißt, die „verschiedenen Firewalls" sind meist verschiedene Oberflächen über einem Motor. Die Verwirrung ist real, weil Syntax, Konfigurationsdateien und Denkmodell sich unterscheiden, aber die Sicherheitseigenschaft, ein Paket wird von einer netfilter-Regel erlaubt oder verworfen, ist identisch.

## Was die UIs gemeinsam haben

Jede Firewall-Oberfläche, ob grafisch oder nicht, beantwortet dieselben drei Fragen: Was darf hinein, was darf hinaus, und ist es an. firewalld fragt nach Zone und Dienst; ufw fragt als Liste von Erlaubnisregeln; eine reine nftables-Tabelle fragt als Regelketten. Alle teilen auch denselben Fehlermodus: Ein Regelfehler kann dich aus einer entfernten Maschine aussperren, weil die Firewall genau tut, was ihr gesagt wurde.

## Was IbexWall hinzufügt

IbexWall arbeitet durch das hindurch, was schon da ist. Auf einer Maschine mit firewalld oder ufw steuert es diese Oberfläche und lässt die Regeln der Distribution unangetastet; auf einer Maschine ohne beides verwaltet es seine eigene nftables-Tabelle `inet ibexwall`. In beiden Fällen schreibt es nur in seine eigene Tabelle, niemals in die Tabelle eines anderen Programms.

Zwei Dinge ändern sich für den Menschen:

- Vor dem Anwenden prüfen. Du siehst die genauen Regeln, die eine Änderung hinzufügt, was sie betrifft und was kaputtgehen kann, bevor irgendetwas geschrieben wird. Eine Änderung, die dein Netz kappen könnte, wartet auf deine Bestätigung.
- Kontrolle pro Programm. Über der Firewall nutzt IbexWall eBPF, um zu entscheiden, welche Programme ins Netz dürfen, und fragt beim ersten Mal, wenn ein neues es versucht.

Die Firewall bleibt dasselbe netfilter wie immer. Was IbexWall ändert, ist, dass sie zu einem Plan wird, den du prüfst und rückgängig machen kannst, statt zu einem Befehl, den du ausführst und hoffst.
