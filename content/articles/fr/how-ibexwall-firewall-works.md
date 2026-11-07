---
title: "Comment fonctionne le pare-feu d'IbexWall : nftables plus le contrôle par programme"
description: "IbexWall utilise deux couches : nftables pour les règles entrantes et eBPF pour décider quels programmes peuvent atteindre le réseau. Comment elles s'emboîtent, et comment un changement reste relisible."
slug: "how-ibexwall-firewall-works"
date: 2026-11-06
updated: 2026-11-06
tags: [pare-feu, eBPF, nftables, par-application]
related_hardening: []
---

Un pare-feu répond à deux questions différentes : ce qui peut atteindre cette machine depuis l'extérieur, et ce qui peut en sortir. La plupart des pare-feux Linux ne répondent qu'à la première. IbexWall répond aux deux avec deux couches, et fait de chaque changement un plan que l'on relit d'abord.

## Couche un : l'entrée, à travers la distribution

Pour le trafic entrant, IbexWall ne remplace pas votre pare-feu. Sur une machine avec firewalld ou ufw, il pilote cette interface ; sur une machine sans les deux, il gère sa propre table nftables `inet ibexwall`. Dans les deux cas, il n'écrit que dans sa propre table, jamais dans la table d'un autre programme.

La première chose à activer est le refus entrant par défaut : rien ne peut écouter de nouvelles connexions sauf si vous l'avez ouvert. À partir de là, l'écran du pare-feu montre ce qui est joignable, ce que vous avez ouvert, et permet de le fermer. Un changement est un plan qui liste les règles exactes, et l'Historique peut les remettre.

## Couche deux : la sortie, par programme

La deuxième question, ce qui peut sortir de la machine, est là où vit le vrai contrôle. IbexWall charge un petit programme eBPF qui observe chaque connexion qu'un programme tente d'ouvrir. La première fois qu'un nouveau programme atteint le réseau, IbexWall demande : autoriser, bloquer ou toujours autoriser. Votre réponse est mémorisée par programme et par destination.

C'est plus fort qu'un pare-feu par port, qui ne voit que des ports. Un navigateur et un keylogger utilisent tous deux HTTPS sur le port 443 ; le port ne les distingue pas. La couche par programme, si, et elle fonctionne sur TCP, UDP et QUIC.

## Le mode Demander et la soupape de sécurité

Un programme sur lequel vous n'avez pas encore tranché peut rester en mode Demander : sa première connexion attend jusqu'à votre réponse, et les connexions retenues les plus anciennes s'affichent d'abord. Un changement qui pourrait couper votre propre accès au réseau est marqué risqué et attend votre confirmation ; si vous ne confirmez pas à temps, il s'annule tout seul.

## Pourquoi cela reste relisible

Chaque changement de pare-feu, entrant ou par programme, passe par le même moteur que tout autre changement dans IbexWall : un plan montre les opérations, un instantané est pris et l'Historique peut annuler. Un pare-feu n'est bon que dans la mesure où vous lui faites confiance, et la confiance vient de pouvoir voir et défaire chaque règle.
