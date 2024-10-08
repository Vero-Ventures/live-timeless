import ContentLoader, { Rect, Circle } from "react-content-loader/native";

export default function GoalListLoader() {
  return (
    <ContentLoader
      speed={1}
      width={400}
      height={460}
      viewBox="0 0 400 460"
      backgroundColor="#173e63"
      foregroundColor="#21588b"
    >
      <Circle cx="48" cy="45" r="22" />
      <Circle cx="48" cy="120" r="22" />
      <Circle cx="48" cy="195" r="22" />
      <Rect x="86" y="175" rx="18" ry="18" width="182" height="38" />
      <Rect x="86" y="25" rx="18" ry="18" width="182" height="38" />
      <Rect x="86" y="100" rx="18" ry="18" width="182" height="38" />
    </ContentLoader>
  );
}
