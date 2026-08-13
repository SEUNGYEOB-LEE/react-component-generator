interface CharCounterProps {
  length: number;
}

export function CharCounter({ length }: CharCounterProps) {
  return <span className="char-counter">{length}자</span>;
}
