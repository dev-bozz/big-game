#!/bin/sh
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  python3 launch_game.py
else
  echo "Нужен Python 3. Установите его и запустите этот файл снова."
  read -r _
fi
