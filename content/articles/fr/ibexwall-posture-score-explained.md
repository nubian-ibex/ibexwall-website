---
title: "Ce que signifie le score de posture d'IbexWall"
description: "Le score sur 100 est un résumé de ce qu'un programme a pu lire sur votre machine. Ce qu'il inclut, ce qu'il n'inclut pas, et comment le lire sans trop lui faire confiance."
slug: "ibexwall-posture-score-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [posture, score, contrôles, constats]
related_hardening: []
---

L'écran Vue d'ensemble s'ouvre sur un nombre, un score sur 100. Un nombre invite à trop de confiance, alors il aide de savoir exactement ce qu'il résume et où il est délibérément silencieux.

## De quoi le score est fait

Le score se calcule à partir des résultats des contrôles que rapportent les plugins : chiffrement du disque et du swap, Secure Boot et verrouillage du noyau, le pare-feu, les comptes (mots de passe vides, uid 0 égaré, verrouillage), si sudo exige un mot de passe, les mises à jour, les ports ouverts et plus. Chaque contrôle a un résultat : réussite, échec, non applicable ou non évalué.

Un contrôle réussi contribue au score ; un échec le baisse. Les contrôles non applicables sont laissés de côté, et les contrôles non évalués ne comptent jamais comme une réussite.

## Ce que le score ne sait pas

Le score est un résumé de réglages qu'un programme a pu lire. Il ne connaît pas votre mot de passe, ni si vous le réutilisez, ni ce que vous téléchargez, ni quels scripts vous exécutez. Il ne voit pas un courriel de hameçonnage ni une extension de navigateur malveillante. Un nombre élevé signifie que l'essentiel est en place, pas que rien ne peut arriver. Traitez un nombre bas comme une liste de tâches, et un nombre élevé comme « le sol est couvert ».

## Les parties derrière le nombre

La Posture système liste chaque contrôle derrière le score, groupé, pour que vous voyiez quel réglage a fait baisser le nombre. Les Constats sont les contrôles qui ont échoué, chacun avec une explication simple et une sévérité. Les Protections sont ce qui est déjà en place. Quand un contrôle ne peut pas lire son entrée, il le dit au lieu de deviner, car un nombre qui cache sa propre ignorance est pire qu'un nombre plus bas et honnête.

## Comment une correction en découle

Chaque constat pointe vers une correction, et chaque correction est un plan que l'on relit d'abord : les fichiers, règles ou services exacts qu'il va changer, et ce qu'il peut casser. Un changement qui pourrait couper votre réseau attend votre confirmation, et l'Historique défait n'importe quoi. Le score monte quand vous appliquez une correction, et vous pouvez le voir bouger, ce qui est le but : le nombre est un progrès, pas un verdict.
