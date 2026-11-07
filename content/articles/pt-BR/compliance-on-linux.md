---
title: "Compliance no Linux: o que significa e o que não significa"
description: "Compliance não é certificação. O que uma verificação de conformidade consegue provar sobre uma máquina Linux, os seis estados de controle, e o que um auditor ainda precisa decidir."
slug: "compliance-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [compliance, normas, atestação, exportação]
related_hardening: []
---

Compliance e certificação são coisas diferentes, e confundi-las é como uma ferramenta exagera. Este artigo as separa e explica o que uma verificação de conformidade local no Linux pode e não pode provar.

## Compliance não é certificação

Compliance significa que os controles técnicos mapeados valem nesta máquina. Certificação vem de uma auditoria independente, que também cobre processos, pessoas e escopo que nenhum programa num único computador consegue ver. Uma ferramenta pode dizer "estes controles técnicos valem"; não pode dizer "esta organização é certificada". O IbexWall diz o primeiro e nunca o segundo.

## Os seis estados

Cada controle de uma norma cai num de seis estados:

- Conforme: toda verificação exigida passou e está fresca.
- Não conforme: pelo menos uma verificação exigida falhou.
- Não avaliado: uma verificação está ausente, velha ou desconhecida. Isso nunca é um passe.
- Precisa de atestação: o controle é organizacional, então uma pessoa precisa declarar que ele vale, com dono e validade.
- Não se aplica: toda verificação exigida diz isso.
- Com exceção: um risco que um dono aceitou, mostrado à parte, nunca contado como conforme.

Uma norma reporta contagens de cada estado, nunca uma porcentagem única que esconde os grupos de não avaliado e atestação.

## As normas do primeiro release

O primeiro release mapeia seis: a Base de referência do IbexWall (o conjunto recomendado do próprio projeto), o art. 46 da LGPD, a CMN 4.893/2021 alterada pela 5.274/2025, a NIST SP 800-53 Rev. 5, a NIST SP 800-171 Rev. 3 e o tema 8 do Anexo A da ISO/IEC 27001:2022. Cada controle carrega o número da referência, uma URL e a data em que foi consultado; textos licenciados nunca são copiados.

## Os limites honestos

Desconhecido nunca é um passe, então um relatório que não consegue provar um controle diz isso em vez de chutar. Um mapeamento que é leitura própria do projeto, como a LGPD, diz isso claramente. Controles de atestação são organizacionais e esperam uma pessoa, não uma verificação.

## Exportar como evidência

O `ibexctl compliance export` grava um relatório assinado com a data, a versão da norma, o estado de cada controle, os resultados crus das verificações, as atestações e o topo da cadeia de auditoria. Ele é selado com uma chave do dispositivo, então uma cópia adulterada falha na verificação. Esse relatório é evidência que uma empresa pode coletar, não um certificado que ela pode exibir.
