import ContactZipClient from "@/components/ContactZipClient";

interface PageProps {
  params: { zipcode: string };
}

export default async function ZipCodePage({
  params,
}: {
  params: Promise<{ zipcode: string }>;
}) {
  const { zipcode } = await params;
  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto py-12">
      <h1 className="dark:text-gray-200 text-2xl font-semibold mb-4">
        Contacts in ZIP: {zipcode}
      </h1>
      <ContactZipClient zip={zipcode} />
    </div>
  );
}
