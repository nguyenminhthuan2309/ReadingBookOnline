const InputField = ({ label, type = "text", className = "" }) => {
  return (
    <>
      <label className="mt-4 ml-32 max-md:ml-2.5">{label}</label>
      <input
        type={type}
        className={`flex shrink-0 self-center bg-white rounded-xl border border-black border-solid w-full px-4 ${className}`}
        style={{ height: "47px", marginBottom: "1.25rem" }}
      />
    </>
  );
};

export default InputField;
