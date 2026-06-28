import React, { useState, useEffect, useRef, useCallback } from "react";
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
  BackHandler,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { Audio } from "expo-av";
import { io as socketIO, Socket } from "socket.io-client";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;
const API_BASE_URL = `${API_URL}/api/orders`;
const BUYER_TIMEOUT_MS = 5 * 60 * 1000; // fallback if server doesn't send timeRemaining

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


const SellerDashboard = () => {
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<{[key: string]: boolean}>({});

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => {} },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                console.log('🔄 Clearing stored data and logging out...');
                await AsyncStorage.multiRemove(['sellerToken', 'sellerInfo']);
                router.replace('/(auth)/seller-login');
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

  // const fetchPendingOrders = async () => {
  //   try {
  //     setLoading(true);
  //     const token = await AsyncStorage.getItem('sellerToken');
  //     if (!token) return;

  //     const res = await axios.get(API_BASE_URL, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     const allOrders = res.data || [];
  //     const pending = allOrders.filter((order: any) => order.status === 'pending');
      
  //     // Check for new orders
  //     if (
  //       pending.length > previousOrderCountRef.current &&
  //       previousOrderCountRef.current > 0
  //     ) {
  //       Vibration.vibrate([0, 400, 200, 400]);
  //       playNotificationSound();   // 🔊 ADD THIS
  //       Alert.alert("🔔 New Order Alert!", "You have new orders!");
  //     }

  //     previousOrderCountRef.current = pending.length;

  //     const withExpiry = pending.map((o: any) => ({
  //       ...o,
  //       expiry: Date.now() + ORDER_TIMEOUT,
  //     }));

  //     setPendingOrders(withExpiry);
  //   } catch (err) {
  //     console.error('❌ Error fetching orders:', err);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  const fetchPendingOrders = async (showLoader = false) => {
  try {
    if (showLoader) setLoading(true);

    const token = await AsyncStorage.getItem("sellerToken");
    if (!token) return;

    const res = await axios.get(API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const pending = (res.data || []).filter((o: any) => o.status === "pending");

    // 🔔 New order detection
    if (
      pending.length > previousOrderCountRef.current &&
      previousOrderCountRef.current > 0
    ) {
      Vibration.vibrate([0, 400, 200, 400]);
      playNotificationSound();
    }

    previousOrderCountRef.current = pending.length;

    setPendingOrders(prev => {
      // preserve existing expiry timers if order already exists
      const prevMap = new Map(prev.map(o => [o._id, o]));

      return pending.map((o: any) => {
        const existing = prevMap.get(o._id);
        // Use server-provided timeRemaining (ms), or fallback
        const serverTimeout = typeof o.timeRemaining === 'number' ? o.timeRemaining : BUYER_TIMEOUT_MS;
        return {
          ...o,
          expiry: existing?.expiry || Date.now() + serverTimeout,
          initialTimeout: existing?.initialTimeout || serverTimeout,
        };
      });
    });

  } catch (err) {
    console.log(err);
  } finally {
    setInitialLoading(false);
    setLoading(false);
    setRefreshing(false);
  }
};

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPendingOrders();
  };

  useEffect(() => {
    fetchPendingOrders(true); // show loader only first time

    const interval = setInterval(() => {
      fetchPendingOrders(false); // silent refresh (now returns filtered results)
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Socket.IO: real-time newOrder notifications
  useEffect(() => {
    let socket: Socket | null = null;

    const connectSocket = async () => {
      try {
        const token = await AsyncStorage.getItem("sellerToken");
        if (!token || !API_URL) return;

        // Decode seller ID from JWT (payload is the second base64 segment)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const sellerId = payload.sellerId || payload.id;
        if (!sellerId) {
          console.log("⚠️ Could not extract sellerId from token");
          return;
        }

        socket = socketIO(API_URL, {
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 3000,
        });

        socket.on("connect", () => {
          console.log("⚡ Socket connected:", socket?.id);
          socket?.emit("joinSeller", sellerId);
        });

        socket.on("newOrder", (order: any) => {
          console.log("🔔 New order via Socket.IO:", order._id);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

          setPendingOrders((prev) => {
            // Avoid duplicates
            if (prev.some((o) => o._id === order._id)) return prev;
            // Use server-provided timeRemaining (ms), or fallback
            const serverTimeout = typeof order.timeRemaining === 'number' ? order.timeRemaining : BUYER_TIMEOUT_MS;
            return [
              { ...order, expiry: Date.now() + serverTimeout, initialTimeout: serverTimeout },
              ...prev,
            ];
          });

          Vibration.vibrate([0, 400, 200, 400]);
          playNotificationSound();
        });

        socket.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
        });
      } catch (err) {
        console.log("⚠️ Socket.IO connection error:", err);
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("🔌 Socket.IO cleanup: disconnected");
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPendingOrders((prev) => prev.filter((order) => Date.now() < order.expiry));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const TimerBar = ({ expiry, initialTimeout }: { expiry: number; initialTimeout?: number }) => {
    const [remaining, setRemaining] = useState(expiry - Date.now());
    const timeout = initialTimeout || BUYER_TIMEOUT_MS;
    useEffect(() => {
      const interval = setInterval(() => setRemaining(expiry - Date.now()), 1000);
      return () => clearInterval(interval);
    }, [expiry]);

    const progress = Math.max(0, remaining / timeout);
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
  const getPrescriptionImageUrl = (imagePath: string | null): string | null => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it starts with /uploads/, prepend API_URL
    if (imagePath.startsWith('/uploads/')) {
      return `${API_URL}${imagePath}`;
    }
    
    // Otherwise, assume it's just a filename
    return `${API_URL}/uploads/${imagePath}`;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.orderToggleContainer}>
          <Text style={styles.orderToggleLabel}>
            Recieve Orders
          </Text>
          <Switch
            trackColor={{ false: "#EF4444", true: "#22C55E" }}
            thumbColor="#FFFFFF"
            onValueChange={toggleOrderStatus}
            value={isAcceptingOrders}
          />
        </View>
      </View>

      {isAcceptingOrders && (
        <View style={styles.ordersContainer}>
            {initialLoading ? (
              <ActivityIndicator size="large" color="#3B82F6" />
            ) : pendingOrders.length === 0 ? (
              <Text>No Pending Orders</Text>
            ) : (
            pendingOrders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const hasImageError = imageLoadError[order._id];

              return (
                <TouchableOpacity
                  key={order._id}
                  style={styles.orderCard}
                  onPress={() => toggleExpand(order._id)}
                >
                  <View style={styles.rowBetween}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.customerName}>
                        {order.buyerId?.name || "Customer"}
                      </Text>
                      <Text style={styles.productName}>
                        {order.items?.map((i: any) => `${i.name} (Qty: ${i.quantity})`).join(", ")}
                      </Text>
                    </View>
                    <View style={styles.rightMeta}>
                      <Text style={styles.amount}>₹{order.totalAmount}</Text>
                    </View>
                  </View>

                  <TimerBar expiry={order.expiry} initialTimeout={order.initialTimeout} />

                  {isExpanded && (
                    <View style={styles.expandedSection}>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailText}>
                          <Text style={styles.detailLabel}>📍 Delivery Address: </Text>
                          {order.deliveryAddress || "N/A"}
                        </Text>
                        {order.buyerId?.mobile && (
                          <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>📞 Contact: </Text>
                            {order.buyerId.mobile}
                          </Text>
                        )}
                      </View>

                      {/* ✅ PRESCRIPTION IMAGES DISPLAY */}
                      {((order.prescriptionImages && order.prescriptionImages.length > 0) || order.prescriptionImage) && (
                        <View style={styles.prescriptionContainer}>
                          <Text style={styles.detailLabel}>Prescriptions:</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                            {order.prescriptionImages && order.prescriptionImages.length > 0 ? (
                              order.prescriptionImages.map((img: string, idx: number) => {
                                const imgUrl = getPrescriptionImageUrl(img);
                                if (!imgUrl) return null;
                                return (
                                  <TouchableOpacity 
                                    key={idx}
                                    onPress={() => openImagePreview(imgUrl)}
                                    style={{ marginRight: 8 }}
                                  >
                                    <Image
                                      source={{ uri: imgUrl }}
                                      style={styles.prescriptionThumbnail}
                                      resizeMode="cover"
                                    />
                                  </TouchableOpacity>
                                );
                              })
                            ) : (
                              (() => {
                                const imgUrl = getPrescriptionImageUrl(order.prescriptionImage);
                                if (!imgUrl || hasImageError) return null;
                                return (
                                  <TouchableOpacity 
                                    onPress={() => openImagePreview(imgUrl)}
                                  >
                                    <Image
                                      source={{ uri: imgUrl }}
                                      style={styles.prescriptionThumbnail}
                                      onError={() => handleImageError(order._id)}
                                      resizeMode="cover"
                                    />
                                  </TouchableOpacity>
                                );
                              })()
                            )}
                          </ScrollView>
                        </View>
                      )}

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
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" // Slate 50
  },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: '#14B8A6', // Primary Teal
    marginTop: 4,
    fontWeight: '600',
  },
  orderToggleContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: 20, 
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderToggleLabel: { 
    fontSize: 16, 
    fontWeight: "700",
    color: '#1E293B',
  },
  ordersContainer: { 
    padding: 16 
  },
  orderCard: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  rowBetween: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  customerName: { 
    fontSize: 17, 
    fontWeight: "bold",
    color: '#0F172A',
  },
  productName: { 
    fontSize: 14, 
    color: "#64748B",
    marginTop: 4,
  },
  rightMeta: { 
    alignItems: "flex-end" 
  },
  amount: { 
    fontSize: 18, 
    fontWeight: "800",
    color: '#14B8A6',
  },
  timerBarBackground: { 
    height: 24, 
    backgroundColor: "#F1F5F9", 
    borderRadius: 12, 
    marginTop: 16, 
    flexDirection: "row",
    overflow: 'hidden',
  },
  timerBarFill: { 
    backgroundColor: "#14B8A6", 
    height: "100%" 
  },
  timerText: { 
    position: "absolute", 
    alignSelf: "center", 
    width: "100%", 
    textAlign: "center",
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  expandedSection: { 
    marginTop: 16, 
    borderTopWidth: 1, 
    borderTopColor: "#F1F5F9", 
    paddingTop: 16 
  },
  detailLabel: { 
    fontWeight: "700", 
    color: "#0F172A" 
  },
  detailBox: { 
    backgroundColor: "#F8FAFC", 
    padding: 14, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailText: { 
    fontSize: 14, 
    color: "#475569", 
    marginBottom: 6 
  },
  actionsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 16,
    gap: 12,
  },
  actionButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center", 
  },
  acceptButton: { 
    backgroundColor: "#14B8A6",
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  rejectButton: { 
    backgroundColor: "#EF4444",
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: { 
    color: "#FFFFFF", 
    fontSize: 15, 
    fontWeight: "700" 
  },
  prescriptionContainer: { 
    marginTop: 12 
  },
  prescriptionThumbnail: { 
    width: 150, 
    height: 150, 
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  errorText: { 
    color: '#EF4444', 
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.95)', 
    justifyContent: 'center' 
  },
  modalCloseButton: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 24,
    zIndex: 10,
  },
  fullSizeImage: { 
    width: Dimensions.get('window').width, 
    height: Dimensions.get('window').height * 0.8 
  },
});

export default SellerDashboard;