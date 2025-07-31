import PromtSuggestionButton from "./PromtSuggestionButton";

const PromtSuggestionRow = ({ onPromtClick }) => {
  const promts = [
    "Who is Aston Martin's Academy team",
    "Who is the highets paid F1 Driver",
  ];
  return (
    <div>
      {promts.map((promt, index) => (
        <PromtSuggestionButton
          text={promt}
          key={`suggestions-${index}`}
          onClick={() => onPromtClick(promt)}
        />
      ))}
    </div>
  );
};
export default PromtSuggestionRow;
