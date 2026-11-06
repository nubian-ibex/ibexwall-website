---
title: "Quão seguro é o meu Linux? Uma verificação em 10 minutos"
description: "Verifique atualizações, criptografia de disco, firewall, Secure Boot, portas abertas, SSH, usuários e backups em dez minutos e entenda o que uma pontuação significa."
slug: "how-secure-is-my-linux-computer"
date: 2026-11-06
updated: 2026-11-06
tags: [checklist, básico, postura]
related_hardening: [mounts.tmp-noexec, fs.protected-files]
faq:
  - q: "Como posso verificar rapidamente o quanto o meu computador Linux é seguro?"
    a: "Olhe oito pontos: atualizações pendentes, criptografia de disco, estado do firewall, Secure Boot, portas em escuta, servidor SSH, contas de usuário e backups. Cada um leva um ou dois minutos, com um único comando."
  - q: "Uma pontuação de segurança alta significa que o meu computador está seguro?"
    a: "Não. Uma pontuação conta as configurações que foram verificadas. Ela não vê senhas fracas, uma página de phishing em que você clicou nem software que você instalou de propósito."
---

O seu computador Linux provavelmente está em boa forma se instala atualizações, tem o disco criptografado, roda um firewall que você sabe explicar e não oferece à rede nada que você não tenha escolhido. Dá para conferir tudo isso em cerca de dez minutos com os comandos abaixo. Quando um comando muda entre distribuições, o texto diz qual.

## As oito verificações

### 1. Atualizações

A maioria dos ataques bem-sucedidos usa uma falha que já tem correção. Veja se há correções esperando:

```sh
# Fedora
sudo dnf check-upgrade
# Ubuntu and Debian
sudo apt update && apt list --upgradable
# Arch
checkupdates   # from the pacman-contrib package
```

Se a lista for longa, atualize agora. Depois veja se as atualizações de segurança se instalam sozinhas: Ubuntu e Debian usam `unattended-upgrades`, o Fedora usa `dnf-automatic` (o dnf5 tem um plugin automático próprio), e o Arch não tem essa ferramenta porque é uma distribuição de lançamento contínuo, que você atualiza à mão.

### 2. Criptografia de disco

Se alguém levar o seu notebook, um disco sem criptografia pode ser lido ao ser ligado em outra máquina. Olhe a estrutura:

```sh
lsblk -f
```

Uma linha `crypto_LUKS` acima do seu sistema de arquivos raiz significa que o disco está criptografado. O nosso artigo sobre [LUKS e TPM2](/pt-br/articles/disk-encryption-on-linux-luks-and-tpm2/) explica o que isso protege e o que não protege.

### 3. Firewall

Veja qual o seu sistema usa:

```sh
sudo nft list ruleset | head -40
sudo ufw status            # Ubuntu, if ufw is installed
sudo firewall-cmd --state  # Fedora, if firewalld is installed
```

Saída vazia no primeiro comando e "inactive" nos outros significam que não há nenhuma filtragem. Se você precisa de um firewall é o assunto de [outro artigo](/pt-br/articles/do-you-need-a-firewall-on-linux-desktop/).

### 4. Secure Boot

```sh
mokutil --sb-state
```

"SecureBoot enabled" significa que o firmware só inicia software de boot assinado. O comando está no pacote `mokutil` nas quatro famílias. Veja [O Secure Boot vale a pena no Linux?](/pt-br/articles/is-secure-boot-worth-it-on-linux/) para conhecer os limites.

### 5. Portas abertas

Uma porta é uma porta que um programa mantém aberta. Liste as que estão esperando conexões:

```sh
sudo ss -tulpn
```

Qualquer coisa em escuta em `127.0.0.1` ou `::1` só pode ser alcançada pela sua própria máquina. Linhas com `0.0.0.0`, `[::]` ou `*` aceitam conexões vindas da rede. Para cada uma, pergunte se você conhece o programa e quer que ele esteja ali. Se não, pare o serviço.

### 6. SSH

Se você nunca entra neste computador de outro lugar, o servidor SSH não deveria estar rodando:

```sh
systemctl is-active sshd   # Fedora, Arch
systemctl is-active ssh    # Debian, Ubuntu
```

Se você o usa, confira as configurações em vigor com `sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication'`. O login como root deve ser `no`, e chaves são melhores que senhas.

### 7. Usuários

```sh
getent group sudo wheel
sudo awk -F: '$2 == "" {print $1}' /etc/shadow
```

O primeiro lista quem pode virar administrador (o grupo é `sudo` no Debian e no Ubuntu, `wheel` no Fedora e no Arch). O segundo mostra contas com o campo de senha vazio, e não deve mostrar nada.

### 8. Backups

Nenhum comando pode dizer que o seu backup funciona. Abra o mais recente e restaure um único arquivo para uma pasta de teste. Se falhar, você achou o seu problema mais importante. Ransomware, um disco que falha e um `rm` digitado errado terminam no mesmo lugar.

## Por onde começar quando a lista é longa

Não tente corrigir tudo numa noite. Atualize primeiro, porque não custa nada e fecha falhas conhecidas. Depois cuide de tudo o que escuta na rede e que você não reconhece, e então do SSH e das contas. Criptografia de disco e Secure Boot costumam exigir uma reinstalação ou uma visita às configurações do firmware, então reserve um fim de semana. Configure os backups antes das alterações arriscadas, não depois.

## O que uma pontuação significa

Uma pontuação de 0 a 100 é um resumo de configurações que um programa conseguiu ler: o firewall está ligado, o disco está criptografado, há atualizações pendentes. Serve para achar lacunas e para ver o progresso depois de mudar algo. Não é um veredito. Ela não sabe que a sua senha é `hunter2`, que você a reutiliza ou que você executou um script de um fórum. Trate um número baixo como uma lista de tarefas e um número alto como "o básico está coberto", não como "nada pode acontecer".

## Verifique com o IbexWall

A tela de visão geral do IbexWall mostra uma pontuação e uma lista do que corrigir, e a Segurança do sistema lista cada verificação por trás dela (boot, disco, firewall, contas, atualizações, portas abertas). Cada correção é um plano que você revisa antes, com os arquivos exatos e o que pode quebrar, e que você pode desfazer pelo Histórico. A versão 1.0 está em preparação, então ainda não há download; acompanhe o progresso na documentação em docs.ibexwall.com.
