---
title: "Faut-il un pare-feu sur un poste Linux ? Ce qu'il fait"
description: "Un poste Linux accepte tout par défaut. Voyez ce qui écoute vraiment, le lien entre nftables, ufw et firewalld, et les règles entrantes ou par programme."
slug: "do-you-need-a-firewall-on-linux-desktop"
date: 2026-11-06
updated: 2026-11-06
tags: [pare-feu, nftables, réseau]
related_hardening: [net.tcp-syncookies, net.source-routing]
faq:
  - q: "Ai-je besoin d'un pare-feu sur un poste Linux ?"
    a: "Si rien n'écoute les connexions extérieures, un pare-feu a peu à bloquer. Il reste utile comme filet de sécurité pour les services que vous installerez plus tard, et sur les réseaux auxquels vous ne faites pas confiance."
  - q: "ufw, firewalld et nftables sont-ils des pare-feu différents ?"
    a: "Non. nftables est le filtre de paquets du noyau. ufw et firewalld sont des outils qui écrivent à votre place des règles nftables ou iptables avec des commandes plus simples."
---

Un poste Linux n'a pas besoin de pare-feu pour être utilisable, et beaucoup fonctionnent sans. Mais c'est un filet de sécurité peu coûteux : si un programme se met plus tard à écouter sur un port, que ce soit par un paquet que vous installez, un serveur de développement que vous oubliez ou un service qu'une distribution active, c'est le pare-feu qui décide si le réseau peut l'atteindre. La question la plus utile est de savoir ce qui écoute en ce moment.

## Tout autorisé par défaut, en clair

Le noyau Linux ne filtre rien tant qu'on n'ajoute pas de règles. Fedora Workstation livre firewalld activé. Ubuntu livre ufw mais le laisse désactivé. Debian et Arch n'installent aucun pare-feu par défaut. Sur une installation neuve de Debian ou d'Arch, chaque port qu'un programme ouvre est donc joignable depuis votre réseau.

C'est moins alarmant que cela n'en a l'air, car un poste neuf en ouvre très peu. Les box domestiques bloquent aussi le trafic non sollicité venant d'Internet. Le risque est le réseau local : un café, un hôtel, une colocation, un bureau.

## Voir ce qui écoute

```sh
sudo ss -tulpn
```

Les colonnes qui comptent sont l'adresse locale et le programme. `127.0.0.1` signifie que seul cet ordinateur peut se connecter. `0.0.0.0` ou `[::]` signifie toute machine qui peut vous joindre. Les entrées normales sur un poste sont le relais DNS local, le service mDNS (Avahi, UDP 5353) et le service d'impression (CUPS, qui reste normalement sur l'interface de bouclage). Tout ce que vous ne reconnaissez pas mérite un coup d'œil.

Vous pouvez aussi tester de l'extérieur avec `nmap` depuis une autre machine, ce qui montre ce que le réseau voit réellement plutôt que ce que la machine croit offrir.

## nftables, ufw et firewalld

Ce sont trois couches, pas trois rivaux.

- nftables est le moteur de filtrage du noyau, et `nft` est sa commande.
- ufw (« uncomplicated firewall ») est une interface simple, courante sur Ubuntu. Un usage typique : `sudo ufw enable` puis `sudo ufw allow 22/tcp`.
- firewalld est une interface construite autour de zones comme `public` et `home`, utilisée par Fedora. Un usage typique : `sudo firewall-cmd --list-all`.

Choisissez celle que votre distribution utilise déjà. Faire tourner deux interfaces qui gèrent toutes deux des règles donne des résultats déroutants. Pour lire ce qui est actif, `sudo nft list ruleset` fonctionne toujours, car toute interface aboutit là, ou dans l'ancienne couche iptables qui repose désormais souvent sur nftables.

## Entrant contre sortant

Une règle entrante décide qui peut ouvrir une connexion vers vous. Pour un poste, le choix raisonnable est de refuser le trafic entrant non sollicité et d'autoriser les réponses aux connexions que vous avez lancées. Les trois outils le font d'emblée une fois activés.

Le filtrage sortant est un autre travail. Les outils classiques filtrent par adresse et par port, pas par programme, donc ils ne peuvent pas dire « Firefox peut se connecter, ce binaire inconnu non ». Le contrôle sortant par programme exige que le noyau dise au filtre quel processus possède une connexion, ce que font les outils fondés sur eBPF. C'est utile pour remarquer un programme qui parle à un serveur inattendu. C'est aussi plus contraignant au quotidien, car vous répondez à une question la première fois que chaque programme se connecte.

## Quand il compte le plus

Trois situations augmentent la valeur d'un pare-feu. Vous utilisez souvent des réseaux publics ou partagés. Vous lancez des serveurs de développement, des bases de données ou des partages de fichiers qui écoutent par défaut sur toutes les adresses, et vous les oubliez. Ou vous partagez une machine avec d'autres personnes, où une installation négligente peut ouvrir un port pour tout le monde. Si rien de cela ne s'applique et que `ss` ne montre rien en dehors de l'interface de bouclage, le pare-feu est une ceinture de sécurité dont vous vous servez rarement. La garder activée coûte très peu.

## Une configuration raisonnable

1. Utilisez l'interface que votre distribution fournit et activez-la.
2. Gardez le réglage par défaut qui refuse les connexions entrantes non sollicitées.
3. N'ouvrez un port que si vous pouvez nommer le service et dire pourquoi.
4. Relancez `ss -tulpn` après avoir installé un logiciel serveur.
5. Si vous voulez voir le comportement sortant, ajoutez une surveillance par programme plutôt que d'écrire des règles à la main.

Sur un portable qui passe d'un réseau à l'autre, les zones ou les profils aident : la zone `public` de firewalld est stricte, et `home` est plus souple.

## Vérifier avec IbexWall

L'écran Pare-feu liste les règles entrantes et passe par le pare-feu que votre système utilise déjà, et l'écran Applications et réseau montre quel programme parle à qui et demande la première fois qu'un programme se connecte. IbexWall garde ses propres règles dans `table inet ibexwall` et ne modifie jamais celles de votre distribution. Chaque changement est un plan que vous examinez, avec un point de restauration que vous pouvez annuler depuis l'Historique, et une règle qui pourrait couper votre connexion attend votre confirmation. La version 1.0 est en préparation. Pour une vue plus large, commencez par l'[auto-vérification en dix minutes](/fr/articles/how-secure-is-my-linux-computer/).
