---
title: "Le système de plugins d'IbexWall : 32 plugins, chacun dans son propre sandbox"
description: "Pourquoi IbexWall est fait de plugins signés, comment un seul binaire les sert tous, et pourquoi chacun tourne dans son propre sandbox où il ne peut que ce que déclare son manifeste."
slug: "ibexwall-plugin-system"
date: 2026-11-06
updated: 2026-11-06
tags: [plugins, sandbox, architecture, signature]
related_hardening: []
---

Un outil de sécurité n'est fiable que dans la mesure de sa partie la plus faible. IbexWall répartit le travail entre 32 plugins, chacun responsable d'une chose, et confine chacun. Cet article explique le pourquoi et le comment.

## Ce que font les plugins

Les plugins se rangent en groupes approximatifs. Les plugins système vérifient et durcissent la machine elle-même : posture, comptes, SSH, sysctl, montages, mises à jour, le démon d'audit, les coredumps et le firmware. Les plugins réseau s'occupent du DNS, du pare-feu, de l'exposition, du Wi-Fi, de l'heure NTS et du VPN. Les plugins endpoint font tourner l'antivirus, l'intégrité et les scans de rootkit, et isolent la machine en urgence. Il y a aussi des plugins pour les applications, les périphériques USB, la caméra et le micro, et la télémétrie.

Certains ne font que vérifier, certains ne font que contrôler, beaucoup font les deux. Une vérification lit l'état réel et rapporte des constats ; un contrôle propose des opérations, comme un changement de sysctl ou une règle de pare-feu, et le cœur les applique.

## Un binaire, de nombreux plugins

Les plugins sont distribués comme un seul binaire multicall sous `/usr/libexec/ibexwall/ibexwall-plugins`, lancé sous un nom différent pour chaque plugin. Le nom indique quel manifeste lire, donc il n'y a qu'un seul build à signer et à auditer, pas trente-deux.

## Signés, et infalsifiables

Chaque plugin porte un manifeste : son id, son nom et sa description en cinq langues et, surtout, ses privilèges, les clés sysctl, les chemins de fichiers et les capacités qu'il peut toucher. Le manifeste est signé, et le démon est compilé avec la clé publique de release embarquée. Un plugin dont le manifeste a été modifié après la signature est refusé net. C'est ce qui permet à une installation empaquetée de faire confiance exactement aux plugins avec lesquels elle a été livrée, sans aucune clé de développement.

## Chacun dans son propre sandbox

Chaque plugin tourne sous systemd dans sa propre unité, avec un utilisateur dynamique, sans home, un répertoire temporaire privé, et uniquement les fichiers et clés sysctl que son manifeste a déclarés. Il n'a pas de shell : les opérations qu'il propose sont des valeurs typées, pas des lignes de commande, donc un plugin ne peut pas glisser une commande arbitraire.

## Les plugins proposent, le cœur exécute

C'est la règle qui tient tout le design. Un plugin ne change jamais le système tout seul. Il propose des opérations typées, et le cœur valide chacune contre le manifeste, prend un instantané de l'état, et seulement ensuite les applique. Le plugin demande ; le cœur décide. Cette séparation est la raison pour laquelle un bug ou une intrusion dans un seul plugin ne peut pas atteindre silencieusement la machine entière.
