import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="text-white rounded-none">
      <div className="flex flex-col w-full bg-red-100 max-md:max-w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
