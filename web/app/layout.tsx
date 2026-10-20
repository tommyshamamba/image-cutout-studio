export const metadata = {
  title: "Image Cutout Studio",
  description: "Upload an image and download a transparent PNG.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
