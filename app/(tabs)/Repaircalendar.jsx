import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_WIDTH = (SCREEN_WIDTH - 40) / 7;

const RepairCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // Start with January 2025
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Static repair job data for January 2025
  const staticEvents = useMemo(() => [
    {
      id: '1',
      title: 'Fix leaky faucet',
      date: new Date(2025, 0, 6), // January 5, 2025
      price: 75.00,
      estimatedDuration: 1.5,
      description: 'Repair a leaky faucet in the kitchen.',
    },
    {
      id: '2',
      title: 'Install new light fixture',
      date: new Date(2025, 0, 10), // January 10, 2025
      price: 120.00,
      estimatedDuration: 2,
      description: 'Install a new ceiling light fixture in the living room.',
    },
    {
      id: '3',
      title: 'Repair drywall',
      date: new Date(2025, 0, 13), // January 19, 2025
      price: 200.00,
      estimatedDuration: 3,
      description: 'Patch and paint a hole in the drywall.',
    },
    {
      id: '4',
      title: 'Unclog drain',
      date: new Date(2025, 0, 23), // January 26, 2025
      price: 90.00,
      estimatedDuration: 1,
      description: 'Unclog a bathroom sink drain.',
    },
    {
      id: '5',
      title: 'Fix running toilet',
      date: new Date(2025, 0, 26), // January 26, 2025
      price: 60.00,
      estimatedDuration: 1,
      description: 'Fix a constantly running toilet.',
    },
    {
      id: '6',
      title: 'Repair drywall',
      date: new Date(2025, 0, 21), // January 21, 2025
      price: 60.00,
      estimatedDuration: 1,
      description: 'Fix a constantly running toilet.',
    },
    {
      id: '7',
      title: 'Fix leaky faucet',
      date: new Date(2024, 11, 6), // January 5, 2025
      price: 75.00,
      estimatedDuration: 1.5,
      description: 'Repair a leaky faucet in the kitchen.',
    },
    {
      id: '8',
      title: 'Install new light fixture',
      date: new Date(2025, 11, 19), // January 10, 2025
      price: 120.00,
      estimatedDuration: 2,
      description: 'Install a new ceiling light fixture in the living room.',
    },
    {
      id: '9',
      title: 'Repair drywall',
      date: new Date(2025, 11, 13), // January 19, 2025
      price: 200.00,
      estimatedDuration: 3,
      description: 'Patch and paint a hole in the drywall.',
    },
    {
      id: '10',
      title: 'Unclog drain',
      date: new Date(2025, 11, 2), // January 26, 2025
      price: 90.00,
      estimatedDuration: 1,
      description: 'Unclog a bathroom sink drain.',
    },
    {
      id: '11',
      title: 'Fix running toilet',
      date: new Date(2025, 11, 28), // January 26, 2025
      price: 60.00,
      estimatedDuration: 1,
      description: 'Fix a constantly running toilet.',
    },
    {
      id: '12',
      title: 'Repair drywall',
      date: new Date(2025, 11, 31), // January 21, 2025
      price: 60.00,
      estimatedDuration: 1,
      description: 'Fix a constantly running toilet.',
    },
    
  ], []);

  // Calculate calendar days
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

  // Get events for a specific date
  const getEventsForDate = useCallback((date) => {
    return staticEvents.filter(event => {
      return event.date.toDateString() === date.toDateString();
    });
  }, [staticEvents]);

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
    backgroundColor: '#ffdddd', // Highlight color for days with events, more noticeable now
  },
  eventDayText: {
    color: '#b91c1c', // Text color for days with events
    fontWeight: 'bold',
  },
});

export default RepairCalendar;