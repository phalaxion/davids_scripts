# Password Generator

A simple cross-platform desktop password generator built with Python and PySide6.

## Features

- Configurable password length
- Toggle character sets: lowercase, uppercase, numbers, symbols (`!@#$%^&*_+`)
- Click the password to copy it to clipboard

## Requirements

- Python 3.8+
- PySide6

```bash
pip install PySide6
```

## Run

```bash
python main.py
```

## Build

Requires PyInstaller:

```bash
pip install pyinstaller
pyinstaller main.spec
```

Output is in `dist/`.