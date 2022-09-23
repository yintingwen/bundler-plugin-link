export const isPackage = (packageId) => {
  return packageId && /^[a-z\-0-9_]+$/i.test(packageId)
}
