import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import { SERVICES } from "@/services";
import { colors, spacing } from "@/theme";
import ServiceCard from "@/components/ServiceCard";

type ContentVersion = { content: string };

export default function HomeScreen() {
  const [contentVersion, setContentVersion] = useState("v1");

  useEffect(() => {
    const loadVersion = async () => {
      try {
        const module = await import("@assets/content_version.json");
        setContentVersion((module.default as ContentVersion).content);
      } catch {
        setContentVersion("v1");
      }
    };
    loadVersion();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <Image
            source={require("@assets/icons/1.png")}
            style={styles.hero}
            resizeMode="cover"
          />
        </View>

        <View style={styles.versionBanner}>
          <Text style={styles.versionText}>
            Content Version: {contentVersion}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
        </View>

        <View style={styles.grid}>
          {SERVICES.map((service) => (
            <Link key={service.id} href={`/service/${service.id}`}>
              <ServiceCard service={service} onPress={() => {}} />
            </Link>
          ))}
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  heroContainer: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  hero: {
    width: "100%",
    height: "100%",
  },
  versionBanner: {
    alignItems: "center",
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginTop: -spacing.md,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  versionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
});
