using Typefast.Server.Models;

namespace Typefast.Server.Data.DTOs
{
    public class GetLeaderboardResponse
    {
        public required List<Score> Scores { get; set; }
        public required int IdTex { get; set; }
    }
}