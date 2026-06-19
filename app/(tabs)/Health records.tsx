import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HealthRecord {
  id: string;
  type: 'prescription' | 'lab-report' | 'visit' | 'vaccination';
  title: string;
  date: string;
  doctor: string;
  details: string;
}

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  icon: any;
  status: 'normal' | 'warning' | 'critical';
}

export default function HealthRecordsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const healthMetrics: HealthMetric[] = [
    { id: '1', name: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'heart-outline', status: 'normal' },
    { id: '2', name: 'Blood Sugar', value: '95', unit: 'mg/dL', icon: 'water-outline', status: 'normal' },
    { id: '3', name: 'Weight', value: '72', unit: 'kg', icon: 'fitness-outline', status: 'normal' },
    { id: '4', name: 'Temperature', value: '98.6', unit: '°F', icon: 'thermometer-outline', status: 'normal' },
  ];

  const healthRecords: HealthRecord[] = [
    {
      id: '1',
      type: 'prescription',
      title: 'Antibiotic Prescription',
      date: '2 Dec 2025',
      doctor: 'Dr. Sharma',
      details: 'Amoxicillin 500mg - 3 times daily for 7 days',
    },
    {
      id: '2',
      type: 'lab-report',
      title: 'Blood Test Report',
      date: '28 Nov 2025',
      doctor: 'Dr. Patel',
      details: 'Complete Blood Count - All values normal',
    },
    {
      id: '3',
      type: 'visit',
      title: 'General Checkup',
      date: '25 Nov 2025',
      doctor: 'Dr. Kumar',
      details: 'Regular health checkup - No issues found',
    },
    {
      id: '4',
      type: 'vaccination',
      title: 'COVID-19 Booster',
      date: '15 Nov 2025',
      doctor: 'Dr. Singh',
      details: 'Third dose administered',
    },
  ];

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return 'document-text';
      case 'lab-report':
        return 'flask';
      case 'visit':
        return 'medical';
      case 'vaccination':
        return 'shield-checkmark';
      default:
        return 'document';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#2ec5b6';
      case 'warning':
        return '#FFB800';
      case 'critical':
        return '#FF6B6B';
      default:
        return '#2ec5b6';
    }
  };

  const filteredRecords = selectedFilter === 'all'
    ? healthRecords
    : healthRecords.filter(record => record.type === selectedFilter);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Health Records</Text>
          <Text style={styles.headerSubtitle}>Track your medical history</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => Alert.alert('Add Record', 'Feature coming soon!')}
        >
          <Ionicons name="add" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Health Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Metrics</Text>
          <View style={styles.metricsGrid}>
            {healthMetrics.map((metric) => (
              <TouchableOpacity
                key={metric.id}
                style={styles.metricCard}
                onPress={() => Alert.alert(metric.name, `Current value: ${metric.value} ${metric.unit}`)}
              >
                <View style={[styles.metricIconContainer, { backgroundColor: `${getStatusColor(metric.status)}20` }]}>
                  <Ionicons
                    name={metric.icon}
                    size={24}
                    color={getStatusColor(metric.status)}
                  />
                </View>
                <Text style={styles.metricName}>{metric.name}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricUnit}>{metric.unit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Upload Report', 'Feature coming soon!')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="cloud-upload-outline" size={24} color="#2ec5b6" />
              </View>
              <Text style={styles.quickActionText}>Upload Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Book Appointment', 'Feature coming soon!')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="calendar-outline" size={24} color="#2ec5b6" />
              </View>
              <Text style={styles.quickActionText}>Book Test</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Reminders', 'Feature coming soon!')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="alarm-outline" size={24} color="#2ec5b6" />
              </View>
              <Text style={styles.quickActionText}>Reminders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Share Records', 'Feature coming soon!')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="share-social-outline" size={24} color="#2ec5b6" />
              </View>
              <Text style={styles.quickActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'prescription' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('prescription')}
            >
              <Text style={[styles.filterText, selectedFilter === 'prescription' && styles.filterTextActive]}>
                Prescriptions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'lab-report' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('lab-report')}
            >
              <Text style={[styles.filterText, selectedFilter === 'lab-report' && styles.filterTextActive]}>
                Lab Reports
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'visit' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('visit')}
            >
              <Text style={[styles.filterText, selectedFilter === 'visit' && styles.filterTextActive]}>
                Visits
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'vaccination' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('vaccination')}
            >
              <Text style={[styles.filterText, selectedFilter === 'vaccination' && styles.filterTextActive]}>
                Vaccinations
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Health Records List */}
        <View style={styles.recordsList}>
          {filteredRecords.map((record) => (
            <TouchableOpacity
              key={record.id}
              style={styles.recordCard}
              onPress={() => Alert.alert(record.title, record.details)}
            >
              <View style={styles.recordIconContainer}>
                <Ionicons
                  name={getRecordIcon(record.type)}
                  size={24}
                  color="#2ec5b6"
                />
              </View>

              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={styles.recordDoctor}>
                  <Ionicons name="person" size={12} color="#CCCCCC" /> {record.doctor}
                </Text>
                <Text style={styles.recordDetails}>{record.details}</Text>
              </View>

              <View style={styles.recordRight}>
                <Text style={styles.recordDate}>{record.date}</Text>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </View>
            </TouchableOpacity>
          ))}

          {filteredRecords.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={64} color="#666666" />
              <Text style={styles.emptyStateText}>No records found</Text>
              <Text style={styles.emptyStateSubText}>Add your first health record</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Slate 900
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#1E293B', // Slate 800
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Slate 700
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC', // Slate 50
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8', // Slate 400
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#2ec5b6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2ec5b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricName: {
    fontSize: 12,
    color: '#94A3B8', // Slate 400
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  metricUnit: {
    fontSize: 12,
    color: '#94A3B8',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '23%',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#334155', // Slate 700
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 11,
    color: '#CBD5E1', // Slate 300
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#1E293B', // Slate 800
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#2ec5b6',
    borderColor: '#2ec5b6',
  },
  filterText: {
    color: '#CBD5E1', // Slate 300
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000000',
  },
  recordsList: {
    paddingHorizontal: 16,
  },
  recordCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  recordIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#334155', // Slate 700
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  recordDoctor: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
  },
  recordDetails: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  recordRight: {
    alignItems: 'flex-end',
  },
  recordDate: {
    fontSize: 12,
    color: '#2ec5b6',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
});

