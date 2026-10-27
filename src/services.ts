export type Service = {
  id: string;
  title: string;
  description: string;
  serviceKey: string;
  iconFile: string;
};

export const SERVICES: Service[] = [
  {
    id: "bill-payment",
    title: "Bill Payment",
    description: "Pay electricity, water, telecom and other bills.",
    serviceKey: "bill_payment",
    iconFile: "icons/bill-payment.png",
  },
  {
    id: "transfer",
    title: "Transfer",
    description: "Transfer funds between CBE accounts and to other banks.",
    serviceKey: "transfer",
    iconFile: "icons/transfer.png",
  },
  {
    id: "utilities",
    title: "Utilities",
    description: "Utility services and micro-finance payments.",
    serviceKey: "utilities",
    iconFile: "icons/utilities.png",
  },
  {
    id: "wallet",
    title: "Digital Wallet",
    description: "Manage your digital CBE wallet and cards.",
    serviceKey: "wallet",
    iconFile: "icons/wallet.png",
  },
  {
    id: "test",
    title: " test",
    description: "Manage your digital CBE wallet and cards.",
    serviceKey: "wallet",
    iconFile: "icons/wallet.png",
  },
];

export function getService(id: string | undefined): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
