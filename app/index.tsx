import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, ShoppingBag, Store, ArrowRight, Shield, Zap } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=1600',
      }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(20,184,166,0.9)', 'rgba(59,130,246,0.9)']}
        style={styles.overlay}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Animatable.View animation="fadeInDown" duration={1000} style={styles.logoContainer}>
                <Heart color="#FFFFFF" size={36} strokeWidth={2.5} />
                <View style={styles.logoGlow} />
              </Animatable.View>
              <Text style={styles.title}>FYM</Text>
              <Text style={styles.subtitle}>Your health, delivered with care</Text>

              <View style={styles.trustIndicators}>
                <View style={styles.trustItem}>
                  <Shield color="rgba(255, 255, 255, 0.9)" size={16} strokeWidth={2} />
                  <Text style={styles.trustText}>Verified</Text>
                </View>
                <View style={styles.trustItem}>
                  <Zap color="rgba(255, 255, 255, 0.9)" size={16} strokeWidth={2} />
                  <Text style={styles.trustText}>Fast Delivery</Text>
                </View>
              </View>
            </View>

            <View style={styles.roleContainer}>
              <Text style={styles.roleTitle}>Choose your role</Text>

              <Animatable.View animation="fadeInUp" delay={200}>
                <TouchableOpacity
                  style={styles.roleCard}
                  onPress={() => router.push('/(auth)/buyer-choice')}
                  activeOpacity={0.9}
                >
                  <View style={[styles.cardBackground, styles.buyerCard]}>
                    <View style={styles.cardContent}>
                      <View style={[styles.iconContainer, styles.buyerIconContainer]}>
                        <ShoppingBag color="#14B8A6" size={24} strokeWidth={2.5} />
                      </View>
                      <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>I'm a Buyer</Text>
                        <Text style={styles.cardDescription}>
                          Order medicines and healthcare products with ease
                        </Text>
                        <View style={styles.cardFeatures}>
                          <Text style={styles.featureText}>• Quick ordering</Text>
                          <Text style={styles.featureText}>• Prescription upload</Text>
                        </View>
                      </View>
                      <View style={styles.arrowContainer}>
                        <ArrowRight color="#14B8A6" size={20} strokeWidth={2.5} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animatable.View>

              <Animatable.View animation="fadeInUp" delay={400}>
                <TouchableOpacity
                  style={styles.roleCard}
                  onPress={() => router.push('/(auth)/seller-choice')}
                  activeOpacity={0.9}
                >
                  <View style={[styles.cardBackground, styles.sellerCard]}>
                    <View style={styles.cardContent}>
                      <View style={[styles.iconContainer, styles.sellerIconContainer]}>
                        <Store color="#3B82F6" size={24} strokeWidth={2.5} />
                      </View>
                      <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>I'm a Seller</Text>
                        <Text style={styles.cardDescription}>
                          Sell medicines and manage your pharmacy inventory
                        </Text>
                        <View style={styles.cardFeatures}>
                          <Text style={styles.featureText}>• Inventory management</Text>
                          <Text style={styles.featureText}>• Order tracking</Text>
                        </View>
                      </View>
                      <View style={styles.arrowContainer}>
                        <ArrowRight color="#3B82F6" size={20} strokeWidth={2.5} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            </View>

            <View style={styles.footer}>
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
              <Text style={styles.footerText}>
                Trusted healthcare marketplace in your pocket
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
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
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logoContainer: {
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
  logoGlow: {
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
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '400',
    marginBottom: 20,
    lineHeight: 24,
    textAlign: 'center',
  },
  trustIndicators: {
    flexDirection: 'row',
    gap: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 5,
  },
  trustText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '500',
  },
  roleContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 40,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  roleCard: {
    marginVertical: 10,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardBackground: {
    borderRadius: 16,
    padding: 16, // Reduced from 24
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  buyerCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#14B8A6',
  },
  sellerCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 90, // Added to ensure consistent height
  },
  iconContainer: {
    width: 48, // Reduced from 64
    height: 48, // Reduced from 64
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14, // Reduced from 18
  },
  buyerIconContainer: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(20, 184, 166, 0.2)',
  },
  sellerIconContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  cardText: {
    flex: 1,
    paddingVertical: 4, // Added for better spacing
  },
  cardTitle: {
    fontSize: 20, // Reduced from 24
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8, // Increased from 6
  },
  cardDescription: {
    fontSize: 13, // Reduced from 15
    color: '#6B7280',
    lineHeight: 20, // Increased from 22
    marginBottom: 12, // Increased from 10
  },
  cardFeatures: {
    gap: 4, // Increased from 2
  },
  featureText: {
    fontSize: 11, // Reduced from 12
    color: '#9CA3AF',
    fontWeight: '500',
    lineHeight: 16, // Added to prevent overlap
  },
  arrowContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    width: 36, // Reduced from 40
    height: 36, // Reduced from 40
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18, // Reduced from 20
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11, // Reduced from 12
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24, // Reduced from 30
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  footerText: {
    fontSize: 13, // Reduced from 14
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '400',
  },
});