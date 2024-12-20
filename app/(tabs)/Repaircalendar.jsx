import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebaseConfig';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_WIDTH = (SCREEN_WIDTH - 40) / 7;

const RepairCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch events - optimized with onSnapshot for real-time updates
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError('No authenticated user found');
      setLoading(false);
      return;
    }

    const professionalId = currentUser.uid;
    const repairOffersRef = collection(db, 'Offers');
    const q = query(
      repairOffersRef,
      where('professionalId', '==', professionalId), // Use the correct field name
      where('status', '==', true)
    );

    // Using onSnapshot for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      }));
      setEvents(fetchedEvents);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching events:', error);
      setError('Failed to fetch repair events');
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Calculate calendar days - optimized with useMemo
  const calendarDays = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const days = [];

    let day = new Date(startOfMonth);
    day.setDate(day.getDate() - day.getDay());

    while (day <= endOfMonth || day.getDay() !== 0) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }

    return days;
  }, [currentDate]);

  // Get events for a specific date - optimized by pre-filtering events
  const getEventsForDate = useCallback((date) => {
    return events.filter(event => {
      return event.date.toDateString() === date.toDateString();
    });
  }, [events]);

  // Change the current month
  const changeMonth = (increment) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + increment, 1));
  };

  // Format date based on type
  const formatDate = useCallback((date, type = 'day') => {
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
  }, []);

  // Handle viewing an event
  const handleViewEvent = useCallback((day) => {
    const eventsOnDay = getEventsForDate(day);
    if (eventsOnDay.length > 0) {
      setSelectedEvent(eventsOnDay[0]);
    }
  }, [getEventsForDate]);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#b91c1c" />
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header and Month Selector */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Repair Calendar</Text>
        </View>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowButton} accessibilityLabel="Previous month">
            <ChevronLeft size={24} color="#b91c1c" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{formatDate(currentDate, 'month-year')}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowButton} accessibilityLabel="Next month">
            <ChevronRight size={24} color="#b91c1c" />
          </TouchableOpacity>
        </View>

        {/* Weekday Header */}
        <View style={styles.weekdayHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <View key={day} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <ScrollView>
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              const eventsOnDay = getEventsForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const hasEvents = eventsOnDay.length > 0;

              return (
                <TouchableOpacity
                  key={`${day.toISOString()}-${index}`}
                  style={[
                    styles.dayCell,
                    !isCurrentMonth && styles.otherMonthDay,
                    isToday && styles.today,
                    hasEvents && styles.eventDay // Highlight days with events
                  ]}
                  onPress={() => hasEvents && handleViewEvent(day)}
                  disabled={!hasEvents}
                  accessibilityLabel={`${formatDate(day, 'full')}${hasEvents ? `, ${eventsOnDay.length} events` : ''}`}
                >
                  <Text style={[
                    styles.dayNumber,
                    !isCurrentMonth && styles.otherMonthText,
                    isToday && styles.todayText,
                    hasEvents && styles.eventDayText // Style text for days with events
                  ]}>
                    {formatDate(day)}
                  </Text>
                  {/* Removed the separate eventIndicator - styling handled by dayCell and dayNumber */}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Event Modal */}
        <Modal
          visible={selectedEvent !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedEvent(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedEvent?.title || 'Event Details'}</Text>
                <TouchableOpacity onPress={() => setSelectedEvent(null)} style={styles.closeButton} accessibilityLabel="Close modal">
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Modal Body */}
              <View style={styles.modalBody}>
                {selectedEvent && (
                  <>
                    <View style={styles.eventDetail}>
                      <Text style={styles.detailLabel}>Date:</Text>
                      <Text style={styles.detailText}>{formatDate(selectedEvent.date, 'full')}</Text>
                    </View>
                    <View style={styles.eventDetail}>
                      <Text style={styles.detailLabel}>Price:</Text>
                      <Text style={styles.detailText}>
                        {typeof selectedEvent.price === 'number' ? `$${selectedEvent.price.toFixed(2)} USD` : 'Price not available'}
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
                    {selectedEvent.description && <Text style={styles.description}>{selectedEvent.description}</Text>}
                  </>
                )}
              </View>

              {/* Modal Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity style={[styles.button, styles.viewButton]} onPress={() => setSelectedEvent(null)}>
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
  eventDay: {
    backgroundColor: '#fee2e2', // Highlight color for days with events
  },
  eventDayText: {
    color: '#b91c1c', // Text color for days with events
    fontWeight: 'bold',
  },
});

export default RepairCalendar;