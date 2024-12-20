import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';

// Mock events data (same as before)
const initialEvents = [
  // ... (Your event data)
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_WIDTH = (SCREEN_WIDTH - 40) / 7; // 40 for padding

const RepairCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Memoization (same as before)
  const calendarDays = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const days = [];
    
    // Start on Sunday before the first day of the month
    let day = new Date(startOfMonth);
    day.setDate(day.getDate() - day.getDay());
    
    // Generate all days for the calendar grid
    while (day <= endOfMonth || day.getDay() !== 0) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
  
    return days;
  }, [currentDate]);

  const getEventsForDate = (date) => {
    return initialEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const changeMonth = (increment) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + increment, 1));
  };

  const formatDate = (date, type = 'day') => {
    const options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
  
    if (type === 'day') return date.getDate();
    if (type === 'month-year') return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (type === 'full') return date.toLocaleDateString('en-US', options);
    
    return date.toDateString();
  };

  const handleViewEvent = (day) => {
    const events = getEventsForDate(day);
    if (events.length > 0) {
      setSelectedEvent(events[0]); // Optionally update to handle all events.
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Use a View instead of ScrollView for consistent background */}
      <View style={styles.content}> 
        {/* Header (Modified) */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Repair Calendar</Text>
        </View>

        {/* Calendar Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowButton}>
            <ChevronLeft size={24} color="#b91c1c" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{formatDate(currentDate, 'month-year')}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowButton}>
            <ChevronRight size={24} color="#b91c1c" />
          </TouchableOpacity>
        </View>

        {/* Weekday Headers */}
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

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !isCurrentMonth && styles.otherMonthDay,
                  isToday && styles.today
                ]}
                onPress={() => eventsOnDay.length > 0 && handleViewEvent(eventsOnDay[0])}
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

        {/* ... (Modal - Modified) ... */}
        <Modal
          visible={selectedEvent !== null}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
                <TouchableOpacity 
                  onPress={() => setSelectedEvent(null)}
                  style={styles.closeButton}
                >
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.eventDetail}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailText}>
                    {selectedEvent && formatDate(new Date(selectedEvent.date), 'full')}
                  </Text>
                </View>

                <View style={styles.eventDetail}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailText}>{selectedEvent?.type}</Text>
                </View>

                <View style={styles.eventDetail}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailText}>{selectedEvent?.location}</Text>
                </View>

                <Text style={styles.description}>{selectedEvent?.description}</Text>
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
    backgroundColor: '#fff', // Match the background color
  },
  content: {
    flex: 1,
    padding: 20, // Add padding similar to your form
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Black header text like your form
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  arrowButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Black text
  },
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)', // Light grey border
  },
  weekdayCell: {
    width: DAY_WIDTH,
    alignItems: 'center',
    paddingBottom: 10,
  },
  weekdayText: {
    fontWeight: 'bold',
    color: '#000', // Black text
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: DAY_WIDTH,
    height: DAY_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)', // Light grey border
    marginBottom: 5,
  },
  otherMonthDay: {
    backgroundColor: '#f2f2f2', // Light grey for other month days
  },
  otherMonthText: {
    color: '#666', // Darker grey text
  },
  dayNumber: {
    fontSize: 16,
    color: '#000',
  },
  today: {
    backgroundColor: '#f2f2f2', // Same highlight as other month days
    borderRadius: 20, // Circular highlight
  },
  todayText: {
    fontWeight: 'bold',
  },
  eventIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#b91c1c', // Red dot
    marginTop: 5,
  },
  // Modal styles (Modified)
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 5, // Less rounded corners
    padding: 20,
    width: SCREEN_WIDTH * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#b91c1c',
    padding: 10,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 20, // Slightly smaller title
    fontWeight: 'bold',
    color: '#fff'
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    marginBottom: 20,
  },
  eventDetail: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#000',
    width: 80,
  },
  detailText: {
    flex: 1,
    color: '#000',
  },
  description: {
    color: '#000',
    marginBottom: 10,
  },
  modalFooter: {
    alignItems: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#b91c1c', // Red button
  },
  viewButton: {
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RepairCalendar;