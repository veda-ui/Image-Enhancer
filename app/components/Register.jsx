"use client";
import { useActionState } from "react";
import { register } from "/pbll/actions/Usercontrolls";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Register() {
  const router = useRouter();
  const [formss, formstatus] = useActionState(register, {});

  
  useEffect(() => {
    if (formss.success) {
      router.push("/upscale");
    }
  }, [formss.success, router]);

  return (
    <>
      <form action={formstatus} className="max-w-xs mx-auto">
        <div className="mb-3">
          <input autoComplete="off" name="username" type="text" placeholder="Username" className="input" />
        </div>
        {formss.errors?.username && (
          <div role="alert" className="alert alert-error">
            <span>{formss.errors.username}</span>
          </div>
        )}

        <div className="mb-3">
          <input autoComplete="off" name="password" type="password" placeholder="Password" className="input" />
        </div>
        {formss.errors?.password && (
          <div role="alert" className="alert alert-error">
            <span>{formss.errors.password}</span>
          </div>
        )}

        <button className="btn btn-neutral">Submit</button>
      </form>
    </>
  );
}
