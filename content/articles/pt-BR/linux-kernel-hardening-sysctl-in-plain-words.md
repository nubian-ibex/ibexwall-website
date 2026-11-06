---
title: "Hardening do kernel Linux com sysctl, em palavras simples"
description: "O que é o hardening via sysctl, quais configurações são seguras para começar, quais podem quebrar Flatpak, VPN ou IPv6, e como aplicar e desfazer com limpeza."
slug: "linux-kernel-hardening-sysctl-in-plain-words"
date: 2026-11-06
updated: 2026-11-06
tags: [sysctl, kernel, hardening]
related_hardening: [kernel.kptr-restrict, kernel.dmesg-restrict, net.tcp-syncookies, kernel.user-namespaces]
faq:
  - q: "O que é o hardening via sysctl?"
    a: "O kernel tem configurações que você muda com ele rodando. Endurecer é escolher valores mais rígidos, como esconder endereços do kernel de programas comuns, para uma falha ser mais difícil de explorar."
  - q: "Como desfaço uma mudança de sysctl?"
    a: "Apague o arquivo que você criou em /etc/sysctl.d e devolva o valor antigo com sysctl -w, ou reinicie. Anote o valor antigo antes."
---

Sysctl é a lista de configurações que o kernel Linux em execução deixa você mudar sem recompilar. Endurecer com sysctl é escolher valores mais rígidos para as que afetam segurança. Cada configuração é pequena, e a maioria é segura. Algumas podem quebrar software que você usa, então o caminho sensato é começar pelas inofensivas e testar o resto uma de cada vez.

## Como funciona

Leia um valor:

```sh
sysctl kernel.kptr_restrict
```

Mude até a próxima reinicialização:

```sh
sudo sysctl -w kernel.kptr_restrict=2
```

Mantenha entre reinicializações colocando num arquivo dentro de `/etc/sysctl.d/`, cujos arquivos terminam em `.conf` e são lidos em ordem de nome:

```sh
echo 'kernel.kptr_restrict = 2' | sudo tee /etc/sysctl.d/90-exemplo.conf
sudo sysctl --system
```

Funciona igual no Fedora, Ubuntu, Debian e Arch. Não edite os arquivos que a sua distribuição entrega; adicione os seus, para uma atualização não sobrescrever seu trabalho e você poder removê-los depois. Como os arquivos são lidos em ordem, um nome mais adiante vence quando dois definem a mesma chave.

## Seguros para começar

Estes mudam pouco num desktop e têm benefício claro.

- [`kernel.kptr_restrict`](/pt-br/hardening/kernel.kptr-restrict/) esconde endereços de memória do kernel de programas comuns. Atacantes usam esses endereços para mirar uma exploração.
- [`kernel.dmesg_restrict`](/pt-br/hardening/kernel.dmesg-restrict/) deixa só um administrador ler o log do kernel, que pode mostrar endereços e detalhes de hardware.
- [`net.ipv4.tcp_syncookies`](/pt-br/hardening/net.tcp-syncookies/) mantém a máquina respondendo quando alguém a inunda com conexões pela metade. Muitas distribuições já o definem como 1.
- `fs.protected_symlinks`, `fs.protected_hardlinks`, `fs.protected_fifos` e `fs.protected_regular` bloqueiam truques antigos em que um atacante planta um link ou arquivo numa pasta compartilhada como `/tmp` para um programa privilegiado escrever onde ele quer. O catálogo os agrupa em [proteger pastas compartilhadas](/pt-br/hardening/fs.protected-files/).

Alguns provavelmente já estão definidos no seu sistema. Ler o valor antes diz isso.

## Os que podem quebrar coisas

Um valor mais rígido pode remover algo de que um programa precisa. Casos conhecidos:

- [`user.max_user_namespaces=0`](/pt-br/hardening/kernel.user-namespaces/) remove uma parte grande da superfície de ataque do kernel, e também para de funcionar o Flatpak, as sandboxes do Chromium e do Firefox, os contêineres rootless e muitos AppImages. Para a maioria dos desktops isso é caro demais.
- `kernel.yama.ptrace_scope` num nível mais rígido significa que um depurador como `gdb` ou `strace` não se anexa a um programa em execução sem direitos extras. Desenvolvedores notam rápido.
- `kernel.perf_event_paranoid` alto impede o profiling sem privilégio com `perf`.
- `net.ipv4.conf.all.rp_filter=1` descarta pacotes que chegam por uma interface que o kernel não usaria para responder. Pode quebrar algumas VPNs e máquinas com várias rotas de rede.
- Ignorar os anúncios de roteador IPv6 pode deixar o IPv6 sem endereço na maioria das redes domésticas.
- `kernel.sysrq=0` remove as teclas de emergência de uma máquina travada.
- Travar o kexec não se desfaz até a próxima reinicialização e afeta ferramentas de dump de crash.

A regra é simples: mude uma, use o computador por um dia, e deixe o resto para depois.

## Como testar uma mudança

Depois de cada mudança, use a máquina como sempre usa. Abra o navegador, inicie um app Flatpak se usa, conecte à VPN, ligue um dispositivo, compile algo. Se trabalha remoto, mantenha uma segunda sessão aberta. Problemas de sysctl costumam aparecer como um programa falhando com "permission denied" ou "operation not permitted" sem causa óbvia, então, quando isso acontecer logo depois de uma mudança, desconfie dela primeiro. Mudar um valor por vez deixa o culpado óbvio e faz o desfazer ser uma linha só.

## Aplicar e desfazer

Anote os valores atuais antes de mudar qualquer coisa:

```sh
sysctl kernel.kptr_restrict kernel.dmesg_restrict
```

Para desfazer uma mudança persistente, remova o arquivo e devolva o valor antigo, pois apagar só o arquivo não muda o kernel em execução:

```sh
sudo rm /etc/sysctl.d/90-exemplo.conf
sudo sysctl -w kernel.kptr_restrict=0
```

Uma reinicialização também devolve ao que os arquivos restantes e o padrão do kernel dizem. Se uma configuração quebrou algo e você não sabe qual, faça bisseção: remova metade do seu arquivo, rode `sudo sysctl --system` e teste.

## Confira com o IbexWall

A tela de Endurecimento lista 26 configurações de kernel, rede, sistema de arquivos e módulos, cada uma com o que pode quebrar, e você marca as que quer. O plugin de hardening do kernel (system.sysctl) lê cada valor, compara com a referência e aplica a sua escolha por um plano. O plano mostra o arquivo exato, que o IbexWall escreve como `/etc/sysctl.d/90-ibexwall.conf`, e o diff antes de qualquer coisa acontecer. Um instantâneo é tirado antes, e o Histórico desfaz. A versão 1.0 está em preparação.
