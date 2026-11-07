---
title: "Qu'est-ce qu'un centre de sécurité pour Linux ?"
description: "Un centre de sécurité est un endroit unique pour voir à quel point un Linux est sûr, comprendre quoi corriger et appliquer chaque correction en sécurité. Pourquoi Linux n'en a jamais eu, et ce que fait IbexWall."
slug: "what-is-a-security-center-for-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [centre-de-sécurité, vue-d'ensemble, posture, histoire]
related_hardening: []
---

Windows et macOS embarquent un panneau qui répond à une question au même endroit : à quel point cette machine est-elle sûre, et que faire. Linux a les pièces, mais pas l'endroit. Cet article parle de l'endroit, et d'IbexWall comme tentative de le construire.

## Ce qu'est un centre de sécurité

Un centre de sécurité a trois tâches :

- Montrer. Lire l'état de la machine et le mettre dans une seule vue : le disque est chiffré, le pare-feu est actif, des mises à jour attendent, quels comptes peuvent devenir root, ce qui écoute sur le réseau.
- Expliquer. Transformer un réglage ou un avertissement en mots sur lesquels une personne peut agir, et dire ce que le modifier peut casser.
- Changer, en sécurité. Appliquer une correction comme une étape que l'on relit d'abord, avec un chemin de retour.

C'est sur cette dernière partie que la plupart des outils Linux s'arrêtent. Ils disent que quelque chose ne va pas, mais appliquer la correction reste à votre charge : modifier un fichier, lancer une commande en root, espérer que la machine redémarre encore.

## Pourquoi Linux n'en a jamais eu

La sécurité sous Linux est une collection de petits outils tranchants, chacun avec son propre fichier de configuration et sa propre interface :

- Le pare-feu est `firewalld`, `ufw` ou `nftables` pur, selon la distribution.
- Le contrôle d'accès obligatoire est AppArmor sur Ubuntu et SELinux sur Fedora et RHEL.
- L'audit est `auditd` ; le chiffrement du disque est LUKS ; SSH est `/etc/ssh/sshd_config`.
- Chacun a sa propre page de manuel, sa propre syntaxe et sa propre idée de « actif ».

Aucun ne parle à l'autre. Qui veut une seule réponse doit d'abord devenir administrateur système.

## Ce que SuSE et d'autres ont construit

L'idée n'est pas neuve. Le `SuSEfirewall2` de SUSE enveloppait `iptables` dans un ensemble de scripts avec un seul fichier de configuration, si bien que le pare-feu devenait une chose que l'on active et que l'on décrit, plutôt qu'un tas de règles. YaST, l'outil d'administration d'openSUSE, est allé plus loin : une seule interface avec des modules pour le pare-feu, le chargeur d'amorçage, les utilisateurs et les services.

C'étaient des outils d'administration, destinés à la personne qui exploite la machine. Ils remplissaient « montrer » et « changer », mais « expliquer et relire », la partie qui rend un changement sûr pour un non-expert, restait mince. C'est cette lacune qui explique qu'un centre de sécurité pour poste Linux manque encore.

## Ce qu'il faut à un centre moderne

Un centre de sécurité pour poste de travail doit faire travailler les pièces ensemble sans prétendre qu'elles n'en forment qu'une :

- Un contrôle de posture qui lit l'état réel et note honnêtement, où « inconnu » n'est jamais un succès.
- Une seule surface de pare-feu, que la machine utilise firewalld, ufw ou rien.
- Un contrôle réseau par programme, pour qu'un nouveau programme doive demander avant d'atteindre internet.
- Une étape de relecture pour chaque changement : les fichiers, règles et services exacts touchés, et ce qui peut casser, avec instantané et annulation.
- Aucune télémétrie. Un outil de sécurité qui téléphone à la maison est une contradiction.

## Comment IbexWall essaie d'être cet endroit

IbexWall est un centre de sécurité pour postes Linux. Son écran Vue d'ensemble montre un score et les constats derrière lui. La Posture système liste les contrôles : démarrage, disque, pare-feu, comptes, mises à jour et ports ouverts. Le Durcissement présente 26 réglages avec ce que chacun protège et ce qu'il peut casser. L'écran du pare-feu ferme ce qui ne devrait pas écouter et décide quels programmes peuvent atteindre le réseau. Le DNS sécurisé dirige les requêtes vers un résolveur chiffré. La Conformité compare la machine à un référentiel et dit, honnêtement, ce qu'elle ne prouve pas.

Chaque changement est un plan que l'on relit, appliqué avec un instantané et annulé depuis l'Historique. Un changement qui pourrait couper votre réseau attend votre confirmation. Le projet est un logiciel libre, publié sous GPL-3.0-or-later, et n'envoie rien à la maison.
