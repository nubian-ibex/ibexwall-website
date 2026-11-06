---
title: "DNS over TLS und DNS over HTTPS erklärt, mit Prüfung"
description: "Einfaches DNS zeigt Ihrem Netzwerk jede besuchte Seite. Was DoT und DoH ändern, wie Sie einen Resolver wählen, der Haken mit Captive Portals und wie Sie testen."
slug: "dns-over-tls-and-https-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [dns, datenschutz, verschlüsselung]
related_hardening: []
faq:
  - q: "Was ist der Unterschied zwischen DNS over TLS und DNS over HTTPS?"
    a: "Beide verschlüsseln die Abfrage. DoT nutzt einen eigenen Port, 853, sodass ein Netzwerk sehen kann, dass Sie es verwenden. DoH läuft wie gewöhnlicher Webverkehr über Port 443 und lässt sich daher schwerer erkennen oder blockieren."
  - q: "Verbirgt verschlüsseltes DNS die Seiten, die ich besuche?"
    a: "Es verbirgt die Abfrage vor Ihrem Netzwerk, aber nicht vor dem Resolver, den Sie gewählt haben, und die Verbindung zur Seite zeigt weiterhin ihre Adresse und oft auch ihren Namen."
---

Jedes Mal, wenn Sie eine Seite öffnen, fragt Ihr Computer zuerst einen DNS-Resolver nach ihrer Adresse. Standardmäßig reist diese Frage als Klartext über Port 53. Wer Ihr WLAN betreibt, Ihr Internetanbieter und jeder auf dem Weg kann also lesen, welche Namen Sie abfragen, und die Antworten verändern. DNS over TLS (DoT) und DNS over HTTPS (DoH) verpacken dieselbe Frage in Verschlüsselung.

## Was einfaches DNS verrät

Eine Abfrage für `example.org` sagt dem Mithörer, dass Sie gleich `example.org` besuchen, auch wenn die Seite selbst verschlüsselt ist. Ein feindliches Netzwerk kann außerdem mit einer falschen Adresse antworten, so leiten manche Captive Portals und manche Angriffe Sie um. Verschlüsselung behebt das Mithören und, weil der Resolver durch sein Zertifikat authentifiziert wird, auch die Manipulation auf dem Weg.

Sie macht Sie nicht anonym. Der Resolver, den Sie wählen, sieht jeden Namen, nach dem Sie fragen. Sie verlagern das Vertrauen also von Ihrem Netzwerk auf dieses Unternehmen. Und wenn Sie sich mit der Seite verbinden, ist ihre Adresse sichtbar, oft auch ihr Name.

## DoT und DoH im Vergleich

- DoT sendet DNS-Nachrichten in TLS über TCP-Port 853. Es ist einfach, und ein Netzbetreiber kann sehen, dass Sie es nutzen, und den Port sperren.
- DoH sendet DNS-Nachrichten als HTTPS-Anfragen über Port 443. Es geht im Webverkehr unter und lässt sich daher schwerer sperren. Manche Browser bringen einen eigenen DoH-Client mit, der den Resolver des Systems umgeht.

Für ein ganzes System ist DoT meist die einfachere Wahl, weil ein Resolver-Dienst es für jedes Programm nutzen kann. DoH innerhalb eines Browsers schützt nur diesen Browser und kann eine lokale Sperrliste oder eine Split-DNS-Einrichtung umgehen, auf die Sie sich verlassen.

## Einen Resolver wählen

Bekannte öffentliche Resolver mit verschlüsselten Endpunkten sind Cloudflare (`1.1.1.1`, Name `one.one.one.one`) und Quad9 (`9.9.9.9`, Name `dns.quad9.net`). Quad9 filtert bekannte schädliche Domains standardmäßig, Cloudflares einfacher Dienst tut das nicht. Ihre Dokumentation beschreibt Protokollierung und Datenschutzrichtlinien, und Sie sollten sie lesen, bevor Sie sich entscheiden. Der Resolver Ihres Anbieters ist eine weitere Möglichkeit, mit dem Nachteil, dass er genau die Partei ist, der Sie ausweichen wollten. Ein Resolver, den Sie selbst betreiben, gibt die meiste Kontrolle und macht die meiste Arbeit.

## Mit systemd-resolved einschalten

Fedora und Ubuntu nutzen systemd-resolved standardmäßig. Debian und Arch haben es verfügbar, aber nicht unbedingt aktiv. Wenn es bei Ihnen läuft, legen Sie ein Drop-in an:

```ini
# /etc/systemd/resolved.conf.d/dot.conf
[Resolve]
DNS=9.9.9.9#dns.quad9.net 149.112.112.112#dns.quad9.net
DNSOverTLS=yes
```

Führen Sie dann `sudo systemctl restart systemd-resolved` aus. Mit `DNSOverTLS=yes` schlagen Abfragen fehl, wenn der Server nicht über TLS erreichbar ist. Der Wert `opportunistic` versucht TLS und fällt auf einfaches DNS zurück. Das hält Sie online, lässt aber zu, dass ein Angreifer das Zurückfallen erzwingt.

## Der Haken mit Captive Portals

WLAN in Hotels und Cafés fängt Ihre erste Webanfrage oft ab, um eine Anmeldeseite zu zeigen. Striktes verschlüsseltes DNS kann das stören, weil das Portal erwartet, einfache Abfragen zu beantworten, bevor Sie sich anmelden. Typische Anzeichen: mit dem WLAN verbunden, aber keine Seite öffnet sich. Gängige Auswege sind, sich im Modus `opportunistic` anzumelden, die Adresse des Portals direkt zu öffnen oder den strikten Modus für diese Sitzung auszuschalten und danach wieder einzuschalten.

## Prüfen, was Ihres tut

```sh
resolvectl status
```

Achten Sie auf `DNS Servers` und auf `+DNSOverTLS` in der Protokollzeile der Schnittstelle oder des globalen Abschnitts. Um zu sehen, ob einfaches DNS die Maschine noch verlässt, beobachten Sie Port 53 auf Ihrer echten Netzwerkschnittstelle (ihren Namen finden Sie mit `ip -br link`, zum Beispiel `wlan0` oder `enp3s0`), während Sie surfen:

```sh
sudo tcpdump -ni wlan0 port 53
```

Verwenden Sie nicht `-i any`: Programme sprechen mit dem lokalen Stub-Resolver auf der Loopback-Schnittstelle, und dieser Verkehr würde auftauchen und wie ein Leck aussehen. Stille auf der echten Schnittstelle, während Seiten laden, heißt, dass Abfragen nicht im Klartext hinausgehen. Sie können auch `resolvectl query example.org` ausführen und prüfen, welcher Server geantwortet hat. Wenn Sie ein VPN nutzen, können dessen DNS-Einstellungen Ihre für manche Namen überschreiben. Testen Sie also mit und ohne VPN.

## Mit IbexWall prüfen

Der Bildschirm Sicheres DNS, getragen vom Plugin net.dns, verschlüsselt Abfragen, blockiert Tracker und Schadsoftware-Domains und hindert Browser daran, es zu umgehen. Ein vorhandenes dnscrypt-proxy erkennt er, statt dagegen zu arbeiten. Änderungen sind ein Plan, den Sie prüfen und im Verlauf rückgängig machen, und eine DNS-Änderung, die Sie offline lassen könnte, wartet auf Ihre Bestätigung. Version 1.0 ist in Vorbereitung. Wenn ein Captive Portal im Weg ist, kann IbexWall Ihnen sagen, dass es eines erkannt hat, die Anmeldung erledigen Sie aber selbst.
