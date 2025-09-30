

namespace Typefast.Server.Data.DTOs
{
    public class MPPacket
    {
        public int IdPer { get; set; }
        public string Username { get; set; }
        public double Time { get; set; }

        public double Progress { get; set; }
        public double Wpm { get; set; }
        public double Accuracy { get; set; }
    }
}