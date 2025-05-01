"use client";
import { useActionState } from "react";
import { login } from "../../actions/Usercontrolls";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const [formss, formstatus] = useActionState(login, {});

  useEffect(() => {
    if (formss.success) {
      router.push("/upscale");
    }
  }, [formss.success, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
        <p className="text-lg text-gray-400">Login to access your account</p>
      </div>

      <form action={formstatus} className="bg-gray-900 shadow-md rounded-lg p-6 w-full max-w-sm">
        <div className="text-2xl mb-7 text-center font-semibold">Login</div>
        <div className="mb-4">
          <input
            autoComplete="off"
            name="username"
            type="text"
            placeholder="Username"
            className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-500"
          />
        </div>
        {formss.errors?.username && (
          <div role="alert" className="alert alert-error text-red-500 text-sm">
            <span>{formss.errors.username}</span>
          </div>
        )}

        <div className="mb-4">
          <input
            autoComplete="off"
            name="password"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-500"
          />
        </div>
        {formss.errors?.password && (
          <div role="alert" className="alert alert-error text-red-500 text-sm">
            <span>{formss.errors.password}</span>
          </div>
        )}

        <button className="btn btn-primary w-full bg-white text-black mt-4">Submit</button>
      </form>
    </div>
  );
}
