export default function slug(name: string): string {
  const lowercasedName = name.toLowerCase().trim();
  const words = lowercasedName.split(/\s+/);
  const slug = words.join('-');
  return slug;
}
