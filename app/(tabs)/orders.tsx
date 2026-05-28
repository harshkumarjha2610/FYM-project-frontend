import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { io as socketIO, Socket } from 'socket.io-client';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface SellerInfo {
  _id: string;
  pharmacyName: string;
  address: string;
  phone?: string;
  ownerContact?: string;
  number?: string;
  email?: string;
}

interface Order {
  _id: string;
  buyerId: string;
  status: 'pending' | 'accepted' | 'confirmed' | 'packing' | 'waiting_for_rider' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'rejected' | 'scheduled';
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  prescriptionImage: string | null;
  scheduledAt: string | null;
  scheduledFor: string | null;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  seller?: SellerInfo;
}

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

export default function OrdersScreen() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [schedulingOrderId, setSchedulingOrderId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');


  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      let buyerId = await AsyncStorage.getItem('buyerId');
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');

      // Fallback: If buyerId is missing but user object exists, extract it
      if (!buyerId && userStr) {
        const user = JSON.parse(userStr);
        buyerId = user.id || user._id;
        if (buyerId) await AsyncStorage.setItem('buyerId', buyerId);
      }

      if (!buyerId || !token) {
        console.log('⚠️ Authentication data missing');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      console.log(`📥 Fetching orders for ${buyerId}...`);
      const response = await axios.get(`${API_URL}/api/orders/buyer/${buyerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      }
    } catch (error: any) {
      console.error('❌ Error fetching orders:', error.message);
      Alert.alert('Error', 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // Socket setup and 7-minute timer logic
  useEffect(() => {
    let socket: Socket | null = null;

    const setupSocket = async () => {
      try {
        const buyerId = await AsyncStorage.getItem('buyerId');
        const token = await AsyncStorage.getItem('token');
        if (!buyerId || !token || !API_URL) return;

        socket = socketIO(API_URL, {
          transports: ['websocket'],
          reconnection: true,
        });

        socket.on('connect', () => {
          console.log('⚡ Buyer socket connected:', socket?.id);
          socket?.emit('joinBuyer', buyerId);
        });

        socket.on('orderResponse', (data: any) => {
          console.log('🔔 Order response received:', data);
          fetchOrders(false);
        });

        socket.on('order-unaccepted', (data: any) => {
          console.log('⚠️ Order unaccepted alert:', data);
          setSchedulingOrderId(data.orderId);
          setScheduleModalVisible(true);
          fetchOrders(false);
        });

      } catch (err) {
        console.error('⚠️ Socket setup error:', err);
      }
    };

    setupSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(false);
  };

  const statusFilters = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'pending', label: 'Pending', icon: 'time-outline' },
    { id: 'scheduled', label: 'Scheduled', icon: 'calendar-outline' },
    { id: 'accepted', label: 'Accepted', icon: 'checkmark-circle-outline' },
    { id: 'packing', label: 'Packing', icon: 'gift-outline' },
    { id: 'waiting_for_rider', label: 'Waiting Rider', icon: 'person-outline' },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: 'bicycle-outline' },
    { id: 'delivered', label: 'Delivered', icon: 'checkmark-done-outline' },
    { id: 'cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#FFB800',
      accepted: '#5AC8FA',
      confirmed: '#5AC8FA',
      packing: '#AF52DE',
      waiting_for_rider: '#5856D6',
      shipped: '#AF52DE',
      out_for_delivery: '#0A84FF',
      delivered: '#32D74B',
      cancelled: '#FF6B6B',
      rejected: '#FF6B6B',
      scheduled: '#2ec5b6',
    };
    return colors[status] || '#2ec5b6';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      pending: 'time',
      scheduled: 'calendar',
      confirmed: 'checkmark-circle',
      packing: 'gift',
      waiting_for_rider: 'person',
      shipped: 'rocket',
      out_for_delivery: 'bicycle',
      delivered: 'checkmark-done-circle',
      cancelled: 'close-circle',
    };
    return icons[status] || 'information-circle';
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.patch(`${API_URL}/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        Alert.alert('Success', 'Order cancelled successfully');
        fetchOrders(false);
      }
    } catch (error: any) {
      console.error('❌ Error cancelling order:', error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleScheduleOrder = async (orderId: string, scheduledDate?: Date) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const payload = scheduledDate ? { scheduledFor: scheduledDate.toISOString() } : {};
      
      const response = await axios.patch(`${API_URL}/api/orders/${orderId}/schedule`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        Alert.alert('Scheduled! 📅', scheduledDate 
          ? `Your order is scheduled for ${scheduledDate.toLocaleString()}.`
          : 'Your order is now scheduled. Sellers can see and accept it anytime.'
        );
        setScheduleModalVisible(false);
        fetchOrders(false);
      }
    } catch (error: any) {
      console.error('❌ Error scheduling order:', error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to schedule order');
    }
  };

  const confirmSchedule = () => {
    if (!schedulingOrderId) return;
    
    const finalDate = new Date(selectedDate);
    finalDate.setHours(21, 0, 0, 0); // 9:00 PM
    
    handleScheduleOrder(schedulingOrderId, finalDate);
  };


  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  const handleOrderAction = (order: Order, action: string) => {
    switch (action) {
      case 'track':
        Alert.alert(
          'Track Order',
          `Order ID: ${order._id}\nStatus: ${order.status}\n\nTracking details will be available soon.`
        );
        break;
      case 'reorder':
        Alert.alert('Reorder', `Would you like to reorder from ${order.seller?.pharmacyName || 'this seller'}?`);
        break;
      case 'schedule':
        setSchedulingOrderId(order._id);
        setScheduleModalVisible(true);
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Order',
          'Are you sure you want to cancel this order?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes, Cancel', onPress: () => handleCancelOrder(order._id) },
          ]
        );
        break;
      case 'help':
        Alert.alert('Need Help?', 'Contact customer support for assistance.');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>Track your medicine orders</Text>
        </View>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => Alert.alert('Help', 'Contact support: +91-XXXXXXXXXX')}
        >
          <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2ec5b6" />
        }
      >
        {/* Status Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedStatus === filter.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedStatus(filter.id)}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={18} 
                color={selectedStatus === filter.id ? '#000000' : '#FFFFFF'} 
              />
              <Text
                style={[
                  styles.filterText,
                  selectedStatus === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Orders List */}
        <View style={styles.ordersContainer}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#2ec5b6" style={{ marginTop: 40 }} />
          ) : (
            filteredOrders.map((order) => (
              <View key={order._id} style={styles.orderCard}>
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderId}>ID: {order._id.substring(order._id.length - 8).toUpperCase()}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Ionicons name={getStatusIcon(order.status) as any} size={14} color="#FFFFFF" />
                    <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Prescription Image (Thumbnail) */}
                {order.prescriptionImage && (
                  <View style={styles.prescriptionThumbContainer}>
                    <Text style={styles.prescriptionLabel}>Prescription:</Text>
                    <TouchableOpacity onPress={() => setPreviewImage(getFullImageUrl(order.prescriptionImage!))}>
                      <Image 
                        source={{ uri: getFullImageUrl(order.prescriptionImage) || undefined }} 
                        style={styles.prescriptionThumbnail}
                        resizeMode="cover"
                      />
                      <View style={styles.previewOverlay}>
                        <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.previewText}>Tap to preview</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

              {/* Order Items */}
              <View style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <View style={styles.itemIcon}>
                      <Ionicons name="medkit" size={20} color="#2ec5b6" />
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                    </View>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                  </View>
                ))}
              </View>

                {/* Order Details */}
                <View style={styles.orderDetails}>
                  {order.seller && (
                    <View style={styles.sellerInfo}>
                      <View style={styles.detailRow}>
                        <Ionicons name="business" size={16} color="#2ec5b6" />
                        <Text style={[styles.detailText, { fontWeight: 'bold', color: '#FFFFFF' }]}>
                          {order.seller.pharmacyName}
                        </Text>
                      </View>
                      {order.seller.address && (
                        <View style={styles.detailRow}>
                          <Ionicons name="location" size={16} color="#2ec5b6" />
                          <Text style={styles.detailText}>{order.seller.address}</Text>
                        </View>
                      )}
                      {(order.seller.phone || order.seller.number) && (
                        <View style={styles.detailRow}>
                          <Ionicons name="call" size={16} color="#2ec5b6" />
                          <Text style={styles.detailText}>{order.seller.phone || order.seller.number}</Text>
                        </View>
                      )}
                    </View>
                  )}
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="map" size={16} color="#2ec5b6" />
                    <Text style={styles.detailText}>{order.deliveryAddress}</Text>
                  </View>

                  {order.status === 'scheduled' && order.scheduledFor && (
                    <View style={[styles.detailRow, { marginTop: 8, backgroundColor: 'rgba(46, 196, 182, 0.1)', padding: 8, borderRadius: 8 }]}>
                      <Ionicons name="calendar" size={16} color="#2ec5b6" />
                      <Text style={[styles.detailText, { fontWeight: 'bold', color: '#2ec5b6' }]}>
                        Scheduled For: {formatDate(order.scheduledFor)}
                      </Text>
                    </View>
                  )}
                </View>

              {/* Order Footer */}
              <View style={styles.orderFooter}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                  <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
                </View>
              </View>

              {/* Order Actions */}
              <View style={styles.orderActions}>
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOrderAction(order, 'track')}
                  >
                    <Ionicons name="location-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Track</Text>
                  </TouchableOpacity>
                )}

                {order.status === 'delivered' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOrderAction(order, 'reorder')}
                  >
                    <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Reorder</Text>
                  </TouchableOpacity>
                )}

                  {order.status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#AF52DE' }]}
                      onPress={() => handleOrderAction(order, 'schedule')}
                    >
                      <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Schedule</Text>
                    </TouchableOpacity>
                  )}

                  {order.status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonDanger]}
                      onPress={() => handleOrderAction(order, 'cancel')}
                    >
                      <Ionicons name="close-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOrderAction(order, 'help')}
                  >
                    <Ionicons name="help-circle-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Help</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {!loading && filteredOrders.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="bag-outline" size={64} color="#666666" />
              <Text style={styles.emptyStateText}>No orders found</Text>
              <Text style={styles.emptyStateSubText}>
                {selectedStatus === 'all' 
                  ? 'Start shopping for medicines' 
                  : `No ${selectedStatus} orders`}
              </Text>
              <TouchableOpacity 
                style={styles.shopNowButton}
                onPress={() => router.push('/')}
              >
                <Text style={styles.shopNowButtonText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Prescription Preview Modal */}
          <Modal visible={!!previewImage} transparent animationType="fade">
            <View style={styles.previewContainer}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setPreviewImage(null)}
              >
                <Ionicons name="close" size={30} color="#FFFFFF" />
              </TouchableOpacity>
              {previewImage && (
                <Image 
                  source={{ uri: previewImage }} 
                  style={styles.fullImage} 
                  resizeMode="contain" 
                />
              )}
            </View>
          </Modal>

          {/* Schedule Order Modal */}
          <Modal
            visible={scheduleModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setScheduleModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.scheduleModalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Schedule Delivery</Text>
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
                    style={styles.confirmBtn}
                    onPress={confirmSchedule}
                  >
                    <Text style={styles.confirmBtnText}>Confirm Schedule</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
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
  helpButton: {
    width: 44,
    height: 44,
    backgroundColor: '#334155', // Slate 700
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  filtersContainer: {
    paddingLeft: 16,
    paddingVertical: 16,
  },
  filtersContent: {
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Slate 800
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    marginLeft: 6,
  },
  filterTextActive: {
    color: '#000000', // Black for contrast against active teal
  },
  ordersContainer: {
    paddingHorizontal: 16,
  },
  ordersCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Slate 700
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#334155', // Slate 700
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#94A3B8',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ec5b6',
  },
  orderDetails: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155', // Slate 700
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#CBD5E1', // Slate 300
    flex: 1,
  },
  orderFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155', // Slate 700
    marginBottom: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ec5b6',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ec5b6',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#2ec5b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: Platform.OS === 'android' ? 12 : 0,
  },
  actionButtonDanger: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    marginBottom: 24,
  },
  shopNowButton: {
    backgroundColor: '#2ec5b6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: Platform.OS === 'android' ? 20 : 0,
  },
  shopNowButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  prescriptionThumbContainer: {
    marginBottom: 16,
  },
  prescriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  prescriptionThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#334155', // Slate 700
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 184, 166, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    gap: 4,
  },
  previewText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  sellerInfo: {
    marginBottom: 12,
    backgroundColor: '#334155', // Slate 700
    padding: 12,
    borderRadius: 12,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)', // Darker overlay
    justifyContent: 'flex-end',
  },
  scheduleModalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: '60%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
    marginTop: 8,
  },
  dateSelector: {
    marginBottom: 20,
  },
  dateItem: {
    width: 80,
    height: 100,
    backgroundColor: '#334155',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#475569',
  },
  dateItemActive: {
    backgroundColor: '#2ec5b6',
    borderColor: '#2DD4BF',
  },
  dateDay: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: '#94A3B8',
  },
  dateTextActive: {
    color: '#FFFFFF',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  timeSlotItem: {
    width: '31%',
    paddingVertical: 12,
    backgroundColor: '#334155',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  timeSlotItemActive: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    borderColor: '#2ec5b6',
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  timeSlotTextActive: {
    color: '#2ec5b6',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CBD5E1',
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#2ec5b6',
    alignItems: 'center',
    shadowColor: '#2ec5b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});


