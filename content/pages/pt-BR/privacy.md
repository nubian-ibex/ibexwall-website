---
title: "Privacidade"
description: "O IbexWall não tem telemetria, conta nem análise de uso. O que ele guarda no seu computador, o que o resolvedor registra e como conferir que nada sai."
updated: 2026-11-06
---

O IbexWall não coleta dados sobre você nem sobre o seu computador. Não há telemetria, conta, análise de uso nem verificação de atualização que envie dados para fora. Este site não usa cookies, análise de uso nem requisições de terceiros; as fontes e as imagens são servidas do mesmo endereço das páginas.

## O que fica no seu computador

- O estado do programa (planos, Histórico, registro de auditoria) fica em `/var/lib/ibexwall`, e as configurações ficam em `/etc/ibexwall`. Só o root pode ler o que deve ser restrito.
- O registro de auditoria é uma cadeia: cada linha traz o hash da anterior, então uma linha removida ou alterada é detectada.
- O resolvedor de DNS seguro conta consultas e bloqueios. Ele nunca registra os nomes que você consulta.

## O que sai do seu computador, e só quando você pede

O IbexWall usa a rede quando você manda: uma consulta DNS que você faz vai para o resolvedor que você escolheu, por uma conexão criptografada; uma atualização de pacotes que você executa vai para a sua distribuição. Um assistente de IA que você conecta pode ler um status com dados ocultados, por uma conexão que você configurou, com uma chave que você pode remover.

## Confira você mesmo

Você não precisa acreditar na nossa palavra. Observe as conexões com `ss -tup`, capture o tráfego com `tcpdump` ou use a visão de rede por programa do próprio aplicativo para ver o que cada processo contata. O artigo [Sem telemetria em uma ferramenta de segurança](/pt-br/articles/no-telemetry-in-a-security-tool/) mostra como.

## Este site

As páginas são arquivos estáticos. Não há cookies, nem scripts de outros sites, nem rastreamento. Os links para outros sites, como o GitHub e a documentação, são links comuns.
