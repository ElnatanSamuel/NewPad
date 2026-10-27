import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Service } from '@/services';
import { colors, spacing } from '@/theme';

const iconMap: Record<string, any> = {
  'icons/transfer.png': require('@assets/icons/transfer.png'),
  'icons/bill-payment.png': require('@assets/icons/bill-payment.png'),
  'icons/utilities.png': require('@assets/icons/utilities.png'),
  'icons/wallet.png': require('@assets/icons/wallet.png'),
};

type Props = {
  service: Service;
  onPress: () => void;
};

export default function ServiceCard({ service, onPress }: Props) {
  const iconSource = iconMap[service.iconFile] || iconMap['icons/transfer.png'];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={iconSource}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.title}>{service.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});