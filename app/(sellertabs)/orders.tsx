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
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;
const API_BASE_URL = `${API_URL}/api/orders`;

const AcceptedOrdersScreen = () => {
  const [acceptedOrders, setAcceptedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchAcceptedOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('sellerToken');
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/accepted`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAcceptedOrders(res.data || []);
    } catch (err: any) {
      console.error('âŒ Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAcceptedOrders();
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const openImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  // âœ… Helper to construct image URL
  const getImageUrl = (order: any): string | null => {
    if (!order.prescriptionImage) return null;
    if (order.prescriptionImage.startsWith('http')) return order.prescriptionImage;
    if (order.prescriptionImage.startsWith('/uploads/')) return `${API_URL}${order.prescriptionImage}`;
    return `${API_URL}/uploads/${order.prescriptionImage}`;
  };
  const getNextStatus = (status: string) => {
    const next: Record<string, string> = {
      accepted: 'packing',
      packing: 'waiting_for_rider',
      waiting_for_rider: 'out_for_delivery',
      out_for_delivery: 'delivered',
    };
    return next[status];
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = await AsyncStorage.getItem('sellerToken');
      if (!token) return;

      await axios.patch(
        `${API_BASE_URL}/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Updated', `Order marked as ${status.replace(/_/g, ' ')}`);
      fetchAcceptedOrders();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update order status');
    }
  };
  useEffect(() => {
    fetchAcceptedOrders();
    const interval = setInterval(fetchAcceptedOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Accepted Orders</Text>
      </View>

      <View style={styles.ordersContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#22C55E" />
        ) : acceptedOrders.length === 0 ? (
          <Text>No Accepted Orders</Text>
        ) : (
          acceptedOrders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            const imageUrl = getImageUrl(order);
            const nextStatus = getNextStatus(order.status || 'accepted');

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
                      {order.items?.map((i: any) => i.name).join(", ")}
                    </Text>
                  </View>
                  <View style={styles.rightMeta}>
                    <Text style={styles.amount}>â‚¹{order.totalAmount}</Text>
                    <Text style={styles.statusBadge}>{String(order.status || 'accepted').replace(/_/g, ' ').toUpperCase()}</Text>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.expandedSection}>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>ðŸ“ Delivery Address: </Text>
                        {order.deliveryAddress || "N/A"}
                      </Text>
                      {order.buyerId?.mobile && (
                        <Text style={styles.detailText}>
                          <Text style={styles.detailLabel}>ðŸ“ž Contact: </Text>
                          {order.buyerId.mobile}
                        </Text>
                      )}
                    </View>
                    
                    {/* âœ… Show prescription image in accepted orders too */}
                    {imageUrl && (
                      <View style={styles.imageContainer}>
                        <Text style={styles.label}>Prescription:</Text>
                        <TouchableOpacity onPress={() => openImagePreview(imageUrl)}>
                          <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                        </TouchableOpacity>
                      </View>
                    )}                    <View style={styles.itemsBox}>
                      <Text style={styles.label}>Order Items:</Text>
                      {order.items?.map((item: any, index: number) => (
                        <View key={`${order._id}-${index}`} style={styles.itemRow}>
                          <Text style={styles.itemName}>{item.name || item.medicine?.name || 'Medicine'}</Text>
                          <Text style={styles.itemMeta}>Qty {item.quantity} • ?{item.price}</Text>
                        </View>
                      ))}
                    </View>

                    {nextStatus && (
                      <TouchableOpacity
                        style={styles.statusUpdateButton}
                        onPress={() => updateOrderStatus(order._id, nextStatus)}
                      >
                        <Text style={styles.statusUpdateText}>
                          Mark as {nextStatus.replace(/_/g, ' ')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Image Modal */}
      <Modal visible={imageModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Text>âœ• Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </ScrollView>
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
    borderLeftColor: '#14B8A6' 
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
  statusBadge: { 
    marginTop: 8, 
    fontSize: 11, 
    fontWeight: "800", 
    backgroundColor: "#14B8A6", 
    color: "#FFFFFF", 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 12,
    letterSpacing: 0.5,
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
  imageContainer: { 
    marginTop: 12 
  },
  label: { 
    fontWeight: "700", 
    color: '#0F172A',
    marginBottom: 10 
  },
  thumbnail: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.95)', 
    justifyContent: 'center' 
  },
  closeButton: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 24,
    zIndex: 10,
  },
  fullImage: { 
    width: Dimensions.get('window').width, 
    height: Dimensions.get('window').height * 0.8 
  },
  itemsBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  itemName: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  itemMeta: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  statusUpdateButton: {
    backgroundColor: '#14B8A6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  statusUpdateText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
});

export default AcceptedOrdersScreen;




