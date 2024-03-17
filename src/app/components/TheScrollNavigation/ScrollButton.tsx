export const ScrollButton = ({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className: string;
}) => {
  return (
    <button
      className={`
        bg-white rounded-full mx-auto transition-all duration-300 ease-in-out 
        h-2 w-2 sm:h-3 sm:w-3
        hover:h-3 hover:w-3
        ${className}
        `}
      onClick={onClick}
    ></button>
  );
};
