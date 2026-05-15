const K = 1.0;
const a = 6378137;
const f = 1 / 298.257222101;
const oLon = 103.83333333333333; // rad: 1.812244193
const No = 38744.572;
const Eo = 28001.642;
const b = a * (1 - f);
const e2 = (2 * f) - (f * f);
const n = (a - b) / (a + b);
const n2 = n * n;
const n3 = n * n2;
const n4 = n * n3;
const G = a * (1 - n) * (1 - n2) * (1 + 9 * n2 / 4 + 225 * n4 / 64) * (Math.PI / 180);

const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const convertSvy21ToWgs84 = (y: number, x: number): { latitude: number, longitude: number } => {
  const N_prime = y - No;
  const E_prime = x - Eo;

  const m_prime = N_prime / K;
  
  const sigma = (m_prime / G) * (Math.PI / 180);

  const sigma_prime = sigma + 
    (3 * n / 2 - 27 * n3 / 32) * Math.sin(2 * sigma) + 
    (21 * n2 / 16 - 55 * n4 / 32) * Math.sin(4 * sigma) + 
    (151 * n3 / 96) * Math.sin(6 * sigma) + 
    (1097 * n4 / 512) * Math.sin(8 * sigma);

  const lat_prime_rad = sigma_prime;
  
  const sin_lat_prime = Math.sin(lat_prime_rad);
  const cos_lat_prime = Math.cos(lat_prime_rad);

  const t_prime = Math.tan(lat_prime_rad);
  const t_prime2 = t_prime * t_prime;
  const t_prime4 = t_prime2 * t_prime2;

  const nu_prime = a / Math.sqrt(1 - e2 * sin_lat_prime * sin_lat_prime);
  const rho_prime = nu_prime * (1 - e2) / (1 - e2 * sin_lat_prime * sin_lat_prime);
  const psi_prime = nu_prime / rho_prime;

  const term1 = t_prime / (2 * rho_prime * nu_prime * K * K);
  const term2 = t_prime / (24 * rho_prime * Math.pow(nu_prime, 3) * Math.pow(K, 4)) * (5 + 3 * t_prime2 + psi_prime * (1 - 2 * t_prime2));
  const term3 = t_prime / (720 * rho_prime * Math.pow(nu_prime, 5) * Math.pow(K, 6)) * (61 + 90 * t_prime2 + 45 * t_prime4);
  const lat_rad = lat_prime_rad - (E_prime * E_prime) * term1 + (Math.pow(E_prime, 4)) * term2 - (Math.pow(E_prime, 6)) * term3;
  
  const lon_term1 = E_prime / (nu_prime * K * cos_lat_prime);
  const lon_term2 = (Math.pow(E_prime, 3)) / (6 * Math.pow(nu_prime, 3) * K * cos_lat_prime) * (psi_prime + 2 * t_prime2);
  const lon_term3 = (Math.pow(E_prime, 5)) / (120 * Math.pow(nu_prime, 5) * K * cos_lat_prime) * (5 + 28 * t_prime2 + 24 * t_prime4);
  const lon_rad = deg2rad(oLon) + lon_term1 - lon_term2 + lon_term3;

  return {
      latitude: lat_rad * (180 / Math.PI),
      longitude: lon_rad * (180 / Math.PI)
  };
}

export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};