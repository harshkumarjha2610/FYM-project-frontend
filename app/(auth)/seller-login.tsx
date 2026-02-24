import React, { useState } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, LogIn, Bug } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_URL } from '@env';
// API Configuration

// const API_URL = "https://rambackend-1-qmpn.onrender.com";
const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

export default function SellerLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Enhanced debug logging function
  const addDebugLog = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log('🔍', logMessage, data || '');
    setDebugInfo(prev => [...prev.slice(-20), logMessage]);
  };

  // Test backend connectivity
  const testBackendConnection = async () => {
    try {
      console.log('🏥 ========================================');
      console.log('🏥 TESTING BACKEND CONNECTION');
      console.log('🏥 ========================================');
      addDebugLog('🏥 Testing backend connectivity...');
      
      const response = await fetch(`${API_URL}/api/test`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('🏥 Response status:', response.status);
      console.log('🏥 Response OK:', response.ok);
      addDebugLog(`🏥 Backend test response: ${response.status}`);
      
      if (response.ok) {
        console.log('✅ Backend is reachable');
        addDebugLog('✅ Backend is reachable');
      } else {
        console.log('❌ Backend returned error:', response.status);
        addDebugLog(`❌ Backend returned error: ${response.status}`);
      }
    } catch (error: any) {
      console.error('❌ Backend connection failed:', error.message);
      addDebugLog('❌ Backend connection failed:', error.message);
    }
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email.trim());
    console.log('📧 Email validation:', isValid);
    addDebugLog(`📧 Email validation: ${isValid}`, {
      original: email,
      trimmed: email.trim(),
      lowercase: email.trim().toLowerCase(),
      hasSpaces: email !== email.trim(),
      length: email.length
    });
    return isValid;
  };

  // Validate password
  const validatePassword = (password: string) => {
    console.log('🔐 Password validation:', {
      length: password.length,
      meetsRequirement: password.length >= 6
    });
    addDebugLog(`🔐 Password validation:`, {
      length: password.length,
      hasSpecialChars: /[^a-zA-Z0-9]/.test(password),
      hasNumbers: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      startsWithSpace: password.startsWith(' '),
      endsWithSpace: password.endsWith(' ')
    });
    return password.length >= 6;
  };

  // Check existing tokens
  const checkExistingTokens = async () => {
    try {
      console.log('💾 ========================================');
      console.log('💾 CHECKING EXISTING TOKENS');
      console.log('💾 ========================================');
      
      const existingSellerToken = await AsyncStorage.getItem('sellerToken');
      const existingBuyerToken = await AsyncStorage.getItem('token');
      const existingGenericToken = await AsyncStorage.getItem('userToken');
      
      console.log('💾 Existing seller token:', existingSellerToken ? 'EXISTS' : 'NONE');
      console.log('💾 Existing buyer token:', existingBuyerToken ? 'EXISTS' : 'NONE');
      console.log('💾 Existing generic token:', existingGenericToken ? 'EXISTS' : 'NONE');
      
      addDebugLog('💾 Existing tokens check:', {
        sellerToken: existingSellerToken ? `${existingSellerToken.substring(0, 20)}...` : 'None',
        buyerToken: existingBuyerToken ? `${existingBuyerToken.substring(0, 20)}...` : 'None',
        genericToken: existingGenericToken ? `${existingGenericToken.substring(0, 20)}...` : 'None'
      });
    } catch (error: any) {
      console.error('❌ Error checking tokens:', error.message);
      addDebugLog('❌ Error checking existing tokens:', error.message);
    }
  };

  // Handle back button press
  const handleBackPress = () => {
    console.log('🔙 Back button pressed');
    addDebugLog('🔙 Back button pressed - navigating to seller choice page');
    router.push('/(auth)/seller-choice');
  };

  const handleLogin = async () => {
    console.log('\n\n');
    console.log('🚀 ========================================');
    console.log('🚀 SELLER LOGIN PROCESS STARTED');
    console.log('🚀 ========================================');
    console.log('⏰ Login initiated at:', new Date().toISOString());
    
    addDebugLog('🚀 === SELLER LOGIN PROCESS STARTED ===');
    setDebugInfo([]);
    
    // Pre-flight checks
    await checkExistingTokens();
    await testBackendConnection();

    if (!email || !password) {
      console.log('❌ Validation failed: Missing fields');
      addDebugLog('❌ Validation failed: Missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      console.log('❌ Email validation failed');
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      console.log('❌ Password validation failed');
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    console.log('✅ All validations passed');
    console.log('🔄 Setting loading state to TRUE');
    setLoading(true);
    
    try {
      const requestPayload = {
        email: email.trim().toLowerCase(),
        password: password
      };

      console.log('📤 ========================================');
      console.log('📤 PREPARING API REQUEST');
      console.log('📤 ========================================');
      console.log('📤 URL:', `${API_URL}/api/seller/login`);
      console.log('📤 Method: POST');
      console.log('📤 Email:', requestPayload.email);
      console.log('📤 Password length:', password.length);

      addDebugLog('📤 Preparing request:', {
        url: `${API_URL}/api/seller/login`,
        method: 'POST',
        emailOriginal: email,
        emailProcessed: requestPayload.email,
        passwordLength: password.length,
        timestamp: new Date().toISOString()
      });

      const requestHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'SellerApp/1.0'
      };

      console.log('📤 Request headers:', requestHeaders);
      addDebugLog('📤 Request headers:', requestHeaders);
      addDebugLog('📤 Request body:', {
        email: requestPayload.email,
        passwordMasked: '*'.repeat(password.length)
      });

      console.log('🌐 Sending HTTP request...');
      addDebugLog('🌐 Sending HTTP request...');
      
      const startTime = Date.now();
      const response = await fetch(`${API_URL}/api/seller/login`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestPayload)
      });

      const responseTime = Date.now() - startTime;
      
      console.log('📦 ========================================');
      console.log('📦 API RESPONSE RECEIVED');
      console.log('📦 ========================================');
      console.log(`📦 Response time: ${responseTime}ms`);
      console.log('📦 Status:', response.status);
      console.log('📦 Status text:', response.statusText);
      console.log('📦 OK:', response.ok);

      addDebugLog(`📦 Response received in ${responseTime}ms`);
      addDebugLog('📦 Response status:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        type: response.type
      });

      // Log response headers
      const responseHeaders: any = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log('📦 Response headers:', responseHeaders);
      addDebugLog('📦 Response headers:', responseHeaders);

      // Parse response
      let data: any;
      try {
        const responseText = await response.text();
        console.log('📦 Raw response (first 500 chars):', responseText.substring(0, 500));
        addDebugLog('📦 Raw response text:', responseText.substring(0, 500));
        
        data = JSON.parse(responseText);
        console.log('📦 Parsed response:', JSON.stringify(data, null, 2));
        
        addDebugLog('📦 Parsed response data:', {
          success: data.success,
          message: data.message,
          hasToken: !!data.token,
          hasSeller: !!data.seller,
          tokenPreview: data.token ? `${data.token.substring(0, 30)}...` : 'None',
          sellerInfo: data.seller ? {
            id: data.seller._id || data.seller.id,
            email: data.seller.email,
            name: data.seller.ownerName || data.seller.pharmacyName,
            isVerified: data.seller.isVerified,
            verificationStatus: data.seller.verificationStatus
          } : 'None'
        });
      } catch (parseError: any) {
        console.error('❌ JSON parse error:', parseError.message);
        addDebugLog('❌ JSON parse error:', parseError.message);
        throw new Error(`Failed to parse server response: ${parseError.message}`);
      }

      if (response.ok && data.success && data.token) {
        console.log('✅ ========================================');
        console.log('✅ LOGIN SUCCESSFUL');
        console.log('✅ ========================================');
        console.log('✅ Token received:', data.token.substring(0, 30) + '...');
        
        addDebugLog('✅ Login successful - processing token...');
        
        // Enhanced token validation
        try {
          const tokenParts = data.token.split('.');
          console.log('🔍 Token structure:', {
            parts: tokenParts.length,
            valid: tokenParts.length === 3,
            headerLength: tokenParts[0]?.length || 0,
            payloadLength: tokenParts[1]?.length || 0,
            signatureLength: tokenParts[2]?.length || 0
          });

          addDebugLog('🔍 Token structure:', {
            parts: tokenParts.length,
            headerLength: tokenParts[0]?.length || 0,
            payloadLength: tokenParts[1]?.length || 0,
            signatureLength: tokenParts[2]?.length || 0
          });

          if (tokenParts.length !== 3) {
            throw new Error('Invalid JWT format');
          }

          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('🔍 Token payload:', payload);
          
          addDebugLog('🔍 Token payload decoded:', {
            type: payload.type,
            sellerId: payload.sellerId,
            email: payload.email,
            iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'None',
            exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'None',
            isExpired: payload.exp ? Date.now() > payload.exp * 1000 : 'Unknown'
          });
          
          if (payload.type !== 'seller') {
            console.error('❌ Token type mismatch:', payload.type);
            addDebugLog(`❌ Token type mismatch: expected 'seller', got '${payload.type}'`);
            Alert.alert('Error', `Invalid token type received: ${payload.type}. Please contact support.`);
            return;
          }

          if (!payload.sellerId) {
            console.error('❌ Token missing sellerId');
            addDebugLog('❌ Token missing sellerId field');
            Alert.alert('Error', 'Invalid token structure: missing seller ID. Please contact support.');
            return;
          }

          console.log('✅ Token validation passed');
          addDebugLog('✅ Token validation passed');
        } catch (tokenError: any) {
          console.error('❌ Token validation failed:', tokenError.message);
          addDebugLog('❌ Token validation failed:', tokenError.message);
          Alert.alert('Error', `Token validation failed: ${tokenError.message}`);
          return;
        }

        // Store token with enhanced logging
        try {
          console.log('💾 ========================================');
          console.log('💾 STORING TOKEN');
          console.log('💾 ========================================');
          console.log('💾 Storing seller token...');
          
          await AsyncStorage.setItem('sellerToken', data.token);
          console.log('✅ Token stored successfully');
          addDebugLog('💾 Seller token stored successfully');
          
          // Verify storage
          const storedToken = await AsyncStorage.getItem('sellerToken');
          const matches = storedToken === data.token;
          console.log('💾 Token verification:', {
            stored: !!storedToken,
            matches: matches,
            tokenLength: storedToken?.length || 0
          });
          
          addDebugLog('💾 Token storage verification:', {
            stored: !!storedToken,
            matches: matches,
            preview: storedToken ? `${storedToken.substring(0, 30)}...` : 'None'
          });
          
          if (!matches) {
            console.error('❌ Token storage verification failed!');
            Alert.alert('Error', 'Failed to store authentication token properly');
            return;
          }
          
        } catch (storageError: any) {
          console.error('❌ Token storage error:', storageError.message);
          addDebugLog('❌ Token storage failed:', storageError.message);
          Alert.alert('Error', `Failed to store authentication token: ${storageError.message}`);
          return;
        }
        
        // Store seller info
        if (data.seller) {
          try {
            const sellerInfo = {
              id: data.seller._id || data.seller.id,
              name: data.seller.ownerName || data.seller.pharmacyName,
              email: data.seller.email,
              isVerified: data.seller.isVerified,
              verificationStatus: data.seller.verificationStatus,
              loginTime: new Date().toISOString()
            };
            
            console.log('💾 Storing seller info:', sellerInfo);
            await AsyncStorage.setItem('sellerInfo', JSON.stringify(sellerInfo));
            console.log('✅ Seller info stored');
            addDebugLog('💾 Seller info stored:', sellerInfo);
          } catch (infoStorageError: any) {
            console.warn('⚠️ Seller info storage failed:', infoStorageError.message);
            addDebugLog('⚠️ Seller info storage failed:', infoStorageError.message);
          }
        }
        
        console.log('✅ ========================================');
        console.log('✅ LOGIN PROCESS COMPLETED SUCCESSFULLY');
        console.log('✅ ========================================');
        
        addDebugLog('✅ Login process completed successfully');
        
        // ✅ DIRECT NAVIGATION WITHOUT ALERT
        console.log('🚀 ========================================');
        console.log('🚀 INITIATING DIRECT NAVIGATION');
        console.log('🚀 ========================================');
        console.log('📍 Target route: (sellertabs)');
        console.log('📍 Navigation method: router.replace');
        console.log('⏰ Navigation time:', new Date().toISOString());
        
        addDebugLog('🚀 Starting direct navigation to sellertabs');
        addDebugLog('📍 Using router.replace("/(sellertabs)")');
        
        try {
          console.log('🔄 Executing router.replace("/(sellertabs)")...');
          
          // Direct navigation
          router.replace('/(sellertabs)');
          
          console.log('✅ router.replace command executed');
          console.log('⏳ Navigation command sent to router');
          console.log('⏳ Waiting for route change...');
          addDebugLog('✅ Navigation command executed successfully');
          
          // Verify navigation after delays
          setTimeout(() => {
            console.log('🔍 Navigation check (500ms): Checking if route changed...');
            addDebugLog('🔍 Navigation check after 500ms');
          }, 500);
          
          setTimeout(() => {
            console.log('🔍 Final navigation check (1000ms): Verifying route change...');
            addDebugLog('🔍 Final navigation check after 1000ms');
          }, 1000);
          
        } catch (navError: any) {
          console.error('❌ ========================================');
          console.error('❌ NAVIGATION ERROR');
          console.error('❌ ========================================');
          console.error('❌ Error name:', navError.name);
          console.error('❌ Error message:', navError.message);
          console.error('❌ Error stack:', navError.stack);
          
          addDebugLog('❌ Navigation failed:', {
            error: navError.message,
            stack: navError.stack,
            name: navError.name
          });
          
          Alert.alert(
            'Navigation Failed',
            `Could not navigate to seller tabs.\n\nError: ${navError.message}\n\nThe route might not exist.`,
            [
              { text: 'Show Logs', onPress: () => showDebugLogs() },
              {
                text: 'Try /(sellertabs)',
                onPress: () => {
                  console.log('🔄 Trying alternative path: /(sellertabs)');
                  try {
                    router.replace('/(sellertabs)' as any);
                    console.log('✅ Alternative navigation executed');
                  } catch (altError: any) {
                    console.error('❌ Alternative also failed:', altError.message);
                    Alert.alert('Error', 'All navigation paths failed. Check if (sellertabs) folder exists.');
                  }
                }
              },
              { text: 'OK' }
            ]
          );
        }
        
      } else {
        console.log('❌ ========================================');
        console.log('❌ LOGIN FAILED');
        console.log('❌ ========================================');
        console.log('❌ Response status:', response.status);
        console.log('❌ Response data:', data);
        
        addDebugLog('❌ Login failed - analyzing error...');
        
        let errorMessage = data.message || 'Login failed';
        let errorDetails = '';
        
        if (response.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
          errorDetails = 'This usually means:\n• Email not found in database\n• Password doesn\'t match\n• Account doesn\'t exist';
          console.log('❌ Authentication failed (401)');
          addDebugLog('❌ Authentication failed (401)', {
            providedEmail: requestPayload.email,
            suggestion: 'Check if seller account exists with this email'
          });
        } else if (response.status === 403) {
          errorMessage = data.message || 'Account access restricted.';
          errorDetails = 'Your account may be:\n• Not verified\n• Suspended\n• Pending approval';
          console.log('❌ Access forbidden (403)');
          addDebugLog('❌ Access forbidden (403)', data);
        } else if (response.status === 404) {
          errorMessage = 'Account not found. Please check your email or register a new account.';
          errorDetails = 'The API endpoint or seller account was not found';
          console.log('❌ Not found (404)');
          addDebugLog('❌ Not found (404)', data);
        } else if (response.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
          errorDetails = 'Rate limiting is active';
          console.log('❌ Rate limited (429)');
          addDebugLog('❌ Rate limited (429)', data);
        } else if (response.status >= 500) {
          errorMessage = `Server error (${response.status}). Please try again later.`;
          errorDetails = 'This is a backend server issue';
          console.log('❌ Server error (5xx)');
          addDebugLog('❌ Server error (5xx)', { status: response.status, data });
        }
        
        addDebugLog('❌ Final error details:', { errorMessage, errorDetails });
        
        if (__DEV__) {
          Alert.alert('Login Failed', `${errorMessage}\n\nDebug Info:\n${errorDetails}`, [
            { text: 'Show Logs', onPress: () => showDebugLogs() },
            { text: 'OK' }
          ]);
        } else {
          Alert.alert('Login Failed', errorMessage);
        }
      }
      
    } catch (error: any) {
      console.error('❌ ========================================');
      console.error('❌ NETWORK/REQUEST ERROR');
      console.error('❌ ========================================');
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      addDebugLog('❌ Network/Request error:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200) || 'No stack trace',
        code: error.code
      });
      
      let errorMessage = 'Network error. Please check your connection and try again.';
      let technicalDetails = '';
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server.';
        technicalDetails = `Server might be down or unreachable at ${API_URL}`;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please check your internet connection.';
        technicalDetails = 'The server took too long to respond';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused.';
        technicalDetails = `Backend server is not running on ${API_URL}`;
      } else {
        technicalDetails = error.message;
      }
      
      if (__DEV__) {
        Alert.alert('Connection Error', `${errorMessage}\n\nTechnical Details:\n${technicalDetails}`, [
          { text: 'Show Logs', onPress: () => showDebugLogs() },
          { text: 'OK' }
        ]);
      } else {
        Alert.alert('Connection Error', errorMessage);
      }
      
    } finally {
      console.log('🔄 Setting loading state to FALSE');
      console.log('🏁 Login process finished');
      console.log('🏁 ========================================\n\n');
      setLoading(false);
      addDebugLog('🏁 Login process finished');
    }
  };

  // Show debug logs
  const showDebugLogs = () => {
    const logsString = debugInfo.join('\n');
    console.log('📋 ========================================');
    console.log('📋 DEBUG LOGS DISPLAY');
    console.log('📋 ========================================');
    console.log(logsString);
    Alert.alert('Debug Logs', logsString.substring(0, 2000) + (logsString.length > 2000 ? '\n...(truncated)' : ''));
  };

  // Clear debug logs
  const clearDebugLogs = () => {
    console.log('🗑️ Debug logs cleared');
    setDebugInfo([]);
    addDebugLog('🗑️ Debug logs cleared');
  };

  // Test navigation directly
  const testNavigation = () => {
    console.log('🧪 ========================================');
    console.log('🧪 TESTING NAVIGATION');
    console.log('🧪 ========================================');

    const pathsToTry = [
      '/(sellertabs)',
      '/(auth)/seller-choice',
    ];

    Alert.alert(
      'Test Navigation',
      'Choose a path to test:',
      pathsToTry.map(path => ({
        text: path,
        onPress: () => {
          console.log(`🧪 Testing path: ${path}`);
          try {
            router.push(path as any);
            console.log(`✅ Navigation to ${path} succeeded`);
            addDebugLog(`✅ Test navigation to ${path} succeeded`);
          } catch (error: any) {
            console.error(`❌ Navigation to ${path} failed:`, error.message);
            addDebugLog(`❌ Test navigation to ${path} failed`);
            Alert.alert('Failed', `Path ${path} failed: ${error.message}`);
          }
        }
      })).concat({ text: 'Cancel', style: 'cancel' } as any)
    );
  };

  React.useEffect(() => {
    console.log('🎬 ========================================');
    console.log('🎬 SELLER LOGIN SCREEN MOUNTED');
    console.log('🎬 ========================================');
    console.log('🎬 Component initialized at:', new Date().toISOString());
    console.log('🎬 API URL:', API_URL);
    console.log('🎬 Platform:', Platform.OS);
    console.log('🎬 Dev mode:', __DEV__);
    
    addDebugLog('🎬 Seller login screen mounted');
    
    return () => {
      console.log('🎬 Seller login screen unmounted');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <ArrowLeft color="#4A6CF7" size={24} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Seller Login</Text>
            {__DEV__ && (
              <TouchableOpacity
                style={styles.debugButton}
                onPress={showDebugLogs}
                activeOpacity={0.7}
              >
                <Bug color="#4A6CF7" size={20} />
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>
                Login to access your seller dashboard and manage your business
              </Text>
            </View>

            {/* Enhanced Development Info */}
            {__DEV__ && (
              <View style={styles.devInfo}>
                <Text style={styles.devInfoText}>Development Mode - Enhanced Debugging</Text>
                <Text style={styles.devInfoSubtext}>API: {API_URL}</Text>
                <Text style={styles.devInfoSubtext}>Logs: {debugInfo.length} entries</Text>
                <View style={styles.debugActions}>
                  <TouchableOpacity style={styles.miniButton} onPress={testBackendConnection}>
                    <Text style={styles.miniButtonText}>Test API</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.miniButton} onPress={testNavigation}>
                    <Text style={styles.miniButtonText}>Test Nav</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.miniButton} onPress={clearDebugLogs}>
                    <Text style={styles.miniButtonText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Mail color="#64748B" size={20} strokeWidth={2.2} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (__DEV__ && text.length > 5) {
                        addDebugLog('📝 Email input changed', { 
                          length: text.length,
                          hasAt: text.includes('@'),
                          endsWithSpace: text.endsWith(' ')
                        });
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock color="#64748B" size={20} strokeWidth={2.2} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (__DEV__ && text.length > 3) {
                        addDebugLog('📝 Password input changed', { 
                          length: text.length,
                          hasSpecialChars: /[^a-zA-Z0-9]/.test(text)
                        });
                      }
                    }}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff color="#64748B" size={20} strokeWidth={2.2} />
                    ) : (
                      <Eye color="#64748B" size={20} strokeWidth={2.2} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                style={styles.forgotPassword}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={loading ? 1 : 0.8}
              >
                <LinearGradient
                  colors={loading ? ['#94A3B8', '#CBD5E1'] : ['#4A6CF7', '#6B4BFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.loginButtonText}>Logging in...</Text>
                    </>
                  ) : (
                    <>
                      <LogIn color="#FFFFFF" size={20} strokeWidth={2.5} />
                      <Text style={styles.loginButtonText}>Login</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(auth)/seller-register')}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Text style={[
                    styles.registerLink,
                    loading && styles.registerLinkDisabled
                  ]}>
                    Register here
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// Add your styles here



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EDF2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  debugButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'left',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  devInfo: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  devInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  devInfoSubtext: {
    fontSize: 12,
    color: '#B45309',
    marginBottom: 2,
  },
  debugActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  miniButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  miniButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
    fontFamily: 'Inter-Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#E2E8F0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4A6CF7',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#4A6CF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 12,
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  registerLink: {
    fontSize: 15,
    color: '#4A6CF7',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  registerLinkDisabled: {
    opacity: 0.5,
  },
});