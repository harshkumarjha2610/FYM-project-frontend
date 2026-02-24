import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, LogIn, UserPlus, SkipForward, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SellerChoiceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Animated Background with Multiple Gradients */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Overlay Pattern */}
        <View style={styles.patternOverlay} />
        
        {/* Header with Glass Effect */}
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
            style={styles.headerGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.backButtonGradient}
              >
                <ArrowLeft color="#FFFFFF" size={22} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Sparkles color="#FFD700" size={20} strokeWidth={2} />
              <Text style={styles.headerTitle}>Seller Portal</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Title Section with Enhanced Typography */}
          <View style={styles.titleContainer}>
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC', '#E2E8F0']}
              style={styles.titleGradient}
            >
              <Text style={styles.title}>Welcome, Seller!</Text>
            </LinearGradient>
            <Text style={styles.subtitle}>
              Choose your preferred way to access the seller dashboard
            </Text>
            <View style={styles.decorativeLine} />
          </View>

          {/* Enhanced Options Container */}
          <View style={styles.optionsContainer}>
            {/* Premium Login Button */}
            <TouchableOpacity
              style={styles.primaryButtonWrapper}
              onPress={() => router.push('/(auth)/seller-login')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                <View style={styles.buttonIconContainer}>
                  <LinearGradient
                    colors={['#3B82F6', '#1D4ED8']}
                    style={styles.iconGradient}
                  >
                    <LogIn color="#FFFFFF" size={24} strokeWidth={2.5} />
                  </LinearGradient>
                </View>
                
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                  <Text style={styles.buttonDescription}>
                    Access your seller dashboard
                  </Text>
                </View>
                
                <View style={styles.buttonArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </LinearGradient>
              
              {/* Glow Effect */}
              <View style={styles.glowEffect} />
            </TouchableOpacity>

            {/* Premium Register Button */}
            <TouchableOpacity
              style={styles.primaryButtonWrapper}
              onPress={() => router.push('/(auth)/seller-register')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                <View style={styles.buttonIconContainer}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.iconGradient}
                  >
                    <UserPlus color="#FFFFFF" size={24} strokeWidth={2.5} />
                  </LinearGradient>
                </View>
                
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <Text style={styles.buttonDescription}>
                    Create your seller account
                  </Text>
                </View>
                
                <View style={styles.buttonArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </LinearGradient>
              
              {/* Glow Effect */}
              <View style={styles.glowEffect} />
            </TouchableOpacity>

            {/* Enhanced Skip Button */}
            <TouchableOpacity
              style={styles.skipButtonWrapper}
              onPress={() => router.push('/(sellertabs)')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.skipButton}
              >
                <SkipForward color="#FFFFFF" size={20} strokeWidth={2.5} />
                <Text style={styles.skipButtonText}>Continue as Guest</Text>
              </LinearGradient>
              
              {/* Border Glow */}
              <LinearGradient
                colors={['rgba(255,255,255,0.5)', 'transparent', 'rgba(255,255,255,0.5)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.skipButtonBorder}
              />
            </TouchableOpacity>
          </View>

          {/* Footer Enhancement */}
          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerText}>
              Trusted by 10,000+ pharmacies nationwide
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    position: 'relative',
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    backgroundColor: 'transparent',
    backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px)',
  },
  
  // Header Styles
  header: {
    marginTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerGradient: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  
  // Title Styles
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  titleGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E40AF',
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(30,64,175,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
    letterSpacing: 0.2,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  decorativeLine: {
    width: 80,
    height: 3,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    marginTop: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },

  // Button Styles
  optionsContainer: {
    gap: 24,
  },
  primaryButtonWrapper: {
    position: 'relative',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(59,130,246,0.2)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    minHeight: 90,
  },
  buttonIconContainer: {
    marginRight: 20,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonTextContainer: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  buttonDescription: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    lineHeight: 22,
  },
  buttonArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59,130,246,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
  },
  arrowText: {
    fontSize: 20,
    color: '#3B82F6',
    fontWeight: '600',
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    opacity: 0.6,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },

  // Skip Button Styles
  skipButtonWrapper: {
    position: 'relative',
    marginTop: 20,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    gap: 12,
  },
  skipButtonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Footer Styles
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerDivider: {
    width: 120,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
    borderRadius: 1,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
