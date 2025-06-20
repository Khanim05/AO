import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://khamiyevbabek-001-site1.ktempurl.com/chathub", {
    accessTokenFactory: () => localStorage.getItem("token")
  })
  .withAutomaticReconnect()
  .build();

export default connection;
