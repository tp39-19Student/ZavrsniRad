using Typefast.Server.Models;

namespace Typefast.Server.Data.DTOs
{
    public class GetLeaderboardResponse
    {
        public List<Score> Scores { get; set; }
        public int IdTex { get; set; }
    }
}