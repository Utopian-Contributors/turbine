import React from "react";

import { useLocation } from "react-router";

import {
  useResetPasswordMutation,
  useSendResetLinkMutation,
} from "../../../generated/graphql";
import { ResetPassword, SendLink } from "../../components/Auth";

export const ForgotPasswordPage: React.FC = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const [resetPassword, resetPasswordResult] = useResetPasswordMutation();

  const [sendResetLink, sendResetLinkResult] = useSendResetLinkMutation();

  return token ? (
    <ResetPassword
      onSubmit={({ password }) => {
        resetPassword({ variables: { password, token } });
      }}
      message={
        resetPasswordResult.data?.resetPassword
          ? "Dein Passwort wurde erfolgreich zurückgesetzt."
          : undefined
      }
      error={
        resetPasswordResult.error
          ? "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut."
          : undefined
      }
    />
  ) : (
    <SendLink
      onSubmit={({ email }) => {
        sendResetLink({ variables: { email } });
      }}
      message={
        sendResetLinkResult.data?.sendResetLink
          ? "Wir haben einen Link zum Zurücksetzen deines Passworts an deine Email-Adresse gesendet."
          : undefined
      }
      error={
        sendResetLinkResult.error
          ? "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut."
          : undefined
      }
    />
  );
};
