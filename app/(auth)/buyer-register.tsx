// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Linking
// } from 'react-native';
// import { router } from 'expo-router';
// import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, MapPin, Home } from 'lucide-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Location from 'expo-location';

// // import { API_URL } froenv';m '@

// // const API_URL = "https://rambackend-1-qmpn.onrender.com";
// const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

// type RegisterRequestBody = {
//   name: string;
//   email: string;
//   password: string;
//   mobile?: string;
//   address?: string;
//   pincode?: string;
// };


// export default function BuyerRegisterScreen() {
//   console.log('BuyerRegisterScreen component rendered');
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     password: '',
//     confirmPassword: '',
//     address: '',
//     pincode: '',
//   });
//   console.log('Initial formData state set:', formData);
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);


//   console.log('Initial component states set - showPassword:', showPassword, 'showConfirmPassword:', showConfirmPassword, 'loading:', loading);


//   const updateFormData = (field: keyof typeof formData, value: string) => {
//     console.log('Updating form field:', field, 'with value:', value);
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     console.log('Form data updated for field:', field);
//   };

//   const validateForm = () => {
//     console.log('Starting form validation...');
//     const { name, email, password, confirmPassword, mobile, pincode } = formData;
//     console.log('Form data to validate:', { name, email, mobile, pincode, passwordLength: password.length });

//     // Required fields
//     if (!name.trim()) {
//       console.log('Validation failed: Name is empty');
//       Alert.alert('Error', 'Please enter your full name');
//       return false;
//     }
//     console.log('Name validation passed');
    
//     if (name.trim().length < 2) {
//       console.log('Validation failed: Name too short');
//       Alert.alert('Error', 'Name must be at least 2 characters long');
//       return false;
//     }
//     console.log('Name length validation passed');

//     if (!email.trim()) {
//       console.log('Validation failed: Email is empty');
//       Alert.alert('Error', 'Please enter your email address');
//       return false;
//     }
//     console.log('Email presence validation passed');
    
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       console.log('Validation failed: Invalid email format');
//       Alert.alert('Error', 'Please enter a valid email address');
//       return false;
//     }
//     console.log('Email format validation passed');

//     if (!password) {
//       console.log('Validation failed: Password is empty');
//       Alert.alert('Error', 'Please enter a password');
//       return false;
//     }
//     console.log('Password presence validation passed');
    
//     if (password.length < 8) {
//       console.log('Validation failed: Password too short');
//       Alert.alert('Error', 'Password must be at least 8 characters long');
//       return false;
//     }
//     console.log('Password length validation passed');

//     if (password !== confirmPassword) {
//       console.log('Validation failed: Passwords do not match');
//       Alert.alert('Error', 'Passwords do not match');
//       return false;
//     }
//     console.log('Password confirmation validation passed');

//     // Optional fields validation
//     if (mobile.trim() && !/^[6-9][0-9]{9}$/.test(mobile.trim())) {
//       console.log('Validation failed: Invalid mobile number format');
//       Alert.alert('Error', 'Please enter a valid 10-digit Indian mobile number');
//       return false;
//     }
//     console.log('Mobile number validation passed');

//     if (pincode.trim() && !/^[1-9][0-9]{5}$/.test(pincode.trim())) {
//       console.log('Validation failed: Invalid pincode format');
//       Alert.alert('Error', 'Please enter a valid 6-digit pincode');
//       return false;
//     }
//     console.log('Pincode validation passed');
//     console.log('All form validations passed successfully');

//     return true;
//   };

//   const handleRegister = async () => {
//     console.log('handleRegister function called');
//     console.log('Current form data:', formData);
    
//     if (!validateForm()) {
//       console.log('Form validation failed, aborting registration');
//       return;
//     }
//     console.log('Form validation successful, proceeding with registration');

//     setLoading(true);
//     console.log('Loading state set to true');

//     try {
//       const { name, email, password, mobile, address, pincode } = formData;
//       console.log('Destructured form data:', { name, email, mobile, address, pincode });
      
//       const requestBody: RegisterRequestBody = {
//         name: name.trim(),
//         email: email.trim().toLowerCase(),
//         password: password,
//       };
//       console.log('Base request body created:', requestBody);

//       // Add optional fields if they have values
//       if (mobile.trim()) {
//         requestBody.mobile = mobile.trim();
//         console.log('Added mobile to request body');
//       }
//       if (address.trim()) {
//         requestBody.address = address.trim();
//         console.log('Added address to request body');
//       }
//       if (pincode.trim()) {
//         requestBody.pincode = pincode.trim();
//         console.log('Added pincode to request body');
//       }

//       console.log('Final registration request body:', requestBody);
//       console.log('Making API call to:', `${API_URL}/api/buyer/register`);

//       const response = await fetch(`${API_URL}/api/buyer/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       console.log('API response received');
//       console.log('Response status:', response.status);
//       console.log('Response ok:', response.ok);
      
//       const data = await response.json();
//       console.log('Response data parsed:', data);

//       if (response.ok || data.success) {
//         console.log('Registration successful, storing auth data...');
        
//         // Store authentication data
//         await AsyncStorage.setItem('token', data.data.token);
//         console.log('Token stored in AsyncStorage');
        
//         await AsyncStorage.setItem('refreshToken', data.data.refreshToken);
//         console.log('Refresh token stored in AsyncStorage');
        
//         await AsyncStorage.setItem('user', JSON.stringify(data.data.buyer));
//         console.log('User data stored in AsyncStorage');
        
//         console.log("Entered the success block");
        
//         Alert.alert('Success', data.message || 'Registration successful!', [
//           {
//             text: 'OK',
//             onPress: () => {
//               console.log('Alert OK button pressed, navigating to login...');
//               router.push('/(auth)/buyer-login');
//               console.log('Navigation to buyer-login triggered');
//             },
//           },
//         ]);
//         console.log("Alert displayed with navigation to login");
        
//       } else {
//         console.log('Registration failed with response:', data);
        
//         // Handle validation errors
//         if (data.errors && Array.isArray(data.errors)) {
//           console.log('Validation errors found:', data.errors);
//           Alert.alert('Validation Error', data.errors.join('\n'));
//         } else {
//           console.log('General registration error:', data.message);
//           Alert.alert('Registration Failed', data.message || 'Registration failed');
//         }
//       }
//     } catch (error) {
//       console.error('Registration error caught:', error);
//       if (error instanceof Error) {
//         console.log('Error details:', error.message);
//       } else {
//         console.log('Error details:', error);
//       }
//       Alert.alert('Error', 'Unable to connect to server. Please check your connection.');
//     } finally {
//       setLoading(false);
//       console.log('Loading state set to false');
//       console.log('Registration process completed');
//     }
//   };

//   // Rest of your component remains the same...
//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView 
//         style={styles.container} 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity 
//               style={styles.backButton} 
//               onPress={() => {
//                 console.log('Back button pressed');
//                 router.back();
//                 console.log('Router.back() called');
//               }}
//               disabled={loading}
//             >
//               <ArrowLeft size={20} color="#14B8A6" />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle}>Buyer Registration</Text>
//           </View>

//           {/* Content */}
//           <View style={styles.content}>
//             <View style={styles.titleContainer}>
//               <Text style={styles.title}>Create Account</Text>
//               <Text style={styles.subtitle}>Sign up to start ordering medicines</Text>
//             </View>

//             {/* Form */}
//             <View style={styles.form}>
//               {/* Required Fields */}
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Required Information</Text>
                
//                 {/* Name */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Full Name *</Text>
//                   <View style={styles.inputWrapper}>
//                     <User size={20} color="#9CA3AF" />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter your full name"
//                       placeholderTextColor="#9CA3AF"
//                       value={formData.name}
//                       onChangeText={(value) => updateFormData('name', value)}
//                       autoCapitalize="words"
//                       editable={!loading}
//                     />
//                   </View>
//                 </View>

//                 {/* Email */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Email Address *</Text>
//                   <View style={styles.inputWrapper}>
//                     <Mail size={20} color="#9CA3AF" />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter your email"
//                       placeholderTextColor="#9CA3AF"
//                       value={formData.email}
//                       onChangeText={(value) => updateFormData('email', value)}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                       editable={!loading}
//                     />
//                   </View>
//                 </View>

//                 {/* Password */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Password *</Text>
//                   <View style={styles.inputWrapper}>
//                     <Lock size={20} color="#9CA3AF" />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Create a strong password"
//                       placeholderTextColor="#9CA3AF"
//                       value={formData.password}
//                       onChangeText={(value) => updateFormData('password', value)}
//                       secureTextEntry={!showPassword}
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                       editable={!loading}
//                     />
//                     <TouchableOpacity
//                       onPress={() => {
//                         console.log('Password eye button pressed, current state:', showPassword);
//                         setShowPassword(!showPassword);
//                         console.log('Password visibility toggled to:', !showPassword);
//                       }}
//                       style={styles.eyeButton}
//                       disabled={loading}
//                     >
//                       {showPassword ? (
//                         <EyeOff size={20} color="#9CA3AF" />
//                       ) : (
//                         <Eye size={20} color="#9CA3AF" />
//                       )}
//                     </TouchableOpacity>
//                   </View>
//                   <Text style={styles.helperText}>
//                     Must be at least 8 characters long
//                   </Text>
//                 </View>

//                 {/* Confirm Password */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Confirm Password *</Text>
//                   <View style={styles.inputWrapper}>
//                     <Lock size={20} color="#9CA3AF" />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Confirm your password"
//                       placeholderTextColor="#9CA3AF"
//                       value={formData.confirmPassword}
//                       onChangeText={(value) => updateFormData('confirmPassword', value)}
//                       secureTextEntry={!showConfirmPassword}
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                       editable={!loading}
//                     />
//                     <TouchableOpacity
//                       onPress={() => {
//                         console.log('Confirm password eye button pressed, current state:', showConfirmPassword);
//                         setShowConfirmPassword(!showConfirmPassword);
//                         console.log('Confirm password visibility toggled to:', !showConfirmPassword);
//                       }}
//                       style={styles.eyeButton}
//                       disabled={loading}
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff size={20} color="#9CA3AF" />
//                       ) : (
//                         <Eye size={20} color="#9CA3AF" />
//                       )}
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>

//               {/* Optional Fields */}
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Additional Information (Optional)</Text>

//                 {/* Mobile */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Mobile Number</Text>
//                   <View style={styles.inputWrapper}>
//                     <Phone size={20} color="#9CA3AF" />
//                     <Text style={styles.countryCode}>+91</Text>
//                     <TextInput
//                       style={styles.input}
//                       placeholder="10-digit mobile number"
//                       placeholderTextColor="#9CA3AF"
//                       value={formData.mobile}
//                       onChangeText={(value) => updateFormData('mobile', value)}
//                       keyboardType="numeric"
//                       maxLength={10}
//                       editable={!loading}
//                     />
//                   </View>
//                 </View>

//                 {/* Address */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Address</Text>
//                   <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
//                     <Home size={20} color="#9CA3AF" style={styles.textAreaIcon} />
//                     <TextInput
//                       style={[styles.input, styles.textArea]}
//                       placeholder="Enter your complete address"
//                       placeholderTextColor="#9CA3AF"
//                       value={formData.address}
//                       onChangeText={(value) => updateFormData('address', value)}
//                       multiline
//                       numberOfLines={3}
//                       textAlignVertical="top"
//                       editable={!loading}
//                     />
//                   </View>
//                 </View>

//                 {/* Pincode */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Pincode</Text>
//                   <View style={styles.inputWrapper}>
//                     <MapPin size={20} color="#9CA3AF" />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="6-digit pincode"
//                       placeholderTextColor="#9CA3AF"
//                       value={formData.pincode}
//                       onChangeText={(value) => updateFormData('pincode', value)}
//                       keyboardType="numeric"
//                       maxLength={6}
//                       editable={!loading}
//                     />
//                   </View>
//                 </View>
//               </View>

//               {/* Register Button */}
//               <TouchableOpacity 
//                 style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
//                 onPress={() => {
//                   console.log('Register button pressed');
//                   handleRegister();
//                 }}
//                 disabled={loading}
//               >
//                 <View style={styles.registerButtonBackground}>
//                   {loading ? (
//                     <ActivityIndicator size="small" color="#FFFFFF" />
//                   ) : (
//                     <UserPlus size={20} color="#FFFFFF" />
//                   )}
//                   <Text style={styles.registerButtonText}>
//                     {loading ? 'Creating Account...' : 'Create Account'}
//                   </Text>
//                 </View>
//               </TouchableOpacity>

//               {/* Login Link */}
//               <View style={styles.loginContainer}>
//                 <Text style={styles.loginText}>Already have an account? </Text>
//                 <TouchableOpacity 
//                   onPress={() => {
//                     console.log('Login link pressed');
//                     router.push('/(auth)/buyer-login');
//                     console.log('Navigation to buyer-login triggered from login link');
//                   }}
//                   disabled={loading}
//                 >
//                   <Text style={styles.loginLink}>Login here</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// // Your styles remain the same...



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
//     backgroundColor: '#F0FDF4',
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
//     marginBottom: 40,
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
//     gap: 32,
//   },
//   section: {
//     gap: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
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
//     minHeight: 48,
//   },
//   textAreaWrapper: {
//     alignItems: 'flex-start',
//     paddingVertical: 16,
//     minHeight: 100,
//   },
//   textAreaIcon: {
//     marginTop: 2,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#1F2937',
//     marginLeft: 12,
//   },
//   textArea: {
//     marginTop: 0,
//     textAlignVertical: 'top',
//   },
//   countryCode: {
//     fontSize: 16,
//     color: '#374151',
//     fontWeight: '500',
//     paddingHorizontal: 4,
//   },
//   eyeButton: {
//     padding: 4,
//   },
//   helperText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   registerButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginTop: 8,
//     backgroundColor: '#14B8A6',
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
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 18,
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 24,
//     gap: 4,
//   },
//   loginText: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   loginLink: {
//     color: '#14B8A6',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  MapPin, 
  Home,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;
const { width, height } = Dimensions.get('window');

type RegisterRequestBody = {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  address?: string;
  pincode?: string;
};

export default function BuyerRegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    pincode: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
    ]).start();
  }, [step]);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, mobile, pincode } = formData;

    if (!name.trim() || name.trim().length < 2) {
      Alert.alert('Error', 'Please enter a valid name (at least 2 characters)');
      return false;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!password || password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (mobile.trim() && !/^[6-9][0-9]{9}$/.test(mobile.trim())) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }

    if (pincode.trim() && !/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { name, email, password, mobile, address, pincode } = formData;
      
      const requestBody: RegisterRequestBody = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      if (mobile.trim()) requestBody.mobile = mobile.trim();
      if (address.trim()) requestBody.address = address.trim();
      if (pincode.trim()) requestBody.pincode = pincode.trim();

      const response = await fetch(`${API_URL}/api/buyer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        await AsyncStorage.setItem('token', data.data.token);
        await AsyncStorage.setItem('refreshToken', data.data.refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.buyer));
        
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.push('/(auth)/buyer-login') }
        ]);
      } else {
        Alert.alert('Registration Failed', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    field: keyof typeof formData,
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
        formData[field].length > 0 && styles.inputContainerFilled
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
          value={formData[field]}
          onChangeText={(value) => updateFormData(field, value)}
          editable={!loading}
          {...options}
        />
        {options.showToggle && (
          <TouchableOpacity onPress={options.onToggle} style={styles.eyeButton}>
            {options.toggleValue ? (
              <EyeOff size={20} color="#14B8A6" />
            ) : (
              <Eye size={20} color="#94A3B8" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <LinearGradient
        colors={['#F0FDFA', '#F8FAFC', '#FFFFFF']}
        style={styles.background}
      >
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
                onPress={() => router.back()}
                disabled={loading}
              >
                <View style={styles.backButtonInner}>
                  <ArrowLeft size={20} color="#0D9488" />
                </View>
              </TouchableOpacity>
              
              <View style={styles.headerContent}>
                <View style={styles.iconBadge}>
                  <ShieldCheck size={24} color="#0D9488" />
                </View>
                <Text style={styles.headerTitle}>Create Account</Text>
                <Text style={styles.headerSubtitle}>Join our healthcare community</Text>
              </View>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, styles.progressStepActive]}>
                <Text style={styles.progressStepText}>1</Text>
              </View>
              <View style={[styles.progressLine, styles.progressLineActive]} />
              <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
                <Text style={styles.progressStepText}>2</Text>
              </View>
            </View>

            {/* Form Card */}
            <Animated.View 
              style={[
                styles.card,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              {step === 1 ? (
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                  <Text style={styles.sectionSubtitle}>Required fields marked with *</Text>
                  
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
                    'Enter your email',
                    { keyboardType: 'email-address', autoCapitalize: 'none' }
                  )}

                  {renderInput(
                    'Password *',
                    'password',
                    <Lock size={20} color="#94A3B8" />,
                    'Create a strong password (min 8 chars)',
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
                    onPress={() => setStep(2)}
                  >
                    <LinearGradient
                      colors={['#14B8A6', '#0D9488']}
                      style={styles.nextButtonGradient}
                    >
                      <Text style={styles.nextButtonText}>Continue</Text>
                      <CheckCircle2 size={20} color="#FFFFFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>Additional Details</Text>
                  <Text style={styles.sectionSubtitle}>Optional but recommended</Text>

                  {renderInput(
                    'Mobile Number',
                    'mobile',
                    <Phone size={20} color="#94A3B8" />,
                    '10-digit mobile number',
                    { keyboardType: 'numeric', maxLength: 10 }
                  )}

                  {renderInput(
                    'Complete Address',
                    'address',
                    <Home size={20} color="#94A3B8" />,
                    'Enter your full address',
                    { multiline: true }
                  )}

                  {renderInput(
                    'Pincode',
                    'pincode',
                    <MapPin size={20} color="#94A3B8" />,
                    '6-digit pincode',
                    { keyboardType: 'numeric', maxLength: 6 }
                  )}

                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={styles.backStepButton}
                      onPress={() => setStep(1)}
                    >
                      <Text style={styles.backStepButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                      onPress={handleRegister}
                      disabled={loading}
                    >
                      <LinearGradient
                        colors={loading ? ['#99F6E4', '#5EEAD4'] : ['#14B8A6', '#0D9488']}
                        style={styles.registerButtonGradient}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="#0F766E" />
                        ) : (
                          <>
                            <Text style={styles.registerButtonText}>Create Account</Text>
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
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/buyer-login')}>
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
    backgroundColor: '#F8FAFC',
  },
  background: {
    flex: 1,
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
    marginBottom: 20,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#CCFBF1',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  progressStepActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  progressStepText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
    maxWidth: 80,
  },
  progressLineActive: {
    backgroundColor: '#0D9488',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  formSection: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
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
    borderColor: '#CBD5E1',
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
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
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
  registerButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 15,
    color: '#0D9488',
    fontWeight: '700',
  },
});