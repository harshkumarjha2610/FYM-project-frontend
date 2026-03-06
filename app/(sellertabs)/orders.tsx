// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// // const API_URL = 'http://192.168.1.3:3000';
// const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

// const API_BASE_URL = `${API_URL}/api/orders`;

// const AcceptedOrdersScreen = () => {
//   const [acceptedOrders, setAcceptedOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

//   // Fetch ONLY accepted orders
//   const fetchAcceptedOrders = async () => {
//     try {
//       console.log('🔍 FETCHING ACCEPTED ORDERS');
//       setLoading(true);
      
//       const token = await AsyncStorage.getItem('sellerToken');
      
//       if (!token) {
//         console.error('❌ No token found');
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(API_BASE_URL, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('✅ Orders fetched:', res.data.length || 0);

//       // ✅ Filter ONLY accepted orders
//       const accepted = (res.data || []).filter((order: any) => order.status === 'accepted');
      
//       console.log('📋 Accepted orders:', accepted.length);

//       setAcceptedOrders(accepted);
      
//     } catch (err: any) {
//       console.error('❌ Error fetching orders:', err.response?.data || err.message);
      
//       if (err.response?.status === 401) {
//         Alert.alert('Session Expired', 'Please login again');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchAcceptedOrders();
//   };

//   const toggleExpand = (orderId: string) => {
//     setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
//   };

//   useEffect(() => {
//     fetchAcceptedOrders();
    
//     // Refresh every 30 seconds
//     const interval = setInterval(fetchAcceptedOrders, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <ScrollView 
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//       }
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Accepted Orders</Text>
//         <TouchableOpacity 
//           style={styles.refreshButton}
//           onPress={fetchAcceptedOrders}
//         >
//           <Text style={styles.refreshText}>🔄 Refresh</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Orders List */}
//       <View style={styles.ordersContainer}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#22C55E" style={{ marginTop: 40 }} />
//         ) : acceptedOrders.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyText}>📦</Text>
//             <Text style={styles.emptyTitle}>No Accepted Orders</Text>
//             <Text style={styles.emptySubtitle}>
//               Orders you accept will appear here
//             </Text>
//           </View>
//         ) : (
//           acceptedOrders.map((order) => {
//             const isExpanded = expandedOrderId === order._id;
//             return (
//               <TouchableOpacity
//                 key={order._id}
//                 style={styles.orderCard}
//                 onPress={() => toggleExpand(order._id)}
//                 activeOpacity={0.9}
//               >
//                 {/* Order Info */}
//                 <View style={styles.rowBetween}>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.customerName}>
//                       {order.buyer?.name || order.customerName || "Customer"}
//                     </Text>
//                     <Text style={styles.productName}>
//                       {order.items?.map((i: any) => i.medicine?.name || i.name).join(", ") || "Items"}
//                     </Text>
//                     <Text style={styles.orderId}>
//                       #{order._id.substring(0, 8)} • Accepted: {new Date(order.respondedAt || order.updatedAt).toLocaleString()}
//                     </Text>
//                   </View>

//                   <View style={styles.rightMeta}>
//                     <Text style={styles.amount}>₹{order.totalAmount || 0}</Text>
//                     <Text style={styles.statusBadge}>ACCEPTED</Text>
//                   </View>
//                 </View>

//                 {/* Expanded Details */}
//                 {isExpanded && (
//                   <View style={styles.expandedSection}>
//                     <Text style={styles.detailText}>
//                       <Text style={styles.detailLabel}>Customer: </Text>
//                       {order.buyer?.name || "N/A"}
//                     </Text>
//                     <Text style={styles.detailText}>
//                       <Text style={styles.detailLabel}>Phone: </Text>
//                       {order.buyer?.mobile || order.phone || "N/A"}
//                     </Text>
//                     <Text style={styles.detailText}>
//                       <Text style={styles.detailLabel}>Address: </Text>
//                       {order.deliveryAddress?.address || order.address || "N/A"}
//                     </Text>
//                     <Text style={styles.detailText}>
//                       <Text style={styles.detailLabel}>Payment: </Text>
//                       {order.paymentMethod || order.payment || "N/A"}
//                     </Text>
//                     {order.notes && (
//                       <Text style={styles.detailText}>
//                         <Text style={styles.detailLabel}>Notes: </Text>
//                         {order.notes}
//                       </Text>
//                     )}
                    
//                     <Text style={styles.detailText}>
//                       <Text style={styles.detailLabel}>Order Date: </Text>
//                       {new Date(order.createdAt).toLocaleString()}
//                     </Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             );
//           })
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FAFB" },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   refreshButton: {
//     padding: 8,
//   },
//   refreshText: {
//     fontSize: 14,
//     color: '#22C55E',
//   },
//   ordersContainer: { padding: 20 },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     paddingHorizontal: 40,
//   },
//   orderCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 18,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//     borderLeftWidth: 4,
//     borderLeftColor: '#22C55E', // Green for accepted
//   },
//   rowBetween: { flexDirection: "row", justifyContent: "space-between" },
//   customerName: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
//   productName: { fontSize: 14, color: "#4B5563", marginTop: 2 },
//   orderId: { fontSize: 12, color: "#6B7280", marginTop: 4 },
//   rightMeta: { alignItems: "flex-end" },
//   amount: { fontSize: 18, fontWeight: "700", color: "#111827" },
//   statusBadge: {
//     marginTop: 6,
//     fontSize: 11,
//     fontWeight: "700",
//     backgroundColor: "#22C55E",
//     color: "#FFFFFF",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     letterSpacing: 0.5,
//   },
//   expandedSection: {
//     marginTop: 14,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//     paddingTop: 12,
//   },
//   detailText: { fontSize: 14, color: "#374151", marginTop: 6 },
//   detailLabel: { fontWeight: "600", color: "#111827" },
  
// });

// export default AcceptedOrdersScreen;


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

      const accepted = (res.data || []).filter((order: any) => order.status === 'accepted');
      setAcceptedOrders(accepted);
    } catch (err: any) {
      console.error('❌ Error:', err);
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

  // ✅ Helper to construct image URL
  const getImageUrl = (order: any): string | null => {
    if (!order.prescriptionImage) return null;
    if (order.prescriptionImage.startsWith('http')) return order.prescriptionImage;
    if (order.prescriptionImage.startsWith('/uploads/')) return `${API_URL}${order.prescriptionImage}`;
    return `${API_URL}/uploads/${order.prescriptionImage}`;
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

            return (
              <TouchableOpacity
                key={order._id}
                style={styles.orderCard}
                onPress={() => toggleExpand(order._id)}
              >
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.customerName}>
                      {order.buyer?.name || "Customer"}
                    </Text>
                    <Text style={styles.productName}>
                      {order.items?.map((i: any) => i.name).join(", ")}
                    </Text>
                  </View>
                  <View style={styles.rightMeta}>
                    <Text style={styles.amount}>₹{order.totalAmount}</Text>
                    <Text style={styles.statusBadge}>ACCEPTED</Text>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.expandedSection}>
                    <Text>Address: {order.deliveryAddress || 'N/A'}</Text>
                    
                    {/* ✅ Show prescription image in accepted orders too */}
                    {imageUrl && (
                      <View style={styles.imageContainer}>
                        <Text style={styles.label}>Prescription:</Text>
                        <TouchableOpacity onPress={() => openImagePreview(imageUrl)}>
                          <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                        </TouchableOpacity>
                      </View>
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
            <Text>✕ Close</Text>
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
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 20, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  ordersContainer: { padding: 20 },
  orderCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#22C55E' },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  customerName: { fontSize: 16, fontWeight: "bold" },
  productName: { fontSize: 14, color: "#4B5563" },
  rightMeta: { alignItems: "flex-end" },
  amount: { fontSize: 18, fontWeight: "700" },
  statusBadge: { marginTop: 6, fontSize: 11, fontWeight: "700", backgroundColor: "#22C55E", color: "#FFFFFF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  expandedSection: { marginTop: 14, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 12 },
  imageContainer: { marginTop: 12 },
  label: { fontWeight: "600", marginBottom: 8 },
  thumbnail: { width: '100%', height: 200, borderRadius: 12 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center' },
  closeButton: { position: 'absolute', top: 50, right: 20, backgroundColor: '#fff', padding: 10, borderRadius: 20 },
  fullImage: { width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.8 },
});

export default AcceptedOrdersScreen;