import { getT } from "@/lib/i18n-server";

export default async function TransparencyClient() {
  const t = await getT();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('transparencyTitle')}</h1>
      <p className="text-lg">{t('transparencyDesc')}</p>
      {/* Add more content as needed */}
    </div>
  );
}