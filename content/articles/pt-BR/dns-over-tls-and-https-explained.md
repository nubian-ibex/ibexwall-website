---
title: "DNS sobre TLS e DNS sobre HTTPS explicados, e como verificar"
description: "O DNS comum expõe à sua rede cada site que você visita. Veja o que DoT e DoH mudam, como escolher um resolvedor, o problema do portal cativo e como testar o seu."
slug: "dns-over-tls-and-https-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [dns, privacidade, criptografia]
related_hardening: []
faq:
  - q: "Qual a diferença entre DNS sobre TLS e DNS sobre HTTPS?"
    a: "Ambos criptografam a consulta. O DoT usa uma porta própria, a 853, então uma rede pode ver que você o usa. O DoH trafega na porta 443 como o tráfego web comum, o que o torna mais difícil de distinguir ou bloquear."
  - q: "O DNS criptografado esconde os sites que eu visito?"
    a: "Ele esconde a consulta da sua rede, mas não do resolvedor que você escolheu, e a conexão com o site ainda mostra o endereço e, muitas vezes, o nome."
---

Toda vez que você abre um site, o seu computador primeiro pergunta a um resolvedor DNS qual é o endereço dele. Por padrão, essa pergunta viaja em texto puro na porta 53, então o dono do Wi-Fi, o seu provedor de internet e qualquer um no caminho pode ler quais nomes você consulta e pode alterar as respostas. O DNS sobre TLS (DoT) e o DNS sobre HTTPS (DoH) envolvem a mesma pergunta em criptografia.

## O que o DNS comum entrega

Uma consulta por `example.org` diz a quem estiver ouvindo que você está prestes a visitar `example.org`, mesmo que a página em si seja criptografada. Uma rede hostil também pode responder com um endereço falso, e é assim que algumas páginas cativas e alguns ataques redirecionam você. A criptografia resolve a escuta e, como o resolvedor é autenticado pelo certificado, a adulteração no caminho.

Ela não torna você anônimo. O resolvedor que você escolhe vê todos os nomes que você pede, então você move a confiança da sua rede para essa empresa. E quando você se conecta ao site, o endereço dele é visível, e muitas vezes o nome também.

## DoT contra DoH

- O DoT envia mensagens DNS dentro de TLS na porta TCP 853. É simples, e o operador de uma rede pode ver que você o usa e pode bloquear a porta.
- O DoH envia mensagens DNS como requisições HTTPS na porta 443. Ele se mistura ao tráfego web, então é mais difícil de bloquear, e alguns navegadores trazem o próprio cliente DoH, que ignora o resolvedor do sistema.

Para o sistema inteiro, o DoT costuma ser a escolha mais fácil, porque um serviço resolvedor pode usá-lo para todos os programas. O DoH dentro de um navegador protege só esse navegador e pode pular uma lista de bloqueio local ou uma configuração de DNS dividido em que você confia.

## Escolher um resolvedor

Resolvedores públicos conhecidos com endpoints criptografados incluem o Cloudflare (`1.1.1.1`, nome `one.one.one.one`) e o Quad9 (`9.9.9.9`, nome `dns.quad9.net`). O Quad9 filtra domínios maliciosos conhecidos por padrão; o serviço simples do Cloudflare não. A documentação deles descreve as políticas de registro e de privacidade, e você deve lê-la antes de decidir. O resolvedor do seu provedor é outra opção, com a ressalva de que é justamente a parte que você queria evitar. Um resolvedor que você mesmo roda dá o maior controle e dá mais trabalho de manutenção.

## Ative com o systemd-resolved

Fedora e Ubuntu usam o systemd-resolved por padrão. Debian e Arch o têm disponível, mas não necessariamente ativo. Se for o seu caso, crie um drop-in:

```ini
# /etc/systemd/resolved.conf.d/dot.conf
[Resolve]
DNS=9.9.9.9#dns.quad9.net 149.112.112.112#dns.quad9.net
DNSOverTLS=yes
```

Depois execute `sudo systemctl restart systemd-resolved`. Com `DNSOverTLS=yes`, as consultas falham quando o servidor não pode ser alcançado por TLS. O valor `opportunistic` tenta TLS e volta ao DNS comum, o que mantém você online, mas deixa um atacante forçar o rebaixamento.

## O problema do portal cativo

O Wi-Fi de hotéis e cafés muitas vezes intercepta a sua primeira requisição web para mostrar uma página de login. O DNS criptografado estrito pode quebrar isso, porque o portal espera responder a consultas comuns antes de você entrar. Sintomas típicos: conectado ao Wi-Fi, nenhuma página abre. Saídas comuns são entrar com o modo `opportunistic`, abrir diretamente o endereço do portal ou desligar o modo estrito nessa sessão e ligá-lo de novo depois.

## Veja o que o seu faz

```sh
resolvectl status
```

Procure `DNS Servers` e `+DNSOverTLS` na linha de protocolos da interface ou da seção global. Para ver se o DNS comum ainda sai da máquina, observe a porta 53 na sua interface de rede real (descubra o nome com `ip -br link`, por exemplo `wlan0` ou `enp3s0`) enquanto navega:

```sh
sudo tcpdump -ni wlan0 port 53
```

Não use `-i any`: os programas falam com o resolvedor local (stub) na interface de loopback, e esse tráfego apareceria e pareceria um vazamento. Silêncio na interface real enquanto as páginas carregam significa que as consultas não saem às claras. Você também pode executar `resolvectl query example.org` e conferir qual servidor respondeu. Se usa uma VPN, as configurações de DNS dela podem substituir as suas para alguns nomes, então teste com ela ligada e desligada.

## Verifique com o IbexWall

A tela de DNS seguro, apoiada pelo plugin net.dns, criptografa as consultas, bloqueia rastreadores e domínios de malware e impede que os navegadores a contornem. Ela reconhece um dnscrypt-proxy existente em vez de brigar com ele. As alterações são um plano que você revisa e desfaz pelo Histórico, e uma mudança de DNS que poderia deixar você sem conexão espera a sua confirmação. A versão 1.0 está em preparação. Se um portal cativo atrapalhar, o IbexWall pode avisar que detectou um, mas é você quem faz o login.
