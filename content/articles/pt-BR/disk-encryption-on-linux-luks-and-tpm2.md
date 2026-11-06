---
title: "Criptografia de disco no Linux: LUKS, TPM2, swap e suspensão"
description: "O que a criptografia LUKS protege, como LUKS2 e o desbloqueio automático por TPM2 trocam conforto por segurança, a lacuna da swap e da hibernação, e como verificar."
slug: "disk-encryption-on-linux-luks-and-tpm2"
date: 2026-11-06
updated: 2026-11-06
tags: [criptografia, luks, tpm2]
related_hardening: []
faq:
  - q: "Contra o que a criptografia de disco LUKS protege?"
    a: "Ela protege dados em repouso. Se o seu notebook for perdido, roubado ou desligado e desmontado, o conteúdo do disco fica ilegível sem a senha ou a chave."
  - q: "O desbloqueio automático por TPM2 é tão seguro quanto digitar uma senha?"
    a: "Ele troca um pouco de segurança por conforto. O disco abre sem senha quando a cadeia de boot confere, então quem pegar a máquina desligada nesse estado avança mais. Adicionar um PIN reduz esse risco."
---

A criptografia de disco protege os seus arquivos quando alguém tem o computador, mas não tem você. No Linux isso é feito com o LUKS, um formato padrão que fica sob o sistema de arquivos. Você digita uma senha na inicialização, o disco é desbloqueado e o sistema funciona normalmente. É a proteção mais útil para um notebook que pode ser perdido.

## O que ela protege e o que não protege

Protege contra:

- Um notebook ou disco perdido ou roubado.
- Alguém que tira o disco e o lê em outro lugar.
- Dados que ficaram num disco que você recicla ou vende.

Não protege contra:

- Malware que roda enquanto você está logado. Nesse momento o disco já está desbloqueado.
- Alguém que consiga a sua senha.
- Uma máquina ligada e desbloqueada que seja apreendida, ou uma pessoa hostil com acesso à máquina e tempo para adulterar a partição de boot sem criptografia.

Por isso ela anda junto com o [Secure Boot](/pt-br/articles/is-secure-boot-worth-it-on-linux/): um cobre os dados guardados, o outro o código de inicialização.

## LUKS2

O LUKS tem duas versões. O LUKS2 é o que os instaladores atuais criam. Ele guarda mais metadados, usa a função de derivação de chave Argon2id, que é de propósito cara para quem tenta adivinhar, e permite vários slots de chave ao mesmo tempo, de modo que uma senha, uma chave de recuperação e um token TPM2 podem desbloquear o mesmo disco.

Veja o que você tem:

```sh
lsblk -f
sudo cryptsetup luksDump /dev/nvme0n1p3
```

Troque o dispositivo pelo que o `lsblk` mostra como `crypto_LUKS`. Procure `Version: 2` e os slots de chave. Instalações antigas podem ser LUKS1; converter é possível, mas exige um backup antes, então leia `man cryptsetup` antes de tentar.

## Desbloqueio por TPM2

Um TPM2 é um chip presente na maioria dos computadores modernos que guarda um segredo e só o libera quando o estado medido da máquina confere. Com o `systemd-cryptenroll` você pode vincular uma chave do disco a ele, de modo que a máquina inicia sem pedir a senha:

```sh
sudo systemd-cryptenroll --tpm2-device=auto --tpm2-pcrs=7 /dev/nvme0n1p3
```

O PCR 7 reflete a configuração do Secure Boot. O seu initramfs precisa conseguir usar o TPM2 (ele precisa de desbloqueio baseado em systemd), e a entrada do crypttab precisa da opção `tpm2-device=auto`. Os passos exatos variam entre as distribuições, então siga a documentação da sua.

A troca é real. O disco abre sozinho para qualquer pessoa que ligue a máquina no estado esperado, então a pergunta pela senha passa para a tela de login. Uma senha de usuário fraca passa a guardar os dados. Adicionar um PIN com `--tpm2-with-pin=yes` traz de volta um segredo que você digita. Guarde a senha original ou uma chave de recuperação em lugar seguro: uma atualização de firmware ou uma mudança na configuração de boot pode alterar as medições, e o TPM deixará de liberar a chave.

## Swap e hibernação

A memória pode chegar ao disco de duas maneiras, e ambas podem vazar chaves e documentos se ficarem desprotegidas.

- Espaço de swap. Se for uma partição simples, tudo o que foi para a swap pode ser lido. Coloque a swap dentro do volume criptografado, ou use zram, que mantém as páginas na memória.
- Hibernação. A imagem inteira da memória é gravada na swap e lida de volta na retomada, inclusive a chave do disco. A hibernação é tão segura quanto a swap que usa, então a swap precisa estar no volume criptografado, e a configuração de retomada precisa ser feita por você ou pelo instalador.

Muitas instalações padrão do Fedora e do Ubuntu colocam a swap em armazenamento criptografado ou em zram, mas "muitas" não é "a sua". Verifique:

```sh
swapon --show
```

Se um dispositivo aparecer na lista, confirme no `lsblk -f` que ele fica sob um pai `crypto_LUKS`.

## Core dumps

Quando um programa trava, o sistema pode gravar a memória dele em disco, e essa memória pode conter senhas ou chaves. Mesmo num disco criptografado, esses arquivos podem ser lidos depois que você faz login, então guardá-los só onde você quiser é um bom hábito.

## Por onde começar

Se o seu disco não está criptografado, a solução limpa é reinstalar escolhendo a criptografia no instalador. Criptografar no mesmo lugar é possível com ferramentas como `cryptsetup-reencrypt`, mas é arriscado; faça antes um backup completo.

## Verifique com o IbexWall

A Segurança do sistema informa se o disco está criptografado, e a verificação de core dumps (system.coredump) pode desligar o armazenamento de dumps de falha por meio de um plano. O IbexWall não criptografa um disco para você nem muda chaves LUKS; ele aponta a lacuna. Toda alteração que ele faz é um plano que você revisa, com um instantâneo que pode ser desfeito pelo Histórico. A versão 1.0 está em preparação.
