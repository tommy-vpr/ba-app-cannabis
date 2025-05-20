import ContactZipClient from "@/components/ContactZipClient";

type Props = {
  params: { zipcode: string };
};

export default function ZipCodePage({ params }: Props) {
  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto py-12">
      <h1 className="dark:text-gray-200 text-2xl font-semibold mb-4">
        Contacts in ZIP: {params.zipcode}
      </h1>
      <ContactZipClient zip={params.zipcode} />
    </div>
  );
}
