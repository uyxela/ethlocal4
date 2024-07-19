import { client } from "@/app/_layout";
import { gql } from "@apollo/client";
import moment from "moment";

export const eventAttributes = (event: any) => {
  const isPhysical = event.type === "physical" || event.medium === "physical";
  const isVirtual = event.type === "virtual" || event.medium === "virtual";
  const isPragma = event.name.toLowerCase().includes("pragma");
  const isCafe = event.type === "cafe";
  const isSummit = event.type === "summit";
  const isMeetup = event.type === "meetup";
  const isHackathon =
    !(isPragma || isCafe || isSummit || isMeetup) || event.type === "hackathon";

  return {
    isPhysical,
    isVirtual,
    isPragma,
    isCafe,
    isSummit,
    isMeetup,
    isHackathon,
  };
};

export function getEventTypeString(event: any): string {
  if (event.type === "cafe") {
    return "Co-working";
  }
  if (event.type === "meetup") {
    return "Meetup";
  }
  if (event.type === "summit") {
    return event.medium === "physical" ? "In-person" : "Summit";
  }
  if (event.type === "hackathon") {
    return event.medium === "physical" ? "Hackathon" : "Virtual";
  }
  if (event.type === "physical") {
    return "In-person";
  }
  if (event.type.startsWith("virtual")) {
    return "Async";
  }
  return event.type;
}

export const getEventColour = (eventAttr: {
  isPhysical: boolean;
  isVirtual: boolean;
  isPragma: boolean;
  isCafe: boolean;
  isSummit: boolean;
  isMeetup: boolean;
  isHackathon: boolean;
}) => {
  if (eventAttr.isSummit) {
    return "#f9a8d4";
  } else if (eventAttr.isCafe) {
    return "#fde047";
  } else if (eventAttr.isMeetup) {
    return "#93c5fd";
  } else if (eventAttr.isHackathon && eventAttr.isVirtual) {
    return "#d8b4fe";
  }
  return "#86efac";
};

export const getCdnUrl = (
  category: string, // users, judges, etc.
  uuid: string,
  size?: string
) => {
  return `https://ethglobal.b-cdn.net/${category}/${uuid}/${
    size || "default"
  }.jpg`;
};

export const getLoginToken = async () => {
  const {
    data: {
      getLoginWithJwtSelf: { emailToken },
    },
  } = await client.query({
    query: gql`
      query {
        getLoginWithJwtSelf {
          emailToken
        }
      }
    `,
  });

  return emailToken;
};

// thank you chatgpt
export function getReadableTimeDifference(
  start: moment.Moment,
  end: moment.Moment
): string {
  const duration = moment.duration(end.diff(start));

  const years = duration.years();
  const months = duration.months();
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let readableDifference = "";

  if (years > 0) {
    return `${years}y`;
  } else if (months > 0) {
    return `${months}M`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    // Include seconds if no other unit is included
    return `${seconds}s`;
  }
}
