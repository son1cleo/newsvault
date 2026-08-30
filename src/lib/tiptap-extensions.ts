import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

// Shared between the TipTap editor (client) and generateHTML (server) so
// stored JSON always renders the same way it was authored.
export const tiptapExtensions = [
  // StarterKit v3 bundles its own Link extension; disable it so our
  // explicitly-configured one below doesn't collide with it.
  StarterKit.configure({ link: false }),
  Link.configure({ openOnClick: false, autolink: true }),
  Image,
];
