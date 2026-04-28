import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { discussionService } from '../services/api';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../utils/theme';

const DiscussionsScreen = ({ navigation }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const response = await discussionService.getDiscussions();
      if (response.data.success) {
        setDiscussions(response.data.discussions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderDiscussion = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.isPinned && <Text style={styles.pinned}>📌</Text>}
      </View>
      <Text style={styles.cardContent} numberOfLines={2}>{item.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardMeta}>
          {item.user?.name} • {item.comments?.length || 0} comments
        </Text>
        {item.isResolved && <Text style={styles.resolved}>Resolved</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discussions</Text>
      </View>
      <FlatList
        data={discussions}
        keyExtractor={(item) => item._id}
        renderItem={renderDiscussion}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchDiscussions}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.surface },
  list: { padding: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text, flex: 1 },
  pinned: { fontSize: 14 },
  cardContent: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  cardMeta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  resolved: { fontSize: FONT_SIZE.xs, color: COLORS.secondary, fontWeight: '600' },
});

export default DiscussionsScreen;