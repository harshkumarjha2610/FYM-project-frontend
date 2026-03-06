// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TextInput,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   ScrollView,
// //   Alert,
// //   Modal,
// //   Image,
// //   ActionSheetIOS,
// //   Platform,
// //   ActivityIndicator,
// //   Linking
// // } from 'react-native';
// // import { router } from 'expo-router';
// // import * as ImagePicker from 'expo-image-picker';
// // import * as Location from 'expo-location';
// // import { 
// //   ArrowLeft, 
// //   User, 
// //   Mail, 
// //   Lock, 
// //   Eye, 
// //   EyeOff, 
// //   Phone, 
// //   Store, 
// //   UserPlus,
// //   FileText,
// //   MapPin,
// //   X,
// //   Plus,
// //   Trash2
// // } from 'lucide-react-native';
// // // import { API_URL } from '@env';
// // // API Configuration
// // // const API_URL = "https://rambackend-1-qmpn.onrender.com";
// // const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;
// // const DISCOUNT_OPTIONS = [
// //   { value: '5', label: '5% Discount' },
// //   { value: '10', label: '10% Discount' },
// //   { value: '12', label: '12% Discount' },
// //   { value: '15', label: '15% Discount' },
// // ];

// // interface Coordinates {
// //   latitude: number;
// //   longitude: number;
// // }

// // interface Region {
// //   latitude: number;
// //   longitude: number;
// //   latitudeDelta: number;
// //   longitudeDelta: number;
// // }

// // const DEFAULT_REGION: Region = {
// //   latitude: 25.5941,
// //   longitude: 85.1376,
// //   latitudeDelta: 0.0922,
// //   longitudeDelta: 0.0421,
// // };

// // export default function SellerRegisterScreen() {
// //   type ShopPhoto = {
// //     id: number;
// //     uri: string;
// //     name: string;
// //     type: string;
// //   };

// //   const [formData, setFormData] = useState<{
// //     name: string;
// //     email: string;
// //     phone: string;
// //     storeName: string;
// //     gstNumber: string;
// //     drugLicense1: string;
// //     drugLicense2: string;
// //     discount: string;
// //     location: string;
// //     coordinates: { lat: number; lng: number } | null;
// //     password: string;
// //     confirmPassword: string;
// //     shopPhotos: ShopPhoto[];
// //   }>({
// //     name: '',
// //     email: '',
// //     phone: '',
// //     storeName: '',
// //     gstNumber: '',
// //     drugLicense1: '',
// //     drugLicense2: '',
// //     discount:'',
// //     location: '',
// //     coordinates: null,
// //     password: '',
// //     confirmPassword: '',
// //     shopPhotos: [],
// //   });
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [isLocating, setIsLocating] = useState<boolean>(false);
// //   const [locationError, setLocationError] = useState<string | null>(null);
// //   const [selectedLocation, setSelectedLocation] = useState<string>('Enable GPS to get location');
// //   const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
// //   const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);
  
// //   useEffect(() => {
// //     (async () => {
// //       await getCurrentLocation();
// //     })();
// //   }, []);

// //       const getCurrentLocation = async () => {
// //       setIsLocating(true);
// //       setLocationError(null);
// //       try {
// //         const { status } = await Location.requestForegroundPermissionsAsync();
// //         if (status !== 'granted') {
// //           setLocationError('Permission to access location was denied');
// //           setSelectedLocation('Enable GPS to get location');
// //           Alert.alert(
// //             'GPS Required',
// //             'Please enable GPS to get your exact delivery address.',
// //             [
// //               { text: 'Cancel', style: 'cancel' },
// //               { text: 'Enable GPS', onPress: () => Linking.openSettings() },
// //             ]
// //           );
// //           return;
// //         }
  
// //         const location = await Location.getCurrentPositionAsync({
// //           accuracy: Location.Accuracy.High,
// //         });
  
// //         const { latitude, longitude } = location.coords;
// //         setUserCoordinates({ latitude, longitude });
  
// //         setMapRegion({
// //           latitude,
// //           longitude,
// //           latitudeDelta: 0.0922,
// //           longitudeDelta: 0.0421,
// //         });
  
// //         const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
// //         if (geocode.length > 0) {
// //           const addressData = geocode[0];
// //           const completeAddress = [
// //             addressData.name,
// //             addressData.street,
// //             addressData.district,
// //             addressData.city,
// //             addressData.region,
// //             addressData.postalCode,
// //             addressData.country,
// //           ]
// //             .filter(Boolean)
// //             .join(', ');
          
// //           setSelectedLocation(completeAddress);
// //         }
// //       } catch (error: any) {
// //         setLocationError('Could not determine your location');
// //         setSelectedLocation('Enable GPS to get location');
// //         console.error('Location error:', error);
// //         Alert.alert(
// //           'Location Error',
// //           'Unable to fetch your location. Please enable GPS and try again.',
// //           [
// //             { text: 'Cancel', style: 'cancel' },
// //             { text: 'Try Again', onPress: getCurrentLocation },
// //           ]
// //         );
// //       } finally {
// //         setIsLocating(false);
// //       }
// //     };

// //   // Enhanced console logging function
// //   const addDebugLog = (message: string, data?: any) => {
// //     const timestamp = new Date().toLocaleTimeString();
// //     const logMessage = `[${timestamp}] ${message}`;
// //     console.log(logMessage, data || '');
// //   };

// //   useEffect(() => {
// //     addDebugLog('🎬 Seller registration screen mounted');
    
// //     (async () => {
// //       addDebugLog('🔐 Requesting camera and media permissions...');
// //       const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
// //       const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

// //       addDebugLog('🔐 Permission status:', {
// //         camera: cameraStatus,
// //         media: mediaStatus,
// //       });

// //       if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
// //         addDebugLog('⚠️ Camera/media permissions not granted');
// //         Alert.alert('Permissions Required', 'Please grant camera and media permissions to use photo features');
// //       } else {
// //         addDebugLog('✅ Camera/media permissions granted');
// //       }
// //     })();
// //   }, []);

// //   // ✅ UPDATED REGISTRATION WITH MINIMAL REQUIRED FIELDS
// //   const handleRegister = async () => {
// //     addDebugLog('🚀 === SELLER REGISTRATION PROCESS STARTED ===');
// //     addDebugLog('📋 Registration Flow:');
// //     addDebugLog('  Step 1: Validate form data');
// //     addDebugLog('  Step 2: Send registration request to backend');
// //     addDebugLog('  Step 3: Backend creates seller account with status: PENDING');
// //     addDebugLog('  Step 4: Admin receives notification for approval');
// //     addDebugLog('  Step 5: Seller waits for admin approval');
// //     addDebugLog('  Step 6: Seller receives approval/rejection email');
    
// //     const { 
// //       name, 
// //       email, 
// //       phone, 
// //       storeName, 
// //       gstNumber, 
// //       drugLicense1, 
// //       drugLicense2, 
// //       location, 
// //       password, 
// //       confirmPassword
// //     } = formData;
    
// //     // ✅ MINIMAL VALIDATIONS - Only email and password required
// //     if (!email || !password) {
// //       Alert.alert('Error', 'Email and password are required');
// //       return;
// //     }

// //     if (password !== confirmPassword) {
// //       Alert.alert('Error', 'Passwords do not match');
// //       return;
// //     }

// //     if (password.length < 6) {
// //       Alert.alert('Error', 'Password must be at least 6 characters long');
// //       return;
// //     }

// //     // Optional validation for GST if provided
// //     if (gstNumber && gstNumber.length !== 15) {
// //       Alert.alert('Error', 'GST number must be 15 characters long');
// //       return;
// //     }

// //     if(!userCoordinates){
// //       Alert.alert('Error', 'Location not allowed!');
// //       return;
// //     }

// //     addDebugLog('✅ All validations passed');
// //     setLoading(true);

// //     try {
// //       // Simple JSON payload - only include fields that have values
// //       const payload: any = {
// //         email: email.toLowerCase().trim(),
// //         password: password,
// //         coordinates: userCoordinates
// //       };

// //       // Add optional fields only if they have values
// //       if (name) payload.ownerName = name;
// //       if (storeName) payload.pharmacyName = storeName;
// //       if (phone) payload.mobile = phone;
// //       if (gstNumber) payload.gstNumber = gstNumber.toUpperCase();
// //       if (drugLicense1) payload.drugLicense1 = drugLicense1;
// //       if (drugLicense2) payload.drugLicense2 = drugLicense2;
// //       if (formData.discount) payload.discount = formData.discount;
// //       if (location) payload.location = location;

// //       addDebugLog('📤 Sending payload:', payload);

// //       const response = await fetch(`${API_URL}/api/seller/register`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(payload),
// //       });

// //       addDebugLog('📦 Response status:', response.status);

// //       const data = await response.json();
// //       addDebugLog('📦 Response data:', data);

// //       if (response.ok && data.success) {
// //         Alert.alert('Success', 'Registration successful! Please wait for approval.', [
// //           { 
// //             text: 'OK', 
// //             onPress: () => router.push('/(auth)/seller-login')
// //           }
// //         ]);
// //       } else {
// //         Alert.alert('Registration Failed', data.message || 'Registration failed');
// //       }
      
// //     } catch (error: any) {
// //       addDebugLog('❌ === REGISTRATION ERROR ===');
// //       addDebugLog('💥 Error type:', error.name || 'Unknown');
// //       addDebugLog('💥 Error message:', error.message || 'Unknown error');
// //       addDebugLog('📋 Error details:', error);
// //       addDebugLog('🔌 Possible causes:');
// //       addDebugLog('  • Backend server is not running');
// //       addDebugLog('  • Network connection issue');
// //       addDebugLog('  • API endpoint is incorrect');
// //       addDebugLog('  • CORS policy blocking request');
// //       Alert.alert('Error', error.message || 'Network error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const updateFormData = (field: string, value: string) => {
// //     addDebugLog(`📝 Form field updated: ${field}`, {
// //       value: field.includes('password') ? '*'.repeat(value.length) : value,
// //       length: value.length,
// //       previousValue: formData[field as keyof typeof formData]
// //     });
    
// //     setFormData(prev => ({ ...prev, [field]: value }));
// //   };

// //   const handleAddPhoto = () => {
// //     addDebugLog('📸 Add photo action triggered');
// //     if (Platform.OS === 'ios') {
// //       ActionSheetIOS.showActionSheetWithOptions(
// //         {
// //           options: ['Cancel', 'Take Photo', 'Choose from Library'],
// //           cancelButtonIndex: 0,
// //         },
// //         (buttonIndex) => {
// //           if (buttonIndex === 1) {
// //             addDebugLog('📸 User selected: Take Photo');
// //             openCamera();
// //           } else if (buttonIndex === 2) {
// //             addDebugLog('📸 User selected: Choose from Library');
// //             openImageLibrary();
// //           } else {
// //             addDebugLog('📸 User canceled photo selection');
// //           }
// //         }
// //       );
// //     } else {
// //       Alert.alert(
// //         'Add Photo',
// //         'Choose an option',
// //         [
// //           { text: 'Cancel', style: 'cancel', onPress: () => addDebugLog('📸 User canceled photo selection') },
// //           { text: 'Take Photo', onPress: () => {
// //             addDebugLog('📸 User selected: Take Photo');
// //             openCamera();
// //           }},
// //           { text: 'Choose from Library', onPress: () => {
// //             addDebugLog('📸 User selected: Choose from Library');
// //             openImageLibrary();
// //           }},
// //         ]
// //       );
// //     }
// //   };

// //   const openCamera = async () => {
// //     addDebugLog('📷 Opening camera...');
// //     try {
// //       const result = await ImagePicker.launchCameraAsync({
// //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //         allowsEditing: true,
// //         aspect: [4, 3],
// //         quality: 0.8,
// //       });

// //       addDebugLog('📷 Camera result:', {
// //         canceled: result.canceled,
// //         assetsCount: result.assets?.length || 0
// //       });

// //       if (!result.canceled && result.assets) {
// //         const photo = {
// //           id: Date.now(),
// //           uri: result.assets[0].uri,
// //           name: `shop_photo_${Date.now()}.jpg`,
// //           type: result.assets[0].type || 'image/jpeg',
// //         };
        
// //         setFormData(prev => ({
// //           ...prev,
// //           shopPhotos: [...prev.shopPhotos, photo]
// //         }));
        
// //         addDebugLog('✅ Photo added from camera', {
// //           photoId: photo.id,
// //           uriPreview: photo.uri.substring(0, 50) + '...',
// //           totalPhotos: formData.shopPhotos.length + 1
// //         });
// //       }
// //     } catch (error: any) {
// //       addDebugLog('❌ Camera error:', error.message);
// //       Alert.alert('Error', 'Failed to open camera');
// //     }
// //   };

// //   const openImageLibrary = async () => {
// //     addDebugLog('🖼️ Opening image library...');
// //     try {
// //       const result = await ImagePicker.launchImageLibraryAsync({
// //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //         allowsEditing: true,
// //         aspect: [4, 3],
// //         quality: 0.8,
// //       });

// //       addDebugLog('🖼️ Library result:', {
// //         canceled: result.canceled,
// //         assetsCount: result.assets?.length || 0
// //       });

// //       if (!result.canceled && result.assets) {
// //         const photo = {
// //           id: Date.now(),
// //           uri: result.assets[0].uri,
// //           name: `shop_photo_${Date.now()}.jpg`,
// //           type: result.assets[0].type || 'image/jpeg',
// //         };
        
// //         setFormData(prev => ({
// //           ...prev,
// //           shopPhotos: [...prev.shopPhotos, photo]
// //         }));
        
// //         addDebugLog('✅ Photo added from library', {
// //           photoId: photo.id,
// //           uriPreview: photo.uri.substring(0, 50) + '...',
// //           totalPhotos: formData.shopPhotos.length + 1
// //         });
// //       }
// //     } catch (error: any) {
// //       addDebugLog('❌ Image library error:', error.message);
// //       Alert.alert('Error', 'Failed to open image library');
// //     }
// //   };

// //   const removePhoto = (photoId: number) => {
// //     addDebugLog('🗑️ Removing photo', {
// //       photoId: photoId,
// //       totalPhotosBefore: formData.shopPhotos.length
// //     });
    
// //     setFormData(prev => ({
// //       ...prev,
// //       shopPhotos: prev.shopPhotos.filter(photo => photo.id !== photoId)
// //     }));
    
// //     addDebugLog('✅ Photo removed', {
// //       photoId: photoId,
// //       totalPhotosAfter: formData.shopPhotos.length - 1
// //     });
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
// //         <View style={styles.header}>
// //           <TouchableOpacity
// //             style={styles.backButton}
// //             onPress={() => {
// //               addDebugLog('🔙 Back button pressed');
// //               router.back();
// //             }}
// //           >
// //             <ArrowLeft color="#3B82F6" size={24} strokeWidth={2} />
// //           </TouchableOpacity>
// //           <Text style={styles.headerTitle}>Seller Registration</Text>
// //         </View>

// //         <View style={styles.content}>
// //           <View style={styles.titleContainer}>
// //             <Text style={styles.title}>Join as Seller</Text>
// //             <Text style={styles.subtitle}>
// //               Register your pharmacy to start selling medicines
// //             </Text>
// //           </View>

// //           <View style={styles.form}>
// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Full Name</Text>
// //               <View style={styles.inputWrapper}>
// //                 <User color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Enter your full name"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.name}
// //                   onChangeText={(value) => updateFormData('name', value)}
// //                   editable={!loading}
// //                 />
// //               </View>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Store/Pharmacy Name</Text>
// //               <View style={styles.inputWrapper}>
// //                 <Store color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Enter your store name"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.storeName}
// //                   onChangeText={(value) => updateFormData('storeName', value)}
// //                   editable={!loading}
// //                 />
// //               </View>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Email Address</Text>
// //               <View style={styles.inputWrapper}>
// //                 <Mail color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Enter your email"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.email}
// //                   onChangeText={(value) => updateFormData('email', value)}
// //                   keyboardType="email-address"
// //                   autoCapitalize="none"
// //                   editable={!loading}
// //                 />
// //               </View>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Phone Number</Text>
// //               <View style={styles.inputWrapper}>
// //                 <Phone color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Enter your phone number"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.phone}
// //                   onChangeText={(value) => updateFormData('phone', value)}
// //                   keyboardType="phone-pad"
// //                   editable={!loading}
// //                 />
// //               </View>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>GST Number</Text>
// //               <View style={styles.inputWrapper}>
// //                 <FileText color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Enter 15-digit GST number"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.gstNumber}
// //                   onChangeText={(value) => updateFormData('gstNumber', value.toUpperCase())}
// //                   maxLength={15}
// //                   autoCapitalize="characters"
// //                   editable={!loading}
// //                 />
// //               </View>
// //               <Text style={styles.helperText}>Format: 22AAAAA0000A1Z5</Text>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Drug License Number 1</Text>
// //               <View style={styles.inputWrapper}>
// //                 <FileText color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Enter first drug license number"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.drugLicense1}
// //                   onChangeText={(value) => updateFormData('drugLicense1', value)}
// //                   editable={!loading}
// //                 />
// //               </View>
// //               <Text style={styles.helperText}>Required for selling medicines</Text>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Drug License Number 2</Text>
// //               <View style={styles.inputWrapper}>
// //                 <FileText color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Enter second drug license number"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.drugLicense2}
// //                   onChangeText={(value) => updateFormData('drugLicense2', value)}
// //                   editable={!loading}
// //                 />
// //               </View>
// //               <Text style={styles.helperText}>Additional license for compliance</Text>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Customer Discount Offer</Text>
// //               <Text style={styles.helperText}>Select the discount percentage you want to offer to customers</Text>
              
// //               <View style={styles.discountGrid}>
// //                 {DISCOUNT_OPTIONS.map((option) => (
// //                   <TouchableOpacity
// //                     key={option.value}
// //                     style={[
// //                       styles.discountOption,
// //                       formData.discount === option.value && styles.discountOptionSelected
// //                     ]}
// //                     onPress={() => {
// //                       addDebugLog(`💰 Discount selected: ${option.value}%`);
// //                       updateFormData('discount', option.value);
// //                     }}
// //                     disabled={loading}
// //                     activeOpacity={0.7}
// //                   >
// //                     <View style={[
// //                       styles.discountCircle,
// //                       formData.discount === option.value && styles.discountCircleSelected
// //                     ]}>
// //                       <Text style={[
// //                         styles.discountPercentage,
// //                         formData.discount === option.value && styles.discountPercentageSelected
// //                       ]}>
// //                         {option.value}%
// //                       </Text>
// //                     </View>
// //                     <Text style={[
// //                       styles.discountLabel,
// //                       formData.discount === option.value && styles.discountLabelSelected
// //                     ]}>
// //                       {option.label}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
              
// //               <View style={styles.discountInfo}>
// //                 <Text style={styles.discountInfoTitle}>Benefits of offering discounts:</Text>
// //                 <Text style={styles.discountInfoText}>• Attract more customers to your pharmacy</Text>
// //                 <Text style={styles.discountInfoText}>• Increase order frequency and customer loyalty</Text>
// //                 <Text style={styles.discountInfoText}>• Stand out from competitors in your area</Text>
// //                 <Text style={styles.discountInfoText}>• Build trust with new customers</Text>
// //               </View>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Pharmacy Location</Text>
// //               <View style={styles.inputWrapper}>
// //                 <MapPin color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Enter your pharmacy address manually"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.location}
// //                   onChangeText={(value) => updateFormData('location', value)}
// //                   multiline
// //                   editable={!loading}
// //                 />
// //               </View>
// //               <Text style={styles.helperText}>Enter your complete pharmacy address</Text>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Shop Photos</Text>
// //               <Text style={styles.helperText}>Add photos of your pharmacy/store (optional but recommended)</Text>
              
// //               <View style={styles.photoGrid}>
// //                 {formData.shopPhotos.map((photo) => (
// //                   <View key={photo.id} style={styles.photoItem}>
// //                     <Image source={{ uri: photo.uri }} style={styles.photoImage} />
// //                     <TouchableOpacity
// //                       style={styles.removePhotoButton}
// //                       onPress={() => removePhoto(photo.id)}
// //                       disabled={loading}
// //                     >
// //                       <Trash2 color="#FFFFFF" size={16} />
// //                     </TouchableOpacity>
// //                   </View>
// //                 ))}
                
// //                 {formData.shopPhotos.length < 6 && (
// //                   <TouchableOpacity
// //                     style={styles.addPhotoButton}
// //                     onPress={handleAddPhoto}
// //                     disabled={loading}
// //                   >
// //                     <Plus color="#6B7280" size={24} />
// //                     <Text style={styles.addPhotoText}>Add Photo</Text>
// //                   </TouchableOpacity>
// //                 )}
// //               </View>
              
// //               <View style={styles.photoGuidelines}>
// //                 <Text style={styles.guidelinesTitle}>Photo Guidelines (Optional):</Text>
// //                 <Text style={styles.guidelinesText}>• Take clear photos of your store front</Text>
// //                 <Text style={styles.guidelinesText}>• Include interior shots showing medicine displays</Text>
// //                 <Text style={styles.guidelinesText}>• Make sure your store name is visible</Text>
// //                 <Text style={styles.guidelinesText}>• Maximum 6 photos allowed</Text>
// //                 <Text style={styles.guidelinesText}>• Photos help build customer trust</Text>
// //               </View>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Password</Text>
// //               <View style={styles.inputWrapper}>
// //                 <Lock color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Create a password (min. 6 characters)"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.password}
// //                   onChangeText={(value) => updateFormData('password', value)}
// //                   secureTextEntry={!showPassword}
// //                   editable={!loading}
// //                 />
// //                 <TouchableOpacity
// //                   onPress={() => {
// //                     addDebugLog('👁️ Toggling password visibility');
// //                     setShowPassword(!showPassword);
// //                   }}
// //                   style={styles.eyeButton}
// //                   disabled={loading}
// //                 >
// //                   {showPassword ? (
// //                     <EyeOff color="#6B7280" size={20} strokeWidth={2} />
// //                   ) : (
// //                     <Eye color="#6B7280" size={20} strokeWidth={2} />
// //                   )}
// //                 </TouchableOpacity>
// //               </View>
// //             </View>

// //             <View style={styles.inputContainer}>
// //               <Text style={styles.label}>Confirm Password</Text>
// //               <View style={styles.inputWrapper}>
// //                 <Lock color="#6B7280" size={20} strokeWidth={2} />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Confirm your password"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={formData.confirmPassword}
// //                   onChangeText={(value) => updateFormData('confirmPassword', value)}
// //                   secureTextEntry={!showConfirmPassword}
// //                   editable={!loading}
// //                 />
// //                 <TouchableOpacity
// //                   onPress={() => {
// //                     addDebugLog('👁️ Toggling confirm password visibility');
// //                     setShowConfirmPassword(!showConfirmPassword);
// //                   }}
// //                   style={styles.eyeButton}
// //                   disabled={loading}
// //                 >
// //                   {showConfirmPassword ? (
// //                     <EyeOff color="#6B7280" size={20} strokeWidth={2} />
// //                   ) : (
// //                     <Eye color="#6B7280" size={20} strokeWidth={2} />
// //                   )}
// //                 </TouchableOpacity>
// //               </View>
// //             </View>

// //             <TouchableOpacity
// //               style={[styles.registerButton, loading && styles.registerButtonDisabled]}
// //               onPress={handleRegister}
// //               disabled={loading}
// //               activeOpacity={0.8}
// //             >
// //               <View style={styles.registerButtonBackground}>
// //                 {loading ? (
// //                   <ActivityIndicator size="small" color="#FFFFFF" />
// //                 ) : (
// //                   <UserPlus color="#FFFFFF" size={20} strokeWidth={2} />
// //                 )}
// //                 <Text style={styles.registerButtonText}>
// //                   {loading ? 'Creating Account...' : 'Create Seller Account'}
// //                 </Text>
// //               </View>
// //             </TouchableOpacity>

// //             <View style={styles.loginContainer}>
// //               <Text style={styles.loginText}>Already have an account? </Text>
// //               <TouchableOpacity 
// //                 onPress={() => {
// //                   addDebugLog('🔀 Navigating to seller login');
// //                   router.push('/(auth)/seller-login');
// //                 }}
// //                 disabled={loading}
// //               >
// //                 <Text style={[styles.loginLink, loading && styles.loginLinkDisabled]}>
// //                   Login here
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // // Add your styles here (styles object)



// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#FFFFFF',
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 24,
// //     paddingVertical: 16,
// //     marginTop: 40,
// //   },
// //   backButton: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#EFF6FF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 16,
// //   },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: '#1F2937',
// //   },
// //   content: {
// //     flex: 1,
// //     paddingHorizontal: 24,
// //     paddingVertical: 32,
// //   },
// //   titleContainer: {
// //     alignItems: 'center',
// //     marginBottom: 32,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: '700',
// //     color: '#1F2937',
// //     marginBottom: 8,
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#6B7280',
// //     textAlign: 'center',
// //     lineHeight: 24,
// //   },
// //   form: {
// //     gap: 20,
// //   },
// //   inputContainer: {
// //     gap: 8,
// //   },
// //   label: {
// //     fontSize: 16,
// //     fontWeight: '500',
// //     color: '#374151',
// //   },
// //   inputWrapper: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#F9FAFB',
// //     borderWidth: 1,
// //     borderColor: '#E5E7EB',
// //     borderRadius: 12,
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //   },
// //   input: {
// //     flex: 1,
// //     fontSize: 16,
// //     color: '#1F2937',
// //     marginLeft: 12,
// //   },
// //   helperText: {
// //     fontSize: 12,
// //     color: '#6B7280',
// //     marginTop: 4,
// //   },
// //   eyeButton: {
// //     padding: 4,
// //   },
// //   photoGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 12,
// //     marginTop: 8,
// //   },
// //   photoItem: {
// //     position: 'relative',
// //     width: 100,
// //     height: 100,
// //   },
// //   photoImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 8,
// //     backgroundColor: '#F3F4F6',
// //   },
// //   removePhotoButton: {
// //     position: 'absolute',
// //     top: -8,
// //     right: -8,
// //     backgroundColor: '#EF4444',
// //     borderRadius: 12,
// //     width: 24,
// //     height: 24,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 2,
// //     borderColor: '#FFFFFF',
// //   },
// //   addPhotoButton: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 8,
// //     borderWidth: 2,
// //     borderColor: '#D1D5DB',
// //     borderStyle: 'dashed',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#F9FAFB',
// //   },
// //   addPhotoText: {
// //     fontSize: 12,
// //     color: '#6B7280',
// //     marginTop: 4,
// //     textAlign: 'center',
// //   },
// //   photoGuidelines: {
// //     marginTop: 12,
// //     padding: 16,
// //     backgroundColor: '#F0F9FF',
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: '#E0F2FE',
// //   },
// //   guidelinesTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#0369A1',
// //     marginBottom: 8,
// //   },
// //   guidelinesText: {
// //     fontSize: 12,
// //     color: '#0369A1',
// //     lineHeight: 16,
// //     marginBottom: 4,
// //   },
// //   registerButton: {
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //     marginTop: 8,
// //     backgroundColor: '#3B82F6',
// //   },
// //   registerButtonDisabled: {
// //     opacity: 0.6,
// //   },
// //   registerButtonBackground: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 16,
// //     gap: 8,
// //   },
// //   registerButtonText: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#FFFFFF',
// //   },
// //   loginContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginTop: 16,
// //   },
// //   loginText: {
// //     fontSize: 14,
// //     color: '#6B7280',
// //   },
// //   loginLink: {
// //     fontSize: 14,
// //     color: '#3B82F6',
// //     fontWeight: '500',
// //   },
// //   loginLinkDisabled: {
// //     opacity: 0.5,
// //   },
// //   discountGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 12,
// //     marginTop: 12,
// //   },
// //   discountOption: {
// //     flex: 1,
// //     minWidth: '45%',
// //     backgroundColor: '#F9FAFB',
// //     borderWidth: 2,
// //     borderColor: '#E5E7EB',
// //     borderRadius: 12,
// //     padding: 16,
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   discountOptionSelected: {
// //     backgroundColor: '#EFF6FF',
// //     borderColor: '#3B82F6',
// //   },
// //   discountCircle: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: '#FFFFFF',
// //     borderWidth: 2,
// //     borderColor: '#E5E7EB',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   discountCircleSelected: {
// //     backgroundColor: '#3B82F6',
// //     borderColor: '#3B82F6',
// //   },
// //   discountPercentage: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: '#374151',
// //   },
// //   discountPercentageSelected: {
// //     color: '#FFFFFF',
// //   },
// //   discountLabel: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: '#6B7280',
// //     textAlign: 'center',
// //   },
// //   discountLabelSelected: {
// //     color: '#3B82F6',
// //   },
// //   discountInfo: {
// //     marginTop: 16,
// //     padding: 16,
// //     backgroundColor: '#F0FDF4',
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: '#D1FAE5',
// //   },
// //   discountInfoTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#065F46',
// //     marginBottom: 8,
// //   },
// //   discountInfoText: {
// //     fontSize: 12,
// //     color: '#065F46',
// //     lineHeight: 16,
// //     marginBottom: 4,
// //   },

// // });


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Alert,
//   Modal,
//   Image,
//   ActionSheetIOS,
//   Platform,
//   ActivityIndicator,
//   Linking
// } from 'react-native';
// import { router } from 'expo-router';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';
// import { 
//   ArrowLeft, 
//   User, 
//   Mail, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   Phone, 
//   Store, 
//   UserPlus,
//   FileText,
//   MapPin,
//   X,
//   Plus,
//   Trash2
// } from 'lucide-react-native';
// // import { API_URL } from '@env';
// // API Configuration
// // const API_URL = "https://rambackend-1-qmpn.onrender.com ";
// const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;
// const DISCOUNT_OPTIONS = [
//   { value: '5', label: '5% Discount' },
//   { value: '10', label: '10% Discount' },
//   { value: '12', label: '12% Discount' },
//   { value: '15', label: '15% Discount' },
// ];

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

// const DEFAULT_REGION: Region = {
//   latitude: 25.5941,
//   longitude: 85.1376,
//   latitudeDelta: 0.0922,
//   longitudeDelta: 0.0421,
// };

// export default function SellerRegisterScreen() {
//   type ShopPhoto = {
//     id: number;
//     uri: string;
//     name: string;
//     type: string;
//   };

//   const [formData, setFormData] = useState<{
//     name: string;
//     email: string;
//     phone: string;
//     storeName: string;
//     gstNumber: string;
//     drugLicense1: string;
//     drugLicense2: string;
//     discount: string;
//     location: string;
//     coordinates: { lat: number; lng: number } | null;
//     password: string;
//     confirmPassword: string;
//     shopPhotos: ShopPhoto[];
//   }>({
//     name: '',
//     email: '',
//     phone: '',
//     storeName: '',
//     gstNumber: '',
//     drugLicense1: '',
//     drugLicense2: '',
//     discount:'',
//     location: '',
//     coordinates: null,
//     password: '',
//     confirmPassword: '',
//     shopPhotos: [],
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isLocating, setIsLocating] = useState<boolean>(false);
//   const [locationError, setLocationError] = useState<string | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState<string>('Enable GPS to get location');
//   const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
//   const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);
  
//   useEffect(() => {
//     (async () => {
//       await getCurrentLocation();
//     })();
//   }, []);

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
        
//         setSelectedLocation(completeAddress);
//         // ✅ Update formData.location with the fetched address
//         setFormData(prev => ({ ...prev, location: completeAddress }));
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

//   // Enhanced console logging function
//   const addDebugLog = (message: string, data?: any) => {
//     const timestamp = new Date().toLocaleTimeString();
//     const logMessage = `[${timestamp}] ${message}`;
//     console.log(logMessage, data || '');
//   };

//   useEffect(() => {
//     addDebugLog('🎬 Seller registration screen mounted');
    
//     (async () => {
//       addDebugLog('🔐 Requesting camera and media permissions...');
//       const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
//       const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       addDebugLog('🔐 Permission status:', {
//         camera: cameraStatus,
//         media: mediaStatus,
//       });

//       if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
//         addDebugLog('⚠️ Camera/media permissions not granted');
//         Alert.alert('Permissions Required', 'Please grant camera and media permissions to use photo features');
//       } else {
//         addDebugLog('✅ Camera/media permissions granted');
//       }
//     })();
//   }, []);

//   // ✅ UPDATED REGISTRATION WITH MINIMAL REQUIRED FIELDS
//   const handleRegister = async () => {
//     addDebugLog('🚀 === SELLER REGISTRATION PROCESS STARTED ===');
//     addDebugLog('📋 Registration Flow:');
//     addDebugLog('  Step 1: Validate form data');
//     addDebugLog('  Step 2: Send registration request to backend');
//     addDebugLog('  Step 3: Backend creates seller account with status: PENDING');
//     addDebugLog('  Step 4: Admin receives notification for approval');
//     addDebugLog('  Step 5: Seller waits for admin approval');
//     addDebugLog('  Step 6: Seller receives approval/rejection email');
    
//     const { 
//       name, 
//       email, 
//       phone, 
//       storeName, 
//       gstNumber, 
//       drugLicense1, 
//       drugLicense2, 
//       location, 
//       password, 
//       confirmPassword
//     } = formData;
    
//     // ✅ MINIMAL VALIDATIONS - Only email and password required
//     if (!email || !password) {
//       Alert.alert('Error', 'Email and password are required');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters long');
//       return;
//     }

//     // Optional validation for GST if provided
//     if (gstNumber && gstNumber.length !== 15) {
//       Alert.alert('Error', 'GST number must be 15 characters long');
//       return;
//     }

//     if(!userCoordinates){
//       Alert.alert('Error', 'Location not allowed!');
//       return;
//     }

//     addDebugLog('✅ All validations passed');
//     setLoading(true);

//     try {
//       // Simple JSON payload - only include fields that have values
//       const payload: any = {
//         email: email.toLowerCase().trim(),
//         password: password,
//         coordinates: userCoordinates
//       };

//       // Add optional fields only if they have values
//       if (name) payload.ownerName = name;
//       if (storeName) payload.pharmacyName = storeName;
//       if (phone) payload.mobile = phone;
//       if (gstNumber) payload.gstNumber = gstNumber.toUpperCase();
//       if (drugLicense1) payload.drugLicense1 = drugLicense1;
//       if (drugLicense2) payload.drugLicense2 = drugLicense2;
//       if (formData.discount) payload.discount = formData.discount;
//       if (location) payload.location = location;

//       addDebugLog('📤 Sending payload:', payload);

//       const response = await fetch(`${API_URL}/api/seller/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       addDebugLog('📦 Response status:', response.status);

//       const data = await response.json();
//       addDebugLog('📦 Response data:', data);

//       if (response.ok && data.success) {
//         Alert.alert('Success', 'Registration successful! Please wait for approval.', [
//           { 
//             text: 'OK', 
//             onPress: () => router.push('/(auth)/seller-login')
//           }
//         ]);
//       } else {
//         Alert.alert('Registration Failed', data.message || 'Registration failed');
//       }
      
//     } catch (error: any) {
//       addDebugLog('❌ === REGISTRATION ERROR ===');
//       addDebugLog('💥 Error type:', error.name || 'Unknown');
//       addDebugLog('💥 Error message:', error.message || 'Unknown error');
//       addDebugLog('📋 Error details:', error);
//       addDebugLog('🔌 Possible causes:');
//       addDebugLog('  • Backend server is not running');
//       addDebugLog('  • Network connection issue');
//       addDebugLog('  • API endpoint is incorrect');
//       addDebugLog('  • CORS policy blocking request');
//       Alert.alert('Error', error.message || 'Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateFormData = (field: string, value: string) => {
//     addDebugLog(`📝 Form field updated: ${field}`, {
//       value: field.includes('password') ? '*'.repeat(value.length) : value,
//       length: value.length,
//       previousValue: formData[field as keyof typeof formData]
//     });
    
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleAddPhoto = () => {
//     addDebugLog('📸 Add photo action triggered');
//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Library'],
//           cancelButtonIndex: 0,
//         },
//         (buttonIndex) => {
//           if (buttonIndex === 1) {
//             addDebugLog('📸 User selected: Take Photo');
//             openCamera();
//           } else if (buttonIndex === 2) {
//             addDebugLog('📸 User selected: Choose from Library');
//             openImageLibrary();
//           } else {
//             addDebugLog('📸 User canceled photo selection');
//           }
//         }
//       );
//     } else {
//       Alert.alert(
//         'Add Photo',
//         'Choose an option',
//         [
//           { text: 'Cancel', style: 'cancel', onPress: () => addDebugLog('📸 User canceled photo selection') },
//           { text: 'Take Photo', onPress: () => {
//             addDebugLog('📸 User selected: Take Photo');
//             openCamera();
//           }},
//           { text: 'Choose from Library', onPress: () => {
//             addDebugLog('📸 User selected: Choose from Library');
//             openImageLibrary();
//           }},
//         ]
//       );
//     }
//   };

//   const openCamera = async () => {
//     addDebugLog('📷 Opening camera...');
//     try {
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       addDebugLog('📷 Camera result:', {
//         canceled: result.canceled,
//         assetsCount: result.assets?.length || 0
//       });

//       if (!result.canceled && result.assets) {
//         const photo = {
//           id: Date.now(),
//           uri: result.assets[0].uri,
//           name: `shop_photo_${Date.now()}.jpg`,
//           type: result.assets[0].type || 'image/jpeg',
//         };
        
//         setFormData(prev => ({
//           ...prev,
//           shopPhotos: [...prev.shopPhotos, photo]
//         }));
        
//         addDebugLog('✅ Photo added from camera', {
//           photoId: photo.id,
//           uriPreview: photo.uri.substring(0, 50) + '...',
//           totalPhotos: formData.shopPhotos.length + 1
//         });
//       }
//     } catch (error: any) {
//       addDebugLog('❌ Camera error:', error.message);
//       Alert.alert('Error', 'Failed to open camera');
//     }
//   };

//   const openImageLibrary = async () => {
//     addDebugLog('🖼️ Opening image library...');
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       addDebugLog('🖼️ Library result:', {
//         canceled: result.canceled,
//         assetsCount: result.assets?.length || 0
//       });

//       if (!result.canceled && result.assets) {
//         const photo = {
//           id: Date.now(),
//           uri: result.assets[0].uri,
//           name: `shop_photo_${Date.now()}.jpg`,
//           type: result.assets[0].type || 'image/jpeg',
//         };
        
//         setFormData(prev => ({
//           ...prev,
//           shopPhotos: [...prev.shopPhotos, photo]
//         }));
        
//         addDebugLog('✅ Photo added from library', {
//           photoId: photo.id,
//           uriPreview: photo.uri.substring(0, 50) + '...',
//           totalPhotos: formData.shopPhotos.length + 1
//         });
//       }
//     } catch (error: any) {
//       addDebugLog('❌ Image library error:', error.message);
//       Alert.alert('Error', 'Failed to open image library');
//     }
//   };

//   const removePhoto = (photoId: number) => {
//     addDebugLog('🗑️ Removing photo', {
//       photoId: photoId,
//       totalPhotosBefore: formData.shopPhotos.length
//     });
    
//     setFormData(prev => ({
//       ...prev,
//       shopPhotos: prev.shopPhotos.filter(photo => photo.id !== photoId)
//     }));
    
//     addDebugLog('✅ Photo removed', {
//       photoId: photoId,
//       totalPhotosAfter: formData.shopPhotos.length - 1
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => {
//               addDebugLog('🔙 Back button pressed');
//               router.back();
//             }}
//           >
//             <ArrowLeft color="#3B82F6" size={24} strokeWidth={2} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Seller Registration</Text>
//         </View>

//         <View style={styles.content}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.title}>Join as Seller</Text>
//             <Text style={styles.subtitle}>
//               Register your pharmacy to start selling medicines
//             </Text>
//           </View>

//           <View style={styles.form}>
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Full Name</Text>
//               <View style={styles.inputWrapper}>
//                 <User color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your full name"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.name}
//                   onChangeText={(value) => updateFormData('name', value)}
//                   editable={!loading}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Store/Pharmacy Name</Text>
//               <View style={styles.inputWrapper}>
//                 <Store color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your store name"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.storeName}
//                   onChangeText={(value) => updateFormData('storeName', value)}
//                   editable={!loading}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Email Address</Text>
//               <View style={styles.inputWrapper}>
//                 <Mail color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your email"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.email}
//                   onChangeText={(value) => updateFormData('email', value)}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   editable={!loading}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Phone Number</Text>
//               <View style={styles.inputWrapper}>
//                 <Phone color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your phone number"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.phone}
//                   onChangeText={(value) => updateFormData('phone', value)}
//                   keyboardType="phone-pad"
//                   editable={!loading}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>GST Number</Text>
//               <View style={styles.inputWrapper}>
//                 <FileText color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter 15-digit GST number"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.gstNumber}
//                   onChangeText={(value) => updateFormData('gstNumber', value.toUpperCase())}
//                   maxLength={15}
//                   autoCapitalize="characters"
//                   editable={!loading}
//                 />
//               </View>
//               <Text style={styles.helperText}>Format: 22AAAAA0000A1Z5</Text>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Drug License Number 1</Text>
//               <View style={styles.inputWrapper}>
//                 <FileText color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter first drug license number"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.drugLicense1}
//                   onChangeText={(value) => updateFormData('drugLicense1', value)}
//                   editable={!loading}
//                 />
//               </View>
//               <Text style={styles.helperText}>Required for selling medicines</Text>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Drug License Number 2</Text>
//               <View style={styles.inputWrapper}>
//                 <FileText color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter second drug license number"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.drugLicense2}
//                   onChangeText={(value) => updateFormData('drugLicense2', value)}
//                   editable={!loading}
//                 />
//               </View>
//               <Text style={styles.helperText}>Additional license for compliance</Text>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Customer Discount Offer</Text>
//               <Text style={styles.helperText}>Select the discount percentage you want to offer to customers</Text>
              
//               <View style={styles.discountGrid}>
//                 {DISCOUNT_OPTIONS.map((option) => (
//                   <TouchableOpacity
//                     key={option.value}
//                     style={[
//                       styles.discountOption,
//                       formData.discount === option.value && styles.discountOptionSelected
//                     ]}
//                     onPress={() => {
//                       addDebugLog(`💰 Discount selected: ${option.value}%`);
//                       updateFormData('discount', option.value);
//                     }}
//                     disabled={loading}
//                     activeOpacity={0.7}
//                   >
//                     <View style={[
//                       styles.discountCircle,
//                       formData.discount === option.value && styles.discountCircleSelected
//                     ]}>
//                       <Text style={[
//                         styles.discountPercentage,
//                         formData.discount === option.value && styles.discountPercentageSelected
//                       ]}>
//                         {option.value}%
//                       </Text>
//                     </View>
//                     <Text style={[
//                       styles.discountLabel,
//                       formData.discount === option.value && styles.discountLabelSelected
//                     ]}>
//                       {option.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
              
//               <View style={styles.discountInfo}>
//                 <Text style={styles.discountInfoTitle}>Benefits of offering discounts:</Text>
//                 <Text style={styles.discountInfoText}>• Attract more customers to your pharmacy</Text>
//                 <Text style={styles.discountInfoText}>• Increase order frequency and customer loyalty</Text>
//                 <Text style={styles.discountInfoText}>• Stand out from competitors in your area</Text>
//                 <Text style={styles.discountInfoText}>• Build trust with new customers</Text>
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Pharmacy Location</Text>
//               <View style={styles.inputWrapper}>
//                 <MapPin color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your pharmacy address manually"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.location} // ✅ Now shows GPS-fetched address by default
//                   onChangeText={(value) => updateFormData('location', value)}
//                   multiline
//                   editable={!loading}
//                 />
//               </View>
//               <Text style={styles.helperText}>
//                 {isLocating ? 'Fetching location...' : locationError ? locationError : 'GPS location fetched automatically. You can edit if needed.'}
//               </Text>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Shop Photos</Text>
//               <Text style={styles.helperText}>Add photos of your pharmacy/store (optional but recommended)</Text>
              
//               <View style={styles.photoGrid}>
//                 {formData.shopPhotos.map((photo) => (
//                   <View key={photo.id} style={styles.photoItem}>
//                     <Image source={{ uri: photo.uri }} style={styles.photoImage} />
//                     <TouchableOpacity
//                       style={styles.removePhotoButton}
//                       onPress={() => removePhoto(photo.id)}
//                       disabled={loading}
//                     >
//                       <Trash2 color="#FFFFFF" size={16} />
//                     </TouchableOpacity>
//                   </View>
//                 ))}
                
//                 {formData.shopPhotos.length < 6 && (
//                   <TouchableOpacity
//                     style={styles.addPhotoButton}
//                     onPress={handleAddPhoto}
//                     disabled={loading}
//                   >
//                     <Plus color="#6B7280" size={24} />
//                     <Text style={styles.addPhotoText}>Add Photo</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
              
//               <View style={styles.photoGuidelines}>
//                 <Text style={styles.guidelinesTitle}>Photo Guidelines (Optional):</Text>
//                 <Text style={styles.guidelinesText}>• Take clear photos of your store front</Text>
//                 <Text style={styles.guidelinesText}>• Include interior shots showing medicine displays</Text>
//                 <Text style={styles.guidelinesText}>• Make sure your store name is visible</Text>
//                 <Text style={styles.guidelinesText}>• Maximum 6 photos allowed</Text>
//                 <Text style={styles.guidelinesText}>• Photos help build customer trust</Text>
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Password</Text>
//               <View style={styles.inputWrapper}>
//                 <Lock color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Create a password (min. 6 characters)"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.password}
//                   onChangeText={(value) => updateFormData('password', value)}
//                   secureTextEntry={!showPassword}
//                   editable={!loading}
//                 />
//                 <TouchableOpacity
//                   onPress={() => {
//                     addDebugLog('👁️ Toggling password visibility');
//                     setShowPassword(!showPassword);
//                   }}
//                   style={styles.eyeButton}
//                   disabled={loading}
//                 >
//                   {showPassword ? (
//                     <EyeOff color="#6B7280" size={20} strokeWidth={2} />
//                   ) : (
//                     <Eye color="#6B7280" size={20} strokeWidth={2} />
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Confirm Password</Text>
//               <View style={styles.inputWrapper}>
//                 <Lock color="#6B7280" size={20} strokeWidth={2} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Confirm your password"
//                   placeholderTextColor="#9CA3AF"
//                   value={formData.confirmPassword}
//                   onChangeText={(value) => updateFormData('confirmPassword', value)}
//                   secureTextEntry={!showConfirmPassword}
//                   editable={!loading}
//                 />
//                 <TouchableOpacity
//                   onPress={() => {
//                     addDebugLog('👁️ Toggling confirm password visibility');
//                     setShowConfirmPassword(!showConfirmPassword);
//                   }}
//                   style={styles.eyeButton}
//                   disabled={loading}
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff color="#6B7280" size={20} strokeWidth={2} />
//                   ) : (
//                     <Eye color="#6B7280" size={20} strokeWidth={2} />
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={[styles.registerButton, loading && styles.registerButtonDisabled]}
//               onPress={handleRegister}
//               disabled={loading}
//               activeOpacity={0.8}
//             >
//               <View style={styles.registerButtonBackground}>
//                 {loading ? (
//                   <ActivityIndicator size="small" color="#FFFFFF" />
//                 ) : (
//                   <UserPlus color="#FFFFFF" size={20} strokeWidth={2} />
//                 )}
//                 <Text style={styles.registerButtonText}>
//                   {loading ? 'Creating Account...' : 'Create Seller Account'}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <View style={styles.loginContainer}>
//               <Text style={styles.loginText}>Already have an account? </Text>
//               <TouchableOpacity 
//                 onPress={() => {
//                   addDebugLog('🔀 Navigating to seller login');
//                   router.push('/(auth)/seller-login');
//                 }}
//                 disabled={loading}
//               >
//                 <Text style={[styles.loginLink, loading && styles.loginLinkDisabled]}>
//                   Login here
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // Add your styles here (styles object)

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//     marginTop: 40,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#EFF6FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingVertical: 32,
//   },
//   titleContainer: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   form: {
//     gap: 20,
//   },
//   inputContainer: {
//     gap: 8,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#374151',
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#1F2937',
//     marginLeft: 12,
//   },
//   helperText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   eyeButton: {
//     padding: 4,
//   },
//   photoGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginTop: 8,
//   },
//   photoItem: {
//     position: 'relative',
//     width: 100,
//     height: 100,
//   },
//   photoImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 8,
//     backgroundColor: '#F3F4F6',
//   },
//   removePhotoButton: {
//     position: 'absolute',
//     top: -8,
//     right: -8,
//     backgroundColor: '#EF4444',
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   addPhotoButton: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     borderStyle: 'dashed',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//   },
//   addPhotoText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   photoGuidelines: {
//     marginTop: 12,
//     padding: 16,
//     backgroundColor: '#F0F9FF',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E0F2FE',
//   },
//   guidelinesTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#0369A1',
//     marginBottom: 8,
//   },
//   guidelinesText: {
//     fontSize: 12,
//     color: '#0369A1',
//     lineHeight: 16,
//     marginBottom: 4,
//   },
//   registerButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginTop: 8,
//     backgroundColor: '#3B82F6',
//   },
//   registerButtonDisabled: {
//     opacity: 0.6,
//   },
//   registerButtonBackground: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     gap: 8,
//   },
//   registerButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   loginText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   loginLink: {
//     fontSize: 14,
//     color: '#3B82F6',
//     fontWeight: '500',
//   },
//   loginLinkDisabled: {
//     opacity: 0.5,
//   },
//   discountGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginTop: 12,
//   },
//   discountOption: {
//     flex: 1,
//     minWidth: '45%',
//     backgroundColor: '#F9FAFB',
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   discountOptionSelected: {
//     backgroundColor: '#EFF6FF',
//     borderColor: '#3B82F6',
//   },
//   discountCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   discountCircleSelected: {
//     backgroundColor: '#3B82F6',
//     borderColor: '#3B82F6',
//   },
//   discountPercentage: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#374151',
//   },
//   discountPercentageSelected: {
//     color: '#FFFFFF',
//   },
//   discountLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   discountLabelSelected: {
//     color: '#3B82F6',
//   },
//   discountInfo: {
//     marginTop: 16,
//     padding: 16,
//     backgroundColor: '#F0FDF4',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#D1FAE5',
//   },
//   discountInfoTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#065F46',
//     marginBottom: 8,
//   },
//   discountInfoText: {
//     fontSize: 12,
//     color: '#065F46',
//     lineHeight: 16,
//     marginBottom: 4,
//   },

// });


import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  Store, 
  UserPlus,
  FileText,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Camera,
  Shield,
  Sparkles,
  Navigation,
  ChevronRight,
  ChevronLeft,
  Award
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;
const { width, height } = Dimensions.get('window');

const DISCOUNT_OPTIONS = [
  { value: '5', label: '5% Off', color: '#10B981', bgColor: '#D1FAE5' },
  { value: '10', label: '10% Off', color: '#3B82F6', bgColor: '#DBEAFE' },
  { value: '12', label: '12% Off', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { value: '15', label: '15% Off', color: '#F59E0B', bgColor: '#FEF3C7' },
];

interface Coordinates {
  latitude: number;
  longitude: number;
}

type ShopPhoto = {
  id: number;
  uri: string;
  name: string;
  type: string;
};

export default function SellerRegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    gstNumber: '',
    drugLicense1: '',
    drugLicense2: '',
    discount: '',
    location: '',
    coordinates: null as Coordinates | null,
    password: '',
    confirmPassword: '',
    shopPhotos: [] as ShopPhoto[],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  useEffect(() => {
    (async () => {
      await getCurrentLocation();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  const getCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location access is needed for pharmacy verification');
        setIsLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
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
        ].filter(Boolean).join(', ');

        setFormData(prev => ({
          ...prev,
          location: completeAddress,
          coordinates: { latitude, longitude }
        }));
      }
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      setIsLocating(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const photo = {
        id: Date.now(),
        uri: result.assets[0].uri,
        name: `shop_photo_${Date.now()}.jpg`,
        type: result.assets[0].type || 'image/jpeg',
      };
      
      setFormData(prev => ({
        ...prev,
        shopPhotos: [...prev.shopPhotos, photo]
      }));
    }
  };

  const removePhoto = (photoId: number) => {
    setFormData(prev => ({
      ...prev,
      shopPhotos: prev.shopPhotos.filter(photo => photo.id !== photoId)
    }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        Alert.alert('Error', 'Please enter your full name (at least 2 characters)');
        return false;
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }
    
    if (step === 2) {
      if (!formData.storeName.trim()) {
        Alert.alert('Error', 'Please enter your pharmacy name');
        return false;
      }
      if (formData.gstNumber && formData.gstNumber.length !== 15) {
        Alert.alert('Error', 'GST number must be exactly 15 characters');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.coordinates) {
        Alert.alert('Error', 'Location access is required for pharmacy verification');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleRegister = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      const payload: any = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        coordinates: formData.coordinates,
      };

      if (formData.name) payload.ownerName = formData.name;
      if (formData.storeName) payload.pharmacyName = formData.storeName;
      if (formData.phone) payload.mobile = formData.phone;
      if (formData.gstNumber) payload.gstNumber = formData.gstNumber.toUpperCase();
      if (formData.drugLicense1) payload.drugLicense1 = formData.drugLicense1;
      if (formData.drugLicense2) payload.drugLicense2 = formData.drugLicense2;
      if (formData.discount) payload.discount = formData.discount;
      if (formData.location) payload.location = formData.location;

      const response = await fetch(`${API_URL}/api/seller/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert(
          'Registration Submitted!', 
          'Your pharmacy registration is under review. You will receive an email once approved.', 
          [{ text: 'OK', onPress: () => router.push('/(auth)/seller-login') }]
        );
      } else {
        Alert.alert('Registration Failed', data.message || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Unable to connect to server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    field: string,
    icon: React.ReactNode,
    placeholder: string,
    options: {
      keyboardType?: any;
      autoCapitalize?: any;
      secureTextEntry?: boolean;
      multiline?: boolean;
      maxLength?: number;
      showToggle?: boolean;
      toggleValue?: boolean;
      onToggle?: () => void;
    } = {}
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputContainer,
        formData[field as keyof typeof formData] && (formData[field as keyof typeof formData] || "").toString().length > 0 && styles.inputContainerFilled
      ]}>
        <View style={styles.inputIconContainer}>
          {icon}
        </View>
        <TextInput
          style={[
            styles.input,
            options.multiline && styles.inputMultiline
          ]}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={formData[field as keyof typeof formData] as string}
          onChangeText={(value) => updateFormData(field, value)}
          editable={!loading}
          {...options}
        />
        {options.showToggle && (
          <TouchableOpacity onPress={options.onToggle} style={styles.eyeButton}>
            {options.toggleValue ? (
              <EyeOff size={20} color="#4F46E5" />
            ) : (
              <Eye size={20} color="#94A3B8" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep === step && styles.stepCircleActive,
            currentStep > step && styles.stepCircleCompleted
          ]}>
            {currentStep > step ? (
              <CheckCircle2 size={20} color="#FFFFFF" />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep === step && styles.stepNumberActive
              ]}>{step}</Text>
            )}
          </View>
          <Text style={[
            styles.stepLabel,
            currentStep === step && styles.stepLabelActive
          ]}>
            {step === 1 ? 'Account' : step === 2 ? 'Business' : 'Verification'}
          </Text>
          {step < 3 && <View style={[
            styles.stepLine,
            currentStep > step && styles.stepLineActive
          ]} />}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {/* Floating Elements */}
        <View style={styles.floatingElement1}>
          <Store size={32} color="rgba(255,255,255,0.15)" />
        </View>
        <View style={styles.floatingElement2}>
          <Shield size={24} color="rgba(255,255,255,0.2)" />
        </View>
        <View style={styles.floatingElement3}>
          <Sparkles size={20} color="rgba(255,255,255,0.25)" />
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
                disabled={loading}
              >
                <View style={styles.backButtonInner}>
                  <ChevronLeft size={24} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              
              <View style={styles.headerContent}>
                <View style={styles.iconBadge}>
                  <Store size={28} color="#4F46E5" />
                </View>
                <Text style={styles.headerTitle}>Seller Registration</Text>
                <Text style={styles.headerSubtitle}>Join our pharmacy network</Text>
              </View>
            </View>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Form Card */}
            <Animated.View 
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
                }
              ]}
            >
              {currentStep === 1 && (
                <View style={styles.formSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <Text style={styles.sectionSubtitle}>Create your seller account</Text>
                  </View>

                  {renderInput(
                    'Full Name *',
                    'name',
                    <User size={20} color="#94A3B8" />,
                    'Enter your full name',
                    { autoCapitalize: 'words' }
                  )}

                  {renderInput(
                    'Email Address *',
                    'email',
                    <Mail size={20} color="#94A3B8" />,
                    'Enter your business email',
                    { keyboardType: 'email-address', autoCapitalize: 'none' }
                  )}

                  {renderInput(
                    'Phone Number',
                    'phone',
                    <Phone size={20} color="#94A3B8" />,
                    'Enter your contact number',
                    { keyboardType: 'phone-pad', maxLength: 10 }
                  )}

                  {renderInput(
                    'Password *',
                    'password',
                    <Lock size={20} color="#94A3B8" />,
                    'Create a secure password (min 6 chars)',
                    {
                      secureTextEntry: !showPassword,
                      showToggle: true,
                      toggleValue: showPassword,
                      onToggle: () => setShowPassword(!showPassword)
                    }
                  )}

                  {renderInput(
                    'Confirm Password *',
                    'confirmPassword',
                    <Lock size={20} color="#94A3B8" />,
                    'Confirm your password',
                    {
                      secureTextEntry: !showConfirmPassword,
                      showToggle: true,
                      toggleValue: showConfirmPassword,
                      onToggle: () => setShowConfirmPassword(!showConfirmPassword)
                    }
                  )}

                  <TouchableOpacity 
                    style={styles.nextButton}
                    onPress={handleNext}
                  >
                    <LinearGradient
                      colors={['#4F46E5', '#7C3AED']}
                      style={styles.nextButtonGradient}
                    >
                      <Text style={styles.nextButtonText}>Continue</Text>
                      <ChevronRight size={20} color="#FFFFFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {currentStep === 2 && (
                <View style={styles.formSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Business Details</Text>
                    <Text style={styles.sectionSubtitle}>Tell us about your pharmacy</Text>
                  </View>

                  {renderInput(
                    'Pharmacy Name *',
                    'storeName',
                    <Store size={20} color="#94A3B8" />,
                    'Enter your pharmacy/store name'
                  )}

                  {renderInput(
                    'GST Number',
                    'gstNumber',
                    <FileText size={20} color="#94A3B8" />,
                    '15-digit GST number (optional)',
                    { maxLength: 15, autoCapitalize: 'characters' }
                  )}

                  {renderInput(
                    'Drug License 1',
                    'drugLicense1',
                    <Award size={20} color="#94A3B8" />,
                    'Primary drug license number'
                  )}

                  {renderInput(
                    'Drug License 2',
                    'drugLicense2',
                    <Award size={20} color="#94A3B8" />,
                    'Secondary drug license number'
                  )}

                  <View style={styles.discountSection}>
                    <Text style={styles.inputLabel}>Customer Discount Offer</Text>
                    <Text style={styles.discountSubtitle}>Select discount to attract more customers</Text>
                    
                    <View style={styles.discountGrid}>
                      {DISCOUNT_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.discountOption,
                            formData.discount === option.value && { 
                              backgroundColor: option.bgColor,
                              borderColor: option.color 
                            }
                          ]}
                          onPress={() => updateFormData('discount', option.value)}
                        >
                          <Text style={[
                            styles.discountText,
                            { color: option.color },
                            formData.discount === option.value && { fontWeight: '800' }
                          ]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={styles.backStepButton}
                      onPress={() => setCurrentStep(1)}
                    >
                      <Text style={styles.backStepButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.nextButtonFlex}
                      onPress={handleNext}
                    >
                      <LinearGradient
                        colors={['#4F46E5', '#7C3AED']}
                        style={styles.nextButtonGradient}
                      >
                        <Text style={styles.nextButtonText}>Continue</Text>
                        <ChevronRight size={20} color="#FFFFFF" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {currentStep === 3 && (
                <View style={styles.formSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Location & Photos</Text>
                    <Text style={styles.sectionSubtitle}>Verify your pharmacy location</Text>
                  </View>

                  {/* Location Card */}
                  <View style={styles.locationCard}>
                    <View style={styles.locationIconContainer}>
                      <Navigation size={24} color="#4F46E5" />
                    </View>
                    <View style={styles.locationContent}>
                      <Text style={styles.locationTitle}>Pharmacy Location</Text>
                      <Text style={styles.locationAddress} numberOfLines={2}>
                        {formData.location || 'Fetching location...'}
                      </Text>
                      {isLocating && (
                        <ActivityIndicator size="small" color="#4F46E5" style={styles.locationLoader} />
                      )}
                    </View>
                    <TouchableOpacity 
                      style={styles.refreshLocationButton}
                      onPress={getCurrentLocation}
                      disabled={isLocating}
                    >
                      <MapPin size={18} color="#4F46E5" />
                    </TouchableOpacity>
                  </View>

                  {/* Photos Section */}
                  <View style={styles.photosSection}>
                    <Text style={styles.inputLabel}>Shop Photos</Text>
                    <Text style={styles.photosSubtitle}>Add photos to build trust (optional)</Text>
                    
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={styles.photosScroll}
                    >
                      {formData.shopPhotos.map((photo) => (
                        <View key={photo.id} style={styles.photoItem}>
                          <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                          <TouchableOpacity
                            style={styles.removePhotoButton}
                            onPress={() => removePhoto(photo.id)}
                          >
                            <Trash2 size={14} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      
                      {formData.shopPhotos.length < 6 && (
                        <TouchableOpacity
                          style={styles.addPhotoButton}
                          onPress={handleAddPhoto}
                        >
                          <View style={styles.addPhotoIcon}>
                            <Camera size={24} color="#4F46E5" />
                          </View>
                          <Text style={styles.addPhotoText}>Add Photo</Text>
                        </TouchableOpacity>
                      )}
                    </ScrollView>
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={styles.backStepButton}
                      onPress={() => setCurrentStep(2)}
                    >
                      <Text style={styles.backStepButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                      onPress={handleRegister}
                      disabled={loading}
                    >
                      <LinearGradient
                        colors={loading ? ['#A5B4FC', '#C4B5FD'] : ['#4F46E5', '#7C3AED']}
                        style={styles.registerButtonGradient}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <Text style={styles.registerButtonText}>Submit</Text>
                            <UserPlus size={20} color="#FFFFFF" />
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Animated.View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.trustBadge}>
                <Shield size={16} color="#4F46E5" />
                <Text style={styles.trustText}>Verified & Secure</Text>
              </View>
              <Text style={styles.footerText}>Already registered? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/seller-login')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  background: {
    flex: 1,
  },
  floatingElement1: {
    position: 'absolute',
    top: height * 0.08,
    right: width * 0.1,
    transform: [{ rotate: '15deg' }],
    opacity: 0.3,
  },
  floatingElement2: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.05,
    transform: [{ rotate: '-10deg' }],
    opacity: 0.4,
  },
  floatingElement3: {
    position: 'absolute',
    top: height * 0.15,
    right: width * 0.25,
    transform: [{ rotate: '20deg' }],
    opacity: 0.35,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerContent: {
    alignItems: 'center',
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  stepCircleActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stepNumberActive: {
    color: '#4F46E5',
  },
  stepLabel: {
    position: 'absolute',
    top: 48,
    width: 80,
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#10B981',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
    minHeight: 400,
  },
  formSection: {
    gap: 16,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 56,
  },
  inputContainerFilled: {
    borderColor: '#C7D2FE',
    backgroundColor: '#FFFFFF',
  },
  inputIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
    paddingVertical: 12,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  eyeButton: {
    padding: 8,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonFlex: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backStepButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backStepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  discountSection: {
    marginTop: 8,
  },
  discountSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    marginLeft: 4,
  },
  discountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  discountOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    minWidth: 80,
    alignItems: 'center',
  },
  discountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationContent: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  locationLoader: {
    marginTop: 8,
  },
  refreshLocationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photosSection: {
    marginTop: 8,
  },
  photosSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    marginLeft: 4,
  },
  photosScroll: {
    flexDirection: 'row',
  },
  photoItem: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  addPhotoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addPhotoText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  registerButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  trustText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footerText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 4,
  },
});