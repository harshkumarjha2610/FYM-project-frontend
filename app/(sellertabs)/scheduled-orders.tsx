import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;
const API_BASE_URL = `${API_URL}/api/orders`;

const ScheduledOrdersScreen = () => {
  const [scheduledOrders, setScheduledOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchScheduledOrders = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const token = await AsyncStorage.getItem('sellerToken');
      if (!token) return;

      console.log('📥 Fetching scheduled orders...');
      const res = await axios.get(`${API_BASE_URL}/scheduled`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setScheduledOrders(res.data || []);
    } catch (err: any) {
      console.error('❌ Error fetching scheduled orders:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchScheduledOrders(false);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const token = await AsyncStorage.getItem('sellerToken');
      if (!token) return;

      const res = await axios.patch(
        `${API_BASE_URL}/${orderId}/respond`,
        { action: 'accept', status: 'accepted' },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      Alert.alert('Success! 🎉', 'Order accepted successfully!');
      fetchScheduledOrders(false);
    } catch (err: any) {
      console.error('❌ Error accepting scheduled order:', err.message);
      Alert.alert('Error', err.response?.data?.message || 'Failed to accept order');
    }
  };

  const openImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  const getImageUrl = (order: any): string | null => {
    if (!order.prescriptionImage) return null;
    if (order.prescriptionImage.startsWith('http')) return order.prescriptionImage;
    if (order.prescriptionImage.startsWith('/uploads/')) return `${API_URL}${order.prescriptionImage}`;
    return `${API_URL}/uploads/${order.prescriptionImage}`;
  };

  useEffect(() => {
    fetchScheduledOrders();
    const interval = setInterval(() => fetchScheduledOrders(false), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scheduled Orders</Text>
        <Text style={styles.headerSubtitle}>Public orders waiting for a seller</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#AF52DE" />}
      >
        <View style={styles.ordersContainer}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#AF52DE" style={{ marginTop: 40 }} />
          ) : scheduledOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Scheduled Orders</Text>
              <Text style={styles.emptySubtitle}>Scheduled orders will appear here for all sellers to accept</Text>
            </View>
          ) : (
            scheduledOrders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const imageUrl = getImageUrl(order);

              return (
                <View key={order._id} style={styles.orderCard}>
                  <TouchableOpacity
                    onPress={() => toggleExpand(order._id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.customerName}>
                          {order.buyerId?.name || "Customer"}
                        </Text>
                        <Text style={styles.productName}>
                          {order.items?.map((i: any) => i.name).join(", ")}
                        </Text>
                        <Text style={styles.timeTag}>
                          Scheduled: {new Date(order.scheduledAt || order.createdAt).toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.rightMeta}>
                        <Text style={styles.amount}>₹{order.totalAmount}</Text>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>SCHEDULED</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.expandedSection}>
                      <View style={styles.detailBox}>
                        <View style={styles.detailRow}>
                          <Ionicons name="location-outline" size={16} color="#64748B" />
                          <Text style={styles.detailText}>{order.deliveryAddress || "N/A"}</Text>
                        </View>
                        {order.buyerId?.mobile && (
                          <View style={styles.detailRow}>
                            <Ionicons name="call-outline" size={16} color="#64748B" />
                            <Text style={styles.detailText}>{order.buyerId.mobile}</Text>
                          </View>
                        )}
                      </View>
                      
                      {imageUrl && (
                        <View style={styles.imageContainer}>
                          <Text style={styles.label}>Prescription Preview:</Text>
                          <TouchableOpacity onPress={() => openImagePreview(imageUrl)}>
                            <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                          </TouchableOpacity>
                        </View>
                      )}

                      <TouchableOpacity 
                        style={styles.acceptButton}
                        onPress={() => handleAcceptOrder(order._id)}
                      >
                        <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.acceptButtonText}>Accept Order Now</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal visible={imageModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeModalButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
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
    color: '#64748B',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
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
    borderLeftWidth: 6, 
    borderLeftColor: '#AF52DE' // Purple for scheduled
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
    color: "#475569",
    marginTop: 4,
  },
  timeTag: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 6,
    fontWeight: '500',
  },
  rightMeta: { 
    alignItems: "flex-end" 
  },
  amount: { 
    fontSize: 18, 
    fontWeight: "800",
    color: '#AF52DE',
  },
  statusBadge: { 
    marginTop: 8, 
    backgroundColor: "#F5F3FF", 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  statusText: {
    fontSize: 10, 
    fontWeight: "800", 
    color: "#AF52DE",
    letterSpacing: 0.5,
  },
  expandedSection: { 
    marginTop: 16, 
    borderTopWidth: 1, 
    borderTopColor: "#F1F5F9", 
    paddingTop: 16 
  },
  detailBox: { 
    backgroundColor: "#F8FAFC", 
    padding: 14, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: { 
    fontSize: 14, 
    color: "#475569", 
    flex: 1,
  },
  imageContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 13,
    fontWeight: "700", 
    color: '#1E293B',
    marginBottom: 10 
  },
  thumbnail: { 
    width: '100%', 
    height: 180, 
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14B8A6',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.95)', 
    justifyContent: 'center' 
  },
  closeModalButton: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fullImage: { 
    width: Dimensions.get('window').width, 
    height: Dimensions.get('window').height * 0.8 
  },
});

export default ScheduledOrdersScreen;
