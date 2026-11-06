---
title: "Segurança"
description: "Como o IbexWall é construído para merecer confiança: planos e instantâneos, plugins e versões assinados, plugins isolados, serviços confinados e como relatar uma vulnerabilidade."
updated: 2026-11-06
---

Uma ferramenta de segurança precisa ser mais segura que o computador que protege. Esta página lista o que o IbexWall faz a respeito e o que ele não promete.

## Alterações que você vê e desfaz

Nada é alterado sem um plano. Um plano lista os arquivos, serviços e regras de firewall exatos, com uma prévia da diferença e uma nota sobre o que pode quebrar. Um instantâneo é criado antes da aplicação. Uma alteração que poderia cortar a sua rede espera a sua confirmação e se desfaz sozinha se você não a der. O Histórico lista cada alteração e desfaz qualquer uma delas.

## Plugins propõem, o núcleo executa

Um plugin lê o sistema e descreve uma alteração. Ele não pode fazê-la. Só o núcleo aplica alterações, como root, pelo plano, pelo instantâneo e pela sua aprovação. O IbexWall edita apenas os próprios arquivos (drop-ins com `ibexwall` no nome e a sua própria tabela de firewall) e nunca os que pertencem à sua distribuição ou a outro programa.

## Assinado, isolado, confinado

- Os manifestos dos plugins são assinados. O daemon é compilado com a chave pública da versão e recusa um manifesto que não seja verificado.
- Cada um dos 32 plugins roda em sua própria unidade systemd: usuário dinâmico, sem capabilities a menos que as declare, sistema somente leitura. A nota da unidade em `systemd-analyze security` é publicada para cada plugin.
- No Debian e no Ubuntu, perfis AppArmor confinam o resolvedor, o servidor do assistente e os plugins. No Fedora, um módulo SELinux faz isso. Ambos são testados com a imposição ativada.

## Versões que você pode conferir

Toda versão tem somas de verificação, uma assinatura para cada arquivo, uma lista de materiais de software (CycloneDX) e uma declaração de procedência. A compilação é reproduzível: compilar o mesmo commit duas vezes, em pastas diferentes, gera arquivos idênticos.

## O que ele não faz

O IbexWall não protege um computador de quem já tem root nele e não pode tornar seguro um programa inseguro. Ele reduz a superfície e diz o que está exposto. O seu modelo de ameaças é público na [documentação](https://docs.ibexwall.com/concepts/security-model/).

## A chave das versões

A chave que assina as versões será publicada aqui e no repositório antes do lançamento da versão 1.0. Até lá, os pacotes gerados pelos testes do projeto são assinados com uma chave de desenvolvimento que não vale para uma versão oficial.

## Relatar uma vulnerabilidade

Use o relato privado de vulnerabilidades do GitHub no [repositório](https://github.com/nubian-ibex/ibexwall/security). Por favor, não abra uma issue pública para um problema de segurança e não inclua segredos no relato. Procuramos responder em poucos dias.
