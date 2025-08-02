"use client";

import FormSwitcher from "@/app/components/FormSwitcher";
import React, { useState } from "react";

export default function Page() {
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center text-white
       flex-col"
    >
      <FormSwitcher />
    </div>
  );
}
