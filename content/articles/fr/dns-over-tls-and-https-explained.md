---
title: "DNS sur TLS et DNS sur HTTPS : explications et vérification"
description: "Le DNS classique montre à votre réseau chaque site que vous visitez. Ce que changent DoT et DoH, comment choisir un résolveur, le piège du portail captif et comment tester."
slug: "dns-over-tls-and-https-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [dns, confidentialité, chiffrement]
related_hardening: []
faq:
  - q: "Quelle différence entre DNS sur TLS et DNS sur HTTPS ?"
    a: "Les deux chiffrent la requête. DoT utilise son propre port, 853, donc un réseau peut voir que vous l'utilisez. DoH passe sur le port 443 comme le trafic web ordinaire, ce qui le rend plus difficile à distinguer ou à bloquer."
  - q: "Le DNS chiffré cache-t-il les sites que je visite ?"
    a: "Il cache la requête à votre réseau, mais pas au résolveur que vous avez choisi, et la connexion au site montre encore son adresse et souvent son nom."
---

Chaque fois que vous ouvrez un site, votre ordinateur demande d'abord son adresse à un résolveur DNS. Par défaut, cette question circule en clair sur le port 53, donc le propriétaire du Wi-Fi, votre fournisseur d'accès et toute personne sur le trajet peuvent lire les noms que vous demandez et modifier les réponses. DNS sur TLS (DoT) et DNS sur HTTPS (DoH) enveloppent la même question dans du chiffrement.

## Ce que révèle le DNS en clair

Une requête pour `example.org` dit à celui qui écoute que vous allez visiter `example.org`, même si la page elle-même est chiffrée. Un réseau hostile peut aussi répondre avec une fausse adresse, ce qui est la façon dont certaines pages captives et certaines attaques vous redirigent. Le chiffrement règle l'écoute et, puisque le résolveur est authentifié par son certificat, la falsification sur le trajet.

Il ne vous rend pas anonyme. Le résolveur que vous choisissez voit chaque nom que vous demandez, donc vous déplacez la confiance de votre réseau vers cette entreprise. Et quand vous vous connectez au site, son adresse est visible, et son nom l'est souvent aussi.

## DoT contre DoH

- DoT envoie les messages DNS dans du TLS sur le port TCP 853. C'est simple, et un opérateur de réseau peut voir que vous l'utilisez et peut bloquer le port.
- DoH envoie les messages DNS sous forme de requêtes HTTPS sur le port 443. Il se fond dans le trafic web, donc il est plus difficile à bloquer, et certains navigateurs embarquent leur propre client DoH qui contourne le résolveur du système.

Pour tout un système, DoT est en général le choix le plus simple, car un service de résolution peut l'utiliser pour tous les programmes. Le DoH d'un seul navigateur ne protège que ce navigateur, et il peut ignorer une liste de blocage locale ou une configuration de DNS séparé sur lesquelles vous comptez.

## Choisir un résolveur

Parmi les résolveurs publics connus qui offrent des points d'accès chiffrés, il y a Cloudflare (`1.1.1.1`, nom `one.one.one.one`) et Quad9 (`9.9.9.9`, nom `dns.quad9.net`). Quad9 filtre par défaut les domaines malveillants connus ; le service simple de Cloudflare ne le fait pas. Leur documentation décrit leurs politiques de journalisation et de confidentialité, et vous devriez la lire avant de décider. Le résolveur de votre fournisseur d'accès est une autre option, avec le défaut d'être la partie que vous cherchiez à éviter. Un résolveur que vous gérez vous-même donne le plus de contrôle et le plus d'entretien.

## L'activer avec systemd-resolved

Fedora et Ubuntu utilisent systemd-resolved par défaut. Debian et Arch l'ont à disposition, mais pas forcément actif. Si c'est le vôtre, créez un fichier drop-in :

```ini
# /etc/systemd/resolved.conf.d/dot.conf
[Resolve]
DNS=9.9.9.9#dns.quad9.net 149.112.112.112#dns.quad9.net
DNSOverTLS=yes
```

Lancez ensuite `sudo systemctl restart systemd-resolved`. Avec `DNSOverTLS=yes`, les requêtes échouent quand le serveur est injoignable en TLS. La valeur `opportunistic` essaie TLS et se rabat sur le DNS en clair, ce qui vous garde en ligne mais permet à un attaquant de forcer le repli.

## Le piège du portail captif

Le Wi-Fi des hôtels et des cafés intercepte souvent votre première requête web pour afficher une page de connexion. Un DNS chiffré strict peut empêcher cela, car le portail s'attend à répondre à des requêtes en clair avant que vous vous identifiiez. Symptômes typiques : connecté au Wi-Fi, aucune page ne s'ouvre. Les issues courantes : vous identifier en mode `opportunistic`, ouvrir directement l'adresse du portail, ou désactiver le mode strict pour cette session et le réactiver après.

## Vérifier ce que fait le vôtre

```sh
resolvectl status
```

Cherchez `DNS Servers` et `+DNSOverTLS` dans la ligne de protocole de l'interface ou de la section globale. Pour voir si du DNS en clair quitte encore la machine, surveillez le port 53 sur votre vraie interface réseau (trouvez son nom avec `ip -br link`, par exemple `wlan0` ou `enp3s0`) pendant que vous naviguez :

```sh
sudo tcpdump -ni wlan0 port 53
```

N'utilisez pas `-i any` : les programmes parlent au résolveur local intermédiaire sur l'interface de bouclage, et ce trafic apparaîtrait et ressemblerait à une fuite. Le silence sur la vraie interface pendant le chargement des pages signifie que les requêtes ne sortent pas en clair. Vous pouvez aussi lancer `resolvectl query example.org` et regarder quel serveur a répondu. Si vous utilisez un VPN, ses réglages DNS peuvent remplacer les vôtres pour certains noms, donc testez avec lui activé puis désactivé.

## Vérifier avec IbexWall

L'écran DNS sécurisé, appuyé sur le plugin net.dns, chiffre les requêtes, bloque les traqueurs et les domaines malveillants, et empêche les navigateurs de le contourner. Il reconnaît un dnscrypt-proxy existant plutôt que de le combattre. Les changements sont un plan que vous examinez et annulez depuis l'Historique, et un changement de DNS qui pourrait vous laisser hors ligne attend votre confirmation. La version 1.0 est en préparation. Si un portail captif gêne, IbexWall peut vous dire qu'il en a détecté un, mais c'est toujours vous qui vous identifiez.
