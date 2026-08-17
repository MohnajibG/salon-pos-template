import Client from "../models/Client";

/**
 * Créer un client
 */
export const createClient = async (
  data: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    gender?: "female" | "male";
    birthDate?: Date;
    notes?: string;
  },
  adminId: string,
) => {
  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();

  const phone = data.phone?.trim() || "";
  const email = data.email?.trim().toLowerCase() || "";

  if (!phone && !email) {
    throw new Error("A phone number or an email address is required.");
  }

  if (phone) {
    const existingPhone = await Client.findOne({
      phone,
      isDeleted: false,
    });

    if (existingPhone) {
      throw new Error("Phone number already exists.");
    }
  }

  if (email) {
    const existingEmail = await Client.findOne({
      email,
      isDeleted: false,
    });

    if (existingEmail) {
      throw new Error("Email already exists.");
    }
  }

  const client = await Client.create({
    firstName,
    lastName,
    phone,
    email,
    gender: data.gender,
    birthDate: data.birthDate,
    notes: data.notes ?? "",
    createdBy: adminId,
  });

  return client;
};

/**
 * Liste des clients
 */
export const getClients = async (filters: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}) => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  const query: any = {
    isDeleted: false,
  };

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  if (filters.search) {
    query.$or = [
      {
        firstName: {
          $regex: filters.search,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: filters.search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: filters.search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: filters.search,
          $options: "i",
        },
      },
    ];
  }

  const total = await Client.countDocuments(query);

  const clients = await Client.find(query)
    .sort({
      createdAt: -1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-__v");

  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    clients,
  };
};

/**
 * Un client
 */
export const getClientById = async (id: string) => {
  const client = await Client.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!client) {
    throw new Error("Client not found.");
  }

  return client;
};

/**
 * Modifier
 */
export const updateClient = async (
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    gender?: "female" | "male";
    birthDate?: Date;
    notes?: string;
  },
  adminId: string,
) => {
  const client = await Client.findById(id);

  if (!client || client.isDeleted) {
    throw new Error("Client not found.");
  }

  if (data.phone && data.phone !== client.phone) {
    const exists = await Client.findOne({
      _id: { $ne: id },
      phone: data.phone,
      isDeleted: false,
    });

    if (exists) {
      throw new Error("Phone number already exists.");
    }

    client.phone = data.phone;
  }

  if (data.email && data.email !== client.email) {
    const exists = await Client.findOne({
      _id: { $ne: id },
      email: data.email.toLowerCase(),
      isDeleted: false,
    });

    if (exists) {
      throw new Error("Email already exists.");
    }

    client.email = data.email.toLowerCase();
  }

  if (data.firstName !== undefined) client.firstName = data.firstName;
  if (data.lastName !== undefined) client.lastName = data.lastName;
  if (data.gender !== undefined) client.gender = data.gender;
  if (data.birthDate !== undefined) client.birthDate = data.birthDate;
  if (data.notes !== undefined) client.notes = data.notes;

  client.updatedBy = adminId as any;

  await client.save();

  return client;
};

/**
 * Activer / Désactiver
 */
export const updateClientStatus = async (
  id: string,
  isActive: boolean,
  adminId: string,
) => {
  const client = await Client.findById(id);

  if (!client || client.isDeleted) {
    throw new Error("Client not found.");
  }

  client.isActive = isActive;
  client.updatedBy = adminId as any;

  await client.save();

  return client;
};

/**
 * Suppression logique
 */
export const deleteClient = async (id: string, adminId: string) => {
  const client = await Client.findById(id);

  if (!client || client.isDeleted) {
    throw new Error("Client not found.");
  }

  client.isDeleted = true;
  client.isActive = false;
  client.deletedAt = new Date();
  client.deletedBy = adminId as any;

  await client.save();

  return client;
};
