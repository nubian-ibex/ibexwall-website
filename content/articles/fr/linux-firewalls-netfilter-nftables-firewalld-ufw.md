---
title: "Pare-feux Linux : netfilter, nftables, firewalld et ufw"
description: "Tout pare-feu Linux repose sur le même cadre du noyau, netfilter. Ce que sont iptables, nftables, firewalld et ufw, en quoi leurs interfaces diffèrent, et ce qu'ils partagent."
slug: "linux-firewalls-netfilter-nftables-firewalld-ufw"
date: 2026-11-06
updated: 2026-11-06
tags: [pare-feu, netfilter, nftables, firewalld, ufw]
related_hardening: []
---

Demandez quel pare-feu Linux utilise et la réponse change selon la distribution : firewalld sur Fedora, ufw sur Ubuntu, nftables pur ailleurs. En dessous, tout est la même chose. Cet article sépare les couches.

## Le point commun : netfilter

Netfilter est le cadre de filtrage de paquets à l'intérieur du noyau Linux. Tout pare-feu sous Linux est une interface qui écrit des règles dans netfilter. C'est le seul point que tous partagent : quel que soit l'outil, la décision a lieu dans les mêmes crochets du noyau, pour chaque paquet qui passe.

## La couche de commande

- iptables est l'ancien outil en espace utilisateur. Il précède le cadre actuel et est en mode maintenance sur la plupart des distributions.
- nftables est son remplaçant moderne. Il fusionne ce qui était plusieurs outils (IPv4, IPv6, ARP, pontage) en un seul, avec une seule commande `nft` et une seule syntaxe de règles.

La plupart des gens n'écrivent pas de règles iptables ou nftables à la main. Ils utilisent une interface, et c'est là que les interfaces divergent.

## Les interfaces et leurs UIs

- firewalld est le démon sur Fedora, RHEL et openSUSE. Il raisonne en zones (domicile, public, travail) et en services, et applique les changements à chaud sans couper les connexions existantes. Ses interfaces sont `firewall-cmd` en ligne de commande et le graphique `firewall-config`.
- ufw, l'Uncomplicated Firewall, est le choix par défaut de Debian et Ubuntu. C'est une fine couche sur iptables ou nftables avec une syntaxe bien plus simple : `ufw allow 22/tcp`, `ufw enable`. Son interface graphique est `gufw`.
- nftables pur est le choix sur Arch et dans les conteneurs, là où la distribution n'impose pas d'interface et où l'administrateur écrit la table directement.

Autrement dit, les « pare-feux différents » sont surtout des interfaces différentes sur un même moteur. La confusion est réelle parce que la syntaxe, les fichiers de configuration et le modèle mental diffèrent, mais la propriété de sécurité, un paquet est autorisé ou rejeté par une règle netfilter, est identique.

## Ce que les UIs ont en commun

Toute interface de pare-feu, graphique ou non, répond aux trois mêmes questions : ce qui peut entrer, ce qui peut sortir, et est-ce actif. firewalld demande par zone et par service ; ufw demande comme une liste de règles d'autorisation ; une table nftables pure demande comme des chaînes de règles. Toutes partagent aussi le même mode d'échec : une erreur de règle peut vous enfermer hors d'une machine distante, parce que le pare-feu fait exactement ce qu'on lui a dit.

## Ce qu'IbexWall ajoute

IbexWall passe par ce qui existe déjà. Sur une machine avec firewalld ou ufw, il pilote cette interface et laisse intactes les règles de la distribution ; sur une machine sans les deux, il gère sa propre table nftables `inet ibexwall`. Dans les deux cas, il n'écrit que dans sa propre table, jamais dans la table d'un autre programme.

Deux choses changent pour la personne :

- Relire avant d'appliquer. Vous voyez les règles exactes qu'un changement va ajouter, ce qu'elles vont affecter et ce qui peut casser, avant que rien ne soit écrit. Un changement qui pourrait couper votre réseau attend votre confirmation.
- Contrôle par programme. Au-dessus du pare-feu, IbexWall utilise eBPF pour décider quels programmes peuvent atteindre le réseau, et demande la première fois qu'un nouveau essaie.

Le pare-feu reste le même netfilter qu'avant. Ce qu'IbexWall change, c'est qu'il devient un plan que l'on relit et que l'on peut annuler, au lieu d'une commande que l'on exécute et que l'on espère.
