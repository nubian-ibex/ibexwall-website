---
title: "Qué significa la puntuación de postura de IbexWall"
description: "La puntuación de 0 a 100 es un resumen de lo que un programa pudo leer sobre tu máquina. Qué incluye, qué no incluye, y cómo leerla sin confiar de más."
slug: "ibexwall-posture-score-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [postura, puntuación, verificaciones, hallazgos]
related_hardening: []
---

La pantalla Visión general abre con un número, una puntuación de 0 a 100. Un número invita a confiar de más, así que ayuda saber exactamente qué resume y dónde es deliberadamente silencioso.

## De qué está hecha la puntuación

La puntuación se calcula a partir de los resultados de las verificaciones que reportan los plugins: cifrado de disco y swap, Secure Boot y lockdown del kernel, el firewall, cuentas (contraseñas vacías, uid 0 extraviado, bloqueo), si sudo exige contraseña, actualizaciones, puertos abiertos y más. Cada verificación tiene un resultado: pasa, falla, no aplica o no evaluada.

Una verificación que pasó contribuye a la puntuación; una que falló la reduce. Las verificaciones no aplicables quedan fuera, y las no evaluadas nunca cuentan como aprobadas.

## Lo que la puntuación no sabe

La puntuación es un resumen de ajustes que un programa pudo leer. No sabe tu contraseña, si la reutilizas, qué descargas ni qué scripts ejecutas. No ve un correo de phishing ni una extensión maliciosa de navegador. Un número alto significa que lo básico está en su sitio, no que nada pueda pasar. Trata un número bajo como una lista de tareas, y uno alto como "el suelo está cubierto".

## Las partes detrás del número

La Postura del sistema lista cada verificación detrás de la puntuación, agrupada, para que veas qué ajuste bajó el número. Los Hallazgos son las verificaciones que fallaron, cada una con una explicación simple y una severidad. Las Protecciones son lo que ya está en su sitio. Cuando una verificación no puede leer su entrada, lo dice en lugar de adivinar, porque un número que esconde su propia ignorancia es peor que uno más bajo y honesto.

## Cómo fluye una corrección desde ella

Cada hallazgo apunta a una corrección, y cada corrección es un plan que revisas antes: los archivos, reglas o servicios exactos que cambiará, y qué puede romper. Un cambio que podría cortar tu red espera tu confirmación, y el Historial deshace cualquier cosa. La puntuación sube cuando aplicas una corrección, y puedes verla moverse, que es el punto: el número es progreso, no un veredicto.
