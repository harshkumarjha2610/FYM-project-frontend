import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  LogOut,
  Shield,
  Heart,
  ShoppingBag,
  Settings,
  Bell,
} from 'lucide-react-native';

// const API_URL = 'http://192.168.1.3:3000';
const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

interface BuyerProfile {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  address?: string;
  pincode?: string;
  createdAt: string;
}

interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSpent: number;
}

export default function HomeScreen() {
  console.log('🏠 HomeScreen (Buyer Profile) component rendered');
  
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch buyer profile from AsyncStorage and API
  const fetchProfile = async () => {
    console.log('📱 Fetching buyer profile...');
    try {
      // Get stored buyer data
      const storedBuyer = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      console.log('📦 Stored buyer data:', storedBuyer ? 'Found' : 'Not found');
      console.log('🔑 Token available:', token ? 'Yes' : 'No');

      if (storedBuyer) {
        const buyerData = JSON.parse(storedBuyer);
        console.log('👤 Setting profile from stored data:', buyerData.name);
        setProfile(buyerData);
      }

      // Fetch fresh data from API if token exists
      if (token) {
        console.log('🔄 Fetching fresh profile from API...');
        const response = await fetch(`${API_URL}/api/buyer/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Profile API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Fresh profile data received');
          setProfile(data.data.buyer);
          
          console.log("Profile data: ", data.data);
          // Update stored buyer data
          await AsyncStorage.setItem('user', JSON.stringify(data.data.buyer));
          console.log('💾 Updated stored buyer data');
        } else {
          console.log('⚠️ Failed to fetch fresh profile data');
        }
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log('🏁 Profile fetch completed');
    }
  };

  // Fetch order statistics (mock for now - you can implement this in your backend)
  const fetchOrderStats = async () => {
    console.log('📊 Fetching order statistics...');
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        // This is a mock implementation - you can create this API endpoint later
        const mockStats: OrderStats = {
          totalOrders: 12,
          completedOrders: 10,
          pendingOrders: 2,
          totalSpent: 2850
        };
        
        console.log('📈 Setting mock order stats');
        setOrderStats(mockStats);
      }
    } catch (error) {
      console.error('❌ Error fetching order stats:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    console.log('🔓 Logout initiated');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('🔄 Clearing stored data...');
            await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
            console.log('✅ Stored data cleared');
            console.log('📍 Navigating to login screen');
            router.replace('/(auth)/buyer-login');
          }
        }
      ]
    );
  };

  // Handle refresh
  const onRefresh = async () => {
    console.log('🔄 Profile refresh initiated');
    setRefreshing(true);
    await fetchProfile();
    await fetchOrderStats();
  };

  // Load data on component mount
  useEffect(() => {
    console.log('🚀 HomeScreen useEffect - Initial data load');
    fetchProfile();
    fetchOrderStats();
  }, []);

  // Loading state
  if (loading) {
    console.log('⏳ Showing loading state');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#14B8A6" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    console.log('❌ Showing error state:', error);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <Text style={styles.headerSubtitle}>Medicine Delivery</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={40} color="#14B8A6" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile?.name || 'Buyer'}</Text>
              <Text style={styles.profileEmail}>{profile?.email || 'No email'}</Text>
              <View style={styles.membershipBadge}>
                <Shield size={12} color="#14B8A6" />
                <Text style={styles.membershipText}>Verified Member</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                console.log('✏️ Edit profile pressed');
                // Navigate to edit profile screen (implement later)
                Alert.alert('Coming Soon', 'Profile editing feature will be available soon!');
              }}
            >
              <Edit3 size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Contact Information */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.contactItem}>
              <Mail size={20} color="#6B7280" />
              <Text style={styles.contactText}>{profile?.email || 'Not provided'}</Text>
            </View>
            
            {profile?.mobile && (
              <View style={styles.contactItem}>
                <Phone size={20} color="#6B7280" />
                <Text style={styles.contactText}>{profile.mobile}</Text>
              </View>
            )}
            
            {profile?.address && (
              <View style={styles.contactItem}>
                <MapPin size={20} color="#6B7280" />
                <Text style={styles.contactText}>
                  {profile.address}
                  {profile.pincode && ` - ${profile.pincode}`}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Order Statistics */}
        {orderStats && (
          <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Order Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <ShoppingBag size={24} color="#14B8A6" />
                <Text style={styles.statNumber}>{orderStats.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statItem}>
                <Heart size={24} color="#EF4444" />
                <Text style={styles.statNumber}>{orderStats.completedOrders}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>₹{orderStats.totalSpent}</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => {
              console.log('📋 Order history pressed');
              // Navigate to order history (implement later)
              Alert.alert('Coming Soon', 'Order history feature will be available soon!');
            }}
          >
            <ShoppingBag size={20} color="#6B7280" />
            <Text style={styles.actionText}>Order History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => {
              console.log('⚙️ Settings pressed');
              // Navigate to settings (implement later)
              Alert.alert('Coming Soon', 'Settings feature will be available soon!');
            }}
          >
            <Settings size={20} color="#6B7280" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.accountInfo}>
          <Text style={styles.accountInfoText}>
            Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  notificationButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#14B8A6',
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  contactSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#EF4444',
  },
  accountInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  accountInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
