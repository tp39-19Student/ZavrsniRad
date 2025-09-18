

namespace Typefast.Server.Data.DTOs
{
    public class FollowRequest
    {
        public required int IdFer { get; set; }
        public required int IdFed { get; set; }
        public required bool State { get; set; }
    }
}