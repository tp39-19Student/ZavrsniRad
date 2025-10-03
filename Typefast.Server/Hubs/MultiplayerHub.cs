

using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Typefast.Server.Data.DTOs;
using Typefast.Server.Middleware;
using Typefast.Server.Models;
using Typefast.Server.Services;

namespace Typefast.Server.Hubs
{
    public class MultiplayerHub : Hub
    {
        private readonly MultiplayerService _multiplayerService;

        public MultiplayerHub(MultiplayerService multiplayerService)
        {
            _multiplayerService = multiplayerService;
        }

        public override async Task OnConnectedAsync()
        {
            //Console.WriteLine("Connected: " + Context.User!.FindFirst("Id"));
            var user = GetUser();

            var room = await _multiplayerService.Connect(user);
            if (room == null)
            {
                await Clients.Caller.SendAsync("JoinFailure");
                return;
            }
            await Clients.Caller.SendAsync("ReceiveRoom", new MPRoom { ChosenText = room.ChosenText, Users = room.Users, StartTime = room.StartTime });

            await Clients.Group(room.Id).SendAsync("Join", user);

            await Groups.AddToGroupAsync(Context.ConnectionId, room.Id);

            _multiplayerService.PrintRooms();
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            //Console.WriteLine("Disconnected: " + Context.User!.FindFirst("Id"));
            var user = GetUser();

            string roomId = _multiplayerService.Disconnect(user);
            if (roomId.Length > 0)
                await Clients.Group(roomId).SendAsync("Leave", user);

            _multiplayerService.PrintRooms();
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendProgress(MPPacket packet)
        {
            string roomId = _multiplayerService.GetRoomId(packet.IdPer);
            //Console.WriteLine(packet.Time);
            if (roomId.Length > 0) await Clients.Group(roomId).SendAsync("ReceiveProgress", packet);
        }

        private MPUser GetUser()
        {
            var id = Context.User?.FindFirst("Id")?.Value;
            var username = Context.User?.FindFirst("Username")?.Value;

            if (id == null || username == null) throw new StatusException(StatusCodes.Status401Unauthorized, "Multiplayer requires login");

            return new MPUser { IdPer = int.Parse(id), Username = username };
        }
    }
}