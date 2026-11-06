---
title: "IbexWall herunterladen"
description: "IbexWall 1.0 ist in Vorbereitung. So werden Releases veröffentlicht und signiert, wie Sie einen Download prüfen und wie Sie heute aus dem Quellcode bauen."
updated: 2026-11-06
---

IbexWall 1.0 ist noch nicht veröffentlicht. Diese Seite sagt, was ein Release enthalten wird, wie Sie es prüfen und wie Sie das Programm in der Zwischenzeit selbst bauen.

## Was ein Release enthält

Jedes Release besteht aus einer Reihe von Dateien auf der [GitHub-Releases-Seite](https://github.com/nubian-ibex/ibexwall/releases):

- Pakete für Fedora (RPM), Ubuntu und Debian (DEB) sowie Arch Linux;
- der Quellcode am getaggten Commit;
- Prüfsummen, eine Signatur für jede Datei, eine Software-Stückliste und eine Herkunftserklärung, die beschreibt, wie die Dateien gebaut wurden.

Die Pakete sind aufgeteilt, damit Sie nur installieren, was Sie brauchen: `ibexwall` (der Daemon, die Kommandozeile und die Plugins), `ibexwall-desktop` (das Fenster, das Tray-Symbol und der Sitzungs-Agent), `ibexwall-mcp` (der Server für KI-Assistenten) und ein Eingrenzungspaket für Ihr System: `ibexwall-apparmor` unter Debian und Ubuntu, `ibexwall-selinux` unter Fedora.

## Unterstützte Systeme

Fedora, Ubuntu 24.04 und 26.04, Debian und Arch Linux. Jedes Release wird vor der Veröffentlichung in einer virtuellen Maschine für jedes dieser Systeme installiert, benutzt, aktualisiert, entfernt und restlos gelöscht.

## Den Download prüfen

Laden Sie die Dateien des Releases in einen Ordner. Prüfen Sie dann die Signatur der Prüfsummenliste, danach jede Prüfsumme und danach jede Signatur:

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo xtask verify-release /path/to/the/folder /path/to/the/folder/ibexwall-release.pub
```

Die Dateien nutzen das Format minisign, daher funktioniert `minisign -V` auch für eine einzelne Datei. Der öffentliche Schlüssel steht außerdem auf der [Sicherheitsseite](/de/security/). Vergleichen Sie beide, bevor Sie einer Signatur vertrauen. Die [Anleitung zur Release-Prüfung](https://docs.ibexwall.com/reference/release-verification/) erklärt jede Datei.

## Aus dem Quellcode bauen

Sie brauchen die Rust-Toolchain, die in `rust-toolchain.toml` steht, und für das Fenster die Node.js-Werkzeuge und die WebKitGTK-Entwicklungspakete.

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo build --release --workspace
```

Probieren Sie es aus, ohne Ihr System zu ändern: `scripts/dev-sandbox.sh` startet den Daemon und das Fenster in einer Sandbox, die Ihre Dateien, Dienste und Firewall nie berührt. Die Entwickleranleitung finden Sie auf [docs.ibexwall.com](https://docs.ibexwall.com/contributing/).

## Was die Installation tut

Die Installation legt die Systembenutzer und Verzeichnisse an, schaltet die Sockets ein, die den Daemon und die Plugins bei Bedarf starten, und startet sie. Sie nimmt keine Sicherheitsänderung vor: Jede Änderung bleibt ein Plan, den Sie prüfen. Das Entfernen der Pakete macht über den Wiederherstellungspunkt jeder Änderung rückgängig, was IbexWall geändert hat, und behält Ihre Daten, bis Sie sie restlos löschen.
