import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { registerUserSchema, type registerUserType } from "@/types/users";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerUserType>({
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit: SubmitHandler<registerUserType> = async ({
    name,
    email,
    password,
  }) => {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/login",
    });

    if (error) alert(error.message);
  };

  return (
    <Card className="w-full max-w-100 shadow-md py-8 px-4 mx-4 rounded-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                type="text"
                id="name"
                {...register("name")}
                placeholder="Full name"
              />
              {errors.name && (
                <FieldError errors={[{ message: errors.name.message }]} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Email"
              />
              {errors.email && (
                <FieldError errors={[{ message: errors.email.message }]} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                type="password"
                id="password"
                {...register("password")}
                placeholder="Password"
              />
              {errors.password && (
                <FieldError errors={[{ message: errors.password.message }]} />
              )}
              <FieldDescription>
                Must be at least 8 characters.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-4">
          <Button disabled={isSubmitting} className="w-full" type="submit">
            Register
          </Button>
          <span className="mt-4">
            Already have account?
            <Link to="/login" className="text-blue-700 ml-0.5">
              Login
            </Link>
          </span>
        </CardFooter>
      </form>
    </Card>
  );
}
