/** Build-time year, cached so pages stay fully static. */
export async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}
