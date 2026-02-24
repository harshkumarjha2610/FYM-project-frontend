import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl, // ✅ ADD THIS IMPORT
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapPin, Phone, Mail, Star, Camera, RefreshCw, LogOut } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
// import { API_URL } from '@env';
const { width } = Dimensions.get('window');

// API Configuration

// const API_URL = 'http://192.168.1.3:3000';
const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

// Updated interface to match your backend response
interface SellerData {
  _id: string;
  ownerName: string;
  pharmacyName: string;
  email: string;
  mobile: string;
  address?: string;
  gstNumber: string;
  drugLicense1: string;
  drugLicense2: string;
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  rating?: { average: number; count: number };
  shopPhotos?: string[];
  verificationStatus: string;
  isVerified: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  businessHours?: any;
  documentsStatus?: any;
}

export default function SellerProfileScreen() {
  console.log('🎬 SellerProfileScreen component mounted');
  
  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSellerData = async () => {
    try {
      console.log('🚀 === FETCHING SELLER PROFILE ===');
      setError(null);

      const token = await AsyncStorage.getItem('sellerToken');
      console.log('🔐 Token retrieved:', token ? 'EXISTS' : 'NULL');
      
      if (!token) {
        console.error('❌ No seller token found');
        Alert.alert(
          'Authentication Required',
          'Please log in to access your profile',
          [
            {
              text: 'Go to Login',
              onPress: () => router.push('/(auth)/seller-login')
            }
          ]
        );
        return;
      }

      // Verify token type
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('📄 Token payload:', payload);
        
        if (payload.type !== 'seller') {
          console.error('❌ Invalid token type:', payload.type);
          Alert.alert(
            'Invalid Token',
            'Please log in with your seller account',
            [
              {
                text: 'Go to Login',
                onPress: () => {
                  AsyncStorage.removeItem('sellerToken');
                  router.push('/(auth)/seller-login');
                }
              }
            ]
          );
          return;
        }
        console.log('✅ Token type verified: seller');
      } catch (tokenError) {
        console.error('❌ Token decode error:', tokenError);
        Alert.alert('Invalid Token', 'Please log in again');
        AsyncStorage.removeItem('sellerToken');
        router.push('/(auth)/seller-login');
        return;
      }

      console.log('🌐 Making API request...');
      const response = await axios.get(`${API_URL}/api/seller/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log('📦 Response received:', response.data);
      
      if (response.data.success && response.data.seller) {
        console.log('✅ Setting seller data');
        setSellerData(response.data.seller);
        console.log('✅ Profile loaded successfully');
      } else {
        console.error('❌ Invalid response structure');
        throw new Error('Invalid response structure');
      }

    } catch (err: any) {
      console.error('❌ Error fetching seller data:', err);
      
      let errorMessage = 'Failed to fetch seller data. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        await AsyncStorage.removeItem('sellerToken');
        Alert.alert(
          'Session Expired',
          errorMessage,
          [
            {
              text: 'Go to Login',
              onPress: () => router.push('/(auth)/seller-login')
            }
          ]
        );
        return;
      } else if (err.response?.status === 403) {
        errorMessage = err.response.data.message || 'Access forbidden.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Seller profile not found.';
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      console.log('📝 Error message:', errorMessage);
      setError(errorMessage);
      
      if (!refreshing) {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      console.log('🏁 Finally block');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
    await fetchSellerData();
  };

  const handleLogout = async () => {
    console.log('🚪 Logout initiated');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('✅ Logging out');
            await AsyncStorage.removeItem('sellerToken');
            router.push('/(auth)/seller-login');
          }
        }
      ]
    );
  };

  useEffect(() => {
    console.log('📥 useEffect - fetching data');
    fetchSellerData();
  }, []);

  const handleAddPhoto = async () => {
    try {
      console.log('📸 Add photo initiated');

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      const formData = new FormData();
      formData.append('photo', {
        uri: result.assets[0].uri,
        type: result.assets[0].type || 'image/jpeg',
        name: result.assets[0].fileName || `photo_${Date.now()}.jpg`,
      } as any);

      const token = await AsyncStorage.getItem('sellerToken');
      
      if (!token) {
        Alert.alert('Error', 'No authentication token found.');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/seller/profile/photos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      console.log('✅ Photo uploaded');
      await fetchSellerData();
      Alert.alert('Success', 'Photo uploaded successfully');

    } catch (error: any) {
      console.error('❌ Photo upload error:', error);
      Alert.alert('Error', 'Failed to upload photo');
    }
  };

  console.log('🎨 Rendering - State:', { loading, error: !!error, hasData: !!sellerData });

  if (loading && !refreshing) {
    console.log('⏳ Showing loading state');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !sellerData) {
    console.log('❌ Showing error state');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'No data available'}</Text>
          <View style={styles.errorActions}>
            <TouchableOpacity style={styles.retryButton} onPress={fetchSellerData}>
              <RefreshCw color="#FFFFFF" size={16} strokeWidth={2} />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/seller-login')}>
              <LogOut color="#FFFFFF" size={16} strokeWidth={2} />
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  console.log('✅ Rendering main profile UI');
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl  // ✅ FIXED - Using correct RefreshControl component
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.pharmacyName}>{sellerData.pharmacyName || 'Pharmacy'}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut color="#FFFFFF" size={20} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View style={[
            styles.verificationBadge,
            { backgroundColor: sellerData.isVerified ? '#22C55E' : '#EF4444' }
          ]}>
            <Text style={styles.verificationText}>
              {sellerData.isVerified ? 'Verified' : sellerData.verificationStatus}
            </Text>
          </View>
          {sellerData.description && (
            <Text style={styles.description}>{sellerData.description}</Text>
          )}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Owner</Text>
              <Text style={styles.infoValue}>{sellerData.ownerName || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Mail color="#6B7280" size={20} strokeWidth={2} />
              <Text style={styles.infoValue}>{sellerData.email || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone color="#6B7280" size={20} strokeWidth={2} />
              <Text style={styles.infoValue}>{sellerData.mobile || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>GST Number</Text>
              <Text style={styles.infoValue}>{sellerData.gstNumber || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Drug License 1</Text>
              <Text style={styles.infoValue}>{sellerData.drugLicense1 || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Drug License 2</Text>
              <Text style={styles.infoValue}>{sellerData.drugLicense2 || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Verification Status</Text>
              <Text style={[
                styles.infoValue,
                { 
                  color: sellerData.isVerified ? '#22C55E' : '#EF4444',
                  fontWeight: '600'
                }
              ]}>
                {sellerData.verificationStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Location Information */}
        {(sellerData.address || sellerData.location) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.infoCard}>
              {sellerData.address && (
                <View style={styles.infoRow}>
                  <MapPin color="#6B7280" size={20} strokeWidth={2} />
                  <Text style={styles.infoValue}>{sellerData.address}</Text>
                </View>
              )}
              {sellerData.location && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Coordinates</Text>
                  <Text style={styles.infoValue}>
                    {`Lat: ${sellerData.location.latitude}, Long: ${sellerData.location.longitude}`}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Shop Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            {sellerData.shopPhotos && sellerData.shopPhotos.length > 0 ? (
              sellerData.shopPhotos.map((photoUrl, index) => (
                <View key={index} style={styles.photoCard}>
                  <Image 
                    source={{ uri: photoUrl }} 
                    style={styles.photo}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.noPhotosText}>No photos uploaded yet</Text>
            )}
            <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
              <Camera color="#FFFFFF" size={24} strokeWidth={2} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Your existing styles remain the same



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  pharmacyName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  verificationBadge: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 10,
  },
  verificationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 120,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    marginLeft: 8,
  },
  photosContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  photoCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  photoName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 100,
  },
  addPhotoButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  addPhotoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noPhotosText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginRight: 12,
    alignSelf: 'center',
  },
  bottomSpacing: {
    height: 32,
  },
});