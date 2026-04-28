import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { analyticsService } from '../services/api';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../utils/theme';

const AnalyticsScreen = ({ navigation }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsService.getUserAnalytics({ timeRange });
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeFilters}>
          {['week', 'month', 'year'].map((range) => (
            <View key={range} style={[styles.filterChip, timeRange === range && styles.filterActive]}>
              <Text style={[styles.filterText, timeRange === range && styles.filterTextActive]} onPress={() => setTimeRange(range)}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatCard title="Total Views" value={analytics?.views || 0} color={COLORS.primary} />
          <StatCard title="Enrollments" value={analytics?.enrollments || 0} color={COLORS.secondary} />
          <StatCard title="Completions" value={analytics?.completions || 0} color={COLORS.accent} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Courses</Text>
          {analytics?.byCourse?.length > 0 ? (
            analytics.byCourse.map((course, index) => (
              <View key={index} style={styles.courseRow}>
                <Text style={styles.courseRank}>#{index + 1}</Text>
                <Text style={styles.courseName}>{course._id || 'Unknown'}</Text>
                <Text style={styles.courseCount}>{course.count} views</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No data yet</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.surface, marginBottom: SPACING.md },
  timeFilters: { flexDirection: 'row' },
  filterChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', marginRight: SPACING.sm },
  filterActive: { backgroundColor: COLORS.surface },
  filterText: { color: COLORS.surface, fontSize: FONT_SIZE.sm },
  filterTextActive: { color: COLORS.primary, fontWeight: '600' },
  content: { flex: 1, padding: SPACING.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, elevation: 3, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.primary },
  statTitle: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginTop: SPACING.sm },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  courseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  courseRank: { width: 30, color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  courseName: { flex: 1, color: COLORS.text, fontSize: FONT_SIZE.sm },
  courseCount: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  emptyText: { color: COLORS.textSecondary, textAlign: 'center', padding: SPACING.lg },
});

export default AnalyticsScreen;