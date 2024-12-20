import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import PhotoUploadComponent from "../../components/PhotoUploadComponent";
import { auth } from "../../config/firebaseConfig.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const Profile = () => {
  const [username, setUsername] = useState("user");
  const [profileImage_uri, setProfileImage_uri] = useState(
    "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"
  );
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [problemsDocs, setProblemsDocs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("No user ID found");
        return;
      }

      console.log("Fetching data for user:", userId);
      const db = getFirestore();

      // Check Clients collection
      const clientQuery = query(
        collection(db, "Clients"),
        where("userId", "==", userId)
      );

      const clientSnapshot = await getDocs(clientQuery);
      console.log("Client documents found:", clientSnapshot.size);

      if (!clientSnapshot.empty) {
        const userData = clientSnapshot.docs[0].data();
        console.log("User data:", userData);
        setUsername(userData.username || "user");
        if (userData.Profile_pic) {
          setProfileImage_uri(userData.Profile_pic);
        }
      }

      // Check Clients Problems
      const problemsQuery = query(
        collection(db, "Problems"),
        where("clientId", "==", userId)
      );

      const problemsSnapshot = await getDocs(problemsQuery);
      console.log("Problems found:", problemsSnapshot.size);

      const problems = problemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProblemsDocs(problems);
      setTotalPosts(problems.length);
      setTotalActive(
        problems.filter(
          (doc) => doc.status === "on cours" || doc.status === "on hold"
        ).length
      );
      setTotalCompleted(
        problems.filter((doc) => doc.status === "completed").length
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && isMounted) {
        console.log("User is signed in, userId:", user.uid);
        fetchData();
      } else {
        console.log("No user signed in");
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handlePhotoUploaded = async (cloudinaryUrls) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log("No user ID found");
      return;
    }

    console.log("Updating profile picture for user:", userId);

    // Firestore setup
    const db = getFirestore();
    const clientQuery = query(
      collection(db, "Clients"),
      where("userId", "==", userId)
    );

    const clientSnapshot = await getDocs(clientQuery);
    if (clientSnapshot.empty) {
      console.log("No client found for this user");
      return;
    }

    // Update Firestore with the new profile picture URL
    const clientDoc = clientSnapshot.docs[0]; // Assuming one match
    console.log(cloudinaryUrls);
    await updateDoc(doc(db, "Clients", clientDoc.id), {
      Profile_pic: cloudinaryUrls[0],
    });
  };

  const renderProblemCard = (problem) => {
    if (!problem) return null;

    return (
      <View
        key={problem.id}
        style={{
          backgroundColor: "#e5e5e5",
          padding: 15,
          marginBottom: 5,
          borderRadius: 15,
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{problem.title || "Untitled"}</Text>
          <Text style={styles.cardSubtitle}>
            {problem.category || "No Category"}
          </Text>
          <Text style={styles.cardSubtitle}>
            {problem.description || "No description"}
          </Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.statusBadgeContainer}>
              <Text
                style={
                  problem.status === "completed"
                    ? styles.completedBadge
                    : styles.activeBadge
                }
              >
                {problem.status || "Unknown"}
              </Text>
            </View>
            {problem.offers && (
              <Text style={styles.cardOffers}>
                {problem.offers.length} offers received
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => {
              if (!problem.id) return;
              router.push({
                pathname:
                  problem.status === "completed"
                    ? "/profileInfo/repairDetails"
                    : "/profileInfo/offersReceived",
                    params: {
                      id: 1,
                      repairer: "Ahmed Essouaied",
                      type: "Electrical Wiring Repair",
                      date: "12 Nov 2023",
                      cost: "80 DT",
                      status: "Completed",
                      description:
                        "Full home electrical system inspection and rewiring of main circuit board",
                      image: "https://via.placeholder.com/150",
                      Rating: 3,
                    },
              });
            }}
          >
            <Text style={styles.detailsButtonText}>
              {problem.status === "completed" ? "View Details" : "View Offers"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF0000"]} // Android
            tintColor="#FF0000" // iOS
          />
        }
      >
        <View style={styles.profileSection}>
          <PhotoUploadComponent
            icons={{ upload: "" }}
            styles={styles}
            onPhotoUpload={handlePhotoUploaded}
            photoSelectionLimit={1}
            uploadedphotostyle={styles.upload_photo}
          >
            <Image
              source={{ uri: profileImage_uri }}
              style={styles.upload_photo}
            />
          </PhotoUploadComponent>

          <Text style={styles.profileName}>{username}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalPosts}</Text>
              <Text style={styles.statLabel}>Total Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalActive}</Text>
              <Text style={styles.statLabel}>Active Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCompleted}</Text>
              <Text style={styles.statLabel}>Completed Jobs</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {Array.isArray(problemsDocs) &&
            problemsDocs.reverse().map(renderProblemCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
    padding: 24,
  },
  photoUpload: {
    width: 80,
    height: 80,
  },
  upload_photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FF0000",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  cardContainer: {
    padding: 24,
  },
  card: {
    backgroundColor: "#EDEDED",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeBadge: {
    backgroundColor: "#FF0000",
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  completedBadge: {
    backgroundColor: "#00FF00",
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  cardOffers: {
    fontSize: 14,
    color: "#000",
  },
  detailsButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
  },
  detailsButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Profile;
