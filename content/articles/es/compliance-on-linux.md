---
title: "Cumplimiento en Linux: qué significa y qué no significa"
description: "Cumplimiento no es certificación. Qué puede probar una verificación de conformidad sobre una máquina Linux, los seis estados de control, y qué debe decidir aún un auditor."
slug: "compliance-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [cumplimiento, marcos, atestación, exportación]
related_hardening: []
---

Cumplimiento y certificación son cosas distintas, y confundirlas es como una herramienta exagera. Este artículo las separa y explica lo que una verificación de conformidad local en Linux puede y no puede probar.

## Cumplimiento no es certificación

Cumplimiento significa que los controles técnicos mapeados se cumplen en esta máquina. La certificación viene de una auditoría independiente, que también cubre procesos, personas y alcance que ningún programa en un solo ordenador puede ver. Una herramienta puede decir "estos controles técnicos se cumplen"; no puede decir "esta organización está certificada". IbexWall dice lo primero y nunca lo segundo.

## Los seis estados

Cada control de un marco cae en uno de seis estados:

- Conforme: toda verificación exigida pasó y está fresca.
- No conforme: al menos una verificación exigida falló.
- No evaluado: una verificación falta, está vieja o es desconocida. Esto nunca es un aprobado.
- Requiere atestación: el control es organizativo, así que una persona debe declarar que se cumple, con dueño y caducidad.
- No aplicable: toda verificación exigida lo dice.
- Con excepción: un riesgo que un dueño aceptó, mostrado aparte, nunca contado como conforme.

Un marco reporta conteos de cada estado, nunca un porcentaje único que esconde los grupos de no evaluado y atestación.

## Los marcos del primer release

El primer release mapea seis: la Referencia de IbexWall (el conjunto recomendado del propio proyecto), el art. 46 de la LGPD, la CMN 4.893/2021 enmendada por la 5.274/2025, la NIST SP 800-53 Rev. 5, la NIST SP 800-171 Rev. 3 y el tema 8 del Anexo A de la ISO/IEC 27001:2022. Cada control lleva el número de la referencia, una URL y la fecha en que fue consultado; los textos bajo licencia nunca se copian.

## Los límites honestos

Desconocido nunca es un aprobado, así que un informe que no puede probar un control lo dice en lugar de adivinar. Un mapeo que es lectura propia del proyecto, como la LGPD, lo dice con claridad. Los controles de atestación son organizativos y esperan a una persona, no a una verificación.

## Exportar como evidencia

`ibexctl compliance export` escribe un informe firmado con la fecha, la versión del marco, el estado de cada control, los resultados crudos de las verificaciones, las atestaciones y el tope de la cadena de auditoría. Se sella con una clave del dispositivo, así que una copia manipulada falla la verificación. Ese informe es evidencia que una empresa puede recoger, no un certificado que puede blandir.
