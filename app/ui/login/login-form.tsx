"use client";

import { loginAction } from "@/actions/auth";
import { useActionState } from "react";
import ValidationError from "../validation/validation-error";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(loginAction, false);

  return (
    <form action={action} className="_social_login_form">
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b14">
            <label htmlFor="email" className="_social_login_label _mar_b8">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control _social_login_input"
            />
          </div>
          <ValidationError message={state?.errors?.email} />
        </div>

        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b14">
            <label htmlFor="password" className="_social_login_label _mar_b8">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control _social_login_input"
            />
          </div>
          <ValidationError message={state?.errors?.password} />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
          <div className="form-check _social_login_form_check">
            <input
              className="form-check-input _social_login_form_check_input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              defaultChecked
            />
            <label
              className="form-check-label _social_login_form_check_label"
              htmlFor="flexRadioDefault2"
            >
              Remember me
            </label>
          </div>
        </div>

        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
          <div className="_social_login_form_left">
            <p className="_social_login_form_left_para">Forgot password?</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
          <div className="_social_login_form_btn _mar_t40 _mar_b60">
            <button
              disabled={pending}
              type="submit"
              className="_social_login_form_btn_link _btn1"
            >
              Login now
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
