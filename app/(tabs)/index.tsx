import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Linking,
  BackHandler,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io as socketIO, Socket } from 'socket.io-client';
import { styles } from './index.styles';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Medicine {
  _id: string;
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  inStock: boolean;
  category: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

interface Seller {
  id: string;
  name: string;
  distance: string;
  rating: number;
  address: string;
  coordinates: Coordinates;
}

const DEFAULT_REGION: Region = {
  latitude: 25.5941,
  longitude: 85.1376,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const HomeScreen: React.FC = () => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [prescriptionImages, setPrescriptionImages] = useState<string[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('Enable GPS to get location');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearestSellers, setNearestSellers] = useState<Seller[]>([]);
  const [showNearestSellers, setShowNearestSellers] = useState<boolean>(false);
  const [fullAddress, setFullAddress] = useState<string>('');
  const [findingSellerModal, setFindingSellerModal] = useState<boolean>(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [matchingStatus, setMatchingStatus] = useState<string>('pending');
  const [canScheduleOrder, setCanScheduleOrder] = useState<boolean>(false);
  const [matchingStartedAt, setMatchingStartedAt] = useState<number | null>(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');
  const [matchProgress, setMatchProgress] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchingOptions, setMatchingOptions] = useState<Array<{ r: number; discount: number[] }>>([]);
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);

  const DEFAULT_MATCHING_OPTIONS = [
    { r: 2000, discount: [15, 20] },
    { r: 5000, discount: [15, 20] },
    { r: 2000, discount: [10, 12, 15, 20] },
    { r: 5000, discount: [10, 12, 15, 20] },
    { r: 7000, discount: [0] },
    { r: 200000, discount: [0, 5, 10, 12, 15, 20] },
  ];

  const fetchMatchingOptions = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`${API_URL}/api/orders/matching-options`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.success && Array.isArray(response.data?.options)) {
        setMatchingOptions(response.data.options);
      }
    } catch (error) {
      console.error('Fetch matching options error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => { } },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                console.log('🔄 Clearing stored data and logging out...');
                await AsyncStorage.multiRemove(['token', 'refreshToken', 'user', 'buyerId']);
                router.replace('/(auth)/buyer-login');
              },
            },
          ],
          { cancelable: true }
        );
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    (async () => {
      await requestLocationPermission();
      await getCurrentLocation();
      await fetchMedicines();
      await fetchMatchingOptions();
    })();

    // Socket Setup
    let socketInstance: Socket | null = null;
    const setupSocket = async () => {
      try {
        let buyerId = await AsyncStorage.getItem('buyerId');
        const userStr = await AsyncStorage.getItem('user');

        if (!buyerId && userStr) {
          const user = JSON.parse(userStr);
          buyerId = user.id || user._id;
          if (buyerId) await AsyncStorage.setItem('buyerId', buyerId);
        }

        if (!buyerId || !API_URL) return;

        socketInstance = socketIO(API_URL, {
          transports: ['websocket'],
          reconnection: true,
        });

        socketInstance.on('connect', () => {
          console.log('⚡ Home socket connected:', socketInstance?.id);
          socketInstance?.emit('joinBuyer', buyerId);
        });

        socketInstance.on('orderResponse', (data: any) => {
          console.log('🔔 Order response received on home:', data);
          if (data.status === 'accepted') {
            setMatchingStatus('accepted');
            clearPlacedOrderDraft();
          }
        });

        socketInstance.on('order-unaccepted', (data: any) => {
          console.log('⚠️ Order unaccepted alert on home:', data);
          setCanScheduleOrder(true);
          setScheduleModalVisible(true);
        });

        setSocket(socketInstance);
      } catch (err) {
        console.error('⚠️ Socket setup error:', err);
      }
    };

    setupSocket();

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  // 5-minute timer logic
  useEffect(() => {
    let interval: any;
    if (findingSellerModal && matchingStatus === 'pending' && matchingStartedAt) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - matchingStartedAt) / 1000;
        const progress = Math.min(elapsed / 300, 1);
        setMatchProgress(progress);

        if (elapsed >= 300) {
          console.log('⏱️ 5 minutes elapsed without seller acceptance');
          setCanScheduleOrder(true);
          setScheduleModalVisible(true);
          clearInterval(interval);
        }
      }, 1000);
    } else {
      setMatchProgress(0);
    }
    return () => clearInterval(interval);
  }, [findingSellerModal, matchingStatus, matchingStartedAt]);


  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchMedicines(searchText);
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchText]);

  const fetchMedicines = async (query: string = '') => {
    setLoading(true);
    try {
      const url = query
        ? `${API_URL}/api/medicines/search?query=${encodeURIComponent(query)}`
        : `${API_URL}/api/medicines`;
      const response = await axios.get<{ medicines: Medicine[] }>(url);
      const data = response.data.medicines;
      console.log('Medicines data:', data);
      setMedicines(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch medicines error:', error);
      Alert.alert('Error', 'Failed to fetch medicines. Please try again.');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationError('Location permission denied');
      Alert.alert(
        'Location Permission Required',
        'Please enable location services to get your exact address.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const getCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        setSelectedLocation('Enable GPS to get location');
        Alert.alert(
          'GPS Required',
          'Please enable GPS to get your exact delivery address.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Enable GPS', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setUserCoordinates({ latitude, longitude });

      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const addressData = geocode[0];
        const completeAddress = [
          addressData.name,
          addressData.street,
          addressData.district,
          addressData.city,
          addressData.region,
          addressData.postalCode,
          addressData.country,
        ]
          .filter(Boolean)
          .join(', ');

        setFullAddress(completeAddress);
        setSelectedLocation(completeAddress);
      }
    } catch (error: any) {
      setLocationError('Could not determine your location');
      setSelectedLocation('Enable GPS to get location');
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to fetch your location. Please enable GPS and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: getCurrentLocation },
        ]
      );
    } finally {
      setIsLocating(false);
    }
  };

  const findNearestSellers = async () => {
    console.log('🎯 FYM button clicked - PLACING ORDER');

    if (prescriptionImages.length === 0 && cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add some medicines to your cart before placing an order.');
      return;
    }

    if (!userCoordinates) {
      Alert.alert(
        'Location Required',
        'Please enable GPS to set your delivery location.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable GPS', onPress: getCurrentLocation },
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      let buyerId = await AsyncStorage.getItem('buyerId');
      const userStr = await AsyncStorage.getItem('user');

      if (!buyerId && userStr) {
        const user = JSON.parse(userStr);
        buyerId = user.id || user._id;
        if (buyerId) await AsyncStorage.setItem('buyerId', buyerId);
      }

      if (!token) {
        Alert.alert('Authentication Required', 'Please log in to place an order.');
        setLoading(false);
        return;
      }

      const finalBuyerId = buyerId || `buyer_${Date.now()}`;

      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append('buyerId', finalBuyerId);
      formData.append('items', JSON.stringify(cartItems.map((item) => ({
        medicineId: item.id,
        name: item.name,
        manufacturer: item.manufacturer,
        price: item.price,
        quantity: item.quantity,
      }))));
      formData.append('totalAmount', getTotalAmount().toString());
      formData.append('deliveryAddress', fullAddress || selectedLocation);
      formData.append('location', JSON.stringify({
        type: 'Point',
        coordinates: [userCoordinates.longitude, userCoordinates.latitude],
      }));

      // Append prescription images as files if any exist
      if (prescriptionImages.length > 0) {
        prescriptionImages.forEach((uri) => {
          const filename = uri.split('/').pop() || `prescription-${Date.now()}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          formData.append('prescriptionImages', {
            uri,
            name: filename,
            type: type,
          } as any);
        });
      }

      console.log('🚀 FYM - Placing order with FormData');

      const response = await axios.post(
        `${API_URL}/api/orders`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ FYM - Order placed successfully:', response.data);

      startSellerMatching(response.data?.order?._id || response.data?.orderId);

    } catch (error: any) {
      console.error('❌ FYM - Place order error:', error.response?.data || error.message);

      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      Alert.alert(
        'Order Failed',
        errorMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: findNearestSellers }
        ]
      );

    } finally {
      setLoading(false);
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      console.log('📸 Requesting gallery permissions...');

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload prescription.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      console.log('✅ Gallery permission granted, launching picker...');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUris = result.assets.map((asset) => asset.uri).filter(Boolean) as string[];
        setPrescriptionImages((prev) => [...prev, ...newUris]);
        Alert.alert('Success', `${newUris.length} prescription image${newUris.length > 1 ? 's' : ''} uploaded from gallery!`);
        console.log('✅ Prescription images set from gallery:', newUris);
      }
    } catch (error) {
      console.error('❌ Gallery error:', error);
      Alert.alert('Error', 'Failed to pick image from gallery. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      console.log('📷 Requesting camera permissions...');

      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow camera access to take a photo of your prescription.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      console.log('✅ Camera permission granted, launching camera...');

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPrescriptionImages((prev) => [...prev, asset.uri]);
        Alert.alert('Success', 'Prescription photo added successfully!');
        console.log('✅ Prescription image set from camera:', asset.uri);
      }
    } catch (error) {
      console.error('❌ Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleUploadPrescription = async () => {
    console.log('🔄 Upload prescription clicked, current images:', prescriptionImages.length);

    if (prescriptionImages.length > 0) {
      Alert.alert(
        'Prescription Uploaded',
        'You can add more prescription images or keep the existing ones.',
        [
          { text: 'Add more', onPress: () => showImagePickerOptions() },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      showImagePickerOptions();
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Upload Prescription',
      'Choose how to upload your prescription',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            console.log('📷 User selected: Take Photo');
            handleTakePhoto();
          }
        },
        {
          text: 'Choose from Gallery',
          onPress: () => {
            console.log('🖼️ User selected: Gallery');
            handleChooseFromGallery();
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addToCart = (medicine: Medicine) => {
    if (!medicine.inStock) {
      Alert.alert('Out of Stock', `${medicine.name} is currently out of stock.`);
      return;
    }

    console.log("medicine: ", medicine);
    console.log("current cart: ", cartItems);

    const existingItem = cartItems.find((item) => item._id === medicine._id);
    console.log("matching: ", existingItem);
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === medicine._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...medicine, quantity: 1 }]);
    }

    setCartCount((prev) => prev + 1);
    Alert.alert('Added to Cart', `${medicine.name} has been added to your cart.`);
  };

  const removeFromCart = (medicineId: string) => {
    const item = cartItems.find((item) => item.id === medicineId);
    if (!item) return;
    if (item.quantity > 1) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === medicineId ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
      setCartCount((prev) => prev - 1);
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== medicineId));
      setCartCount((prev) => prev - 1);
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const startSellerMatching = (orderId: string) => {
    setActiveOrderId(orderId);
    setMatchingStatus('pending');
    setCanScheduleOrder(false);
    setMatchingStartedAt(Date.now());
    setShowCart(false);
    setFindingSellerModal(true);
  };

  const clearPlacedOrderDraft = () => {
    setCartItems([]);
    setCartCount(0);
    setPrescriptionImages([]);
  };

  const handleCancelActiveOrder = () => {
    setCancelModalVisible(true);
  };

  const confirmCancelActiveOrder = async () => {
    if (!activeOrderId) return;
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.patch(
        `${API_URL}/api/orders/${activeOrderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        Alert.alert('Order Cancelled', 'Your order has been cancelled.');
        closeMatchingModal();
      }
    } catch (error: any) {
      console.error('Cancel order error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
      setCancelModalVisible(false);
    }
  };

  const handleScheduleActiveOrder = async (scheduledDate?: Date) => {
    if (!activeOrderId) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const payload = scheduledDate ? { scheduledFor: scheduledDate.toISOString() } : {};

      const response = await axios.patch(
        `${API_URL}/api/orders/${activeOrderId}/schedule`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setMatchingStatus('scheduled');
        clearPlacedOrderDraft();
        setScheduleModalVisible(false);
        Alert.alert('Order Scheduled', scheduledDate
          ? `Your order is scheduled for ${scheduledDate.toLocaleString()}.`
          : 'Your order is now visible to all sellers until the deadline.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to schedule order');
    } finally {
      setLoading(false);
    }
  };

  const confirmSchedule = () => {
    if (!activeOrderId) return;

    const finalDate = new Date(selectedDate);
    finalDate.setHours(21, 0, 0, 0); // 9:00 PM

    handleScheduleActiveOrder(finalDate);
  };


  const closeMatchingModal = () => {
    if (matchingStatus !== 'pending') {
      clearPlacedOrderDraft();
    }
    setFindingSellerModal(false);
  };

  const placeOrder = async () => {
    console.log('🛒 Place Order button clicked');

    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add some medicines to your cart before placing an order.');
      return;
    }

    if (!userCoordinates) {
      Alert.alert(
        'Location Required',
        'Please enable GPS to set delivery location.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable GPS', onPress: getCurrentLocation },
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const buyerId = await AsyncStorage.getItem('buyerId');

      if (!token) {
        Alert.alert('Authentication Required', 'Please log in to place an order.');
        setLoading(false);
        return;
      }

      const finalBuyerId = buyerId || `buyer_${Date.now()}`;

      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append('buyerId', finalBuyerId);
      formData.append('items', JSON.stringify(cartItems.map((item) => ({
        medicineId: item.id,
        name: item.name,
        manufacturer: item.manufacturer,
        price: item.price,
        quantity: item.quantity,
      }))));
      formData.append('totalAmount', getTotalAmount().toString());
      formData.append('deliveryAddress', fullAddress || selectedLocation);
      formData.append('location', JSON.stringify({
        type: 'Point',
        coordinates: [userCoordinates.longitude, userCoordinates.latitude],
      }));

      // Append prescription images as files if any exist
      if (prescriptionImages.length > 0) {
        prescriptionImages.forEach((uri) => {
          const filename = uri.split('/').pop() || `prescription-${Date.now()}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          formData.append('prescriptionImages', {
            uri,
            name: filename,
            type: type,
          } as any);
        });
      }

      console.log('🚀 FYM - Placing order with FormData');

      const response = await axios.post(
        `${API_URL}/api/orders`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ Order placed successfully:', response.data);

      startSellerMatching(response.data?.order?._id || response.data?.orderId);

    } catch (error: any) {
      console.error('❌ Place order error:', error.response?.data || error.message);

      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      Alert.alert('Order Failed', errorMessage);

    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines && Array.isArray(medicines)
    ? medicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(searchText.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchText.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setShowSuggestions(text.length > 0);
  };

  const getActiveMatchingOption = () => {
    const optionsList = matchingOptions && matchingOptions.length > 0 ? matchingOptions : DEFAULT_MATCHING_OPTIONS;
    if (!matchingStartedAt) return optionsList[0];
    const elapsedSeconds = (Date.now() - matchingStartedAt) / 1000;
    const tierIndex = Math.min(Math.floor(elapsedSeconds / 70), optionsList.length - 1);
    return optionsList[Math.max(0, tierIndex)];
  };

  const currentOption = getActiveMatchingOption();
  const currentRadiusKm = currentOption ? (currentOption.r / 1000).toFixed(0) : '2';
  const currentDiscountText = currentOption ? currentOption.discount.join(', ') : '15, 20';

  const getMatchingStatusMessage = () => {
    if (!matchingStartedAt) return '';
    const elapsedSeconds = (Date.now() - matchingStartedAt) / 1000;
    if (elapsedSeconds < 60) {
      return "Sending request to 2 km radius and 20% discount offering pharmacies";
    }
    if (elapsedSeconds < 120) {
      return "Sending request to 2 km radius and 15-20% discount offering pharmacies";
    }
    if (elapsedSeconds < 180) {
      return "Sending request to 3 km radius & 10-20% discount offering pharmacies";
    }
    if (elapsedSeconds < 240) {
      return "Sending request to 5 km radius & 0-20% discount offering pharmacies";
    }
    return "Sending request to 5 km radius & 10-20% discount offering pharmacies";
  };

  return (
    <View style={styles.mainContainer}>
      {/* Location Selection Map Modal */}
      <Modal visible={showMap} animationType="slide">
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={true}
            onRegionChangeComplete={setMapRegion}
          >
            {userCoordinates && (
              <Marker coordinate={userCoordinates}>
                <View style={styles.markerContainer}>
                  <View style={styles.markerPin}>
                    <Ionicons name="medkit" size={24} color="#FF6B6B" />
                  </View>
                  <View style={styles.markerPointer} />
                </View>
              </Marker>
            )}
          </MapView>

          <View style={styles.mapControls}>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={getCurrentLocation}
              disabled={isLocating || loading}
            >
              {isLocating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="navigate" size={24} color="#FFFFFF" />
              )}
              <Text style={styles.mapButtonText}>{isLocating ? 'Locating...' : 'My Location'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mapButton, styles.confirmButton]}
              onPress={() => setShowMap(false)}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>

          {locationError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{locationError}</Text>
            </View>
          )}
        </View>
      </Modal>

      {/* Nearest Sellers Map Modal */}
      <Modal visible={showNearestSellers} animationType="slide">
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              ...userCoordinates || DEFAULT_REGION,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            {userCoordinates && (
              <Marker coordinate={userCoordinates}>
                <View style={styles.userMarker}>
                  <Ionicons name="person" size={24} color="#2ec5b6" />
                </View>
              </Marker>
            )}

            {nearestSellers.map((seller) => (
              <Marker key={seller.id} coordinate={seller.coordinates}>
                <View style={styles.sellerMarker}>
                  <Ionicons name="medkit" size={24} color="#FF6B6B" />
                </View>
              </Marker>
            ))}
          </MapView>

          <View style={styles.sellersListContainer}>
            <View style={styles.sellersListHeader}>
              <Text style={styles.sellersListTitle}>Nearest Sellers ({nearestSellers.length})</Text>
              <TouchableOpacity onPress={() => setShowNearestSellers(false)} disabled={loading}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2ec5b6" />
                <Text style={styles.loadingText}>Loading sellers...</Text>
              </View>
            ) : nearestSellers.length === 0 ? (
              <View style={styles.noSellersContainer}>
                <Ionicons name="sad-outline" size={48} color="#666666" />
                <Text style={styles.noSellersText}>No sellers found nearby</Text>
                <Text style={styles.noSellersSubText}>Try searching in a different area</Text>
              </View>
            ) : (
              <ScrollView style={styles.sellersList}>
                {nearestSellers.map((seller) => (
                  <TouchableOpacity
                    key={seller.id}
                    style={styles.sellerCard}
                    onPress={() => {
                      setMapRegion({
                        ...seller.coordinates,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      });
                    }}
                  >
                    <View style={styles.sellerInfo}>
                      <Text style={styles.sellerName}>{seller.name}</Text>
                      <View style={styles.sellerDetails}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.sellerRating}>{seller.rating}</Text>
                        <Text style={styles.sellerDistance}>{seller.distance} away</Text>
                      </View>
                      <Text style={styles.sellerAddress}>{seller.address}</Text>
                    </View>
                    <View style={styles.selectSellerButton}>
                      <Text style={styles.selectSellerText}>View</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={[styles.confirmSellerButton, nearestSellers.length === 0 && styles.disabledButton]}
              onPress={() => setShowNearestSellers(false)}
              disabled={loading}
            >
              <Text style={styles.confirmSellerButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cart Modal */}
      {showCart && (
        <Modal animationType="slide">
          <View style={styles.cartModal}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Your Cart</Text>
              <TouchableOpacity
                onPress={() => setShowCart(false)}
                style={styles.closeCartButton}
                disabled={loading}
              >
                <Ionicons name="close" size={24} color="#2ec5b6" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2ec5b6" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            ) : cartItems.length === 0 ? (
              <View style={styles.emptyCartContainer}>
                <Ionicons name="bag-outline" size={64} color="#9ADFD7" />
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
                <Text style={styles.emptyCartSubText}>Add some medicines to get started</Text>
                <TouchableOpacity
                  style={styles.continueShopping}
                  onPress={() => setShowCart(false)}
                >
                  <Text style={styles.continueShoppingText}>Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {prescriptionImages.length > 0 && (
                  <View style={styles.cartPrescriptionBox}>
                    <View style={styles.cartPrescriptionHeader}>
                      <Ionicons name="document-attach" size={18} color="#2ec5b6" />
                      <Text style={styles.cartPrescriptionTitle}>{`Prescription${prescriptionImages.length > 1 ? 's' : ''} added`}</Text>
                    </View>
                    <View style={styles.prescriptionImageList}>
                      {prescriptionImages.map((uri, index) => (
                        <View key={`${uri}-${index}`} style={styles.prescriptionImageItem}>
                          <Image source={{ uri }} style={styles.cartPrescriptionImage} resizeMode="contain" />
                          <TouchableOpacity
                            style={styles.removePrescriptionButton}
                            onPress={() => setPrescriptionImages((prev) => prev.filter((_, i) => i !== index))}
                          >
                            <Text style={styles.removePrescriptionText}>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    <View style={styles.prescriptionActions}>
                      <TouchableOpacity onPress={handleUploadPrescription} style={styles.changePrescriptionButton}>
                        <Text style={styles.changePrescriptionText}>Add more</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <ScrollView style={styles.cartItemsList}>
                  {cartItems.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemName}>{item.name}</Text>
                        <Text style={styles.cartItemManufacturer}>by {item.manufacturer}</Text>
                        <Text style={styles.cartItemPrice}>₹{item.price} each</Text>
                      </View>

                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => removeFromCart(item.id)}
                        >
                          <Ionicons name="remove" size={20} color="#2ec5b6" />
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => addToCart(item)}
                        >
                          <Ionicons name="add" size={20} color="#2ec5b6" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.cartItemTotal}>₹{item.price * item.quantity}</Text>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.cartFooter}>
                  <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Subtotal:</Text>
                      <Text style={styles.totalValue}>₹{getTotalAmount()}</Text>
                    </View>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Delivery:</Text>
                      <Text style={styles.deliveryFree}>FREE</Text>
                    </View>
                    <View style={[styles.totalRow, styles.grandTotalRow]}>
                      <Text style={styles.grandTotalLabel}>Total:</Text>
                      <Text style={styles.grandTotalValue}>₹{getTotalAmount()}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.placeOrderButton, loading && styles.disabledButton]}
                    onPress={placeOrder}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    <Ionicons name="card" size={20} color="#000000" />
                    <Text style={styles.placeOrderText}>Place Order</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </Modal>
      )}

      {/* Seller Matching Modal */}
      <Modal visible={findingSellerModal} animationType="slide" transparent>
        <View style={styles.matchingOverlay}>
          <View style={styles.matchingPanel}>
            <View style={styles.matchingIconWrap}>
              {matchingStatus === 'pending' ? (
                <Ionicons name="search" size={42} color="#2ec5b6" />
              ) : (
                <Ionicons
                  name={matchingStatus === 'scheduled' ? 'calendar' : 'checkmark-circle'}
                  size={42}
                  color="#2ec5b6"
                />
              )}
            </View>

            <Text style={styles.matchingTitle}>
              {matchingStatus === 'pending'
                ? 'Finding your medicine'
                : matchingStatus === 'scheduled'
                  ? 'Order scheduled'
                  : 'Seller found'}
            </Text>

            {matchingStatus === 'pending' && (
              <>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${matchProgress * 100}%` }]} />
                </View>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>Searching nearby pharmacies...</Text>
                </View>
              </>
            )}

            <Text style={styles.matchingSubtitle}>
              {matchingStatus === 'pending'
                ? getMatchingStatusMessage()
                : matchingStatus === 'scheduled'
                  ? 'Every seller can now see this order until the deadline.'
                  : `Your order is ${matchingStatus.replace(/_/g, ' ')}. You can track it in Orders.`}
            </Text>

            {/* {activeOrderId && (
              <Text style={styles.matchingOrderId}>Order #{activeOrderId.slice(-8).toUpperCase()}</Text>
            )} */}

            {matchingStatus === 'pending' && (
              <View style={styles.searchingNoteContainer}>
                <Ionicons name="information-circle-outline" size={16} color="#64748B" />
                <Text style={styles.searchingNote}>You'll be notified as soon as a pharmacy accepts.</Text>
              </View>
            )}

            {matchingStatus !== 'pending' && (
              <TouchableOpacity
                style={styles.viewOrdersButton}
                onPress={() => {
                  closeMatchingModal();
                  router.push('/(tabs)/orders');
                }}
              >
                <Text style={styles.viewOrdersButtonText}>View Orders</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.matchingSecondaryButton, matchingStatus === 'pending' && { borderColor: '#EF4444', borderWidth: 1 }]}
              onPress={matchingStatus === 'pending' ? handleCancelActiveOrder : closeMatchingModal}
            >
              <Text style={[styles.matchingSecondaryText, matchingStatus === 'pending' && { color: '#EF4444' }]}>
                {matchingStatus === 'pending' ? 'Cancel Order' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Custom Cancel Confirmation Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.customAlertOverlay}>
          <View style={styles.customAlertContent}>
            <View style={styles.customAlertIcon}>
              <Ionicons name="warning" size={36} color="#EF4444" />
            </View>
            <Text style={styles.customAlertTitle}>Cancel Order</Text>
            <Text style={styles.customAlertMessage}>
              Are you sure you want to cancel this order?
            </Text>
            <View style={styles.customAlertButtons}>
              <TouchableOpacity
                style={[styles.customAlertButton, styles.customAlertKeepBtn]}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.customAlertKeepText}>No, Keep Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.customAlertButton, styles.customAlertConfirmBtn]}
                onPress={confirmCancelActiveOrder}
              >
                <Text style={styles.customAlertConfirmText}>Yes, Cancel Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Main App Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => setShowMap(true)}
            activeOpacity={0.8}
            disabled={loading}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={18} color="#2ec5b6" />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>
              {isLocating ? 'Detecting location...' : selectedLocation}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#2ec5b6" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => setShowCart(true)}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Ionicons name="bag-handle" size={24} color="#FFFFFF" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Find Your Medicine</Text>
          <Text style={styles.welcomeSubText}>Quick, reliable, and delivered to your door</Text>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color="#2ec5b6" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search medicines, brands, conditions..."
              placeholderTextColor="#666666"
              value={searchText}
              onChangeText={handleSearchChange}
              onFocus={handleSearchFocus}
              editable={!loading}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setShowSuggestions(false);
                }}
                style={styles.clearButton}
                disabled={loading}
              >
                <Ionicons name="close-circle" size={20} color="#666666" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.fymButton, loading && styles.disabledButton]}
            activeOpacity={0.8}
            onPress={findNearestSellers}
            disabled={loading}
          >
            <Ionicons name="sparkles" size={18} color="#000000" />
            <Text style={styles.fymButtonText}>FYM</Text>
          </TouchableOpacity>
        </View>

        {showSuggestions && (
          <View style={styles.medicineResultsContainer}>
            <View style={styles.resultsHeader}>
              <View style={styles.resultsHeaderRow}>
                <Text style={styles.resultsTitle}>
                  {searchText ? `Results for "${searchText}"` : 'Popular Medicines'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                    setShowSuggestions(false);
                  }}
                  style={styles.cutButton}
                  disabled={loading}
                >
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultsCount}>{filteredMedicines.length} medicines found</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.noResultsText}>Loading medicines...</Text>
              </View>
            ) : (
              <View
                style={styles.medicineList}
              >
                {filteredMedicines.map((medicine) => (
                  <View key={medicine._id} style={styles.medicineItem}>
                    <View style={styles.medicineInfo}>
                      <View style={styles.medicineHeader}>
                        <Text style={styles.medicineName}>{medicine.name}</Text>
                        <View
                          style={[styles.stockBadge, !medicine.inStock && styles.outOfStockBadge]}
                        >
                          <Text
                            style={[styles.stockText, !medicine.inStock && styles.outOfStockText]}
                          >
                            {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.manufacturerText}>by {medicine.manufacturer}</Text>

                      <View style={styles.medicineDetails}>
                        <View style={styles.categoryTag}>
                          <Text style={styles.categoryText}>{medicine.category}</Text>
                        </View>
                        <Text style={styles.priceText}>₹{medicine.price}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.addToCartButton, !medicine.inStock && styles.disabledButton]}
                      onPress={() => addToCart(medicine)}
                      disabled={!medicine.inStock || loading}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={medicine.inStock ? 'add-circle' : 'ban'}
                        size={24}
                        color={medicine.inStock ? '#2ec5b6' : '#666'}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                {filteredMedicines.length === 0 && searchText.length > 0 && (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search" size={48} color="#9ADFD7" />
                    <Text style={styles.noResultsText}>No medicines found</Text>
                    <Text style={styles.noResultsSubText}>Try searching with different keywords</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {!showSuggestions && (
          <>
            <View style={styles.cardsSection}>
              <Text style={styles.sectionTitle}>How would you like to get started?</Text>

              <View style={styles.cardRow}>
                <TouchableOpacity
                  style={styles.bigCard}
                  activeOpacity={0.8}
                  onPress={handleUploadPrescription}
                  disabled={loading}
                >
                  <View style={styles.cardIconContainer}>
                    <View style={styles.cardIconBg}>
                      <Ionicons name="camera" size={32} color="#000000" />
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>Upload Prescription</Text>
                  <Text style={styles.cardSubText}>
                    {prescriptionImages.length > 0 ? 'Prescription uploaded!' : 'Take a photo or upload your prescription'}
                  </Text>
                  {prescriptionImages.length > 0 && (
                    <Image
                      source={{ uri: prescriptionImages[0] }}
                      style={styles.prescriptionPreview}
                      resizeMode="contain"
                    />
                  )}
                  <View style={styles.cardAction}>
                    <Text style={styles.cardActionText}>
                      {prescriptionImages.length > 0 ? 'Change Prescription' : 'Get Started'}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#2ec5b6" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bigCard} activeOpacity={0.8} disabled={loading}>
                  <View style={styles.cardIconContainer}>
                    <View style={styles.cardIconBg}>
                      <Ionicons name="chatbubble-ellipses" size={32} color="#000000" />
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>Need Help?</Text>
                  <Text style={styles.cardSubText}>
                    Chat with our pharmacists or get medicine recommendations
                  </Text>
                  <View style={styles.cardAction}>
                    <Text style={styles.cardActionText}>Talk to Expert</Text>
                    <Ionicons name="arrow-forward" size={16} color="#2ec5b6" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading} onPress={() => router.push('/(tabs)/orders')}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="repeat" size={20} color="#000000" />
                  </View>
                  <Text style={styles.quickActionText}>Reorder</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading} onPress={() => Alert.alert('Wishlist', 'Wishlist support will be available soon.')}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="heart" size={20} color="#000000" />
                  </View>
                  <Text style={styles.quickActionText}>Wishlist</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading} onPress={() => router.push('/(tabs)/orders')}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="time" size={20} color="#000000" />
                  </View>
                  <Text style={styles.quickActionText}>Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading} onPress={() => Alert.alert('Support', 'Contact support: +91-XXXXXXXXXX')}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="call" size={20} color="#000000" />
                  </View>
                  <Text style={styles.quickActionText}>Support</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {loading && (
        <View style={styles.globalLoading}>
          <ActivityIndicator size="large" color="#2ec5b6" />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      )}

      {/* Schedule Order Modal */}
      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.scheduleModalOverlay}>
          <View style={styles.scheduleModalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Schedule Delivery</Text>
                {activeOrderId && (
                  <Text style={styles.modalOrderId}>Order #{activeOrderId.slice(-8).toUpperCase()}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => setScheduleModalVisible(false)}>
                <Ionicons name="close" size={24} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Select a date for your delivery (by evening 9pm)</Text>

            <Text style={styles.sectionLabel}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelector}>
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                const isSelected = d.toDateString() === selectedDate.toDateString();
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.dateItem, isSelected && styles.dateItemActive]}
                    onPress={() => setSelectedDate(d)}
                  >
                    <Text style={[styles.dateDay, isSelected && styles.dateTextActive]}>
                      {i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' })}
                    </Text>
                    <Text style={[styles.dateNumber, isSelected && styles.dateTextActive]}>
                      {d.getDate()}
                    </Text>
                    <Text style={[styles.dateMonth, isSelected && styles.dateTextActive]}>
                      {d.toLocaleDateString('en-IN', { month: 'short' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setScheduleModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scheduleConfirmBtn}
                onPress={confirmSchedule}
              >
                <Text style={styles.scheduleConfirmBtnText}>Confirm Delivery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default HomeScreen;










