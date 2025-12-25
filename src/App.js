import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  Dimensions,
} from "react-native";
import { create } from "zustand";
import LottieView from "lottie-react-native";

// 1. إدارة حالة الغرفة (Zustand Store)
const useRoomStore = create((set) => ({
  seats: Array(8)
    .fill(null)
    .map((_, i) => ({ id: i, userId: null, name: null, isMuted: true })),
  roomName: "غرفة الأصدقاء الراقية",
  activeGift: null,

  // الجلوس على مقعد
  takeSeat: (index, user) =>
    set((state) => {
      const newSeats = [...state.seats];
      if (!newSeats[index].userId) {
        newSeats[index] = {
          ...newSeats[index],
          userId: user.id,
          name: user.name,
        };
      }
      return { seats: newSeats };
    }),

  // كتم أو فتح الميكروفون
  toggleMic: (index) =>
    set((state) => {
      const newSeats = [...state.seats];
      if (newSeats[index].userId) {
        newSeats[index].isMuted = !newSeats[index].isMuted;
      }
      return { seats: newSeats };
    }),

  // إرسال هدية
  triggerGift: (giftType) => {
    set({ activeGift: giftType });
    setTimeout(() => set({ activeGift: null }), 4000); // تختفي الهدية بعد 4 ثوانٍ
  },
}));

// 2. المكون الرئيسي للتطبيق
export default function App() {
  const { seats, roomName, takeSeat, toggleMic, activeGift, triggerGift } =
    useRoomStore();

  // مستخدم وهمي (أنت)
  const currentUser = { id: "user_99", name: "أحمد" };

  const renderSeat = (seat, index) => (
    <TouchableOpacity
      key={seat.id}
      style={styles.seatContainer}
      onPress={() => takeSeat(index, currentUser)}
    >
      <View style={[styles.avatarCircle, seat.userId && styles.activeAvatar]}>
        {seat.userId ? (
          <>
            <Image
              source={{ uri: `i.pravatar.cc{seat.userId}` }}
              style={styles.avatarImage}
            />
            <View style={styles.micStatus}>
              <Text style={{ fontSize: 10 }}>{seat.isMuted ? "🔇" : "🎙️"}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.emptyMic}>🎙️</Text>
        )}
      </View>
      <Text style={styles.seatName}>{seat.name || `مقعد ${seat.id + 1}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "images.unsplash.com" }}
        style={styles.background}
      >
        {/* رأس الصفحة - إعدادات الغرفة */}
        <View style={styles.header}>
          <View>
            <Text style={styles.roomTitle}>{roomName}</Text>
            <Text style={styles.onlineCount}>👥 125 متابع</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <Text style={{ color: "white" }}>⚙️ الإعدادات</Text>
          </TouchableOpacity>
        </View>

        {/* شبكة المقاعد */}
        <View style={styles.grid}>
          {seats.map((seat, index) => renderSeat(seat, index))}
        </View>

        {/* منطقة الأنيميشن للهدايا */}
        {activeGift && (
          <View style={styles.giftOverlay}>
            <Text style={styles.giftText}>🎁 تم إرسال {activeGift}!</Text>
            {/* يمكنك استبدال الرابط بملف Lottie محلي لديك */}
            <LottieView
              source={{ uri: "assets9.lottiefiles.com" }}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
        )}

        {/* شريط الأدوات السفلي */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => triggerGift("التاج الذهبي")}
          >
            <Text style={styles.btnIcon}>🎁</Text>
            <Text style={styles.btnText}>هدايا</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => toggleMic(0)}
          >
            <Text style={styles.btnIcon}>🎤</Text>
            <Text style={styles.btnText}>الميكروفون</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#ff4d4d" }]}
          >
            <Text style={styles.btnText}>خروج</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

// 3. التنسيقات (Styles)
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  roomTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  onlineCount: { color: "#ccc", fontSize: 12, textAlign: "right" },
  settingsBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 20,
  },

  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  seatContainer: {
    width: width / 4 - 20,
    alignItems: "center",
    marginBottom: 25,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#555",
  },
  activeAvatar: { borderColor: "#00ffcc" },
  avatarImage: { width: 56, height: 56, borderRadius: 28 },
  emptyMic: { fontSize: 20, opacity: 0.5 },
  seatName: { color: "white", fontSize: 10, marginTop: 5 },
  micStatus: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 2,
  },

  giftOverlay: {
    position: "absolute",
    top: "30%",
    alignSelf: "center",
    alignItems: "center",
  },
  giftText: {
    color: "#ffcc00",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  lottie: { width: 250, height: 250 },

  footer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignSelf: "center",
  },
  actionBtn: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 15,
    width: 80,
  },
  btnIcon: { fontSize: 20 },
  btnText: { color: "white", fontSize: 12, marginTop: 4 },
});
