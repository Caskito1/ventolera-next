export function canAccess(user, module) {
  const permission = user?.permissions?.[module];
  return permission && permission !== "none";
}

export function canRead(user, module) {
  return ["read","write","admin"].includes(
    user?.permissions?.[module]
  );
}

export function canWrite(user, module) {
  return ["write","admin"].includes(
    user?.permissions?.[module]
  );
}

export function canAdmin(user, module) {
  return user?.permissions?.[module] === "admin";
}