namespace Typefast.Server.Data.DTOs
{
    public class BlockRequest
    {
        public required int IdPer { get; set; }
        public required long blUntil { get; set; }
        public required string blReason { get; set; }
    }
}