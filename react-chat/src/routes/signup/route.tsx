"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { PasswordField } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert } from "@/components/common/alert";
import { WEBAPP_URL } from "@/lib/constants";
import { isPasswordValid } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePocket } from "@/providers/PocketbaseProvider";
import { toast } from "sonner";

export const signupSchema = z.object({
  // Username is marked optional here because it's requirement depends on if it's the Organization invite or a team invite which isn't easily done in zod
  // It's better handled beyond zod in `validateAndGetCorrectedUsernameAndEmail`
  username: z.string().optional(),
  email: z.string().email(),
  password: z.string().superRefine((data, ctx) => {
    const isStrict = false;
    const result = isPasswordValid(data, true, isStrict);
    Object.keys(result).map((key: string) => {
      if (!result[key as keyof typeof result]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: key,
        });
      }
    });
  }),
  token: z.string().optional(),
});

export const Route = createFileRoute("/signup")({
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const { pb } = usePocket();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const form = useForm<z.infer<typeof signupSchema>>({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
    },
  });

  const {
    register,
    watch,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = form;
  const loadingSubmitState = isSubmitting || isGoogleLoading;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const data = {
      username: values.username,
      email: values.email,
      emailVisibility: true,
      password: values.password,
      passwordConfirm: values.password,
      name: values.username,
    };
    try {
      const record = await pb.collection("users").create(data);
      toast.success("Account created successfully");
      navigate({ to: "/login" });
    } catch (e) {
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="flex justify-center">
      <div
        className={cn(
          "light bg-muted 2xl:bg-default flex min-h-screen w-full flex-col items-center justify-center [--cal-brand:#111827] dark:[--cal-brand:#FFFFFF]",
          "[--cal-brand-subtle:#9CA3AF]",
          "[--cal-brand-text:#FFFFFF] dark:[--cal-brand-text:#000000]",
          "[--cal-brand-emphasis:#101010] dark:[--cal-brand-emphasis:#e1e1e1] "
        )}
      >
        <div className="bg-muted 2xl:border-subtle grid w-full max-w-[1440px] grid-cols-1 grid-rows-1 overflow-hidden lg:grid-cols-2 2xl:rounded-[20px] 2xl:border 2xl:py-6">
          {/* Left side */}
          <div className="ml-auto mr-auto mt-0 flex w-full max-w-xl flex-col px-4 pt-6 sm:px-16 md:px-20 lg:mt-12 2xl:px-28">
            {/* Header */}

            <div className="flex flex-col gap-2">
              <h1 className="font-cal text-[28px] leading-none ">create_your_account</h1>

              <p className="text-subtle text-base font-medium leading-5">signup_description</p>
            </div>
            {/* Form Container */}
            <div className="mt-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Username */}
                  <Label htmlFor="username">Username</Label>
                  <Input {...register("username")} type="text" data-testid="signup-usernamefield" />
                  <Label htmlFor="email">Email</Label>
                  <Input {...register("email")} type="email" data-testid="signup-emailfield" />

                  <Label htmlFor="password">Password</Label>
                  <PasswordField data-testid="signup-passwordfield" {...register("password")} />
                  <Button
                    type="submit"
                    className="my-2 w-full justify-center"
                    loading={loadingSubmitState}
                    disabled={
                      !!form.formState.errors.username ||
                      !!form.formState.errors.email ||
                      !form.getValues("email") ||
                      !form.getValues("password") ||
                      isSubmitting
                    }
                  >
                    {"create_account"}
                  </Button>
                </form>
              </Form>
              {/* Continue with Social Logins - Only for non-invite links */}

              {/* Social Logins - Only for non-invite links*/}

              {/* <div className="mt-6 flex flex-col gap-2 md:flex-row">
              {IS_GOOGLE_LOGIN_ENABLED ? (
                <Button
                  color="secondary"
                  disabled={!!form.formState.errors.username}
                  loading={isGoogleLoading}
                  className={cn("w-full justify-center rounded-md text-center", form.formState.errors.username ? "opacity-50" : "")}
                  onClick={async () => {
                    setIsGoogleLoading(true);
                    const username = form.getValues("username");
                    const baseUrl = process.env.NEXT_PUBLIC_WEBAPP_URL;
                    const GOOGLE_AUTH_URL = `${baseUrl}/auth/sso/google`;
                    if (username) {
                      // If username is present we save it in query params to check for premium
                      const searchQueryParams = new URLSearchParams();
                      searchQueryParams.set("username", username);
                      localStorage.setItem("username", username);
                      navigate({to: `${GOOGLE_AUTH_URL}?${searchQueryParams.toString()}`});
                      return;
                    }
                    navigate({to: GOOGLE_AUTH_URL});
                  }}
                >
                  <img className={cn("text-subtle  mr-2 h-4 w-4 dark:invert")} src="/google-icon.svg" alt="" />
                  Google
                </Button>
              ) : null}
            </div> */}
            </div>
            {/* Already have an account & T&C */}
            <div className="mt-10 flex h-full flex-col justify-end text-xs">
              <div className="flex flex-col text-sm">
                <div className="flex gap-1">
                  <p className="text-subtle">{"already_have_account"}</p>
                  <Link to="/login" className="text-emphasis hover:underline">
                    {"sign_in"}
                  </Link>
                </div>
                <div className="text-subtle ">
                  By proceeding, you agree to our{" "}
                  <Link className="text-emphasis hover:underline" href={`${WEBAPP_URL}/terms`} target="_blank">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link className="text-emphasis hover:underline" href={`${WEBAPP_URL}/privacy`} target="_blank">
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
