import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationIconContainer: {
    marginRight: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: '#F8FAFC', // Slate 50
    fontWeight: '500',
  },
  cartButton: {
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 20,
    padding: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#14B8A6', // Primary Teal
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  welcomeSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC', // Slate 50
  },
  welcomeSubText: {
    fontSize: 16,
    color: '#94A3B8', // Slate 400
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#F8FAFC', // Slate 50
  },
  clearButton: {
    padding: 4,
  },
  fymButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14B8A6',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  fymButtonText: {
    marginLeft: 4,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  medicineResultsContainer: {
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  cutButton: {
    backgroundColor: '#334155', // Slate 700
    borderRadius: 20,
    padding: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  medicineList: {
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#334155', // Slate 700
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#475569', // Slate 600
  },
  medicineInfo: {
    flex: 1,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  stockBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  outOfStockBadge: {
    backgroundColor: '#FEE2E2',
  },
  stockText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: 'bold',
  },
  outOfStockText: {
    color: '#991B1B',
  },
  manufacturerText: {
    fontSize: 14,
    color: '#94A3B8', // Slate 400
    marginTop: 2,
  },
  medicineDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: '#475569', // Slate 600
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#CBD5E1', // Slate 300
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14B8A6',
  },
  addToCartButton: {
    marginLeft: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 16,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  cardsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigCard: {
    width: '48%',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  cardIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconBg: {
    backgroundColor: '#334155', // Slate 700
    borderRadius: 20,
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 12,
    color: '#94A3B8', // Slate 400
    marginBottom: 12,
  },
  prescriptionPreview: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActionText: {
    fontSize: 14,
    color: '#14B8A6',
    fontWeight: 'bold',
    marginRight: 4,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '23%',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    backgroundColor: '#334155', // Slate 700
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#CBD5E1', // Slate 300
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 40 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
  },
  mapButtonText: {
    marginLeft: 8,
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorBanner: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#991B1B',
    textAlign: 'center',
    fontWeight: '600',
  },
  cartModal: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Slate 700
    marginTop: Platform.OS === 'ios' ? 40 : 0,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  closeCartButton: {
    padding: 4,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 16,
  },
  emptyCartSubText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  continueShopping: {
    marginTop: 24,
    backgroundColor: '#14B8A6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  continueShoppingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cartItemsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Slate 700
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  cartItemManufacturer: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  quantityButton: {
    padding: 4,
    backgroundColor: '#334155', // Slate 700
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginHorizontal: 12,
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14B8A6',
    minWidth: 60,
    textAlign: 'right',
  },
  cartFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155', // Slate 700
    backgroundColor: '#1E293B', // Slate 800
  },
  totalSection: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  deliveryFree: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155', // Slate 700
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14B8A6',
  },
  placeOrderButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#14B8A6',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: Platform.OS === 'android' ? 40 : 0,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerPin: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#EF4444',
    marginTop: -4,
  },
  userMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#14B8A6',
  },
  sellerMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  sellersListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B', // Slate 800
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  sellersListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sellersListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  sellersList: {
    marginBottom: 16,
  },
  sellerCard: {
    backgroundColor: '#334155', // Slate 700
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569', // Slate 600
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  sellerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerRating: {
    marginLeft: 4,
    marginRight: 12,
    color: '#F8FAFC',
  },
  sellerDistance: {
    color: '#64748B',
  },
  sellerAddress: {
    color: '#64748B',
    fontSize: 14,
  },
  selectSellerButton: {
    backgroundColor: '#14B8A6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  selectSellerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmSellerButton: {
    backgroundColor: '#14B8A6',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: Platform.OS === 'android' ? 40 : 0,
  },
  confirmSellerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 16,
  },
  globalLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)', // Slate 900 with opacity
  },
  noSellersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noSellersText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 16,
  },
  noSellersSubText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },

});
