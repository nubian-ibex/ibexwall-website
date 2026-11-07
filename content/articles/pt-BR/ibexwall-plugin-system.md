---
title: "O sistema de plugins do IbexWall: 32 plugins, cada um no próprio sandbox"
description: "Por que o IbexWall é feito de plugins assinados, como um único binário serve a todos, e por que cada um roda num sandbox próprio onde só pode o que o manifesto declara."
slug: "ibexwall-plugin-system"
date: 2026-11-06
updated: 2026-11-06
tags: [plugins, sandbox, arquitetura, assinatura]
related_hardening: []
---

Uma ferramenta de segurança é tão confiável quanto a sua parte mais fraca. O IbexWall divide o trabalho em 32 plugins, cada um responsável por uma coisa, e confina cada um. Este artigo explica o porquê e o como.

## O que os plugins fazem

Os plugins se dividem em grupos aproximados. Os de sistema verificam e endurecem a própria máquina: postura, contas, SSH, sysctl, mounts, atualizações, o daemon de auditoria, core dumps e firmware. Os de rede cuidam de DNS, firewall, exposição, Wi-Fi, horário NTS e VPN. Os de endpoint rodam antivírus, integridade e varreduras de rootkit, e isolam a máquina numa emergência. Também há plugins para aplicativos, dispositivos USB, câmera e microfone, e telemetria.

Alguns só verificam, alguns só controlam, muitos fazem ambos. Uma verificação lê o estado real e relata descobertas; um controle propõe operações, como uma mudança de sysctl ou uma regra de firewall, e o core as aplica.

## Um binário, muitos plugins

Os plugins são distribuídos como um único binário multicall em `/usr/libexec/ibexwall/ibexwall-plugins`, iniciado sob um nome diferente para cada plugin. O nome diz qual manifesto ler, então há um único build para assinar e auditar, não trinta e dois.

## Assinados, e à prova de adulteração

Cada plugin carrega um manifesto: seu id, nome e descrição em cinco idiomas e, crucialmente, seus privilégios, as chaves de sysctl, os caminhos de arquivo e as capacidades que pode tocar. O manifesto é assinado, e o daemon é compilado com a chave pública de release embutida. Um plugin cujo manifesto foi editado depois da assinatura é recusado na hora. É isso que permite a uma instalação empacotada confiar exatamente nos plugins com que foi enviada, sem nenhuma chave de desenvolvimento.

## Cada um no próprio sandbox

Cada plugin roda sob o systemd numa unidade própria, com usuário dinâmico, sem home, diretório temporário privado, e apenas os arquivos e chaves de sysctl que o manifesto declarou. Ele não tem shell: as operações que propõe são valores tipados, não linhas de comando, então um plugin não consegue esconder um comando arbitrário.

## Plugins propõem, o core executa

Essa é a regra que sustenta o design inteiro. Um plugin nunca muda o sistema sozinho. Ele propõe operações tipadas, e o core valida cada uma contra o manifesto, tira um snapshot do estado, e só então as aplica. O plugin pergunta; o core decide. Essa separação é o motivo de um bug ou uma invasão num único plugin não conseguir alcançar silenciosamente a máquina inteira.
