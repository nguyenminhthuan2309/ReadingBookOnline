const InputField = ({ label, type = "text", className = "" }) => {
  return (
    <div className="w-full">
      <label className="block mb-2">{label}</label>
      <input
        type={type}
        className={`flex shrink-0 w-full max-w-full bg-white rounded-xl border border-black border-solid h-[47px] ${className}`}
      />
    </div>
  );
};

export default InputField;
