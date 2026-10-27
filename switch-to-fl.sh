#!/bin/bash
# Switch all icons to fl.png

cd /private/tmp/NewPad/assets/icons

# Backup current icons
mkdir -p ../icons-backup
cp transfer.png ../icons-backup/ 2>/dev/null || true
cp bill-payment.png ../icons-backup/ 2>/dev/null || true
cp hero.png ../icons-backup/ 2>/dev/null || true
cp utilities.png ../icons-backup/ 2>/dev/null || true
cp wallet.png ../icons-backup/ 2>/dev/null || true

# Replace all with fl.png
cp fl.png transfer.png
cp fl.png bill-payment.png
cp fl.png hero.png
cp fl.png utilities.png
cp fl.png wallet.png

echo "All icons switched to fl.png"