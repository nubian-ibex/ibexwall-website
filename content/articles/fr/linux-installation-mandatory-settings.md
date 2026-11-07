---
title: "Les réglages à réussir quand on installe Linux"
description: "Les choix faits à l'installation, chiffrement du disque, Secure Boot, comptes et partitionnement, difficiles à changer ensuite, et comment IbexWall valide chacun après coup."
slug: "linux-installation-mandatory-settings"
date: 2026-11-06
updated: 2026-11-06
tags: [installation, chiffrement, secure-boot, comptes]
related_hardening: []
---

La plupart des décisions de sécurité de Linux se prennent dans la première heure, pendant l'installation, et il est ensuite pénible de les changer. Cet article liste celles qu'il faut réussir d'emblée, et comment les vérifier après coup avec IbexWall.

## Chiffrez le disque pendant l'installation

Chiffrer après coup signifie généralement réinstaller. Pendant la configuration, choisissez le chiffrement complet du disque (LUKS) et chiffrez aussi le swap, car un portable en veille écrit l'image mémoire dans le swap en clair. Là où le firmware le permet, liez le déverrouillage au TPM2 pour que la machine démarre sans second mot de passe mais refuse un disque retiré.

Vérifiez après : `posture.disk_encryption` et `posture.swap_encryption` d'IbexWall.

## Activez Secure Boot

Secure Boot est un réglage du firmware, pas une case de l'installateur sur toutes les distributions, mais c'est pendant l'installation qu'on remarque qu'il est éteint. Activez-le et le verrouillage du noyau pour qu'un noyau falsifié ou un module non signé soit refusé.

Vérifiez après : `posture.secure_boot` et `posture.lockdown`.

## Choisissez bien les comptes

Le premier utilisateur est l'administrateur. Donnez-lui un vrai mot de passe, jamais vide, et assurez-vous que seul le compte prévu détient l'uid 0. Activez le verrouillage de compte pour freiner un devineur.

Vérifiez après : `accounts.empty_passwords`, `accounts.uid0` et `accounts.lockout`.

## Faites demander un mot de passe à sudo

Certains installateurs proposent sudo sans mot de passe par commodité. Refusez. Un sudo qui demande un mot de passe est la différence entre « quelqu'un a lu le disque » et « quelqu'un est root ». Configurez-le pour journaliser ce qu'il exécute.

Vérifiez après : `posture.sudo_nopasswd` et `accounts.sudo_logging`.

## Allumez le pare-feu dès le premier jour

Un pare-feu qui refuse l'entrant par défaut ne coûte rien à l'installation et évite les surprises. Fedora embarque firewalld, Ubuntu embarque ufw ; allumez celui qui est là avant que la machine ne voie le réseau.

Vérifiez après : `firewall.default_deny` et l'écran du pare-feu.

## Laissez les mises à jour tourner seules

Activez les mises à jour de sécurité automatiques dans l'installateur ou juste après. Une machine qui se met à jour seule ferme les failles connues sans humain dans la boucle, et c'est le contrôle que les attaquants comptent que l'on saute.

Vérifiez après : `posture.updates_automatic` et `cves.security_updates`.

## Les choix difficiles à changer

Le chiffrement du disque, Secure Boot et le schéma de partitionnement sont des décisions du moment de l'installation. Tout le reste, pare-feu, comptes, sudo et mises à jour, se corrige après, mais ne devrait pas avoir à l'être. Réussir les difficiles d'emblée signifie qu'il ne reste que les faciles.

## Vérifiez tout avec IbexWall

Après l'installation, l'écran Vue d'ensemble d'IbexWall montre un score et les constats derrière lui, et la Posture système liste chaque contrôle : disque, démarrage, pare-feu, comptes, mises à jour et ports ouverts. Chaque correction est un plan que l'on relit d'abord, avec les fichiers exacts et ce qui peut casser, et l'Historique peut l'annuler.
