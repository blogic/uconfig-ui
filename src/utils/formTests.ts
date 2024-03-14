const ipv4CidrRegexp =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/;
export const isValidIpv4Cidr = (value?: string) => {
  if (!value) return false;

  return ipv4CidrRegexp.test(value);
};

const ipv4Regexp =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

export const isValidIpv4 = (value?: string) => {
  if (!value) return false;

  return ipv4Regexp.test(value);
};

const alphanumericRegexp = /^[a-zA-Z0-9]+$/;

export const isValidAlphanumeric = (value?: string) => {
  if (!value) return false;

  return alphanumericRegexp.test(value);
};
