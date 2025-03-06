"use client";
import RegistrationForm from "./SignUpForm";

const RegisterPage = () => {
  return (
    <div className="text-white rounded-none">
      <div class="flex flex-col w-full" style={{ backgroundColor: "#F6E8DF" }}>
        <div
          className="flex flex-col self-center text-base text-black bg-white rounded-xl"
          style={{
            minWidth: "1052px",
            paddingTop: "2.5rem",
            paddingBottom: "1.75rem",
            paddingLeft: "1.25rem",
            paddingRight: "3.125rem",
            marginTop: "3.5rem",
            marginBottom: "3.5rem",
            fontSize: "1rem",
            backgroundColor: "#FFFFFF",
            borderRadius: "0.625rem",
          }}
        >
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
