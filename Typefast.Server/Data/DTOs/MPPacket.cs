

namespace Typefast.Server.Data.DTOs
{
    public class MPPacket
    {
        public required int IdPer { get; set; }
        public required string Username { get; set; }
        public required double Time { get; set; }

        public required double Progress { get; set; }
        public required double Wpm { get; set; }
        public required double Accuracy { get; set; }
    }
}