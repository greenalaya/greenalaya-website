const collaboratorPlaceholderPhoto = "/images/collaborators/placeholder.jpg";

export function collaboratorPhotoUrl(member: { photo_url: string | null }): string {
  return member.photo_url ?? collaboratorPlaceholderPhoto;
}

/** Logos the image optimizer may fetch (see `images` in next.config.ts); anything else is served as is. */
export function canOptimizeLogo(src: string) {
  return (
    src.startsWith("/images/") ||
    /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(src)
  );
}
