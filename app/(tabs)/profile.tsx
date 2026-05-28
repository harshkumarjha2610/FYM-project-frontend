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
  Platform,
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

export default function ProfileScreen() {
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch buyer profile from AsyncStorage and API
  const fetchProfile = async () => {
    try {
      const storedBuyer = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      if (storedBuyer) {
        setProfile(JSON.parse(storedBuyer));
      }

      if (token) {
        const response = await fetch(`${API_URL}/api/buyer/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.data.buyer);
          await AsyncStorage.setItem('user', JSON.stringify(data.data.buyer));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch order statistics from backend API
  const fetchOrderStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const storedBuyer = await AsyncStorage.getItem('user');
      
      if (token && storedBuyer) {
        const buyer = JSON.parse(storedBuyer);
        const buyerId = buyer.id || buyer._id;
        
        if (buyerId) {
          const res = await fetch(`${API_URL}/api/orders/buyer/${buyerId}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          
          if (data.success && data.stats) {
            setOrderStats(data.stats);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['token', 'refreshToken', 'user', 'buyerId']);
            router.replace('/(auth)/buyer-login');
          }
        }
      ]
    );
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    await fetchOrderStats();
  };

  useEffect(() => {
    fetchProfile();
    fetchOrderStats();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2ec5b6" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
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
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2ec5b6" />}
      >
        {/* Header/Profile Info */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{profile?.name?.charAt(0) || 'U'}</Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Edit3 size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{profile?.name || 'User'}</Text>
            <Text style={styles.email}>{profile?.email || 'user@example.com'}</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{orderStats?.totalOrders || 0}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{orderStats?.completedOrders || 0}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{orderStats?.pendingOrders || 0}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
          <View style={[styles.statBox, styles.wideStatBox]}>
            <Text style={[styles.statValue, { color: '#2ec5b6' }]}>₹{orderStats?.totalSpent || 0}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(20, 184, 166, 0.1)' }]}>
              <User size={20} color="#2ec5b6" />
            </View>
            <Text style={styles.menuText}>Personal Details</Text>
            <Bell size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/orders')}>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <ShoppingBag size={20} color="#3B82F6" />
            </View>
            <Text style={styles.menuText}>Order History</Text>
            <Bell size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Heart size={20} color="#EF4444" />
            </View>
            <Text style={styles.menuText}>My Wishlist</Text>
            <Bell size={18} color="#64748B" />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Support & Legal</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
              <Shield size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Bell size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Settings size={20} color="#F59E0B" />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <Bell size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <LogOut size={20} color="#EF4444" />
            </View>
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2026 FYM Medicine Delivery</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2ec5b6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2ec5b6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#334155',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
  },
  editProfileText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    padding: 20,
    marginTop: -20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  wideStatBox: {
    flex: 0,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#F8FAFC',
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 12,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#475569',
  },
});

