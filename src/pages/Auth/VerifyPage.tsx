import React, { useMemo } from "react";

import { useNavigate } from "react-router";

import {
  useLoggedInQuery,
  useResendCodeMutation,
  useVerifyMutation,
} from "../../../generated/graphql";
import { Verify } from "../../components/Auth";

export const VerifyPage: React.FC = () => {
  const navigate = useNavigate();

  const loggedInQueryResult = useLoggedInQuery();

  const [verify, verificationResult] = useVerifyMutation({
    onCompleted: (data) => {
      loggedInQueryResult.client.cache.evict({ fieldName: "loggedIn" });
      if (data.verify?.verified) {
        // Redirect to the previous page or the home page
        const prev = localStorage.getItem("redirect");
        if (prev) {
          localStorage.removeItem("redirect");
          navigate(prev);
        } else {
          navigate("/");
        }
      }
    },
    onError: (error) => console.error(error),
  });

  const [resendCode, resendMutationResult] = useResendCodeMutation({
    onCompleted: () => {
      console.debug("Code was sent again.");
    },
  });

  const resendResultMessage = useMemo(() => {
    if (resendMutationResult.data?.resendVerificationCode) {
      return "Code was sent again.";
    }
  }, [resendMutationResult.data?.resendVerificationCode]);

  const resendResultError = useMemo(() => {
    if (resendMutationResult.error) {
      return "Code was already requested.";
    }
  }, [resendMutationResult.error]);

  return (
    <Verify
      onResendCode={() => {
        const { data } = loggedInQueryResult;
        if (data?.loggedIn?.email) {
          resendCode();
        }
      }}
      onSubmit={({ verificationCode }) => {
        verify({
          variables: {
            code: verificationCode,
          },
        });
      }}
      message={resendResultMessage}
      error={verificationResult.error ? "Invalid Code" : resendResultError}
    />
  );
};
