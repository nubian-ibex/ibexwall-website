---
title: "Attaques connues contre les postes Linux d'entreprise, et comment les arrêter"
description: "Les façons documentées dont les attaquants entrent dans les postes Linux en entreprise : vol d'identifiants, élévation de privilèges, persistance et chaîne d'approvisionnement. Ce qui arrête chacune, et comment IbexWall le valide."
slug: "attacks-against-corporate-linux-desktops"
date: 2026-11-06
updated: 2026-11-06
tags: [attaques, entreprise, durcissement, validation]
related_hardening: []
---

Les attaquants écrivent rarement un exploit neuf pour un poste Linux. Ils réutilisent une courte liste de techniques connues, parce qu'elles continuent de fonctionner. Cet article liste les techniques, ce qui arrête chacune, et comment IbexWall transforme « nous croyons l'avoir arrêtée » en un contrôle qui l'affirme.

## Vol d'identifiants et comptes faibles

L'entrée la plus courante est un mot de passe vide, réutilisé, ou sur une machine où quelqu'un peut devenir root sans mot de passe. Sur un poste d'entreprise, le risque s'aggrave avec un SSH laissé ouvert et un sudo configuré pour ne pas demander de mot de passe.

Ce qui l'arrête : aucun mot de passe vide, aucun uid 0 égaré, le verrouillage de compte, un sudo qui exige un mot de passe et un SSH durci. IbexWall vérifie tout cela : `accounts.empty_passwords`, `accounts.uid0`, `accounts.lockout`, `posture.sudo_nopasswd` et `ssh.hardening`.

## Élévation de privilèges

Une fois entré comme utilisateur sans privilèges, l'attaquant élève. Les routes courantes sont un fichier sensible inscriptible, un binaire setuid, un vieux noyau avec une faille connue, ou une session déverrouillée.

Ce qui l'arrête : corriger promptement, des permissions strictes sur `/etc/shadow`, `/etc/passwd` et `/etc/sudoers`, et un verrouillage d'écran automatique. IbexWall vérifie les mises à jour en attente, les permissions des fichiers sensibles (`accounts.file_perms`), la journalisation de sudo et `session_lock.automatic`.

## Persistance

Après l'élévation, l'attaquant veut survivre à un redémarrage. Les techniques documentées incluent les entrées d'autostart, cron, les fichiers de démarrage du shell et `LD_PRELOAD`. Un démarrage propre qui recharge silencieusement une porte dérobée est le but.

Ce qui l'arrête : surveiller ces endroits pour y détecter des changements. Le `endpoint.persistence` d'IbexWall hache les unités, les timers, cron, l'autostart, le démarrage du shell et `LD_PRELOAD`, et rapporte ce qui est nouveau ou a changé depuis une référence que vous avez acceptée.

## Chaîne d'approvisionnement et exécution de l'inconnu

Un paquet compromis, un dépôt cloné ou un script de forum peuvent planter du code qui ensuite téléphone à la maison ou lit le disque. C'est moins une question de « scan de malware » que de n'exécuter que ce à quoi vous faites confiance et de surveiller ce qu'il atteint.

Ce qui l'arrête : les signatures de paquets, un pare-feu qui refuse entrant par défaut et le contrôle réseau par programme. IbexWall vérifie que les signatures de paquets sont exigées (`updates.signatures`), que le pare-feu refuse par défaut (`firewall.default_deny`), et il demande la première fois qu'un nouveau programme atteint le réseau.

## Le but de la validation

Aucune de ces défenses n'est neuve. Ce qui est difficile, c'est de savoir, sur une machine précise, lesquelles tiennent vraiment. Une politique qui dit « chiffrez le disque et verrouillez les comptes » n'est pas un chiffrement. IbexWall transforme chaque défense en un contrôle qui lit l'état réel, rapporte honnêtement quand il ne peut pas le lire, et laisse la personne corriger ce qui a échoué par un plan relu et réversible. Une entreprise gagne une machine qui prouve sa propre posture, au lieu d'une machine à qui l'on a simplement dit d'être sûre.
