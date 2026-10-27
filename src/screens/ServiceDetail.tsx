import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getService } from "@/services";
import { colors, spacing } from "@/theme";

const iconMap: Record<string, any> = {
  "icons/transfer.png": require("@assets/icons/transfer.png"),
  "icons/bill-payment.png": require("@assets/icons/bill-payment.png"),
  "icons/utilities.png": require("@assets/icons/utilities.png"),
};

export default function ServiceDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const service = getService(params.id);

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Service not found</Text>
      </SafeAreaView>
    );
  }

  const iconSource = iconMap[service.iconFile] || iconMap["icons/transfer.png"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={iconSource} style={styles.icon} resizeMode="contain" />
          <Text style={styles.title}>{service.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{service.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Service Code</Text>
          <Text style={styles.value}>{service.serviceKey}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>ID</Text>
          <Text style={styles.value}>{service.id}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    fontSize: 18,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
