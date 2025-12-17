// src/app/auth/signin/page.tsx
import SignInForm from "./SignInForm"; // separate client form

export const metadata = {
  title: "AquaFlow - Sign In",
  description: "Securely sign in to AquaFlow and take control of your water delivery operations.",
};

export default function SignInPage() {
  return <SignInForm />;
}
