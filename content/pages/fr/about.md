---
title: "À propos d'IbexWall"
description: "IbexWall est un centre de sécurité libre et open source pour Linux, créé par le projet Nubian Ibex. Licence, conception et façons de participer."
updated: 2026-11-06
---

IbexWall est un centre de sécurité libre et open source pour les postes de travail Linux, publié sous licence GPL-3.0-or-later par le projet Nubian Ibex. Il existe parce que vérifier un ordinateur Linux, comprendre le résultat et le corriger sans risque ne devrait pas demander une journée de lecture.

## Principes

- Montrer d'abord, changer ensuite : chaque changement est un plan que vous examinez et pouvez annuler.
- Parler simplement : chaque vérification et chaque réglage est expliqué avec des mots qu'un non-spécialiste peut suivre, et dit ce qu'il peut casser.
- Rester chez vous : pas de télémétrie, pas de compte, pas de dépendance. Les données sont sur votre ordinateur et le code est ouvert.
- Rester dans son couloir : IbexWall ne modifie que ses propres fichiers et laisse ceux de votre distribution tranquilles.

## Comment il est conçu

Le démon, la ligne de commande, le résolveur DNS sécurisé et le serveur pour assistants sont écrits en Rust. Le contrôle réseau par programme utilise eBPF, le pare-feu est nftables, les composants communiquent entre eux par varlink, et polkit décide qui peut faire quoi. La fenêtre est une interface Svelte 5 dans Tauri 2. Les plugins forment un seul binaire signé, lancé par systemd pour chaque plugin dans son propre bac à sable.

## Participer

- Lisez la [documentation](https://docs.ibexwall.com) et le [code source](https://github.com/nubian-ibex/ibexwall).
- Traduisez : l'application et ce site existent en anglais, portugais, espagnol, français et allemand, et ajouter une langue ne demande aucun code. Le [guide de traduction](https://docs.ibexwall.com/contributing/translating/) explique comment.
- Relisez un réglage de durcissement : chaque page liste ses sources. Si quelque chose est faux ou périmé, ouvrez un ticket.

## Langues

Le programme et ce site suivent la langue de votre système. Chaque page a un sélecteur de langue ; une page qui n'est pas encore traduite affiche le texte anglais et le signale.
