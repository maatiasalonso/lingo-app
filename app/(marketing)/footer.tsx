"use client";
import { Button } from "@/components/ui/button";
import ReactCountryFlag from "react-country-flag";

export const Footer = () => {
  const languages = [
    {
      code: "US",
      name: "English",
    },
    {
      code: "ES",
      name: "Spanish",
    },
    {
      code: "FR",
      name: "French",
    },
    {
      code: "IT",
      name: "Italian",
    },
    {
      code: "JP",
      name: "Japanese",
    },
  ];

  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-zinc-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        <CountryFlags languages={languages} />
      </div>
    </footer>
  );
};

type CountryFlagsProps = {
  languages: {
    code: string;
    name: string;
  }[];
};

const CountryFlags = ({ languages }: CountryFlagsProps) => {
  return languages.map((language) => (
    <Button
      size={"lg"}
      variant={"ghost"}
      className="w-full uppercase font-bold text-zinc-500"
      key={language.code}
    >
      <ReactCountryFlag
        svg
        countryCode={language.code}
        style={{
          width: "2em",
          height: "2em",
          borderRadius: "33%",
          marginRight: "0.7rem",
        }}
      />
      {language.name}
    </Button>
  ));
};
