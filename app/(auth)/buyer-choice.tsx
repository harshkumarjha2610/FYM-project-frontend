import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  LogIn,
  UserPlus,
  SkipForward,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

export default function BuyerChoiceScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=1600',
        }}
        style={styles.background}
      >
        <LinearGradient
          colors={['rgba(20,184,166,0.92)', 'rgba(59,130,246,0.92)']}
          style={styles.overlay}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Header */}
              <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                  activeOpacity={0.8}
                >
                  <ArrowLeft color="#FFFFFF" size={22} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Buyer Access</Text>
              </Animatable.View>

              {/* Welcome Section */}
              <Animatable.View animation="fadeIn" delay={200} duration={800} style={styles.welcomeSection}>
                <View style={styles.iconCircle}>
                  <ShoppingBag size={36} color="#FFFFFF" strokeWidth={2.5} />
                  <View style={styles.iconGlow} />
                </View>
                <Text style={styles.title}>Welcome, Buyer!</Text>
                <Text style={styles.subtitle}>
                  Choose how you want to access our marketplace
                </Text>
              </Animatable.View>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {/* Sign In Card */}
                <Animatable.View animation="fadeInUp" delay={300}>
                  <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => router.push('/(auth)/buyer-login')}
                    activeOpacity={0.9}
                  >
                    <View style={[styles.cardBackground, styles.signInCard]}>
                      <View style={styles.cardContent}>
                        <View style={[styles.cardIconContainer, styles.signInIconBg]}>
                          <LogIn color="#14B8A6" size={24} strokeWidth={2.5} />
                        </View>
                        <View style={styles.cardText}>
                          <Text style={styles.cardTitle}>Sign In</Text>
                          <Text style={styles.cardDescription}>
                            Access your existing account
                          </Text>
                        </View>
                        <View style={styles.arrowContainer}>
                          <ArrowRight color="#14B8A6" size={20} strokeWidth={2.5} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animatable.View>

                {/* Create Account Card */}
                <Animatable.View animation="fadeInUp" delay={450}>
                  <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => router.push('/(auth)/buyer-register')}
                    activeOpacity={0.9}
                  >
                    <View style={[styles.cardBackground, styles.registerCard]}>
                      <View style={styles.cardContent}>
                        <View style={[styles.cardIconContainer, styles.registerIconBg]}>
                          <UserPlus color="#3B82F6" size={24} strokeWidth={2.5} />
                        </View>
                        <View style={styles.cardText}>
                          <Text style={styles.cardTitle}>Create Account</Text>
                          <Text style={styles.cardDescription}>
                            Join our marketplace today
                          </Text>
                        </View>
                        <View style={styles.arrowContainer}>
                          <ArrowRight color="#3B82F6" size={20} strokeWidth={2.5} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animatable.View>

                {/* Divider */}
                <Animatable.View animation="fadeIn" delay={550} style={styles.divider}>
                  {/* <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} /> */}
                </Animatable.View>

                {/* Browse as Guest */}
                {/* <Animatable.View animation="fadeInUp" delay={600}>
                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => router.push('/(tabs)')}
                    activeOpacity={0.8}
                  >
                    <SkipForward color="#FFFFFF" size={20} strokeWidth={2.5} />
                    <Text style={styles.guestButtonText}>Browse as Guest</Text>
                  </TouchableOpacity>
                </Animatable.View> */}
              </View>

              {/* Footer */}
              <Animatable.View animation="fadeIn" delay={700} style={styles.footer}>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>10,000+</Text>
                    <Text style={styles.statLabel}>Happy Customers</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>500+</Text>
                    <Text style={styles.statLabel}>Partner Pharmacies</Text>
                  </View>
                </View>
              </Animatable.View>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 40) + 8,
    marginBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  // Options
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  optionCard: {
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardBackground: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  signInCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#14B8A6',
  },
  registerCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  signInIconBg: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(20, 184, 166, 0.2)',
  },
  registerIconBg: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 20,
  },
  arrowContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  // Guest Button
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  guestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
});
