import { LinearGradient } from "expo-linear-gradient";

export default function Background() {
  return (
    <LinearGradient
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        width: "100%",
      }}
      colors={[
        "rgba(253,245,231,1)",
        "rgba(233,234,251,1)",
        "rgba(226,247,238,1)",
      ]}
      start={{
        x: 0,
        y: 0.3,
      }}
      end={{
        x: 0.9,
        y: 0,
      }}
      locations={[0, 0.45, 1]}
    />
  );
}
