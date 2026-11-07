---
title: "Configuration obligatoire pour un poste Linux d'entreprise"
description: "La liste qu'une entreprise devrait appliquer sur chaque poste Linux avant de le donner à un employé : chiffrement du disque, Secure Boot, comptes, pare-feu, mises à jour et SSH, et comment IbexWall prouve que chaque point tient."
slug: "corporate-linux-desktop-mandatory-setup"
date: 2026-11-06
updated: 2026-11-06
tags: [entreprise, installation, liste, conformité]
related_hardening: []
---

Une entreprise qui déploie des postes Linux écrit généralement une politique puis fait confiance à chaque machine pour la suivre. Cet article transforme cette politique en une liste concrète, et pointe les contrôles d'IbexWall qui prouvent que chaque point tient vraiment sur la machine.

## Chiffrement du disque, avant tout

Chiffrez le disque et le swap, et déverrouillez avec une clé liée au TPM2 là où le firmware le permet, pour que la machine démarre sans second mot de passe mais refuse quand même un disque retiré. Sans chiffrement, tout le reste est inutile : les données partent avec le portable.

Ce qu'IbexWall valide : `posture.disk_encryption` et `posture.swap_encryption` lisent l'état réel du disque et du swap, et disent honnêtement quand ils ne peuvent pas.

## Secure Boot et verrouillage du noyau

Activez Secure Boot et le verrouillage du noyau. Ensemble, ils empêchent un attaquant de démarrer un noyau falsifié ou de charger un module non signé depuis un système en marche.

Ce qu'IbexWall valide : `posture.secure_boot` et `posture.lockdown`.

## Comptes : pas de mot de passe vide, pas de root égaré, verrouillage actif

Un poste d'entreprise a exactement un chemin d'administrateur, et il exige un mot de passe. Vérifiez qu'aucun compte n'a de mot de passe vide, que seuls les comptes prévus détiennent l'uid 0 et que les échecs de connexion verrouillent le compte.

Ce qu'IbexWall valide : `accounts.empty_passwords`, `accounts.uid0` et `accounts.lockout`.

## sudo demande un mot de passe, et journalise

Configurez sudo pour exiger le mot de passe de l'utilisateur et pour journaliser ce qu'il exécute. Un sudo sans mot de passe transforme une session volée en root immédiat ; un sudo sans journal cache ce qui a été fait.

Ce qu'IbexWall valide : `posture.sudo_nopasswd` et `accounts.sudo_logging`.

## Un pare-feu qui refuse l'entrant par défaut

Rien ne devrait écouter de nouvelles connexions sauf ce que l'entreprise a ouvert. Sur Fedora c'est firewalld, sur Ubuntu ufw, et IbexWall passe par celui qui est présent.

Ce qu'IbexWall valide : `firewall.default_deny`, et l'écran du pare-feu ferme ce qui ne devrait pas écouter.

## Des mises à jour qui s'installent seules

Activez les mises à jour de sécurité automatiques pour qu'une faille connue soit fermée sans attendre une personne. C'est le contrôle le moins cher qui soit et celui que les attaquants comptent que vous sautiez.

Ce qu'IbexWall valide : `posture.updates_automatic`, `updates.automatic` et `cves.security_updates`.

## SSH, s'il est actif

Si un poste accepte SSH, durcissez-le : pas de login root, pas de login par mot de passe seul, et pas de clés courtes. S'il n'a pas besoin de SSH, éteignez-le.

Ce qu'IbexWall valide : `ssh.hardening`.

## Sauvegardes, testées en restaurant

Aucun contrôle ne prouve qu'une sauvegarde fonctionne. La règle est : une fois par mois, restaurez un fichier de la sauvegarde la plus récente dans un dossier temporaire. Le rançongiciel, un disque qui lâche et un `rm` mal tapé finissent au même endroit.

## Prouvez-le, machine par machine

Une politique qui dit « chiffrez le disque » n'est pas un chiffrement. La valeur d'IbexWall dans un déploiement d'entreprise est que chaque machine prouve sa propre posture, et qu'un gestionnaire de flotte peut collecter un rapport signé (`ibexctl compliance export`) sans qu'IbexWall téléphone à la maison. L'écran Conformité compare la machine à la LGPD, au NIST et à l'ISO là où l'entreprise a besoin d'une preuve pour un audit.
