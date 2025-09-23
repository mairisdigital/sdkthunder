import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SDKThunder - Admin Login",
  description: "Pierakstīšanās admin panelī",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}