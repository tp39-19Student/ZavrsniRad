
namespace Typefast.Server.Data.DTOs
{
    public class SubmitScoreRequest
    {
        public required int IdTex { get; set; }
        public required float Time { get; set; }
        public required float Accuracy { get; set; }
    }
}