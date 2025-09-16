namespace Typefast.Server.Data.DTOs
{
    public class SubmitTextRequest
    {
        public required string Text { get; set; }
        public required int IdCat { get; set; }
    }
}