---
title: "Conformité sous Linux : ce qu'elle signifie et ce qu'elle ne signifie pas"
description: "La conformité n'est pas une certification. Ce qu'un contrôle de conformité peut prouver sur une machine Linux, les six états de contrôle, et ce qu'un auditeur doit encore décider."
slug: "compliance-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [conformité, référentiels, attestation, export]
related_hardening: []
---

Conformité et certification sont deux choses différentes, et les confondre est la façon dont un outil surestime. Cet article les sépare, et explique ce qu'un contrôle de conformité local sous Linux peut et ne peut pas prouver.

## La conformité n'est pas une certification

La conformité signifie que les contrôles techniques mappés tiennent sur cette machine. La certification vient d'un audit indépendant, qui couvre aussi les processus, les personnes et un périmètre qu'aucun programme sur un seul ordinateur ne peut voir. Un outil peut dire « ces contrôles techniques tiennent » ; il ne peut pas dire « cette organisation est certifiée ». IbexWall dit la première et jamais la seconde.

## Les six états

Chaque contrôle d'un référentiel tombe dans l'un de six états :

- Conforme : tout contrôle exigé a réussi et est frais.
- Non conforme : au moins un contrôle exigé a échoué.
- Non évalué : un contrôle manque, est périmé ou inconnu. Ce n'est jamais une réussite.
- À attester : le contrôle est organisationnel, donc une personne doit déclarer qu'il tient, avec un propriétaire et une échéance.
- Non applicable : tout contrôle exigé le dit.
- Avec exception : un risque qu'un propriétaire a accepté, montré à part, jamais compté comme conforme.

Un référentiel rapporte des décomptes de chaque état, jamais un pourcentage unique qui cache les groupes non évalué et à attester.

## Les référentiels de la première version

La première version en mappe six : la Référentiel IbexWall (l'ensemble recommandé du projet), l'article 46 de la LGPD, la CMN 4.893/2021 modifiée par la 5.274/2025, la NIST SP 800-53 Rev. 5, la NIST SP 800-171 Rev. 3 et le thème 8 de l'Annexe A de l'ISO/IEC 27001:2022. Chaque contrôle porte le numéro de la référence, une URL et la date à laquelle il a été consulté ; les textes sous licence ne sont jamais copiés.

## Les limites honnêtes

L'inconnu n'est jamais une réussite, donc un rapport qui ne peut pas prouver un contrôle le dit au lieu de deviner. Un mappage qui est la propre lecture du projet, comme la LGPD, le dit clairement. Les contrôles à attester sont organisationnels et attendent une personne, pas un contrôle.

## Exporter comme preuve

`ibexctl compliance export` écrit un rapport signé avec la date, la version du référentiel, l'état de chaque contrôle, les résultats bruts des contrôles, les attestations et la tête de la chaîne d'audit. Il est scellé avec une clé de l'appareil, donc une copie falsifiée échoue à la vérification. Ce rapport est une preuve qu'une entreprise peut collecter, pas un certificat qu'elle peut brandir.
