'use client'

interface MoodOption {
  emoji: string;
  label: string;
  value: string;
}

export const moods = [
  { value: 'happy', emoji: '😊' },
  { value: 'relaxed', emoji: '😌' },
  { value: 'neutral', emoji: '😐' },
  { value: 'sad', emoji: '😔' },
  { value: 'worried', emoji: '😟' },
] as const;

interface MoodSelectorProps {
  selected: string | null;
  onSelect: (mood: string) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex gap-2 mb-3">
      {moods.map(mood => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onSelect(mood.value)}
          className={`text-2xl p-2 rounded-full hover:bg-[--bg-task] transition-colors
            ${selected === mood.value ? 'bg-[--bg-task]' : ''}`}
          title={mood.value}
        >
          {mood.emoji}
        </button>
      ))}
    </div>
  )
} 