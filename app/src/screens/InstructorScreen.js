import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { instructorService, courseService } from '../services/api';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../utils/theme';

const InstructorScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getInstructorCourses();
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderCourse = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={[styles.status, item.isPublished ? styles.published : styles.draft]}>
          {item.isPublished ? 'Published' : 'Draft'}
        </Text>
      </View>
      <Text style={styles.cardMeta}>
        {item.enrolledStudents?.length || 0} students • {item.totalLessons} lessons
      </Text>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.publishButton]}>
          <Text style={styles.actionText}>
            {item.isPublished ? 'Unpublish' : 'Publish'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Instructor Panel</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Course</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={renderCourse}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No courses yet. Create your first course!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.surface, marginBottom: SPACING.md },
  addButton: { backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, alignSelf: 'flex-start' },
  addButtonText: { color: COLORS.primary, fontWeight: '600' },
  list: { padding: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text, flex: 1 },
  status: { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  published: { color: COLORS.secondary },
  draft: { color: COLORS.accent },
  cardMeta: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  cardActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  actionButton: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.border },
  actionText: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  publishButton: { backgroundColor: COLORS.primary },
  empty: { alignItems: 'center', padding: SPACING.xl },
  emptyText: { color: COLORS.textSecondary },
});

export default InstructorScreen;