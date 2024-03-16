import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import z from "zod";
import { useNavigate } from "@tanstack/react-router";
import AuthContainer from "@/components/auth-container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ErrorCode } from "@/lib/errorcode";
import { Alert } from "@/components/ui/alert";
import { EmailField, PasswordField } from "@/components/form/form-input";
import { pb } from "@/lib/pocketbase";

// const routeApi = getRouteApi("/login");

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

interface LoginValues {
  email: string;
  password: string;
  csrfToken: string;
}
const LoginFooter = (
  <Link to={`/signup`} className="text-brand-500 font-medium">
    {"dont_have_an_account"}
  </Link>
);

export default function Login() {
  // const routeSearch = routeApi.useSearch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // const callbackUrl = routeSearch.callbackUrl || "/";
  const formSchema = z
    .object({
      email: z.string().min(1, `${"error_required_field"}`).email(`${"enter_valid_email"}`),
      password: z.string().min(1, `${"error_required_field"}`),
    })
    .passthrough();
  const methods = useForm<LoginValues>({ resolver: zodResolver(formSchema) });
  const { register, formState } = methods;

  const errorMessages: { [key: string]: string } = {
    // [ErrorCode.SecondFactorRequired]: t("2fa_enabled_instructions"),
    // Don't leak information about whether an email is registered or not
    [ErrorCode.IncorrectEmailPassword]: "incorrect_email_password",
    [ErrorCode.IncorrectTwoFactorCode]: `${"incorrect_2fa_code"} ${"please_try_again"}`,
    [ErrorCode.InternalServerError]: `${"something_went_wrong"} ${"please_try_again_and_contact_us"}`,
    [ErrorCode.ThirdPartyIdentityProviderEnabled]: "account_created_with_identity_provider",
  };

  const onSubmit = async (values: LoginValues) => {
    setErrorMessage(null);
    try {
      // telemetry.event(telemetryEventTypes.login, collectPageParameters());
      await pb.collection("users").authWithPassword(values.email, values.password);

      // not verified
      navigate({ to: "/main" });

      // we're logged in! let's do a hard refresh to the desired url
    } catch (e: any) {
      setErrorMessage(errorMessages[ErrorCode.IncorrectEmailPassword]);
    }

    // fallback if error not found
  };

  return (
    <div className="dark:bg-brand dark:text-brand-contrast text-emphasis min-h-screen [--cal-brand-emphasis:#101010] [--cal-brand-subtle:#9CA3AF] [--cal-brand-text:white] [--cal-brand:#111827] dark:[--cal-brand-emphasis:#e1e1e1] dark:[--cal-brand-text:black] dark:[--cal-brand:white]">
      <AuthContainer title="login" description="login" showLogo heading={"welcome_back"} footerText={LoginFooter}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} data-testid="login-form">
            <div>
              <input defaultValue={undefined} type="hidden" hidden {...register("csrfToken")} />
            </div>
            <div className="space-y-6">
              <div className={cn("space-y-6")}>
                <div className="gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <EmailField id="email" placeholder="eric.li@example.com" required {...register("email")} />
                </div>
                <div className="relative">
                  <div className="gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <PasswordField id="password" autoComplete="off" required className="mb-0" {...register("password")} />
                  </div>
                  <div className="absolute -top-[2px] right-2">
                    <Link href="/auth/forgot-password" tabIndex={-1} className="text-default text-sm font-medium">
                      {"forgot"}
                    </Link>
                  </div>
                </div>
              </div>

              {errorMessage && <Alert severity="error" title={errorMessage} />}
              <Button type="submit" color="primary" disabled={formState.isSubmitting} className="w-full justify-center">
                Sign In
              </Button>
            </div>
          </form>
        </FormProvider>
      </AuthContainer>
    </div>
  );
}
