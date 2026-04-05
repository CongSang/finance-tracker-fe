interface ColorButtonProps {
  color: string
  active?: boolean
  setColor: (color: string) => void
}

export const ColorButton = ({ color, active = false, setColor }: ColorButtonProps) => {
  return (
    <button 
      type="button"
      className={`w-7 h-7 rounded-full transition-all ${
        active ? 'ring-2 ring-offset-2 ring-primary scale-90' : 'hover:scale-90'
      }`}
      style={{ backgroundColor: color }}
      onClick={() => setColor(color)}
    />
  );
}