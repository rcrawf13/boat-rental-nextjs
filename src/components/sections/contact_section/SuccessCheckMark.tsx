"use client";

type SuccessCheckMarkProps = {
  size?: number;
};

const SuccessCheckMark = ({ size = 112 }: SuccessCheckMarkProps) => {
  return (
    <div
      className="successCheckMark"
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" role="img" aria-label="Success">
        <circle className="successCheckMark__circle" cx="60" cy="60" r="54" />
        <path className="successCheckMark__path" d="M34 62l17 17 35-35" />
      </svg>
    </div>
  );
};

export default SuccessCheckMark;
