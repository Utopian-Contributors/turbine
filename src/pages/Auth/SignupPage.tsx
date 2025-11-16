import React from "react";

import { useNavigate } from "react-router";

import { useRegisterMutation } from "../../../generated/graphql";
import { Signup } from "../../components/Auth";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [register] = useRegisterMutation({
    onCompleted: (data) => {
      if (data.register?.accessToken) {
        localStorage.setItem("access_token", data.register.accessToken);
        navigate("/auth/verify");
      }
    },
    onError: (error) => console.error(error),
  });

  return (
    <Signup
      onSubmit={(data) => {
        register({ variables: { data } });
      }}
    />
  );
};
