// this file is used to seed the database with some default users and data

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const load = async () => {
  try {
    // default user for creating models, etc
    await prisma.user.create({
      data: {
        name: "admin",
        admin: true,
      },
    });
    console.log("created admin user");

    await prisma.user.create({
      data: {
        name: "auto-interp",
        isUmapExplainer: true,
      },
    });
    console.log("created auto-interp user");

    await prisma.user.create({
      data: {
        name: "anon-search",
        isAnonSearcher: true,
      },
    });
    console.log("created anon-search user");

    await prisma.user.create({
      data: {
        name: "visible-activation",
        isPublicActivations: true,
      },
    });
    console.log("created visible-activation user");
  } catch (e) {
    console.error(e);
  }
};

load();
