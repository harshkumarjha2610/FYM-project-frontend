import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// const API_URL = "https://rambackend-1-qmpn.onrender.com";
const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

const { width, height } = Dimensions.get('window');

export default function BuyerLoginScreen() {
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  console.log("API_URL: ", API_URL);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Refs for TextInput
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    console.log('=== LOGIN PROCESS STARTED ===');
    
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields', [
        { text: 'OK', style: 'default' }
      ]);
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address', [
        { text: 'OK', style: 'default' }
      ]);
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        email: email.trim().toLowerCase(),
        password: password,
        rememberMe: rememberMe
      };
      
      const response = await fetch(`${API_URL}/api/buyer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await AsyncStorage.setItem('token', data.data.token);
        await AsyncStorage.setItem('refreshToken', data.data.refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.buyer));
        
        router.replace('/(tabs)');
      } else {
        const errorMessage = data.message || 'Invalid credentials';
        Alert.alert('Login Failed', errorMessage, [
          { text: 'OK', style: 'default' }
        ]);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Connection Error', 'Unable to connect to server. Please check your connection.', [
        { text: 'Retry', onPress: handleLogin },
        { text: 'Cancel', style: 'cancel' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      <SafeAreaView style={styles.container}>
        {/* Gradient Background */}
        <LinearGradient
          colors={['#0F766E', '#14B8A6', '#5EEAD4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
          pointerEvents="none"
        >
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
        </LinearGradient>

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
              onPress={() => router.back()}
              disabled={loading}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Welcome Back</Text>
          </View>

          {/* Main Content Card */}
          <View style={styles.contentCard}>
            {/* Logo/Icon Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <LogIn size={36} color="#14B8A6" strokeWidth={2.5} />
              </View>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Access your buyer account</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={22} color="#9CA3AF" strokeWidth={2} />
                  <TextInput
                    ref={emailInputRef}
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                  />
                  {email ? (
                    <View style={styles.validIndicator}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={22} color="#9CA3AF" strokeWidth={2} />
                  <TextInput
                    ref={passwordInputRef}
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    {showPassword ? (
                      <EyeOff size={22} color="#9CA3AF" strokeWidth={2} />
                    ) : (
                      <Eye size={22} color="#9CA3AF" strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Options Row */}
              <View style={styles.optionsRow}>
                <TouchableOpacity 
                  style={styles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Text style={styles.checkboxMark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.forgotButton}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#14B8A6', '#0F766E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <LogIn size={22} color="#FFFFFF" strokeWidth={2.5} />
                  )}
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>New to our platform? </Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(auth)/buyer-register')}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.registerLink}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F766E',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.4,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -60,
    right: -60,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: 80,
    left: -40,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    bottom: 30,
    right: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: Platform.OS === 'ios' ? 10 : 30,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 30,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#CCFBF1',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  form: {
    gap: 22,
  },
  inputContainer: {
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
    paddingVertical: 0,
  },
  validIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  checkboxMark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  rememberMeText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },
  forgotButton: {
    padding: 6,
  },
  forgotText: {
    fontSize: 15,
    color: '#14B8A6',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  loginButtonDisabled: {
    opacity: 0.65,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
    minHeight: 58,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
  },
  registerText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  registerLink: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
