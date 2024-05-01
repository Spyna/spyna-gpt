export function ConnectionState({
  isConnected,
}: Readonly<{ isConnected: boolean }>) {
  return <p>State: {"" + isConnected}</p>;
}
