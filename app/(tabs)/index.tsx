// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
//   Image,
//   Modal,
//   ActivityIndicator,
//   Platform,
//   StyleSheet,
//   Linking,
// } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import { Ionicons } from '@expo/vector-icons';
// import * as Location from 'expo-location';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { styles } from './index.styles';

// // const API_URL = "https://rambackend-1-qmpn.onrender.com";
// const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// interface Region {
//   latitude: number;
//   longitude: number;
//   latitudeDelta: number;
//   longitudeDelta: number;
// }

// interface Medicine {
//   _id: string;
//   id: string;
//   name: string;
//   price: number;
//   manufacturer: string;
//   inStock: boolean;
//   category: string;
// }

// interface CartItem extends Medicine {
//   quantity: number;
// }

// interface Seller {
//   id: string;
//   name: string;
//   distance: string;
//   rating: number;
//   address: string;
//   coordinates: Coordinates;
// }

// const DEFAULT_REGION: Region = {
//   latitude: 25.5941,
//   longitude: 85.1376,
//   latitudeDelta: 0.0922,
//   longitudeDelta: 0.0421,
// };

// const HomeScreen: React.FC = () => {
//   const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
//   const [searchText, setSearchText] = useState<string>('');
//   const [cartCount, setCartCount] = useState<number>(0);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [showCart, setShowCart] = useState<boolean>(false);
//   const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
//   const [medicines, setMedicines] = useState<Medicine[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [selectedLocation, setSelectedLocation] = useState<string>('Enable GPS to get location');
//   const [isLocating, setIsLocating] = useState<boolean>(false);
//   const [showMap, setShowMap] = useState<boolean>(false);
//   const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
//   const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);
//   const [locationError, setLocationError] = useState<string | null>(null);
//   const [nearestSellers, setNearestSellers] = useState<Seller[]>([]);
//   const [showNearestSellers, setShowNearestSellers] = useState<boolean>(false);
//   const [fullAddress, setFullAddress] = useState<string>('');

//   useEffect(() => {
//     (async () => {
//       await requestLocationPermission();
//       await getCurrentLocation();
//       await fetchMedicines();
//     })();
//   }, []);

//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       fetchMedicines(searchText);
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [searchText]);

//   const fetchMedicines = async (query: string = '') => {
//     setLoading(true);
//     try {
//       const url = query
//         ? `${API_URL}/api/medicines/search?query=${encodeURIComponent(query)}`
//         : `${API_URL}/api/medicines`;
//       const response = await axios.get<{ medicines: Medicine[] }>(url);
//       const data = response.data.medicines;
//       console.log('Medicines data:', data);
//       setMedicines(Array.isArray(data) ? data : []);
//     } catch (error: any) {
//       console.error('Fetch medicines error:', error);
//       Alert.alert('Error', 'Failed to fetch medicines. Please try again.');
//       setMedicines([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const requestLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setLocationError('Location permission denied');
//       Alert.alert(
//         'Location Permission Required',
//         'Please enable location services to get your exact address.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Open Settings', onPress: () => Linking.openSettings() },
//         ]
//       );
//     }
//   };

//   const getCurrentLocation = async () => {
//     setIsLocating(true);
//     setLocationError(null);
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setLocationError('Permission to access location was denied');
//         setSelectedLocation('Enable GPS to get location');
//         Alert.alert(
//           'GPS Required',
//           'Please enable GPS to get your exact delivery address.',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { text: 'Enable GPS', onPress: () => Linking.openSettings() },
//           ]
//         );
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       const { latitude, longitude } = location.coords;
//       setUserCoordinates({ latitude, longitude });

//       setMapRegion({
//         latitude,
//         longitude,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       });

//       const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
//       if (geocode.length > 0) {
//         const addressData = geocode[0];
//         const completeAddress = [
//           addressData.name,
//           addressData.street,
//           addressData.district,
//           addressData.city,
//           addressData.region,
//           addressData.postalCode,
//           addressData.country,
//         ]
//           .filter(Boolean)
//           .join(', ');
        
//         setFullAddress(completeAddress);
//         setSelectedLocation(completeAddress);
//       }
//     } catch (error: any) {
//       setLocationError('Could not determine your location');
//       setSelectedLocation('Enable GPS to get location');
//       console.error('Location error:', error);
//       Alert.alert(
//         'Location Error',
//         'Unable to fetch your location. Please enable GPS and try again.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Try Again', onPress: getCurrentLocation },
//         ]
//       );
//     } finally {
//       setIsLocating(false);
//     }
//   };

//  const findNearestSellers = async () => {
//   console.log('🎯 FYM button clicked - PLACING ORDER');
  
//   // Same validation as Place Order
//   if (!prescriptionImage && cartItems.length === 0) {
//     Alert.alert('Empty Cart', 'Please add some medicines to your cart before placing an order.');
//     return;
//   }

//   if (!userCoordinates) {
//     Alert.alert(
//       'Location Required',
//       'Please enable GPS to set your delivery location.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Enable GPS', onPress: getCurrentLocation },
//       ]
//     );
//     return;
//   }

//   setLoading(true);
//   try {
//     const token = await AsyncStorage.getItem('token');
//     const buyerId = await AsyncStorage.getItem('buyerId');
    
//     if (!token) {
//       Alert.alert('Authentication Required', 'Please log in to place an order.');
//       setLoading(false);
//       return;
//     }

//     const finalBuyerId = buyerId || `buyer_${Date.now()}`;
    
//     console.log('🚀 FYM - Placing order with data:', {
//       buyerId: finalBuyerId,
//       itemsCount: cartItems.length,
//       totalAmount: getTotalAmount(),
//       hasLocation: !!userCoordinates,
//       hasPrescription: !!prescriptionImage
//     });

//     const response = await axios.post(
//       `${API_URL}/api/orders`,
//       {
//         buyerId: finalBuyerId,
//         items: cartItems.map((item) => ({
//           medicineId: item.id,
//           name: item.name,
//           manufacturer: item.manufacturer,
//           price: item.price,
//           quantity: item.quantity,
//         })),
//         totalAmount: getTotalAmount(),
//         prescriptionImage,
//         deliveryAddress: fullAddress || selectedLocation,
//         location: {
//           type: 'Point',
//           coordinates: [userCoordinates.longitude, userCoordinates.latitude],
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('✅ FYM - Order placed successfully:', response.data);

//     Alert.alert(
//       '🎉 Order Placed Successfully!',
//       `Your order of ₹${getTotalAmount()} has been placed successfully!\n\n` +
//       `Items: ${cartItems.length}\n` +
//       `Delivery to: ${selectedLocation}\n\n` +
//       `Nearby sellers have been notified and will contact you soon.`,
//       [
//         {
//           text: 'OK',
//           onPress: () => {
//             setCartItems([]);
//             setCartCount(0);
//             setShowCart(false);
//             setPrescriptionImage(null);
//           },
//         },
//       ]
//     );
    
//   } catch (error: any) {
//     console.error('❌ FYM - Place order error:', error.response?.data || error.message);
    
//     const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
//     Alert.alert(
//       'Order Failed',
//       errorMessage,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Retry', onPress: findNearestSellers }
//       ]
//     );
    
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleChooseFromGallery = async () => {
//     try {
//       console.log('📸 Requesting gallery permissions...');
      
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
//       if (status !== 'granted') {
//         Alert.alert(
//           'Permission Required',
//           'Please allow access to your photo library to upload prescription.',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { text: 'Open Settings', onPress: () => Linking.openSettings() },
//           ]
//         );
//         return;
//       }

//       console.log('✅ Gallery permission granted, launching picker...');

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//         base64: true,
//       });

//       console.log('Gallery result:', result);

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const base64Image = result.assets[0].base64;
//         setPrescriptionImage(base64Image || null);
//         Alert.alert('Success', 'Prescription uploaded from gallery!');
//         console.log('✅ Prescription image set from gallery');
//       }
//     } catch (error) {
//       console.error('❌ Gallery error:', error);
//       Alert.alert('Error', 'Failed to pick image from gallery. Please try again.');
//     }
//   };

//   const handleTakePhoto = async () => {
//     try {
//       console.log('📷 Requesting camera permissions...');
      
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
//       if (status !== 'granted') {
//         Alert.alert(
//           'Permission Required',
//           'Please allow camera access to take a photo of your prescription.',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { text: 'Open Settings', onPress: () => Linking.openSettings() },
//           ]
//         );
//         return;
//       }

//       console.log('✅ Camera permission granted, launching camera...');

//       const result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//         base64: true,
//       });

//       console.log('Camera result:', result);

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const base64Image = result.assets[0].base64;
//         setPrescriptionImage(base64Image || null);
//         Alert.alert('Success', 'Prescription photo taken successfully!');
//         console.log('✅ Prescription image set from camera');
//       }
//     } catch (error) {
//       console.error('❌ Camera error:', error);
//       Alert.alert('Error', 'Failed to take photo. Please try again.');
//     }
//   };

//   const handleUploadPrescription = async () => {
//     console.log('🔄 Upload prescription clicked, current image:', prescriptionImage ? 'exists' : 'none');
    
//     if (prescriptionImage) {
//       Alert.alert(
//         'Prescription Uploaded',
//         'Would you like to change the prescription?',
//         [
//           { text: 'Change', onPress: () => showImagePickerOptions() },
//           { text: 'Keep', style: 'cancel' },
//         ]
//       );
//     } else {
//       showImagePickerOptions();
//     }
//   };

//   const showImagePickerOptions = () => {
//     Alert.alert(
//       'Upload Prescription',
//       'Choose how to upload your prescription',
//       [
//         { 
//           text: 'Take Photo', 
//           onPress: () => {
//             console.log('📷 User selected: Take Photo');
//             handleTakePhoto();
//           }
//         },
//         { 
//           text: 'Choose from Gallery', 
//           onPress: () => {
//             console.log('🖼️ User selected: Gallery');
//             handleChooseFromGallery();
//           }
//         },
//         { text: 'Cancel', style: 'cancel' },
//       ]
//     );
//   };

//   const addToCart = (medicine: Medicine) => {
//     if (!medicine.inStock) {
//       Alert.alert('Out of Stock', `${medicine.name} is currently out of stock.`);
//       return;
//     }

//     console.log("medicine: ", medicine);
//     console.log("current cart: ", cartItems);
    
//     const existingItem = cartItems.find((item) => item._id === medicine._id);
//     console.log("matching: ", existingItem);
//     if (existingItem) {
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item._id === medicine._id ? { ...item, quantity: item.quantity + 1 } : item
//         )
//       );
//     } else {
//       setCartItems((prev) => [...prev, { ...medicine, quantity: 1 }]);
//     }

//     setCartCount((prev) => prev + 1);
//     Alert.alert('Added to Cart', `${medicine.name} has been added to your cart.`);
//   };

//   const removeFromCart = (medicineId: string) => {
//     const item = cartItems.find((item) => item.id === medicineId);
//     if (!item) return;
//     if (item.quantity > 1) {
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.id === medicineId ? { ...item, quantity: item.quantity - 1 } : item
//         )
//       );
//       setCartCount((prev) => prev - 1);
//     } else {
//       setCartItems((prev) => prev.filter((item) => item.id !== medicineId));
//       setCartCount((prev) => prev - 1);
//     }
//   };

//   const getTotalAmount = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const placeOrder = async () => {
//     console.log('🛒 Place Order button clicked');
    
//     if (cartItems.length === 0) {
//       Alert.alert('Empty Cart', 'Please add some medicines to your cart before placing an order.');
//       return;
//     }

//     if (!userCoordinates) {
//       Alert.alert(
//         'Location Required',
//         'Please enable GPS to set delivery location.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Enable GPS', onPress: getCurrentLocation },
//         ]
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const buyerId = await AsyncStorage.getItem('buyerId');
      
//       if (!token) {
//         Alert.alert('Authentication Required', 'Please log in to place an order.');
//         setLoading(false);
//         return;
//       }

//       const finalBuyerId = buyerId || `buyer_${Date.now()}`;
      
//       console.log('🚀 Placing order with data:', {
//         buyerId: finalBuyerId,
//         itemsCount: cartItems.length,
//         totalAmount: getTotalAmount(),
//         hasLocation: !!userCoordinates,
//         hasPrescription: !!prescriptionImage
//       });

//       const response = await axios.post(
//         `${API_URL}/api/orders`,
//         {
//           buyerId: finalBuyerId,
//           items: cartItems.map((item) => ({
//             medicineId: item.id,
//             name: item.name,
//             manufacturer: item.manufacturer,
//             price: item.price,
//             quantity: item.quantity,
//           })),
//           totalAmount: getTotalAmount(),
//           prescriptionImage,
//           location: {
//             coordinates: [userCoordinates.longitude, userCoordinates.latitude],
//           },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('✅ Order placed successfully:', response.data);

//       Alert.alert(
//         '🎉 Order Placed Successfully!',
//         `Your order of ₹${getTotalAmount()} has been placed. Nearby sellers have been notified and will contact you soon.`,
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               setCartItems([]);
//               setCartCount(0);
//               setShowCart(false);
//               setPrescriptionImage(null);
//             },
//           },
//         ]
//       );
      
//     } catch (error: any) {
//       console.error('❌ Place order error:', error.response?.data || error.message);
      
//       const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
//       Alert.alert('Order Failed', errorMessage);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredMedicines = medicines && Array.isArray(medicines)
//     ? medicines.filter(
//         (medicine) =>
//           medicine.name.toLowerCase().includes(searchText.toLowerCase()) ||
//           medicine.manufacturer.toLowerCase().includes(searchText.toLowerCase()) ||
//           medicine.category.toLowerCase().includes(searchText.toLowerCase())
//       )
//     : [];

//   const handleSearchFocus = () => {
//     setShowSuggestions(true);
//   };

//   const handleSearchChange = (text: string) => {
//     setSearchText(text);
//     setShowSuggestions(text.length > 0);
//   };

//   return (
//     <View style={styles.mainContainer}>
//       {/* Location Selection Map Modal */}
//       <Modal visible={showMap} animationType="slide">
//         <View style={styles.mapContainer}>
//           <MapView
//             style={styles.map}
//             region={mapRegion}
//             showsUserLocation={true}
//             showsMyLocationButton={false}
//             followsUserLocation={true}
//             onRegionChangeComplete={setMapRegion}
//           >
//             {userCoordinates && (
//               <Marker coordinate={userCoordinates}>
//                 <View style={styles.markerContainer}>
//                   <View style={styles.markerPin}>
//                     <Ionicons name="medkit" size={24} color="#FF6B6B" />
//                   </View>
//                   <View style={styles.markerPointer} />
//                 </View>
//               </Marker>
//             )}
//           </MapView>

//           <View style={styles.mapControls}>
//             <TouchableOpacity
//               style={styles.mapButton}
//               onPress={getCurrentLocation}
//               disabled={isLocating || loading}
//             >
//               {isLocating ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Ionicons name="navigate" size={24} color="#FFFFFF" />
//               )}
//               <Text style={styles.mapButtonText}>{isLocating ? 'Locating...' : 'My Location'}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.mapButton, styles.confirmButton]}
//               onPress={() => setShowMap(false)}
//               disabled={loading}
//             >
//               <Text style={styles.confirmButtonText}>Confirm Location</Text>
//             </TouchableOpacity>
//           </View>

//           {locationError && (
//             <View style={styles.errorBanner}>
//               <Text style={styles.errorText}>{locationError}</Text>
//             </View>
//           )}
//         </View>
//       </Modal>

//       {/* Nearest Sellers Map Modal */}
//       <Modal visible={showNearestSellers} animationType="slide">
//         <View style={styles.mapContainer}>
//           <MapView
//             style={styles.map}
//             region={{
//               ...userCoordinates || DEFAULT_REGION,
//               latitudeDelta: 0.0922,
//               longitudeDelta: 0.0421,
//             }}
//             showsUserLocation={true}
//           >
//             {userCoordinates && (
//               <Marker coordinate={userCoordinates}>
//                 <View style={styles.userMarker}>
//                   <Ionicons name="person" size={24} color="#2EC4B6" />
//                 </View>
//               </Marker>
//             )}

//             {nearestSellers.map((seller) => (
//               <Marker key={seller.id} coordinate={seller.coordinates}>
//                 <View style={styles.sellerMarker}>
//                   <Ionicons name="medkit" size={24} color="#FF6B6B" />
//                 </View>
//               </Marker>
//             ))}
//           </MapView>

//           <View style={styles.sellersListContainer}>
//             <View style={styles.sellersListHeader}>
//               <Text style={styles.sellersListTitle}>Nearest Sellers ({nearestSellers.length})</Text>
//               <TouchableOpacity onPress={() => setShowNearestSellers(false)} disabled={loading}>
//                 <Ionicons name="close" size={24} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>

//             {loading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#2EC4B6" />
//                 <Text style={styles.loadingText}>Loading sellers...</Text>
//               </View>
//             ) : nearestSellers.length === 0 ? (
//               <View style={styles.noSellersContainer}>
//                 <Ionicons name="sad-outline" size={48} color="#666666" />
//                 <Text style={styles.noSellersText}>No sellers found nearby</Text>
//                 <Text style={styles.noSellersSubText}>Try searching in a different area</Text>
//               </View>
//             ) : (
//               <ScrollView style={styles.sellersList}>
//                 {nearestSellers.map((seller) => (
//                   <TouchableOpacity
//                     key={seller.id}
//                     style={styles.sellerCard}
//                     onPress={() => {
//                       setMapRegion({
//                         ...seller.coordinates,
//                         latitudeDelta: 0.005,
//                         longitudeDelta: 0.005,
//                       });
//                     }}
//                   >
//                     <View style={styles.sellerInfo}>
//                       <Text style={styles.sellerName}>{seller.name}</Text>
//                       <View style={styles.sellerDetails}>
//                         <Ionicons name="star" size={16} color="#FFD700" />
//                         <Text style={styles.sellerRating}>{seller.rating}</Text>
//                         <Text style={styles.sellerDistance}>{seller.distance} away</Text>
//                       </View>
//                       <Text style={styles.sellerAddress}>{seller.address}</Text>
//                     </View>
//                     <View style={styles.selectSellerButton}>
//                       <Text style={styles.selectSellerText}>View</Text>
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             )}

//             <TouchableOpacity
//               style={[styles.confirmSellerButton, nearestSellers.length === 0 && styles.disabledButton]}
//               onPress={() => setShowNearestSellers(false)}
//               disabled={loading}
//             >
//               <Text style={styles.confirmSellerButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Cart Modal */}
//       {showCart && (
//         <Modal animationType="slide">
//           <View style={styles.cartModal}>
//             <View style={styles.cartHeader}>
//               <Text style={styles.cartTitle}>Your Cart</Text>
//               <TouchableOpacity
//                 onPress={() => setShowCart(false)}
//                 style={styles.closeCartButton}
//                 disabled={loading}
//               >
//                 <Ionicons name="close" size={24} color="#2EC4B6" />
//               </TouchableOpacity>
//             </View>

//             {loading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#2EC4B6" />
//                 <Text style={styles.loadingText}>Processing...</Text>
//               </View>
//             ) : cartItems.length === 0 ? (
//               <View style={styles.emptyCartContainer}>
//                 <Ionicons name="bag-outline" size={64} color="#9ADFD7" />
//                 <Text style={styles.emptyCartText}>Your cart is empty</Text>
//                 <Text style={styles.emptyCartSubText}>Add some medicines to get started</Text>
//                 <TouchableOpacity
//                   style={styles.continueShopping}
//                   onPress={() => setShowCart(false)}
//                 >
//                   <Text style={styles.continueShoppingText}>Continue Shopping</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <>
//                 <ScrollView style={styles.cartItemsList}>
//                   {cartItems.map((item) => (
//                     <View key={item.id} style={styles.cartItem}>
//                       <View style={styles.cartItemInfo}>
//                         <Text style={styles.cartItemName}>{item.name}</Text>
//                         <Text style={styles.cartItemManufacturer}>by {item.manufacturer}</Text>
//                         <Text style={styles.cartItemPrice}>₹{item.price} each</Text>
//                       </View>

//                       <View style={styles.quantityControls}>
//                         <TouchableOpacity
//                           style={styles.quantityButton}
//                           onPress={() => removeFromCart(item.id)}
//                         >
//                           <Ionicons name="remove" size={20} color="#2EC4B6" />
//                         </TouchableOpacity>

//                         <Text style={styles.quantityText}>{item.quantity}</Text>

//                         <TouchableOpacity
//                           style={styles.quantityButton}
//                           onPress={() => addToCart(item)}
//                         >
//                           <Ionicons name="add" size={20} color="#2EC4B6" />
//                         </TouchableOpacity>
//                       </View>

//                       <Text style={styles.cartItemTotal}>₹{item.price * item.quantity}</Text>
//                     </View>
//                   ))}
//                 </ScrollView>

//                 <View style={styles.cartFooter}>
//                   <View style={styles.totalSection}>
//                     <View style={styles.totalRow}>
//                       <Text style={styles.totalLabel}>Subtotal:</Text>
//                       <Text style={styles.totalValue}>₹{getTotalAmount()}</Text>
//                     </View>
//                     <View style={styles.totalRow}>
//                       <Text style={styles.totalLabel}>Delivery:</Text>
//                       <Text style={styles.deliveryFree}>FREE</Text>
//                     </View>
//                     <View style={[styles.totalRow, styles.grandTotalRow]}>
//                       <Text style={styles.grandTotalLabel}>Total:</Text>
//                       <Text style={styles.grandTotalValue}>₹{getTotalAmount()}</Text>
//                     </View>
//                   </View>

//                   <TouchableOpacity
//                     style={[styles.placeOrderButton, loading && styles.disabledButton]}
//                     onPress={placeOrder}
//                     activeOpacity={0.8}
//                     disabled={loading}
//                   >
//                     <Ionicons name="card" size={20} color="#000000" />
//                     <Text style={styles.placeOrderText}>Place Order</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         </Modal>
//       )}

//       {/* Main App Content */}
//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//         <View style={styles.topBar}>
//           <TouchableOpacity
//             style={styles.locationContainer}
//             onPress={() => setShowMap(true)}
//             activeOpacity={0.8}
//             disabled={loading}
//           >
//             <View style={styles.locationIconContainer}>
//               <Ionicons name="location" size={18} color="#2EC4B6" />
//             </View>
//             <Text style={styles.locationText} numberOfLines={1}>
//               {isLocating ? 'Detecting location...' : selectedLocation}
//             </Text>
//             <Ionicons name="chevron-down" size={16} color="#2EC4B6" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.cartButton}
//             onPress={() => setShowCart(true)}
//             activeOpacity={0.8}
//             disabled={loading}
//           >
//             <Ionicons name="bag-handle" size={24} color="#FFFFFF" />
//             {cartCount > 0 && (
//               <View style={styles.cartBadge}>
//                 <Text style={styles.cartBadgeText}>{cartCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         <View style={styles.welcomeSection}>
//           <Text style={styles.welcomeText}>Find Your Medicine</Text>
//           <Text style={styles.welcomeSubText}>Quick, reliable, and delivered to your door</Text>
//         </View>

//         <View style={styles.searchWrapper}>
//           <View style={styles.searchBar}>
//             <View style={styles.searchIconContainer}>
//               <Ionicons name="search" size={20} color="#2EC4B6" />
//             </View>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search medicines, brands, conditions..."
//               placeholderTextColor="#666666"
//               value={searchText}
//               onChangeText={handleSearchChange}
//               onFocus={handleSearchFocus}
//               editable={!loading}
//             />
//             {searchText.length > 0 && (
//               <TouchableOpacity
//                 onPress={() => {
//                   setSearchText('');
//                   setShowSuggestions(false);
//                 }}
//                 style={styles.clearButton}
//                 disabled={loading}
//               >
//                 <Ionicons name="close-circle" size={20} color="#666666" />
//               </TouchableOpacity>
//             )}
//           </View>
          
//           <TouchableOpacity
//             style={[styles.fymButton, loading && styles.disabledButton]}
//             activeOpacity={0.8}
//             onPress={findNearestSellers}
//             disabled={loading}
//           >
//             <Ionicons name="sparkles" size={18} color="#000000" />
//             <Text style={styles.fymButtonText}>FYM</Text>
//           </TouchableOpacity>
//         </View>

//         {showSuggestions && (
//           <View style={styles.medicineResultsContainer}>
//             <View style={styles.resultsHeader}>
//               <View style={styles.resultsHeaderRow}>
//                 <Text style={styles.resultsTitle}>
//                   {searchText ? `Results for "${searchText}"` : 'Popular Medicines'}
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSearchText('');
//                     setShowSuggestions(false);
//                   }}
//                   style={styles.cutButton}
//                   disabled={loading}
//                 >
//                   <Ionicons name="close" size={20} color="#FFFFFF" />
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.resultsCount}>{filteredMedicines.length} medicines found</Text>
//             </View>

//             {loading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#FFFFFF" />
//                 <Text style={styles.noResultsText}>Loading medicines...</Text>
//               </View>
//             ) : (
//               <ScrollView
//                 style={styles.medicineList}
//                 showsVerticalScrollIndicator={false}
//                 nestedScrollEnabled={true}
//               >
//                 {filteredMedicines.map((medicine) => (
//                   <View key={medicine._id} style={styles.medicineItem}>
//                     <View style={styles.medicineInfo}>
//                       <View style={styles.medicineHeader}>
//                         <Text style={styles.medicineName}>{medicine.name}</Text>
//                         <View
//                           style={[styles.stockBadge, !medicine.inStock && styles.outOfStockBadge]}
//                         >
//                           <Text
//                             style={[styles.stockText, !medicine.inStock && styles.outOfStockText]}
//                           >
//                             {medicine.inStock ? 'In Stock' : 'Out of Stock'}
//                           </Text>
//                         </View>
//                       </View>

//                       <Text style={styles.manufacturerText}>by {medicine.manufacturer}</Text>

//                       <View style={styles.medicineDetails}>
//                         <View style={styles.categoryTag}>
//                           <Text style={styles.categoryText}>{medicine.category}</Text>
//                         </View>
//                         <Text style={styles.priceText}>₹{medicine.price}</Text>
//                       </View>
//                     </View>

//                     <TouchableOpacity
//                       style={[styles.addToCartButton, !medicine.inStock && styles.disabledButton]}
//                       onPress={() => addToCart(medicine)}
//                       disabled={!medicine.inStock || loading}
//                       activeOpacity={0.7}
//                     >
//                       <Ionicons
//                         name={medicine.inStock ? 'add-circle' : 'ban'}
//                         size={24}
//                         color={medicine.inStock ? '#2EC4B6' : '#666'}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 ))}

//                 {filteredMedicines.length === 0 && searchText.length > 0 && (
//                   <View style={styles.noResultsContainer}>
//                     <Ionicons name="search" size={48} color="#9ADFD7" />
//                     <Text style={styles.noResultsText}>No medicines found</Text>
//                     <Text style={styles.noResultsSubText}>Try searching with different keywords</Text>
//                   </View>
//                 )}
//               </ScrollView>
//             )}
//           </View>
//         )}

//         {!showSuggestions && (
//           <>
//             <View style={styles.cardsSection}>
//               <Text style={styles.sectionTitle}>How would you like to get started?</Text>

//               <View style={styles.cardRow}>
//                 <TouchableOpacity
//                   style={styles.bigCard}
//                   activeOpacity={0.8}
//                   onPress={handleUploadPrescription}
//                   disabled={loading}
//                 >
//                   <View style={styles.cardIconContainer}>
//                     <View style={styles.cardIconBg}>
//                       <Ionicons name="camera" size={32} color="#000000" />
//                     </View>
//                   </View>
//                   <Text style={styles.cardTitle}>Upload Prescription</Text>
//                   <Text style={styles.cardSubText}>
//                     {prescriptionImage ? 'Prescription uploaded!' : 'Take a photo or upload your prescription'}
//                   </Text>
//                   {prescriptionImage && (
//                     <Image
//                       source={{ uri: `data:image/jpeg;base64,${prescriptionImage}` }}
//                       style={styles.prescriptionPreview}
//                     />
//                   )}
//                   <View style={styles.cardAction}>
//                     <Text style={styles.cardActionText}>
//                       {prescriptionImage ? 'Change Prescription' : 'Get Started'}
//                     </Text>
//                     <Ionicons name="arrow-forward" size={16} color="#2EC4B6" />
//                   </View>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.bigCard} activeOpacity={0.8} disabled={loading}>
//                   <View style={styles.cardIconContainer}>
//                     <View style={styles.cardIconBg}>
//                       <Ionicons name="chatbubble-ellipses" size={32} color="#000000" />
//                     </View>
//                   </View>
//                   <Text style={styles.cardTitle}>Need Help?</Text>
//                   <Text style={styles.cardSubText}>
//                     Chat with our pharmacists or get medicine recommendations
//                   </Text>
//                   <View style={styles.cardAction}>
//                     <Text style={styles.cardActionText}>Talk to Expert</Text>
//                     <Ionicons name="arrow-forward" size={16} color="#2EC4B6" />
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={styles.quickActionsSection}>
//               <Text style={styles.sectionTitle}>Quick Actions</Text>
//               <View style={styles.quickActionsRow}>
//                 <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading}>
//                   <View style={styles.quickActionIcon}>
//                     <Ionicons name="repeat" size={20} color="#000000" />
//                   </View>
//                   <Text style={styles.quickActionText}>Reorder</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading}>
//                   <View style={styles.quickActionIcon}>
//                     <Ionicons name="heart" size={20} color="#000000" />
//                   </View>
//                   <Text style={styles.quickActionText}>Wishlist</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading}>
//                   <View style={styles.quickActionIcon}>
//                     <Ionicons name="time" size={20} color="#000000" />
//                   </View>
//                   <Text style={styles.quickActionText}>Orders</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading}>
//                   <View style={styles.quickActionIcon}>
//                     <Ionicons name="call" size={20} color="#000000" />
//                   </View>
//                   <Text style={styles.quickActionText}>Support</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </>
//         )}
//       </ScrollView>

//       {loading && (
//         <View style={styles.globalLoading}>
//           <ActivityIndicator size="large" color="#2EC4B6" />
//           <Text style={styles.loadingText}>Please wait...</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// export default HomeScreen;


import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [prescriptionUri, setPrescriptionUri] = useState<string | null>(null); // Store the file URI
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

  useEffect(() => {
    (async () => {
      await requestLocationPermission();
      await getCurrentLocation();
      await fetchMedicines();
    })();
  }, []);

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
    
    if (!prescriptionImage && cartItems.length === 0) {
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

      // Append prescription image as file if exists
      if (prescriptionUri) {
        const filename = prescriptionUri.split('/').pop() || 'prescription.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('prescriptionImage', {
          uri: prescriptionUri,
          name: filename,
          type: type,
        } as any);
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

      Alert.alert(
        '🎉 Order Placed Successfully!',
        `Your order of ₹${getTotalAmount()} has been placed successfully!\n\n` +
        `Items: ${cartItems.length}\n` +
        `Delivery to: ${selectedLocation}\n\n` +
        `Nearby sellers have been notified and will contact you soon.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setCartItems([]);
              setCartCount(0);
              setShowCart(false);
              setPrescriptionImage(null);
              setPrescriptionUri(null);
            },
          },
        ]
      );
      
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
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        // Remove base64: true, we want the file URI instead
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPrescriptionUri(asset.uri); // Store the file URI
        setPrescriptionImage(asset.uri); // For preview display
        Alert.alert('Success', 'Prescription uploaded from gallery!');
        console.log('✅ Prescription image set from gallery:', asset.uri);
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
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        // Remove base64: true, we want the file URI instead
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPrescriptionUri(asset.uri); // Store the file URI
        setPrescriptionImage(asset.uri); // For preview display
        Alert.alert('Success', 'Prescription photo taken successfully!');
        console.log('✅ Prescription image set from camera:', asset.uri);
      }
    } catch (error) {
      console.error('❌ Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleUploadPrescription = async () => {
    console.log('🔄 Upload prescription clicked, current image:', prescriptionImage ? 'exists' : 'none');
    
    if (prescriptionImage) {
      Alert.alert(
        'Prescription Uploaded',
        'Would you like to change the prescription?',
        [
          { text: 'Change', onPress: () => showImagePickerOptions() },
          { text: 'Keep', style: 'cancel' },
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

      // Append prescription image as file if exists
      if (prescriptionUri) {
        const filename = prescriptionUri.split('/').pop() || 'prescription.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('prescriptionImage', {
          uri: prescriptionUri,
          name: filename,
          type: type,
        } as any);
      }

      console.log('🚀 Placing order with FormData');

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

      Alert.alert(
        '🎉 Order Placed Successfully!',
        `Your order of ₹${getTotalAmount()} has been placed. Nearby sellers have been notified and will contact you soon.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setCartItems([]);
              setCartCount(0);
              setShowCart(false);
              setPrescriptionImage(null);
              setPrescriptionUri(null);
            },
          },
        ]
      );
      
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
                  <Ionicons name="person" size={24} color="#2EC4B6" />
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
                <ActivityIndicator size="large" color="#2EC4B6" />
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
                <Ionicons name="close" size={24} color="#2EC4B6" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2EC4B6" />
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
                          <Ionicons name="remove" size={20} color="#2EC4B6" />
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => addToCart(item)}
                        >
                          <Ionicons name="add" size={20} color="#2EC4B6" />
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
              <Ionicons name="location" size={18} color="#2EC4B6" />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>
              {isLocating ? 'Detecting location...' : selectedLocation}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#2EC4B6" />
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
              <Ionicons name="search" size={20} color="#2EC4B6" />
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
                        color={medicine.inStock ? '#2EC4B6' : '#666'}
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
                    {prescriptionImage ? 'Prescription uploaded!' : 'Take a photo or upload your prescription'}
                  </Text>
                  {prescriptionImage && (
                    <Image
                      source={{ uri: prescriptionImage }} // Now using file URI directly
                      style={styles.prescriptionPreview}
                    />
                  )}
                  <View style={styles.cardAction}>
                    <Text style={styles.cardActionText}>
                      {prescriptionImage ? 'Change Prescription' : 'Get Started'}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#2EC4B6" />
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
                    <Ionicons name="arrow-forward" size={16} color="#2EC4B6" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="repeat" size={20} color="#000000" />
                  </View>
                  <Text style={styles.quickActionText}>Reorder</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="heart" size={20} color="#000000" />
                  </View>
                  <Text style={styles.quickActionText}>Wishlist</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="time" size={20} color="#000000" />
                  </View>
                  <Text style={styles.quickActionText}>Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} disabled={loading}>
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
          <ActivityIndicator size="large" color="#2EC4B6" />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;