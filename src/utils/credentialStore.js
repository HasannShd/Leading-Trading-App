export const storePasswordCredential = async ({ identifier, password, name }) => {
  if (
    typeof window === 'undefined' ||
    typeof navigator === 'undefined' ||
    typeof window.PasswordCredential === 'undefined' ||
    !navigator.credentials?.store ||
    !identifier ||
    !password
  ) {
    return false;
  }

  try {
    const credential = new window.PasswordCredential({
      id: String(identifier),
      password: String(password),
      name: name ? String(name) : undefined,
    });
    await navigator.credentials.store(credential);
    return true;
  } catch (error) {
    return false;
  }
};
