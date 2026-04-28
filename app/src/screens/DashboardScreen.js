import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { getUser, removeToken } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../utils/theme';

const modules = [
  {
    id: 'courses',
    title: 'Courses',
    subtitle: 'Browse & enroll',
    icon: '📚',
    screen: 'Courses',
    color: '#4F46E5',
  },
  {
    id: 'discussions',
    title: 'Discussions',
    subtitle: 'Ask & answer',
    icon: '💬',
    screen: 'Discussions',
    color: '#10B981',
  },
  {
    id: 'assessments',
    title: 'Assessments',
    subtitle: 'Quiz & exams',
    icon: '📝',
    screen: 'Assessments',
    color: '#F59E0B',
  },
  {
    id: 'instructor',
    title: 'Instructor',
    subtitle: 'Manage courses',
    icon: '👨‍🏫',
    screen: 'Instructor',
    color: '#EF4444',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'Track progress',
    icon: '📊',
    screen: 'Analytics',
    color: '#8B5CF6',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Stay updated',
    icon: '🔔',
    screen: 'Notifications',
    color: '#EC4899',
  },
];

const ModuleCard = ({ module, onPress }) => (
  <TouchableOpacity 
    style={styles.card} 
    onPress={onPress}
    activeOpacity={0.7}>
    <View style={[styles.iconContainer, { backgroundColor: module.color + '20' }]}>
      <Text style={styles.cardIcon}>{module.icon}</Text>
    </View>
    <Text style={styles.cardTitle}>{module.title}</Text>
    <Text style={styles.cardSubtitle}>{module.subtitle}</Text>
    <View style={[styles.arrow, { backgroundColor: module.color }]}>
      <Text style={styles.arrowText}>→</Text>
    </View>
  </TouchableOpacity>
);

const DashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  const handleLogout = async () => {
    await removeToken();
    navigation.replace('Login');
  };

  const handleModulePress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user?.role || 'Student'}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modules */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>My Modules</Text>
        <View style={styles.modulesGrid}>
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onPress={() => handleModulePress(module.screen)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  userEmail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.surface,
    opacity: 0.8,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  roleText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.surface,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  logoutButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  logoutText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  arrow: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;