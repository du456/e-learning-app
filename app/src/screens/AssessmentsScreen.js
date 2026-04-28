import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { assessmentService } from '../services/api';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../utils/theme';

const AssessmentsScreen = ({ navigation }) => {
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('assessments');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assessRes, subRes] = await Promise.all([
        assessmentService.getAssessments(),
        assessmentService.getMySubmissions(),
      ]);
      if (assessRes.data.success) setAssessments(assessRes.data.assessments);
      if (subRes.data.success) setSubmissions(subRes.data.submissions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderAssessment = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMeta}>
        {item.course?.title} • {item.type} • {item.timeLimit} min
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardQuestions}>{item.questions?.length || 0} questions</Text>
        <Text style={styles.passingScore}>Pass: {item.passingScore}%</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSubmission = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.assessment?.title}</Text>
      <Text style={styles.cardMeta}>{item.assessment?.course?.title}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.score}>
          Score: {item.score}/{item.totalPoints}
        </Text>
        <Text style={[styles.status, item.passed && styles.passed]}>
          {item.passed ? 'Passed' : 'Failed'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assessments</Text>
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, tab === 'assessments' && styles.tabActive]} onPress={() => setTab('assessments')}>
            <Text style={[styles.tabText, tab === 'assessments' && styles.tabTextActive]}>Quizzes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'submissions' && styles.tabActive]} onPress={() => setTab('submissions')}>
            <Text style={[styles.tabText, tab === 'submissions' && styles.tabTextActive]}>My Submissions</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={tab === 'assessments' ? assessments : submissions}
        keyExtractor={(item) => item._id}
        renderItem={tab === 'assessments' ? renderAssessment : renderSubmission}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.surface, marginBottom: SPACING.md },
  tabs: { flexDirection: 'row', gap: SPACING.sm },
  tab: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: 'rgba(255,255,255,0.2)' },
  tabActive: { backgroundColor: COLORS.surface },
  tabText: { color: COLORS.surface, fontSize: FONT_SIZE.sm },
  tabTextActive: { color: COLORS.primary, fontWeight: '600' },
  list: { padding: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, elevation: 3 },
  cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
  cardMeta: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  cardQuestions: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  passingScore: { fontSize: FONT_SIZE.xs, color: COLORS.primary },
  score: { fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '600' },
  status: { fontSize: FONT_SIZE.sm, color: COLORS.error, fontWeight: '600' },
  passed: { color: COLORS.secondary },
});

export default AssessmentsScreen;