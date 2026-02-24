import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NewsArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  readTime: string;
  image?: string;
}

export default function MedicineNewsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'latest', name: 'Latest', icon: 'time-outline' },
    { id: 'research', name: 'Research', icon: 'flask-outline' },
    { id: 'covid', name: 'COVID-19', icon: 'shield-outline' },
    { id: 'wellness', name: 'Wellness', icon: 'heart-outline' },
    { id: 'pharma', name: 'Pharma', icon: 'medkit-outline' },
  ];

  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      category: 'research',
      title: 'New Breakthrough in Cancer Treatment Shows Promise',
      summary: 'Researchers discover novel approach to targeting cancer cells with minimal side effects. Clinical trials show 85% success rate.',
      source: 'Medical Journal Today',
      time: '2 hours ago',
      readTime: '5 min read',
    },
    {
      id: '2',
      category: 'covid',
      title: 'COVID-19 Variant Update: What You Need to Know',
      summary: 'Health officials report new variant detected. Vaccines remain effective against severe illness.',
      source: 'WHO Health News',
      time: '4 hours ago',
      readTime: '3 min read',
    },
    {
      id: '3',
      category: 'pharma',
      title: 'FDA Approves New Diabetes Medication',
      summary: 'Revolutionary drug approved for Type 2 diabetes management with improved efficacy and fewer side effects.',
      source: 'Pharma Times',
      time: '6 hours ago',
      readTime: '4 min read',
    },
    {
      id: '4',
      category: 'wellness',
      title: 'Mental Health: Breaking the Stigma in India',
      summary: 'New initiatives aim to improve mental health awareness and access to treatment across the country.',
      source: 'Health India',
      time: '8 hours ago',
      readTime: '6 min read',
    },
    {
      id: '5',
      category: 'research',
      title: 'AI-Powered Diagnostics Revolution Healthcare',
      summary: 'Machine learning algorithms now detect diseases earlier than traditional methods with 95% accuracy.',
      source: 'Tech Medicine',
      time: '10 hours ago',
      readTime: '7 min read',
    },
    {
      id: '6',
      category: 'latest',
      title: 'Vitamin D Deficiency Linked to Immune System',
      summary: 'Study reveals critical connection between vitamin D levels and immune response effectiveness.',
      source: 'Nutrition Science',
      time: '12 hours ago',
      readTime: '4 min read',
    },
    {
      id: '7',
      category: 'pharma',
      title: 'Generic Drug Prices Drop by 40% This Quarter',
      summary: 'Government initiative brings down essential medicine costs, making healthcare more accessible.',
      source: 'Economic Health',
      time: '1 day ago',
      readTime: '3 min read',
    },
    {
      id: '8',
      category: 'wellness',
      title: 'Sleep Disorders: Silent Epidemic Affecting Millions',
      summary: 'Experts warn about rising sleep issues and their impact on overall health and productivity.',
      source: 'Sleep Research Institute',
      time: '1 day ago',
      readTime: '5 min read',
    },
  ];

  const filteredNews = newsArticles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      research: '#2EC4B6',
      covid: '#FF6B6B',
      pharma: '#5AC8FA',
      wellness: '#32D74B',
      latest: '#FFB800',
    };
    return colors[category] || '#2EC4B6';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Medicine News</Text>
          <Text style={styles.headerSubtitle}>Stay updated with latest health news</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => Alert.alert('Notifications', 'No new notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#2EC4B6" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search news..."
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#666666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={18} 
                color={selectedCategory === category.id ? '#000000' : '#FFFFFF'} 
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Section */}
        {selectedCategory === 'all' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
              <TouchableOpacity onPress={() => Alert.alert('View All', 'Feature coming soon!')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.trendingContainer}
            >
              {newsArticles.slice(0, 3).map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.trendingCard}
                  onPress={() => Alert.alert(article.title, article.summary)}
                >
                  <View style={styles.trendingImagePlaceholder}>
                    <Ionicons name="newspaper" size={40} color="#2EC4B6" />
                  </View>
                  <View style={styles.trendingContent}>
                    <View style={[styles.trendingCategory, { backgroundColor: getCategoryColor(article.category) }]}>
                      <Text style={styles.trendingCategoryText}>{article.category.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.trendingTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    <View style={styles.trendingMeta}>
                      <Text style={styles.trendingTime}>
                        <Ionicons name="time-outline" size={12} /> {article.time}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* News Articles List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Latest Updates' : `${categories.find(c => c.id === selectedCategory)?.name} News`}
          </Text>
          <Text style={styles.resultCount}>{filteredNews.length} articles</Text>

          {filteredNews.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.newsCard}
              onPress={() => Alert.alert(article.title, article.summary)}
            >
              <View style={styles.newsImageContainer}>
                <View style={styles.newsImagePlaceholder}>
                  <Ionicons name="newspaper" size={32} color="#2EC4B6" />
                </View>
                <View style={[styles.newsCategoryBadge, { backgroundColor: getCategoryColor(article.category) }]}>
                  <Text style={styles.newsCategoryBadgeText}>{article.category}</Text>
                </View>
              </View>

              <View style={styles.newsContent}>
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                <Text style={styles.newsSummary} numberOfLines={2}>
                  {article.summary}
                </Text>

                <View style={styles.newsFooter}>
                  <View style={styles.newsSource}>
                    <Ionicons name="newspaper-outline" size={12} color="#2EC4B6" />
                    <Text style={styles.newsSourceText}>{article.source}</Text>
                  </View>
                  <View style={styles.newsMeta}>
                    <Text style={styles.newsTime}>
                      <Ionicons name="time-outline" size={12} /> {article.time}
                    </Text>
                    <Text style={styles.newsReadTime}>• {article.readTime}</Text>
                  </View>
                </View>

                <View style={styles.newsActions}>
                  <TouchableOpacity style={styles.newsActionButton}>
                    <Ionicons name="bookmark-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.newsActionButton}>
                    <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredNews.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#666666" />
              <Text style={styles.emptyStateText}>No news found</Text>
              <Text style={styles.emptyStateSubText}>
                {searchQuery ? 'Try different keywords' : 'Check back later for updates'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2EC4B6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    backgroundColor: '#1A1A1A',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2EC4B6',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2EC4B6',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2EC4B6',
  },
  categoryButtonActive: {
    backgroundColor: '#2EC4B6',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#000000',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2EC4B6',
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 16,
  },
  trendingContainer: {
    marginTop: 8,
  },
  trendingCard: {
    width: 280,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2EC4B6',
    overflow: 'hidden',
  },
  trendingImagePlaceholder: {
    height: 140,
    backgroundColor: '#2EC4B620',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingContent: {
    padding: 12,
  },
  trendingCategory: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  trendingCategoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 22,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingTime: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2EC4B6',
    overflow: 'hidden',
  },
  newsImageContainer: {
    width: 120,
    position: 'relative',
  },
  newsImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2EC4B620',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsCategoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newsCategoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  newsContent: {
    flex: 1,
    padding: 12,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 20,
  },
  newsSummary: {
    fontSize: 13,
    color: '#CCCCCC',
    marginBottom: 8,
    lineHeight: 18,
  },
  newsFooter: {
    marginBottom: 8,
  },
  newsSource: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  newsSourceText: {
    fontSize: 12,
    color: '#2EC4B6',
    marginLeft: 4,
    fontWeight: '600',
  },
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsTime: {
    fontSize: 11,
    color: '#999999',
  },
  newsReadTime: {
    fontSize: 11,
    color: '#999999',
    marginLeft: 4,
  },
  newsActions: {
    flexDirection: 'row',
    gap: 8,
  },
  newsActionButton: {
    width: 32,
    height: 32,
    backgroundColor: '#2EC4B620',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
});
