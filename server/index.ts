import { PrismaClient } from "@prisma/client";
import { Expo } from "expo-server-sdk";
import cron from "node-cron";
import "dotenv/config";

let expo = new Expo();

const prisma = new PrismaClient();

import express, { NextFunction, Request, Response } from "express";
const app = express();

function authorize(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization === `Bearer ${process.env.SECRET}`) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.get("/schedule-item", authorize, async (req, res) => {
  console.log("SCHEDULE ITEM", req.query);

  const { id, userId } = req.query;

  const schedule = await prisma.scheduleItem.findFirst({
    where: {
      ethglobalId: Number(id),
      schedule: {
        user: {
          ethglobalId: Number(userId),
        },
      },
    },
  });

  res.json({
    isStarred: !!schedule,
  });
});

app.get("/schedules", authorize, async (req, res) => {
  console.log("SCHEDULES", req.query);

  const { id } = req.query;

  const schedules = await prisma.schedule.findMany({
    where: {
      user: {
        ethglobalId: Number(id),
      },
    },
    include: {
      ScheduleItem: true,
    },
  });

  res.json({
    schedules,
  });
});

app.get("/notifications", authorize, async (req, res) => {
  console.log("NOTIFICATIONS", req.query);

  const { id } = req.query;

  const notifications = await prisma.notification.findMany({
    where: {
      user: {
        ethglobalId: Number(id),
      },
    },
  });

  res.json({
    notifications,
  });
});

app.post("/notifications", authorize, async (req, res) => {
  console.log("NOTIFICATIONS", req.query);

  const { ids } = req.query;

  const notificationsIds = (ids as string).split(",").map(Number);

  const notifications = await prisma.notification.updateMany({
    where: {
      id: {
        in: notificationsIds,
      },
    },
    data: {
      readAt: new Date(),
    },
  });

  res.json({
    success: true,
  });
});

app.post("/toggle", authorize, async (req, res) => {
  console.log("TOGGLE", req.query);

  const { id, eventId, userId, startTime, name } = req.query;

  const user = await prisma.user.upsert({
    where: {
      ethglobalId: Number(userId),
    },
    update: {},
    create: {
      ethglobalId: Number(userId),
    },
  });

  const schedule = await prisma.schedule.upsert({
    where: {
      userId_ethglobalEventId: {
        userId: user.id,
        ethglobalEventId: Number(eventId),
      },
    },
    update: {},
    create: {
      userId: user.id,
      ethglobalEventId: Number(eventId),
    },
  });

  const scheduleItem = await prisma.scheduleItem.findFirst({
    where: {
      ethglobalId: Number(id),
    },
  });

  if (scheduleItem) {
    await prisma.scheduleItem.delete({
      where: {
        id: scheduleItem.id,
      },
    });
  } else {
    await prisma.scheduleItem.create({
      data: {
        ethglobalId: Number(id),
        scheduleId: schedule.id,
        startTime: new Date(startTime as string),
        name: name as string,
      },
    });
  }

  res.json({
    success: true,
  });
});

app.post("/register", authorize, async (req, res) => {
  console.log("REGISTER", req.query);

  const { id, token } = req.query;

  await prisma.user.upsert({
    where: {
      ethglobalId: Number(id),
    },
    update: {
      pushToken: token as string,
    },
    create: {
      ethglobalId: Number(id),
      pushToken: token as string,
    },
  });

  res.json({
    success: true,
  });
});

app.post("/unregister", authorize, async (req, res) => {
  console.log("UNREGISTER", req.query);

  const { id, token } = req.query;

  await prisma.user.update({
    where: {
      ethglobalId: Number(id),
      pushToken: token as string,
    },
    data: {
      pushToken: null,
    },
  });

  res.json({
    success: true,
  });
});

async function sendNotification({
  pushToken,
  title,
  body,
  userId,
}: {
  pushToken: string;
  title: string;
  body: string;
  userId: number;
}) {
  await expo.sendPushNotificationsAsync([
    {
      to: pushToken,
      sound: "default",
      title,
      body,
    },
  ]);

  await prisma.notification.create({
    data: {
      title,
      body,
      userId,
      sentAt: new Date(),
    },
  });
}

app.post("/notify", authorize, async (req, res) => {
  const { id, title, body } = req.query;

  const user = await prisma.user.findFirst({
    where: {
      ethglobalId: Number(id),
    },
  });

  if (!user || !user.pushToken) {
    res.json({
      success: false,
    });
    return;
  }

  await sendNotification({
    pushToken: user.pushToken,
    title: title as string,
    body: body as string,
    userId: user.id,
  });

  res.json({
    success: true,
  });
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
});

cron.schedule("* * * * *", async () => {
  // fetch all users with pushTokens
  const users = await prisma.user.findMany({
    where: {
      pushToken: {
        not: null,
      },
    },
  });

  // fetch all scheduleItems for these users that are starting between the next 16-14 minutes
  const scheduleItems = await prisma.scheduleItem.findMany({
    where: {
      schedule: {
        userId: {
          in: users.map((user) => user.id),
        },
      },
      startTime: {
        gte: new Date(Date.now() + 14 * 60 * 1000),
        lte: new Date(Date.now() + 16 * 60 * 1000),
      },
    },
    include: {
      schedule: {
        include: {
          user: true,
        },
      },
    },
  });

  const messages: {
    to: string;
    sound: "default";
    title: string;
    body: string;
  }[] = [];

  for (const scheduleItem of scheduleItems) {
    if (
      await prisma.notification.findFirst({
        where: {
          scheduleItemId: scheduleItem.id,
        },
      })
    ) {
      continue;
    }

    messages.push({
      to: scheduleItem.schedule.user.pushToken!,
      sound: "default",
      title: `${scheduleItem.name} is starting in 15 minutes!`,
      body: "Check the Globy app for more information.",
    });

    console.log("MESSAGES", messages);

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  }
});

cron.schedule("* * * * *", async () => {
  // fetch all users with pushTokens
  const users = await prisma.user.findMany({
    where: {
      pushToken: {
        not: null,
      },
    },
  });

  // fetch all scheduleItems for these users that are starting +- 1 minute
  const scheduleItems = await prisma.scheduleItem.findMany({
    where: {
      schedule: {
        userId: {
          in: users.map((user) => user.id),
        },
      },
      startTime: {
        gte: new Date(Date.now() + 1 * 60 * 1000),
        lte: new Date(Date.now() - 1 * 60 * 1000),
      },
    },
    include: {
      schedule: {
        include: {
          user: true,
        },
      },
    },
  });

  const messages: {
    to: string;
    sound: "default";
    title: string;
    body: string;
  }[] = [];

  for (const scheduleItem of scheduleItems) {
    if (
      await prisma.notification.findFirst({
        where: {
          scheduleItemId: scheduleItem.id,
          sentAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000),
          },
        },
      })
    ) {
      continue;
    }

    messages.push({
      to: scheduleItem.schedule.user.pushToken!,
      sound: "default",
      title: `${scheduleItem.name} is starting now!`,
      body: "Check the Globy app for more information.",
    });

    console.log("MESSAGES", messages);

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  }
});
