---
title: "Por que uma ferramenta de segurança não deve mandar nada para casa, e como conferir"
description: "Uma ferramenta de segurança vê suas portas, apps e logs, então nunca deve falar com o servidor do autor. Veja o que o IbexWall envia, que é nada, e como verificar você mesmo."
slug: "no-telemetry-in-a-security-tool"
date: 2026-11-06
updated: 2026-11-06
tags: [privacidade, telemetria, confiança]
related_hardening: []
faq:
  - q: "O IbexWall envia dados aos autores?"
    a: "Não. Não há telemetria, nem analytics, nem conta. Tráfego de rede só acontece quando você pede, como uma consulta DNS que você faz ou uma atualização de pacote que você roda."
  - q: "Como verifico que um programa não envia nada?"
    a: "Observe as conexões dele com ss ou uma captura de pacotes enquanto ele roda, ou aplique uma regra de firewall que bloqueia o tráfego de saída dele e veja que nada quebra."
---

Uma ferramenta de segurança lê coisas que a maioria dos programas nunca vê: quais serviços escutam na sua máquina, quais programas se conectam aonde, quais contas existem, o que dizem seus logs. Se essa ferramenta também reportasse para casa, mesmo de um jeito anônimo "inofensivo", seria um mapa do seu sistema saindo pela porta. Então a regra é simples: ela não deve enviar nada, a não ser que você peça. O IbexWall segue essa regra. Não tem telemetria, nem analytics, nem contas, e não liga para casa.

## Por que aqui isso importa mais

Telemetria num app comum diz aos autores qual botão é clicado. Numa ferramenta de segurança, o mesmo canal carregaria fatos como "este computador tem uma porta SSH aberta e um kernel antigo". Dados assim são úteis para a única pessoa que não deveria tê-los. Anonimizar é difícil, porque detalhes de máquina costumam ser únicos o bastante para identificar você. O desenho seguro mais simples é não coletar.

Há também a confiança. Uma ferramenta que pede root, lê o estado do sistema e aplica mudanças precisa merecê-la. "Nada sai da máquina" é uma afirmação que você pode testar, o que é melhor que uma política de privacidade em que você precisa acreditar.

## O que o IbexWall envia

Nada por conta própria. Os casos em que existe tráfego são os que você provoca:

- Uma consulta DNS que você faz. Se você usa a tela de DNS seguro, o resolvedor encaminha suas consultas ao upstream que você escolheu, porque esse é o trabalho dele.
- Uma atualização de pacote que você roda com o seu gerenciador.
- Uma conexão de assistente remoto, se você ligar. O servidor MCP só aceita conexões por TLS e só quando você ativa a opção remota.
- Downloads que você pede, como listas de bloqueio do filtro de DNS.

A verificação de vulnerabilidades conhecidas funciona offline, a partir do cache do próprio gerenciador de pacotes. Nada é enviado para lugar nenhum por causa dela.

## Como verificar você mesmo

Você não precisa aceitar a nossa palavra, e não precisa. Veja três caminhos.

Liste as conexões de um programa agora:

```sh
sudo ss -tupn | grep -i ibex
```

Observe a interface de rede real enquanto usa (ache o nome dela com `ip -br link`):

```sh
sudo tcpdump -ni wlan0 -w ibex.pcap
```

Abra o arquivo depois com `tcpdump -nr ibex.pcap` ou Wireshark e procure destinos que você não reconhece. Lembre que seus outros programas também conversam, então filtre pelo horário em que você usou o IbexWall e pelo que você fez.

O teste mais forte é uma regra. Crie uma regra de firewall que bloqueie o tráfego de saída do usuário do programa, ou da máquina inteira, use a ferramenta e veja que ela continua funcionando. Recursos que precisam de rede por natureza, como um servidor DNS upstream, é claro que param.

A tela de Apps e rede do IbexWall mostra qual programa conversa com onde, então ela também pode reportar sobre si mesma e sobre todo o resto da sua máquina.

## O que perguntar de qualquer ferramenta

As mesmas perguntas valem para todo programa que você instala, ferramenta de segurança ou não. Ele precisa de conta? Diz o que envia e quando? Continua funcionando com a rede bloqueada? Você consegue ler o código-fonte ou ao menos inspecionar o tráfego? Existe um interruptor de desligar que é respeitado? Uma ferramenta que não responde isso com clareza já te disse algo.

## Outra telemetria no seu sistema

A sua distribuição e alguns dos seus apps podem enviar relatórios de uso. Isso é assunto separado da ferramenta de segurança, e você pode se importar ou não. O plugin de Telemetria (privacy.telemetry) lista o que encontra para você decidir, e só lista. Para o hábito mais amplo de conferir, veja a [verificação de dez minutos](/pt-br/articles/how-secure-is-my-linux-computer/).

## O que acompanha

O código aberto ajuda aqui. O código está no GitHub sob GPL-3.0-or-later, então qualquer um lê como o acesso à rede é usado, e os releases planejam trazer somas de verificação, assinaturas, um SBOM e uma declaração de proveniência. O primeiro release ainda não foi publicado.

## Confira com o IbexWall

Abra Apps e rede para ver as conexões de cada programa, e Plugins para ler o que cada plugin pode ler e mudar. Qualquer mudança é um plano que você revisa, com instantâneo e desfazer no Histórico. A versão 1.0 está em preparação.
