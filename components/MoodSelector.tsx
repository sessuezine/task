interface MoodOption {
  emoji: string;
  label: string;
  value: string;
}

export const moods = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😌", label: "Content", value: "content" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😕", label: "Ambivalent", value: "ambivalent" },
  { emoji: "😢", label: "Sad", value: "sad" },
] as const;

interface MoodSelectorProps {
  selected: string | null;
  onSelect: (mood: string) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex gap-2 mb-3">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onSelect(mood.value)}
          className={`p-2 rounded-lg hover:bg-[--bg-task] transition-colors ${
            selected === mood.value ? 'bg-[--bg-task]' : ''
          }`}
          title={mood.label}
        >
          <span className="text-2xl">{mood.emoji}</span>
        </button>
      ))}
    </div>
  )
} 