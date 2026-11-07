---
title: "Antivirus sous Linux d'entreprise : ce qui marche encore, et comment IbexWall aide"
description: "Pourquoi antivirus veut dire autre chose sous Linux, quels scanners et outils d'intégrité restent efficaces, et comment IbexWall en fait une configuration relue et validée."
slug: "antivirus-on-corporate-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [antivirus, endpoint, intégrité, rootkit, entreprise]
related_hardening: []
---

L'antivirus sous Linux est un travail différent de Windows, et le traiter pareil gaspille de l'effort. Cet article explique ce qui est réellement efficace sur un poste Linux d'entreprise et où IbexWall se place.

## Pourquoi le travail est différent

La plupart des malwares écrits pour Linux ne sont pas attrapés par un scanner de signatures tourné vers des fichiers Windows, et la plupart des malwares qui ciblent les postes ciblent encore Windows. Sous Linux, la valeur principale du scanner est le transit : une pièce jointe, un téléchargement, un dossier partagé qui transporte une charge Windows vers un collègue. Les risques plus profonds de Linux, une porte dérobée, un rootkit, un binaire modifié, sont attrapés par l'intégrité et le comportement, pas par une signature de fichier.

## Ce qui marche encore sous Linux

- ClamAV est le scanner open source. Il est honnête sur son fonctionnement par signature : il attrape des fichiers connus, pas un comportement nouveau. Sur un poste d'entreprise, il gagne sa vie à analyser les fichiers qui passent, et il peut tourner sur un horaire.
- L'intégrité des fichiers, via AIDE ou la vérification du gestionnaire de paquets (`rpm -Va`, `dpkg --verify`, `pacman -Qkk`), attrape un binaire de programme qui a changé sur le disque. C'est le signal qui compte le plus sous Linux.
- Les scanners de rootkit cherchent les processus, modules et ports cachés, ce qu'une porte dérobée au niveau du noyau dissimule.
- Les vérifications de persistance surveillent les endroits où une porte dérobée survit : autostart, cron, démarrage du shell, `LD_PRELOAD`.

Les agents EDR commerciaux (CrowdStrike Falcon, SentinelOne, Microsoft Defender for Endpoint et d'autres) ajoutent la détection comportementale et une console par-dessus. Ils sont efficaces, et ce sont aussi des services gérés et centraux.

## Ce qu'IbexWall en fait

IbexWall n'installe pas d'antivirus, et ce n'est pas un EDR. Il transforme les pièces efficaces en plugins que vous pouvez voir et contrôler :

- `endpoint.av` fait tourner ClamAV et YARA sur les dossiers que vous choisissez, sur l'horaire que vous définissez, et transforme ce que les scanners ont imprimé en constats. Un scanner ou une base absent est dit, pas caché.
- `endpoint.integrity` fait tourner le vérificateur de paquets et AIDE quand c'est configuré, et rapporte un fichier de programme modifié comme une sévérité élevée.
- `endpoint.rootkit` vérifie les signes que laisse un rootkit.
- `endpoint.persistence` surveille les endroits où une porte dérobée s'installerait.

Comme chaque plugin est dans un sandbox et que chaque scan est un changement relu et réversible, la personne devant la machine voit le résultat et peut agir, ce qui est la différence entre un antivirus qui tourne en silence et un qui est vraiment lu.

## Ce que cela signifie pour adopter Linux

Une entreprise qui hésite à mettre Linux sur les postes pose souvent la mauvaise question, qui est « Linux a-t-il un antivirus comme Windows ? ». La bonne question est « pouvons-nous prouver que chaque machine est à jour, chiffrée, scannée et inchangée ? ». IbexWall y répond sur la machine, sans console et sans envoyer de données nulle part, et remet à l'entreprise une preuve qu'elle peut conserver.
