import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Vibration,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Audio } from "expo-av";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;
const API_BASE_URL = `${API_URL}/api/orders`;
const ORDER_TIMEOUT = 10 * 60 * 1000;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SellerDashboard = () => {
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<{[key: string]: boolean}>({});
  
  const previousOrderCountRef = useRef<number>(0);
  const notificationSound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/sounds/notification.mp3") // adjust path if needed
        );
        notificationSound.current = sound;
      } catch (e) {
        console.log("Error loading sound", e);
      }
    };

    loadSound();

    return () => {
      notificationSound.current?.unloadAsync();
    };
  }, []);

  const playNotificationSound = async () => {
    try {
      await notificationSound.current?.replayAsync();
    } catch (e) {
      console.log("Error playing sound", e);
    }
  };

  const openImagePreview = (imageUrl: string) => {
    // console.log('🖼️ Opening image preview:', imageUrl);
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  const handleImageError = (orderId: string) => {
    console.error('❌ Failed to load image for order:', orderId);
    setImageLoadError(prev => ({ ...prev, [orderId]: true }));
  };

  const toggleOrderStatus = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAcceptingOrders((prev) => !prev);
  };

  const toggleExpand = (orderId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleAccept = async (orderId: string) => {
    try {
      const token = await AsyncStorage.getItem('sellerToken');
      if (!token) {
        Alert.alert('Authentication Required', 'Please login again');
        return;
      }
      
      const res = await axios.patch(
        `${API_BASE_URL}/${orderId}/respond`,
        { action: 'accept', status: 'accepted' },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setPendingOrders((prev) => prev.filter((order) => order._id !== orderId));
      Alert.alert('Success! 🎉', 'Order accepted successfully!');
      
    } catch (err: any) {
      console.error('❌ Error accepting order:', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Failed to accept order');
      fetchPendingOrders();
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      const token = await AsyncStorage.getItem('sellerToken');
      const res = await axios.patch(
        `${API_BASE_URL}/${orderId}/respond`,
        { action: 'reject', status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setPendingOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err: any) {
      console.error('❌ Error rejecting order:', err);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('sellerToken');
      if (!token) return;

      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allOrders = res.data || [];
      const pending = allOrders.filter((order: any) => order.status === 'pending');
      
      // Check for new orders
      if (
        pending.length > previousOrderCountRef.current &&
        previousOrderCountRef.current > 0
      ) {
        Vibration.vibrate([0, 400, 200, 400]);
        playNotificationSound();   // 🔊 ADD THIS
        Alert.alert("🔔 New Order Alert!", "You have new orders!");
      }

      previousOrderCountRef.current = pending.length;

      const withExpiry = pending.map((o: any) => ({
        ...o,
        expiry: Date.now() + ORDER_TIMEOUT,
      }));

      setPendingOrders(withExpiry);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPendingOrders();
  };

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPendingOrders((prev) => prev.filter((order) => Date.now() < order.expiry));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const TimerBar = ({ expiry }: { expiry: number }) => {
    const [remaining, setRemaining] = useState(expiry - Date.now());
    useEffect(() => {
      const interval = setInterval(() => setRemaining(expiry - Date.now()), 1000);
      return () => clearInterval(interval);
    }, [expiry]);

    const progress = Math.max(0, remaining / ORDER_TIMEOUT);
    return (
      <View style={styles.timerBarBackground}>
        <View style={[styles.timerBarFill, { flex: progress }]} />
        <Text style={styles.timerText}>
          {Math.floor(remaining / 60000)}:{String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0")}
        </Text>
      </View>
    );
  };

  // ✅ CRITICAL FIX: Properly construct image URL
  const getPrescriptionImageUrl = (order: any): string | null => {
    if (!order.prescriptionImage) return null;
    
    // If it's already a full URL, return as-is
    if (order.prescriptionImage.startsWith('http')) {
      return order.prescriptionImage;
    }
    
    // If it starts with /uploads/, prepend API_URL
    if (order.prescriptionImage.startsWith('/uploads/')) {
      return `${API_URL}${order.prescriptionImage}`;
    }
    
    // Otherwise, assume it's just a filename
    return `${API_URL}/uploads/${order.prescriptionImage}`;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Incoming Orders</Text>
          <Text style={styles.headerSubtitle}>🔔 Auto-refresh every 30s</Text>
        </View>
      </View>

      <View style={styles.orderToggleContainer}>
        <Text style={styles.orderToggleLabel}>
          {isAcceptingOrders ? "Accepting Orders ✅" : "Not Accepting Orders ❌"}
        </Text>
        <Switch
          trackColor={{ false: "#EF4444", true: "#22C55E" }}
          thumbColor="#FFFFFF"
          onValueChange={toggleOrderStatus}
          value={isAcceptingOrders}
        />
      </View>

      {isAcceptingOrders && (
        <View style={styles.ordersContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" />
          ) : pendingOrders.length === 0 ? (
            <Text>No Pending Orders</Text>
          ) : (
            pendingOrders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const prescriptionImageUrl = getPrescriptionImageUrl(order);
              const hasImageError = imageLoadError[order._id];

              return (
                <TouchableOpacity
                  key={order._id}
                  style={styles.orderCard}
                  onPress={() => toggleExpand(order._id)}
                >
                  <View style={styles.rowBetween}>
                    <View>
                      <Text style={styles.customerName}>
                        {order.buyer?.name || "Customer"}
                      </Text>
                      <Text style={styles.productName}>
                        {order.items?.map((i: any) => i.name).join(", ")}
                      </Text>
                    </View>
                    <View style={styles.rightMeta}>
                      <Text style={styles.amount}>₹{order.totalAmount}</Text>
                    </View>
                  </View>

                  <TimerBar expiry={order.expiry} />

                  {isExpanded && (
                    <View style={styles.expandedSection}>
                      {/* ✅ PRESCRIPTION IMAGE DISPLAY */}
                      {prescriptionImageUrl && !hasImageError ? (
                        <View style={styles.prescriptionContainer}>
                          <Text style={styles.detailLabel}>Prescription:</Text>
                          <TouchableOpacity 
                            onPress={() => openImagePreview(prescriptionImageUrl)}
                          >
                            <Image
                              source={{ uri: prescriptionImageUrl }}
                              style={styles.prescriptionThumbnail}
                              onError={() => handleImageError(order._id)}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : hasImageError ? (
                        <Text style={styles.errorText}>Failed to load image</Text>
                      ) : null}

                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.rejectButton]}
                          onPress={() => handleReject(order._id)}
                        >
                          <Text style={styles.actionText}>❌ Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.acceptButton]}
                          onPress={() => handleAccept(order._id)}
                        >
                          <Text style={styles.actionText}>✅ Accept</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      {/* Image Preview Modal */}
      <Modal visible={imageModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Text>✕ Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullSizeImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 20, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 12, color: '#22C55E' },
  orderToggleContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, backgroundColor: "#FFFFFF" },
  orderToggleLabel: { fontSize: 16, fontWeight: "600" },
  ordersContainer: { padding: 20 },
  orderCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, marginBottom: 16, elevation: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  customerName: { fontSize: 16, fontWeight: "bold" },
  productName: { fontSize: 14, color: "#4B5563" },
  rightMeta: { alignItems: "flex-end" },
  amount: { fontSize: 18, fontWeight: "700" },
  timerBarBackground: { height: 20, backgroundColor: "#F3F4F6", borderRadius: 12, marginTop: 12, flexDirection: "row" },
  timerBarFill: { backgroundColor: "#3B82F6", height: "100%" },
  timerText: { position: "absolute", alignSelf: "center", width: "100%", textAlign: "center" },
  expandedSection: { marginTop: 14, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 12 },
  detailLabel: { fontWeight: "600" },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  actionButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginHorizontal: 6 },
  acceptButton: { backgroundColor: "#22C55E" },
  rejectButton: { backgroundColor: "#EF4444" },
  actionText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  prescriptionContainer: { marginTop: 12 },
  prescriptionThumbnail: { width: '100%', height: 200, borderRadius: 12 },
  errorText: { color: '#EF4444', marginTop: 8 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center' },
  modalCloseButton: { position: 'absolute', top: 50, right: 20, backgroundColor: '#fff', padding: 10, borderRadius: 20 },
  fullSizeImage: { width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.8 },
});

export default SellerDashboard;