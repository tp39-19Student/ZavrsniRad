namespace Typefast.Server.Data.DTOs
{
    public class BlockRequest
    {
        public required int IdPer { get; set; }
        public required int blUntil { get; set; }
        public required string blReason { get; set; }
    }
}