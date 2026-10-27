#!/bin/bash
# Restore original icons from backup

cd /private/tmp/NewPad/assets/icons

if [ -d ../icons-backup ]; then
    cp ../icons-backup/transfer.png . 2>/dev/null || true
    cp ../icons-backup/bill-payment.png . 2>/dev/null || true
    cp ../icons-backup/hero.png . 2>/dev/null || true
    cp ../icons-backup/utilities.png . 2>/dev/null || true
    cp ../icons-backup/wallet.png . 2>/dev/null || true
    echo "Original icons restored from backup"
else
    echo "No backup found at ../icons-backup"
    exit 1
fi