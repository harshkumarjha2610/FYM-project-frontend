import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, LogIn, UserPlus, SkipForward, ShoppingBag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function BuyerChoiceScreen() {
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale1 = useRef(new Animated.Value(1)).current;
  const buttonScale2 = useRef(new Animated.Value(1)).current;
  const buttonScale3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleButtonPress = (buttonScale: Animated.Value, onPress: () => void) => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      <SafeAreaView style={styles.container}>
        {/* Gradient Background with Decorative Elements */}
        <LinearGradient
          colors={['#0F766E', '#14B8A6', '#5EEAD4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
          <View style={styles.decorativeCircle4} />
          
          {/* Floating Icons */}
          <Animated.View 
            style={[
              styles.floatingIcon1,
              {
                transform: [{
                  rotate: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }]
              }
            ]}
          >
            <ShoppingBag size={24} color="rgba(255, 255, 255, 0.3)" />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.floatingIcon2,
              {
                transform: [{
                  rotate: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['360deg', '0deg'],
                  })
                }]
              }
            ]}
          >
            <UserPlus size={20} color="rgba(255, 255, 255, 0.2)" />
          </Animated.View>
        </LinearGradient>

        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buyer Access</Text>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {/* Welcome Section */}
          <Animated.View 
            style={[
              styles.welcomeSection,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.welcomeIconContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.welcomeIconGradient}
              >
                <ShoppingBag size={40} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
            </View>
            
            <Text style={styles.title}>Welcome, Buyer!</Text>
            <Text style={styles.subtitle}>
              Choose how you want to access our marketplace
            </Text>
          </Animated.View>

          {/* Options Container */}
          <Animated.View 
            style={[
              styles.optionsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Login Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale1 }] }}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => handleButtonPress(buttonScale1, () => router.push('/(auth)/buyer-login'))}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8FAFC']}
                  style={styles.buttonGradient}
                >
                  <View style={styles.buttonIconContainer}>
                    <View style={styles.buttonIcon}>
                      <LogIn color="#14B8A6" size={28} strokeWidth={2.5} />
                    </View>
                    <View style={styles.buttonTextContainer}>
                      <Text style={styles.primaryButtonText}>Sign In</Text>
                      <Text style={styles.buttonDescription}>
                        Access your existing account
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonArrow}>
                    <Text style={styles.arrowText}>→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Register Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale2 }] }}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => handleButtonPress(buttonScale2, () => router.push('/(auth)/buyer-register'))}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8FAFC']}
                  style={styles.buttonGradient}
                >
                  <View style={styles.buttonIconContainer}>
                    <View style={[styles.buttonIcon, { backgroundColor: '#F0FDF4' }]}>
                      <UserPlus color="#14B8A6" size={28} strokeWidth={2.5} />
                    </View>
                    <View style={styles.buttonTextContainer}>
                      <Text style={styles.primaryButtonText}>Create Account</Text>
                      <Text style={styles.buttonDescription}>
                        Join our marketplace today
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonArrow}>
                    <Text style={styles.arrowText}>→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Skip Login Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale3 }] }}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => handleButtonPress(buttonScale3, () => router.push('/(tabs)'))}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.skipButtonGradient}
                >
                  <SkipForward color="#FFFFFF" size={22} strokeWidth={2.5} />
                  <Text style={styles.skipButtonText}>Browse as Guest</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Benefits Section */}
            {/* <Animated.View 
              style={[
                styles.benefitsContainer,
                {
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1],
                  })
                }
              ]}
            >
              <Text style={styles.benefitsTitle}>Why create an account?</Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>Track your orders</Text>
                </View>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>Save favorites</Text>
                </View>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>Exclusive deals</Text>
                </View>
              </View>
            </Animated.View> */}
          </Animated.View>
        </View>
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
    bottom: 0,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -100,
    right: -80,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: 150,
    left: -60,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: 200,
    right: -40,
  },
  decorativeCircle4: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    bottom: 100,
    left: 30,
  },
  floatingIcon1: {
    position: 'absolute',
    top: height * 0.2,
    right: 50,
  },
  floatingIcon2: {
    position: 'absolute',
    bottom: height * 0.3,
    left: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: Platform.OS === 'ios' ? 20 : 40,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  welcomeIconContainer: {
    marginBottom: 24,
  },
  welcomeIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    gap: 20,
  },
  primaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonTextContainer: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  buttonArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: '#14B8A6',
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  skipButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  benefitsContainer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  benefitText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
});
