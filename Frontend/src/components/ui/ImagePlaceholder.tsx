import { Image as ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  className?: string;
  iconClassName?: string;
}

/**
 * Bloc générique remplaçant une photo réelle : à utiliser en attendant
 * que chaque salon ajoute ses propres images (locaux, équipe, réalisations).
 */
const ImagePlaceholder = ({
  className = "",
  iconClassName = "",
}: ImagePlaceholderProps) => (
  <div
    className={`flex items-center justify-center bg-linear-to-br from-(--surface) via-(--border) to-(--surface) ${className}`}
  >
    <ImageIcon
      className={`h-10 w-10 text-(--muted) ${iconClassName}`}
      strokeWidth={1.25}
    />
  </div>
);

export default ImagePlaceholder;
