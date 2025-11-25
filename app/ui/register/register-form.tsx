"use client";

import { registerAction } from "@/actions/auth";
import { useActionState } from "react";
import ValidationError from "@/app/ui/validation/validation-error";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, false);

  return (
    <form action={action} className="_social_registration_form">
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label
              htmlFor="first_name"
              className="_social_registration_label _mar_b8"
            >
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="string"
              className="form-control _social_registration_input"
            />
          </div>
          <ValidationError message={state?.errors?.firstName} />
        </div>

        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label
              htmlFor="last_name"
              className="_social_registration_label _mar_b8"
            >
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="string"
              className="form-control _social_registration_input"
            />
          </div>
          <ValidationError message={state?.errors?.lastName} />
        </div>

        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label
              htmlFor="email"
              className="_social_registration_label _mar_b8"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control _social_registration_input"
            />
          </div>
          <ValidationError message={state?.errors?.email} />
        </div>

        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label
              htmlFor="password"
              className="_social_registration_label _mar_b8"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control _social_registration_input"
            />
          </div>
          <ValidationError message={state?.errors?.password} />
        </div>
        {/* end form row*/}
      </div>

      <div className="row">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="form-check _social_registration_form_check">
            <input
              className="form-check-input _social_registration_form_check_input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              defaultChecked
            />
            <label
              className="form-check-label _social_registration_form_check_label"
              htmlFor="flexRadioDefault2"
            >
              I agree to terms & conditions
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
          <div className="_social_registration_form_btn _mar_t40 _mar_b60">
            <button
              disabled={pending}
              type="submit"
              className="_social_registration_form_btn_link _btn1"
            >
              Register now
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
