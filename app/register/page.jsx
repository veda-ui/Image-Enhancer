import Register from "../components/Register";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Create an Account</h1>
        <p className="text-lg text-gray-400">Sign up to get started</p>
      </div>

      <div className="bg-gray-900 shadow-md rounded-lg p-6 w-full max-w-sm">
        <p className="text-center text-lg mb-5">
          Don&rsquo;t have an account? <strong>Create one</strong>
        </p>
        <Register
          inputClassName="input input-bordered w-full bg-gray-800 text-white placeholder-gray-500"
        />
      </div>
    </div>
  );
}