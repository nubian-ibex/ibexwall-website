---
title: "Brauchen Sie eine Firewall auf dem Linux-Desktop?"
description: "Ein Linux-Desktop erlaubt standardmäßig alles. Was wirklich lauscht, wie nftables, ufw und firewalld zusammenhängen und eingehende Regeln gegen Regeln pro Programm."
slug: "do-you-need-a-firewall-on-linux-desktop"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, nftables, netzwerk]
related_hardening: [net.tcp-syncookies, net.source-routing]
faq:
  - q: "Brauche ich auf einem Linux-Desktop eine Firewall?"
    a: "Wenn nichts auf Verbindungen von außen lauscht, gibt es für eine Firewall wenig zu blockieren. Sie lohnt sich trotzdem als Sicherheitsnetz für Dienste, die Sie später installieren, und in Netzwerken, denen Sie nicht trauen."
  - q: "Sind ufw, firewalld und nftables verschiedene Firewalls?"
    a: "Nein. nftables ist der Paketfilter im Kernel. ufw und firewalld sind Werkzeuge, die mit einfacheren Befehlen nftables- oder iptables-Regeln für Sie schreiben."
---

Ein Linux-Desktop braucht keine Firewall, um benutzbar zu sein, und viele laufen ohne. Aber sie ist ein günstiges Sicherheitsnetz: Wenn ein Programm später auf einem Port zu lauschen beginnt, sei es durch ein Paket, das Sie installieren, einen Entwicklungsserver, den Sie vergessen, oder einen Dienst, den eine Distribution aktiviert, entscheidet eine Firewall, ob das Netzwerk ihn erreichen kann. Die nützlichere Frage ist, was gerade lauscht.

## Standardmäßig erlaubt, in einfachen Worten

Der Linux-Kernel filtert nichts, bis Regeln hinzugefügt werden. Fedora Workstation liefert firewalld aktiviert aus. Ubuntu liefert ufw mit, lässt es aber aus. Debian und Arch installieren standardmäßig keine Firewall. Auf einer frischen Debian- oder Arch-Maschine ist also jeder Port, den ein Programm öffnet, aus Ihrem Netzwerk erreichbar.

Das ist weniger beunruhigend, als es klingt, denn ein frischer Desktop öffnet sehr wenige. Heimrouter blockieren außerdem unaufgeforderten Verkehr aus dem Internet. Das Risiko liegt im lokalen Netzwerk: einem Café, einem Hotel, einer WG, einem Büro.

## Sehen, was lauscht

```sh
sudo ss -tulpn
```

Wichtig sind die Spalten mit der lokalen Adresse und dem Programm. `127.0.0.1` heißt, nur dieser Computer kann sich verbinden. `0.0.0.0` oder `[::]` heißt, jede Maschine, die Sie erreichen kann. Typische harmlose Einträge auf einem Desktop sind der lokale DNS-Stub, der mDNS-Dienst (Avahi, UDP 5353) und der Druckerdienst (CUPS, der normalerweise auf Loopback sitzt). Alles, was Sie nicht kennen, verdient einen Blick.

Sie können auch von außen mit `nmap` auf einer anderen Maschine testen. Das zeigt, was das Netzwerk tatsächlich sieht, statt dessen, was die Maschine anzubieten glaubt.

## nftables, ufw und firewalld

Das sind drei Schichten, keine drei Rivalen.

- nftables ist die Filter-Engine im Kernel, und `nft` ist ihr Befehl.
- ufw („uncomplicated firewall“) ist ein einfaches Frontend, verbreitet unter Ubuntu. Typisch sind `sudo ufw enable` und `sudo ufw allow 22/tcp`.
- firewalld ist ein Frontend rund um Zonen wie `public` und `home`, das Fedora nutzt. Typisch ist `sudo firewall-cmd --list-all`.

Nehmen Sie das Frontend, das Ihre Distribution schon nutzt. Zwei Frontends, die beide Regeln verwalten, führen zu verwirrenden Ergebnissen. Um zu lesen, was aktiv ist, funktioniert `sudo nft list ruleset` immer, denn jedes Frontend landet dort oder in der älteren iptables-Schicht, die heute oft auf nftables aufsetzt.

## Eingehend und ausgehend

Eine eingehende Regel entscheidet, wer eine Verbindung zu Ihnen aufbauen darf. Für einen Desktop ist die vernünftige Voreinstellung, unaufgeforderten eingehenden Verkehr abzulehnen und Antworten auf Verbindungen zuzulassen, die Sie selbst gestartet haben. Alle drei Werkzeuge tun das ab Werk, wenn sie aktiviert sind.

Ausgehendes Filtern ist eine andere Aufgabe. Die klassischen Werkzeuge filtern nach Adresse und Port, nicht nach Programm. Sie können also nicht sagen „Firefox darf sich verbinden, dieses unbekannte Programm nicht“. Ausgehende Kontrolle pro Programm braucht den Kernel, der dem Filter sagt, welcher Prozess eine Verbindung besitzt, und genau das tun eBPF-basierte Werkzeuge. Sie hilft, ein Programm zu bemerken, das mit einem unerwarteten Server spricht. Sie ist auch mühsamer im Alltag, weil Sie beim ersten Verbindungsversuch jedes Programms eine Frage beantworten.

## Wann es am wichtigsten ist

Drei Situationen erhöhen den Wert einer Firewall. Sie nutzen oft öffentliche oder geteilte Netzwerke. Sie betreiben Entwicklungsserver, Datenbanken oder Dateifreigaben, die standardmäßig an jede Adresse binden, und vergessen sie. Oder Sie teilen sich eine Maschine mit anderen, wo eine unachtsame Installation einen Port für alle öffnen kann. Trifft nichts davon zu und zeigt `ss` nichts außerhalb von Loopback, ist die Firewall ein Sicherheitsgurt, den Sie selten brauchen. Sie angeschaltet zu lassen kostet sehr wenig.

## Eine vernünftige Einrichtung

1. Nutzen Sie das Frontend, das Ihre Distribution mitbringt, und schalten Sie es ein.
2. Behalten Sie die Voreinstellung bei, unaufgeforderte eingehende Verbindungen abzulehnen.
3. Öffnen Sie einen Port nur, wenn Sie den Dienst und den Grund nennen können.
4. Sehen Sie sich `ss -tulpn` nach der Installation von Serversoftware noch einmal an.
5. Wenn Sie ausgehendes Verhalten sehen wollen, ergänzen Sie eine Überwachung pro Programm, statt Regeln von Hand zu schreiben.

Auf einem Laptop, der zwischen Netzwerken wechselt, helfen Zonen oder Profile: Die Zone `public` von firewalld ist streng, `home` ist lockerer.

## Mit IbexWall prüfen

Der Bildschirm Firewall listet eingehende Regeln auf und arbeitet über die Firewall, die Ihr System bereits nutzt. Der Bildschirm Apps und Netzwerk zeigt, welches Programm mit wem spricht, und fragt, wenn sich ein Programm zum ersten Mal verbindet. IbexWall hält seine eigenen Regeln in `table inet ibexwall` und ändert nie die Ihrer Distribution. Jede Änderung ist ein Plan, den Sie prüfen, mit einem Wiederherstellungspunkt, den Sie im Verlauf rückgängig machen können, und eine Regel, die Ihre Verbindung kappen könnte, wartet auf Ihre Bestätigung. Version 1.0 ist in Vorbereitung. Für das größere Bild beginnen Sie mit dem [Selbsttest in zehn Minuten](/de/articles/how-secure-is-my-linux-computer/).
