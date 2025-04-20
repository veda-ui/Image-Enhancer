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
    <>

      <form action={formstatus} className="absolute max-w-xs top-60 left-5/12 ">
      <div className="text-2xl mb-7"><strong>Login</strong> to your account</div>
        <div className="mb-3 ">
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
