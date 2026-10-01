import { getInitials } from "../utils.js";

const COLORS = ["#0f6e8c", "#7a4fb5", "#b3601f", "#2f7d4f", "#a8335c", "#3b5bb5"];

export default function Avatar({ name }) {
  // Same name always gets the same colour
  const index = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLORS.length;
  return (
    <span className="avatar" style={{ background: COLORS[index] }} aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}
