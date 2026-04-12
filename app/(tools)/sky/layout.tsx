// Override root layout for /sky — remove the padded <main> wrapper
// by wrapping in a fragment that bypasses it. The SkyScene renders
// position:fixed so it still fills the viewport correctly.
export default function SkyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
