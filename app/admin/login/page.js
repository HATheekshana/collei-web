import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-sm mx-auto mt-16">
          <h1 className="font-display text-3xl text-parchment mb-1 text-center">
            Keeper Login
          </h1>
          <p className="text-parchment/50 text-sm text-center">
            Loading...
          </p>
        </div>
      }
    >
      <AdminLoginClient />
    </Suspense>
  );
}