import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  deliveryDate?: string;
  seller: string;
  address: string;
  paymentMethod: string;
}

export default function OrdersScreen() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statusFilters = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'pending', label: 'Pending', icon: 'time-outline' },
    { id: 'confirmed', label: 'Confirmed', icon: 'checkmark-circle-outline' },
    { id: 'shipped', label: 'Shipped', icon: 'rocket-outline' },
    { id: 'delivered', label: 'Delivered', icon: 'checkmark-done-outline' },
    { id: 'cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
  ];

  const orders: Order[] = [
    {
      id: '1',
      orderId: 'ORD-2025-001',
      status: 'shipped',
      items: [
        { name: 'Paracetamol 500mg', quantity: 2, price: 45 },
        { name: 'Cough Syrup', quantity: 1, price: 120 },
      ],
      totalAmount: 210,
      orderDate: '2 Dec 2025, 10:30 AM',
      deliveryDate: '4 Dec 2025',
      seller: 'MediCare Pharmacy',
      address: 'Sector 15, Noida, Delhi NCR',
      paymentMethod: 'UPI',
    },
    {
      id: '2',
      orderId: 'ORD-2025-002',
      status: 'delivered',
      items: [
        { name: 'Vitamin D3', quantity: 1, price: 250 },
        { name: 'Multivitamin Tablets', quantity: 1, price: 180 },
      ],
      totalAmount: 430,
      orderDate: '28 Nov 2025, 3:45 PM',
      deliveryDate: '30 Nov 2025',
      seller: 'Health Plus Store',
      address: 'Sector 15, Noida, Delhi NCR',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: '3',
      orderId: 'ORD-2025-003',
      status: 'confirmed',
      items: [
        { name: 'Antibiotics Pack', quantity: 1, price: 350 },
      ],
      totalAmount: 350,
      orderDate: '3 Dec 2025, 9:15 AM',
      deliveryDate: '5 Dec 2025',
      seller: 'Apollo Pharmacy',
      address: 'Sector 15, Noida, Delhi NCR',
      paymentMethod: 'Card',
    },
    {
      id: '4',
      orderId: 'ORD-2025-004',
      status: 'pending',
      items: [
        { name: 'Blood Pressure Monitor', quantity: 1, price: 1200 },
        { name: 'Thermometer', quantity: 1, price: 450 },
      ],
      totalAmount: 1650,
      orderDate: '4 Dec 2025, 1:20 PM',
      seller: 'Medical Equipment Hub',
      address: 'Sector 15, Noida, Delhi NCR',
      paymentMethod: 'UPI',
    },
    {
      id: '5',
      orderId: 'ORD-2025-005',
      status: 'cancelled',
      items: [
        { name: 'Pain Relief Gel', quantity: 2, price: 180 },
      ],
      totalAmount: 360,
      orderDate: '1 Dec 2025, 5:00 PM',
      seller: 'City Pharmacy',
      address: 'Sector 15, Noida, Delhi NCR',
      paymentMethod: 'UPI',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#FFB800',
      confirmed: '#5AC8FA',
      preparing: '#FF9500',
      shipped: '#AF52DE',
      delivered: '#32D74B',
      cancelled: '#FF6B6B',
    };
    return colors[status] || '#2EC4B6';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      pending: 'time',
      confirmed: 'checkmark-circle',
      preparing: 'construct',
      shipped: 'rocket',
      delivered: 'checkmark-done-circle',
      cancelled: 'close-circle',
    };
    return icons[status] || 'information-circle';
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const handleOrderAction = (order: Order, action: string) => {
    switch (action) {
      case 'track':
        Alert.alert(
          'Track Order',
          `Order ID: ${order.orderId}\nStatus: ${order.status}\n\nTracking details will be available soon.`
        );
        break;
      case 'reorder':
        Alert.alert('Reorder', `Would you like to reorder from ${order.seller}?`);
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Order',
          'Are you sure you want to cancel this order?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes, Cancel', onPress: () => Alert.alert('Order Cancelled') },
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
                name={filter.icon} 
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
          <Text style={styles.ordersCount}>
            {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
          </Text>

          {filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View style={styles.orderHeaderLeft}>
                  <Text style={styles.orderId}>{order.orderId}</Text>
                  <Text style={styles.orderDate}>{order.orderDate}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Ionicons name={getStatusIcon(order.status)} size={14} color="#FFFFFF" />
                  <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
              </View>

              {/* Order Items */}
              <View style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <View style={styles.itemIcon}>
                      <Ionicons name="medkit" size={20} color="#2EC4B6" />
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
                <View style={styles.detailRow}>
                  <Ionicons name="business" size={16} color="#2EC4B6" />
                  <Text style={styles.detailText}>{order.seller}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={16} color="#2EC4B6" />
                  <Text style={styles.detailText}>{order.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="card" size={16} color="#2EC4B6" />
                  <Text style={styles.detailText}>{order.paymentMethod}</Text>
                </View>
                {order.deliveryDate && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#2EC4B6" />
                    <Text style={styles.detailText}>Expected: {order.deliveryDate}</Text>
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
          ))}

          {filteredOrders.length === 0 && (
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
                onPress={() => Alert.alert('Shop Now', 'Navigate to home screen')}
              >
                <Text style={styles.shopNowButtonText}>Shop Now</Text>
              </TouchableOpacity>
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
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2EC4B6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
  helpButton: {
    width: 44,
    height: 44,
    backgroundColor: '#1A1A1A',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2EC4B6',
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
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2EC4B6',
  },
  filterButtonActive: {
    backgroundColor: '#2EC4B6',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  filterTextActive: {
    color: '#000000',
  },
  ordersContainer: {
    paddingHorizontal: 16,
  },
  ordersCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2EC4B6',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2EC4B630',
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#CCCCCC',
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
    backgroundColor: '#2EC4B620',
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
    color: '#FFFFFF',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2EC4B6',
  },
  orderDetails: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2EC4B630',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#CCCCCC',
    flex: 1,
  },
  orderFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2EC4B630',
    marginBottom: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2EC4B6',
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
    backgroundColor: '#2EC4B6',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonDanger: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
    marginBottom: 24,
  },
  shopNowButton: {
    backgroundColor: '#2EC4B6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  shopNowButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});
