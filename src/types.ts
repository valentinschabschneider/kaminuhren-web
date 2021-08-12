export type Clock = {
  id: number;
  type: string;
  description: string | undefined;
  qrCodeUrl: string | undefined;
  thumbnailUrl: string | undefined;
  imageUrls: string[];
};
