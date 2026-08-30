const EXERCISE_VISUALS: Record<string, { emoji: string; bg: string; accent: string }> = {
  "wall-pushup": { emoji: "🧱", bg: "#FFF3E0", accent: "#FF8A65" },
  "incline-pushup": { emoji: "📐", bg: "#FFF3E0", accent: "#FF8A65" },
  "dumbbell-chest-press": { emoji: "🏋️", bg: "#E8EAF6", accent: "#5C6BC0" },
  "overhead-press": { emoji: "🙌", bg: "#E3F2FD", accent: "#42A5F5" },
  "floor-pushup": { emoji: "💪", bg: "#FCE4EC", accent: "#E57399" },
  "tricep-dip": { emoji: "🪑", bg: "#F3E5F5", accent: "#AB47BC" },
  "lateral-raise": { emoji: "🦅", bg: "#E0F7FA", accent: "#26C6DA" },
  "bent-over-row": { emoji: "🚣", bg: "#E8F5E9", accent: "#66BB6A" },
  "single-arm-row": { emoji: "💪", bg: "#E8F5E9", accent: "#43A047" },
  "band-pull-apart": { emoji: "🎯", bg: "#FFF9C4", accent: "#F9A825" },
  "bicep-curl": { emoji: "💪", bg: "#FCE4EC", accent: "#E91E63" },
  "lat-pulldown-band": { emoji: "⬇️", bg: "#E3F2FD", accent: "#1E88E5" },
  "reverse-fly": { emoji: "🦋", bg: "#F3E5F5", accent: "#9C27B0" },
  "bodyweight-squat": { emoji: "🦵", bg: "#FFF3E0", accent: "#FF7043" },
  "goblet-squat": { emoji: "🏆", bg: "#FFF8E1", accent: "#FFB300" },
  "split-squat": { emoji: "🦿", bg: "#E0F2F1", accent: "#26A69A" },
  "sumo-squat": { emoji: "🏯", bg: "#FFEBEE", accent: "#EF5350" },
  "step-up": { emoji: "🪜", bg: "#E8F5E9", accent: "#4CAF50" },
  "wall-sit": { emoji: "🧘", bg: "#E0F7FA", accent: "#00ACC1" },
  "reverse-lunge": { emoji: "🚶", bg: "#F1F8E9", accent: "#7CB342" },
  "glute-bridge": { emoji: "🌉", bg: "#FFF3E0", accent: "#E8A87C" },
  "hip-hinge": { emoji: "🔄", bg: "#FBE9E7", accent: "#D84315" },
  "romanian-deadlift": { emoji: "🏋️", bg: "#FFEBEE", accent: "#C62828" },
  "kettlebell-deadlift": { emoji: "🔔", bg: "#F3E5F5", accent: "#7B1FA2" },
  "single-leg-bridge": { emoji: "🦵", bg: "#FFF3E0", accent: "#FF9800" },
  "good-morning": { emoji: "🌅", bg: "#FFF9C4", accent: "#F9A825" },
  "dead-bug": { emoji: "🐛", bg: "#E8F5E9", accent: "#66BB6A" },
  "bird-dog": { emoji: "🐕", bg: "#E3F2FD", accent: "#42A5F5" },
  "forearm-plank": { emoji: "🧱", bg: "#FFEBEE", accent: "#EF5350" },
  "pallof-press": { emoji: "🎯", bg: "#E8EAF6", accent: "#5C6BC0" },
  "side-plank": { emoji: "📏", bg: "#FCE4EC", accent: "#E57399" },
  "farmer-carry": { emoji: "🧑‍🌾", bg: "#E8F5E9", accent: "#388E3C" },
  "glute-kickback": { emoji: "🦵", bg: "#FFF3E0", accent: "#FF7043" },
  "single-leg-stand": { emoji: "🦩", bg: "#FCE4EC", accent: "#E91E63" },
  "tandem-walk": { emoji: "🚶", bg: "#E0F7FA", accent: "#00ACC1" },
  "lateral-band-walk": { emoji: "🦀", bg: "#FFF9C4", accent: "#FDD835" },
  "single-leg-rdl-bodyweight": { emoji: "⚖️", bg: "#E3F2FD", accent: "#1976D2" },
  "calf-raise": { emoji: "🦶", bg: "#F1F8E9", accent: "#689F38" },
  "squat-to-press": { emoji: "⬆️", bg: "#E8EAF6", accent: "#3F51B5" },
  "cat-cow": { emoji: "🐱", bg: "#FFF9C4", accent: "#FFB300" },
  "world-greatest-stretch": { emoji: "🌍", bg: "#E8F5E9", accent: "#4CAF50" },
  "hip-circles": { emoji: "🔵", bg: "#E3F2FD", accent: "#2196F3" },
  "thoracic-rotation": { emoji: "🔄", bg: "#F3E5F5", accent: "#9C27B0" },
  "ankle-circles": { emoji: "🦶", bg: "#E0F2F1", accent: "#009688" },
  "shoulder-passthrough": { emoji: "🤸", bg: "#FFF3E0", accent: "#FF7043" },
};

const PATTERN_FALLBACK: Record<string, { emoji: string; bg: string; accent: string }> = {
  push: { emoji: "💪", bg: "#FCE4EC", accent: "#E57399" },
  pull: { emoji: "🏋️", bg: "#E8F5E9", accent: "#66BB6A" },
  squat: { emoji: "🦵", bg: "#FFF3E0", accent: "#FF7043" },
  hinge: { emoji: "🔄", bg: "#FBE9E7", accent: "#D84315" },
  core: { emoji: "🎯", bg: "#E8EAF6", accent: "#5C6BC0" },
  balance_functional: { emoji: "⚖️", bg: "#E0F7FA", accent: "#26C6DA" },
  mobility: { emoji: "🧘", bg: "#F3E5F5", accent: "#AB47BC" },
};

export function ExerciseIllustration({
  exerciseId,
  movementPattern,
  size = "md",
}: {
  exerciseId: string;
  movementPattern: string;
  size?: "sm" | "md";
}) {
  const visual = EXERCISE_VISUALS[exerciseId] || PATTERN_FALLBACK[movementPattern] || PATTERN_FALLBACK.core;

  const sizeClasses = {
    sm: "h-10 w-10 text-lg",
    md: "h-12 w-12 text-xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden`}
      style={{ backgroundColor: visual.bg }}
    >
      <div
        className="absolute inset-0 opacity-20 rounded-xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${visual.accent}, transparent 70%)`,
        }}
      />
      <span className="relative" role="img" aria-hidden="true">
        {visual.emoji}
      </span>
    </div>
  );
}
