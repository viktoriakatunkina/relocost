"use client";

import { Link } from "@/i18n/navigation";
import { PackageComparisonTable } from "./PackageComparisonTable";

// Обёртка нужна только для того, чтобы передать renderAction (функцию) в
// PackageComparisonTable — тот клиентский, а /tariffs/page.tsx серверный:
// функции нельзя прокидывать через границу Server → Client Component
// напрямую, поэтому вся интерактивная часть собрана здесь, внутри "use client".
export function TariffsCityTable() {
  return (
    <PackageComparisonTable
      renderAction={() => (
        <Link
          href="/search"
          className="inline-flex w-full items-center justify-center px-3 py-2 rounded-pill border border-copper/40 text-copper font-medium text-xs hover:bg-copper/10 transition"
        >
          Выбрать город
        </Link>
      )}
    />
  );
}
