

using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Typefast.Server.Data;
using Typefast.Server.Data.DTOs;
using Typefast.Server.Hubs;
using Typefast.Server.Middleware;
using Typefast.Server.Models;

namespace Typefast.Server.Services
{
    public class MultiplayerService
    {
        public class Room
        {
            private static readonly int LOBBY_SECONDS = 10; // How long the room waits for new users to join
            private static readonly int COUNTDOWN_SECONDS = 5; // Additional wait time after lobby, new users can't join at this stage
            private readonly IHubContext<MultiplayerHub> _hub;

            public Text ChosenText { get; set; }
            public List<MPUser> Users { get; } = new List<MPUser>();
            public long StartTime { get; } = DateTimeOffset.Now.ToUnixTimeMilliseconds() + ((LOBBY_SECONDS + COUNTDOWN_SECONDS) * 1000);
            private Timer timer;


            public string Id { get; set; }
            private int _userCount = 0;
            public int UserCount { get { return _userCount; } }

            public bool Locked { get; set; } = false; // Too late to accept new users
            public bool Finished { get; set; } = false; // No users connected

            private async void LockRoom(object? state)
            {
                await _hub.Clients.Group(Id).SendAsync("Lock");
                timer?.Dispose();
                Locked = true;
                timer = new Timer(StartRoom, null, StartTime - DateTimeOffset.Now.ToUnixTimeMilliseconds(), Timeout.Infinite);
                Console.WriteLine("Room locked: " + Id);
            }

            private async void StartRoom(object? state)
            {
                await _hub.Clients.Group(Id).SendAsync("Start");
                timer?.Dispose();
                Console.WriteLine("Room started: " + Id);
            }


            public Room(Text chosenText, IHubContext<MultiplayerHub> hub)
            {
                Id = Guid.NewGuid().ToString();
                ChosenText = chosenText;
                _hub = hub;

                timer = new Timer(LockRoom, null, LOBBY_SECONDS * 1000, Timeout.Infinite);
            }

            public bool IsOpen()
            {
                return Finished == false && Locked == false && UserCount < 5;
            }

            public int AddUser(MPUser user)
            {
                if (Finished || Locked) return -1;
                int res = Interlocked.Increment(ref _userCount);
                Users.Add(user);

                return res;
            }

            public int RemoveUser(MPUser user)
            {
                int res = Interlocked.Decrement(ref _userCount);
                if (res == 0)
                {
                    Finished = true;
                    timer?.Change(Timeout.Infinite, Timeout.Infinite);
                    timer?.Dispose();
                }

                Users.RemoveAll(u => u.IdPer == user.IdPer);
                return res;
            }
        }

        private readonly List<Room> Rooms = new List<Room>();
        private readonly Dictionary<int, Room> UserDictionary = new Dictionary<int, Room>();
        private readonly IServiceProvider _services;
        private readonly IHubContext<MultiplayerHub> _hub;

        public MultiplayerService(IServiceProvider services, IHubContext<MultiplayerHub> hub)
        {
            _services = services;
            _hub = hub;
        }


        public async Task<Room?> Connect(MPUser user)
        {
            try
            {
                var existing = UserDictionary[user.IdPer];
                if (existing != null) return null;
            }
            catch (KeyNotFoundException) { }
            Room? open = Rooms.Find(r => r.IsOpen());
            if (open == null)
            {
                using (var scope = _services.CreateScope())
                {
                    TextService textService = scope.ServiceProvider.GetRequiredService<TextService>();
                    Text text = await textService.GetRandom();
                    //Text text = await textService.GetById(14);
                    open = new Room(text, _hub);
                    Rooms.Add(open);
                    PrintRooms();
                    Console.WriteLine("Created room: " + open.Id);
                }
            }

            if (open.AddUser(user) != -1)
            {
                UserDictionary[user.IdPer] = open;
                return open;
            }
            return await Connect(user);
        }

        public string Disconnect(MPUser user)
        {
            try
            {
                Room? room = UserDictionary[user.IdPer];
                int remaining = room.RemoveUser(user);
                UserDictionary.Remove(user.IdPer);

                if (remaining == 0)
                {
                    Rooms.Remove(room);
                    PrintRooms();
                    Console.WriteLine("Deleted room: " + room.Id);
                }
                
                return room.Id;
            }
            catch (KeyNotFoundException) { return ""; }
        }

        public string GetRoomId(int userId)
        {
            try
            {
                return UserDictionary[userId].Id;
            }
            catch (KeyNotFoundException) { return ""; }
            ;
        }

        public void PrintRooms()
        {
            foreach (var room in Rooms)
            {
                Console.Write(room.Id + ", text: " + room.ChosenText.IdTex + ", Users: [");
                foreach (var user in room.Users) Console.Write(user.IdPer + " - " + user.Username + ", ");
                Console.Write("]\n");
            }
            
        }
    }
}