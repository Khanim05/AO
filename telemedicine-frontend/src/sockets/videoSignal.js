import * as signalR from "@microsoft/signalr";

export const createVideoSignalConnection = (token) => {
  return new signalR.HubConnectionBuilder()
    .withUrl("https://khamiyevbabek-001-site1.ktempurl.com/webrtchub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
};
