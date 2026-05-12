export type VehicleType = "car" | "motorcycle" | "van";
export type SpotStatus = "available" | "occupied" | "reserved";
export type PaymentMethod = "cash" | "pix" | "card" | "courtesy";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  createdAt: string;
};

export type ParkingSpot = {
  id: string;
  number: number;
  status: SpotStatus;
  vehiclePlate?: string;
  vehicleType?: VehicleType;
  entryAt?: string;
};

export type Vehicle = {
  id: string;
  plate: string;
  model: string;
  color: string;
  type: VehicleType;
  driverName?: string;
  driverPhone?: string;
  spotId: string;
  entryAt: string;
};

export type VehicleHistory = {
  id: string;
  plate: string;
  model: string;
  spotNumber: number;
  entryAt: string;
  exitAt: string;
  totalMinutes: number;
  paidCents: number;
  paymentMethod?: PaymentMethod;
};

export type Payment = {
  id: string;
  plate: string;
  amountCents: number;
  method: PaymentMethod;
  paidAt: string;
  historyId?: string;
};

export type Settings = {
  parkingName: string;
  address: string;
  phone: string;
  openingHours: string;
  totalSpots: number;
  firstHourCents: number;
  additionalHourCents: number;
};
