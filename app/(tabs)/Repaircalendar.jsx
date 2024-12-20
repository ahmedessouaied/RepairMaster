import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebaseConfig';
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_WIDTH = (SCREEN_WIDTH - 40) / 7;

const RepairCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user from Firebase Auth
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          setError('No authenticated user found');
          setLoading(false);
          return;
        }

        const professionalId = currentUser.uid;
        
        // Query Firestore with the professional ID from auth
        const repairOffersRef = collection(db, 'Offers');
        const q = query(
          repairOffersRef,
          where('professionalId', '==', professionalId),
          where('status', '==', true)
        );
        
        const snapshot = await getDocs(q);
        const fetchedEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        }));
        
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to fetch repair events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Only fetch on component mount

  // Rest of the component remains the same...
  const calendarDays = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const days = [];
    
    let day = new Date(startOfMonth);
    day.setDate(day.getDate() - day.getDay());
    
    while (day <= endOfMonth || day.getDay() !== 0) {
      days.push(new Date(day));
      day = new Date(day.setDate(day.getDate() + 1));
    }

    return days;
  }, [currentDate]);

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const changeMonth = (increment) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + increment, 1));
  };

  const formatDate = (date, type = 'day') => {
    if (!date) return '';
    
    try {
      switch (type) {
        case 'day':
          return date.getDate();
        case 'month-year':
          return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        case 'full':
          return date.toLocaleDateString('en-US', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          });
        default:
          return date.toDateString();
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const handleViewEvent = (day) => {
    const eventsOnDay = getEventsForDate(day);
    if (eventsOnDay.length > 0) {
      setSelectedEvent(eventsOnDay[0]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text>Loading calendar...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Repair Calendar</Text>
        </View>

        <View style={styles.monthSelector}>
          <TouchableOpacity 
            onPress={() => changeMonth(-1)} 
            style={styles.arrowButton}
            accessibilityLabel="Previous month"
          >
            <ChevronLeft size={24} color="#b91c1c" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{formatDate(currentDate, 'month-year')}</Text>
          <TouchableOpacity 
            onPress={() => changeMonth(1)} 
            style={styles.arrowButton}
            accessibilityLabel="Next month"
          >
            <ChevronRight size={24} color="#b91c1c" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekdayHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <View key={day} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        <ScrollView>
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              const eventsOnDay = getEventsForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <TouchableOpacity
                  key={`${day.toISOString()}-${index}`}
                  style={[
                    styles.dayCell,
                    !isCurrentMonth && styles.otherMonthDay,
                    isToday && styles.today
                  ]}
                  onPress={() => eventsOnDay.length > 0 && handleViewEvent(day)}
                  disabled={eventsOnDay.length === 0}
                  accessibilityLabel={`${formatDate(day, 'full')}${eventsOnDay.length > 0 ? `, ${eventsOnDay.length} events` : ''}`}
                >
                  <Text style={[
                    styles.dayNumber,
                    !isCurrentMonth && styles.otherMonthText,
                    isToday && styles.todayText
                  ]}>
                    {formatDate(day)}
                  </Text>
                  {eventsOnDay.length > 0 && (
                    <View style={styles.eventIndicator} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <Modal
          visible={selectedEvent !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedEvent(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedEvent?.title || 'Event Details'}</Text>
                <TouchableOpacity 
                  onPress={() => setSelectedEvent(null)}
                  style={styles.closeButton}
                  accessibilityLabel="Close modal"
                >
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                {selectedEvent ? (
                  <>
                    <View style={styles.eventDetail}>
                      <Text style={styles.detailLabel}>Date:</Text>
                      <Text style={styles.detailText}>
                        {formatDate(selectedEvent.date, 'full')}
                      </Text>
                    </View>

                    <View style={styles.eventDetail}>
                      <Text style={styles.detailLabel}>Price:</Text>
                      <Text style={styles.detailText}>
                        {typeof selectedEvent.price === 'number' 
                          ? `$${selectedEvent.price.toFixed(2)} USD`
                          : 'Price not available'}
                      </Text>
                    </View>

                    <View style={styles.eventDetail}>
                      <Text style={styles.detailLabel}>Duration:</Text>
                      <Text style={styles.detailText}>
                        {typeof selectedEvent.estimatedDuration === 'number'
                          ? `${selectedEvent.estimatedDuration} hours`
                          : 'Duration not available'}
                      </Text>
                    </View>

                    {selectedEvent.description && (
                      <Text style={styles.description}>{selectedEvent.description}</Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.description}>No event details available</Text>
                )}
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={[styles.button, styles.viewButton]}
                  onPress={() => setSelectedEvent(null)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  arrowButton: {
    padding: 10,
  },
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayCell: {
    width: DAY_WIDTH,
    alignItems: 'center',
  },
  weekdayText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: DAY_WIDTH,
    height: DAY_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  dayNumber: {
    fontSize: 16,
    color: '#1f2937',
  },
  otherMonthDay: {
    backgroundColor: '#f9fafb',
  },
  otherMonthText: {
    color: '#9ca3af',
  },
  today: {
    backgroundColor: '#fee2e2',
  },
  todayText: {
    color: '#b91c1c',
    fontWeight: 'bold',
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#b91c1c',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#b91c1c',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  eventDetail: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#1f2937',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#b91c1c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default RepairCalendar;